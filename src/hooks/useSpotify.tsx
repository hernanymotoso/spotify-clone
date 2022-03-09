import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
// import spotifyApi from '../lib/spotify';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

const useSpotify = () => {
  console.log();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      // If refresh access token attempt fails, direct user to login...
      if (session.refreshTokenError === 'RefreshAccessTokenError') {
        signIn();
      }

      spotifyApi.setAccessToken(session.user.accessToken as string);
    }
  }, [session]);

  return spotifyApi;
};

export default useSpotify;
