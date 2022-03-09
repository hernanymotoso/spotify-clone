import { JWT as JWTNextAuth } from 'next-auth/jwt';
import { DefaultSession } from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT extends JWTNextAuth {
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    username?: string;
    accessTokenExpires?: number | undefined;
    error?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    refreshTokenError?: string;
    user: {
      accessToken?: string | undefined;
      refreshToken?: string | undefined;
      username?: string;
    } & DefaultSession['user'];
  }
}
