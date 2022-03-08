import { JWT as JWTNextAuth } from 'next-auth/jwt';
import { DefaultSession } from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT extends JWTNextAuth {
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
    username?: string;
    accessTokenExpires: number;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken?: string | undefined;
      refreshToken?: string | undefined;
      username?: string;
    } & DefaultSession['user'];
  }
}
