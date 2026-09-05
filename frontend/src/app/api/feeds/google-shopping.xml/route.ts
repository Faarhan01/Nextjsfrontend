import { NextRequest } from 'next/server';
import { GET as handler } from '../google-shopping/route';

export async function GET(request: NextRequest) {
  return handler(request);
}
