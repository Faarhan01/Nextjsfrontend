import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const tag = searchParams.get('tag');

    const expectedSecret = process.env.REVALIDATION_SECRET || 'mrbulk_revalidate_secret';

    if (secret && secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (!tag) {
      return NextResponse.json({ message: 'Missing tag parameter' }, { status: 400 });
    }

    (revalidateTag as any)(tag);
    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Error revalidating' }, { status: 500 });
  }
}
