import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/data/presets';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find((p) => String(p.id) === id);

  if (!product) {
    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, product });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  return NextResponse.json({
    success: true,
    product: { ...body, id },
    message: 'Product updated successfully',
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    success: true,
    message: `Product ${id} removed successfully`,
  });
}
