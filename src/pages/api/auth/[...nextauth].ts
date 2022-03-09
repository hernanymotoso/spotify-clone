import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { JWT } from 'next-auth/jwt';
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify';

async function refreshAccessToken(token: JWT) {
  try {
    spotifyApi.setAccessToken(token.accessToken as string);
    spotifyApi.setRefreshToken(token.refreshToken as string);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    console.log('@NEXTAUTH REFRESHED TOKEN IS', refreshedToken);
    console.log(Date.now);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify API
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Error in if of refresh token', error);

    return {
      ...token,

      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  // configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      console.log('@NEXTAUTH  INITIAL SIGN IN');

      // initial sign in
      if (account && user) {
        console.log('@NEXTAUTH  INITIAL SIGN IN');

        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: (account.expires_at as number) * 1000, // we are handling expiry times in Milliseconds hence * 1000
        };
      }

      // Return previus token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        console.log('@NEXTAUTH EXISTING ACCESS TOKEN IS VALID');
        return token;
      }

      // Access token has expired, so we need to refresh it...
      console.log('@NEXTAUTH TOKEN HAS EXPIRED, REFRESHING...');

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
      session.refreshTokenError = token.error;

      return session;
    },
  },
});
