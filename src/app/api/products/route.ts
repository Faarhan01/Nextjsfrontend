import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/data/presets';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();
  const brand = searchParams.get('brand')?.toLowerCase();
  const categoryId = searchParams.get('categoryId');
  const isFeatured = searchParams.get('isFeatured');

  let filtered = [...MOCK_PRODUCTS];

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search) ||
        p.category?.toLowerCase().includes(search)
    );
  }

  if (brand) {
    filtered = filtered.filter((p) => p.brand?.toLowerCase() === brand);
  }

  if (categoryId) {
    filtered = filtered.filter((p) => String(p.categoryId) === categoryId);
  }

  if (isFeatured === 'true') {
    filtered = filtered.filter((p) => p.isFeatured);
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    products: filtered,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProduct = {
      ...body,
      id: body.id || `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Product created successfully',
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid product payload' }, { status: 400 });
  }
}
