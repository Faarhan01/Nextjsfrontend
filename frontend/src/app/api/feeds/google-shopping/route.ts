import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '../../../../data/presets';

function escapeXml(unsafe: string | number | undefined | null): string {
  if (unsafe === undefined || unsafe === null) return '';
  const str = String(unsafe);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get('currency') || 'ZAR';
  const origin = request.nextUrl.origin || 'https://ais-dev-6gn5ggip67oqekkhfx7fhc-396079311886.europe-west1.run.app';
  const now = new Date().toUTCString();

  const itemsXml = MOCK_PRODUCTS.map((product, idx) => {
    const numericId = parseInt(product.id.replace(/\D/g, '') || String(idx + 1), 10);
    const mockGtin = `600987${(100000 + numericId).toString().slice(-6)}`;
    
    let rawPrice = 99.00;
    if (product.price) {
      const parsed = parseFloat(product.price.replace(/[^0-9.]/g, ''));
      if (!isNaN(parsed)) rawPrice = parsed;
    }

    const priceFormatted = `${rawPrice.toFixed(2)} ${currency}`;
    const availability = (product.stock && product.stock > 0) ? 'in_stock' : 'out_of_stock';
    const productLink = `${origin}/product/${encodeURIComponent(product.id)}`;
    const brand = product.brand || 'Mrbulk';
    const category = product.category || 'General';
    const description = product.description || `${product.name} - Quality retail and wholesale item from Mrbulk (mrbulk.co.za).`;

    const additionalImages = (product.images || [])
      .filter((img) => img !== product.imageUrl)
      .slice(0, 5)
      .map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
      .join('\n');

    return `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${escapeXml(productLink)}</g:link>
      <g:image_link>${escapeXml(product.imageUrl)}</g:image_link>
${additionalImages ? additionalImages + '\n' : ''}      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${escapeXml(priceFormatted)}</g:price>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:gtin>${mockGtin}</g:gtin>
      <g:identifier_exists>yes</g:identifier_exists>
      <g:google_product_category>${escapeXml(category)}</g:google_product_category>
      <g:product_type>${escapeXml(category)}</g:product_type>
      <g:shipping>
        <g:country>ZA</g:country>
        <g:service>Standard Express</g:service>
        <g:price>0.00 ${escapeXml(currency)}</g:price>
      </g:shipping>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Mrbulk — Official Google Merchant Center Product Feed</title>
    <link>${escapeXml(origin)}</link>
    <description>Automated live product catalog, real-time inventory, and price synchronization feed for Google Shopping and Performance Max.</description>
    <lastBuildDate>${now}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=3600',
    },
  });
}
