import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { MOCK_PRODUCTS } from '@/data/presets';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function POST(request: NextRequest) {
  try {
    const { query, catalogProducts, cartItems, history } = await request.json();

    if (!query) {
      return NextResponse.json({ success: false, message: 'Query is required' }, { status: 400 });
    }

    const ai = getAIClient();

    if (ai) {
      try {
        const availableProducts = (catalogProducts && catalogProducts.length > 0) ? catalogProducts : MOCK_PRODUCTS.slice(0, 15);
        const catalogContext = availableProducts
          .map((p: any) => `ID: ${p.id} | Name: ${p.name} | Price: ${p.price} | Category: ${p.category} | Desc: ${p.description}`)
          .join('\n');

        const prompt = `You are the friendly, expert shopping concierge for Mrbulk (mrbulk.co.za), a premier South African retail and wholesale marketplace operated by Mr Cheap General Dealer ZA.
Prices are in South African Rand (ZAR / R).

Available Catalog items:
${catalogContext}

Customer query: "${query}"

Return a JSON object with:
{
  "reply": "Your helpful, professional response to the customer",
  "recommendedProductIds": ["matching_id_1", "matching_id_2"],
  "followUpSuggestions": ["Short question or prompt 1", "Short question or prompt 2"]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return NextResponse.json({ success: true, data: parsed });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call fallback:', geminiError?.message);
      }
    }

    // Intelligent local fallback if Gemini key is not configured or fails
    const lower = query.toLowerCase();
    const matches = MOCK_PRODUCTS.filter(
      (p) =>
        lower.includes(p.name.toLowerCase()) ||
        lower.includes(p.category?.toLowerCase() || '') ||
        (p.brand && lower.includes(p.brand.toLowerCase()))
    ).slice(0, 3);

    const recommendedProductIds = matches.length > 0 ? matches.map((m) => m.id) : [MOCK_PRODUCTS[0]?.id, MOCK_PRODUCTS[1]?.id].filter(Boolean);

    let reply = `Welcome to Mrbulk! I'd be happy to assist you with "${query}". `;
    if (matches.length > 0) {
      reply += `We have excellent options in our catalog such as the ${matches.map((m) => m.name).join(' and ')}. All items ship directly across South Africa with standard tracking.`;
    } else {
      reply += `Feel free to explore our curated retail and wholesale collections, or search specifically for appliances, decor, electronics, or bulk goods.`;
    }

    return NextResponse.json({
      success: true,
      data: {
        reply,
        recommendedProductIds,
        followUpSuggestions: [
          'What are your top wholesale deals?',
          'How fast is shipping to Johannesburg & Cape Town?',
          'Can I register as an independent marketplace seller?',
        ],
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Concierge request failed' }, { status: 500 });
  }
}
