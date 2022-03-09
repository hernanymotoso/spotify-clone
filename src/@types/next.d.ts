import { NextApiRequest as NextApiRequestCore } from 'next';
import { NextRequest } from 'next/server';

declare module 'next' {
  interface NextApiRequest extends NextApiRequestCore, NextRequest {}
}
