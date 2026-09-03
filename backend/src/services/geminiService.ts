import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export function safeExtractJson<T = any>(text: string, defaultValue: T): T {
  if (!text || typeof text !== "string") return defaultValue;
  
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // Try to strip markdown code blocks
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim()) as T;
      } catch {}
    }
    // Try finding outer object/array
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(trimmed.substring(firstBrace, lastBrace + 1)) as T;
      } catch {}
    }
    const firstBracket = trimmed.indexOf('[');
    const lastBracket = trimmed.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      try {
        return JSON.parse(trimmed.substring(firstBracket, lastBracket + 1)) as T;
      } catch {}
    }
  }
  return defaultValue;
}

export async function generateContentWithFallback(ai: GoogleGenAI, options: {
  model: string;
  contents: any;
  config: any;
}) {
  const modelsToTry = [
    options.model,
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
  ];

  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    if (i > 0 && currentModel === options.model) {
      continue;
    }

    try {
      if (i > 0) {
        console.warn(`Attempting fallback to model: ${currentModel}`);
      }
      return await ai.models.generateContent({
        model: currentModel,
        contents: options.contents,
        config: options.config,
      });
    } catch (error: any) {
      lastError = error;
      const errorStr = String(error?.message || error || "");
      const isQuotaError = errorStr.includes("429") || 
                           errorStr.includes("quota") || 
                           errorStr.includes("RESOURCE_EXHAUSTED") ||
                           errorStr.includes("limit");

      if (isQuotaError) {
        console.warn(`Model ${currentModel} hit quota limit: ${errorStr}`);
        continue;
      } else {
        throw error;
      }
    }
  }

  if (lastError) {
    const lastErrorStr = String(lastError?.message || lastError || "");
    if (
      lastErrorStr.includes("429") || 
      lastErrorStr.includes("quota") || 
      lastErrorStr.includes("RESOURCE_EXHAUSTED") ||
      lastErrorStr.includes("limit")
    ) {
      throw new Error(
        "AI Studio Gemini API quota limit exceeded (429). If you are using a personal key, please check billing details. Otherwise, try again shortly."
      );
    }
    throw lastError;
  }

  throw new Error("An unexpected error occurred during AI content generation.");
}

export async function generateBrand(params: { prompt?: string; imageBase64?: string; imageMimeType?: string; customInstructions?: string }) {
  const { prompt, imageBase64, imageMimeType, customInstructions } = params;
  const ai = getAIClient();

  let systemInstruction = `You are an expert brand designer and vector illustrator.
Your task is to design a modern, professional, high-quality brand logo in vector format (SVG) and provide metadata.

CRITICAL CONTRAST & VISIBILITY MANDATES:
1. The background of the logo MUST be transparent. Do NOT draw any solid background rectangles.
2. Because the background is transparent and will be rendered on a light-colored website background, any text, borders, or central icon shapes MUST NOT be white. Change any white or light text/paths to deep colors or pure black.
3. The SVG must be clean, valid, and fully scalable.
4. Wrap text and path tags nicely. Use standard system fonts inside the SVG.
5. Provide viewBox="0 0 200 80", width="200", height="80".`;

  if (customInstructions) {
    systemInstruction += `\n\nADDITIONAL AI PROMPT INSTRUCTIONS FROM USER SETTINGS:\n${customInstructions}`;
  }

  let userPrompt = "Generate a professional brand logo and details.";
  if (prompt) {
    userPrompt += ` Description provided by the user: "${prompt}"`;
  } else {
    userPrompt += " Generate a beautiful modern e-commerce brand.";
  }

  const parts: any[] = [];
  if (imageBase64 && imageMimeType) {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    parts.push({
      inlineData: {
        mimeType: imageMimeType,
        data: base64Data,
      },
    });
    userPrompt += "\nAnalyze this uploaded logo image. Convert it into a clean, transparent-background SVG version of this brand logo. Translate any white text to dark colors for high contrast on light backgrounds.";
  }

  parts.push({ text: userPrompt });

  const response = await generateContentWithFallback(ai, {
    model: "gemini-3.5-flash",
    contents: [{ parts }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          svg: { type: Type.STRING }
        },
        required: ["name", "description", "svg"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response generated from AI model.");
  return safeExtractJson(text, { name: "LuxeStore Exclusive", description: "Curated luxury brand", svg: "<svg viewBox='0 0 200 80'></svg>" });
}

export async function generateProducts(params: {
  prompt: string;
  existingBrands?: any[];
  existingCategories?: any[];
  customInstructions?: string;
  imageBase64?: string;
  imageMimeType?: string;
}) {
  const { prompt, existingBrands, existingCategories, customInstructions, imageBase64, imageMimeType } = params;
  const ai = getAIClient();

  let enhancedPrompt = `User Prompt: ${prompt}`;
  let systemInstruction = `You are an expert e-commerce catalog curator and internet search specialist.
Your task is to generate one or more high-quality, professional products based on the user's prompt, optional reference image, and any scanned website content.`;

  if (customInstructions) {
    systemInstruction += `\n\nADDITIONAL AI PROMPT INSTRUCTIONS:\n${customInstructions}`;
  }

  const parts: any[] = [];
  if (imageBase64 && imageMimeType) {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    parts.push({
      inlineData: { mimeType: imageMimeType, data: base64Data },
    });
    enhancedPrompt += "\nAnalyze this reference image and generate matching products.";
  }
  parts.push({ text: enhancedPrompt });

  const response = await generateContentWithFallback(ai, {
    model: "gemini-3.5-flash",
    contents: [{ parts }],
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
                description: { type: Type.STRING },
                brandName: { type: Type.STRING },
                categoryName: { type: Type.STRING },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["name", "price", "imageUrl", "description"]
            }
          }
        },
        required: ["products"]
      }
    }
  });

  return safeExtractJson(response.text || "{}", { products: [] });
}

export async function generateStudioAssets(params: any) {
  const { prompt, imageBase64, imageMimeType, customInstructions } = params;
  const ai = getAIClient();

  let systemInstruction = `You are a master e-commerce studio architect. Generate brand, categories, and products.`;
  if (customInstructions) systemInstruction += `\n\nInstructions: ${customInstructions}`;

  const parts: any[] = [];
  if (imageBase64 && imageMimeType) {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    parts.push({ inlineData: { mimeType: imageMimeType, data: base64Data } });
  }
  parts.push({ text: prompt || "Generate complete brand, categories, and catalog products package." });

  const response = await generateContentWithFallback(ai, {
    model: "gemini-3.5-flash",
    contents: [{ parts }],
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brand: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              svg: { type: Type.STRING }
            },
            required: ["name", "description", "svg"]
          },
          categories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
                description: { type: Type.STRING },
                icon: { type: Type.STRING },
                subcategories: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["name", "description"]
                  }
                }
              },
              required: ["name", "imageUrl", "description", "icon", "subcategories"]
            }
          },
          products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
                description: { type: Type.STRING },
                brandName: { type: Type.STRING },
                categoryName: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "price", "imageUrl", "description"]
            }
          }
        }
      }
    }
  });

  return safeExtractJson(response.text || "{}", { brand: null, categories: [], products: [] });
}

export async function generateConciergeReply(params: any) {
  const { query, catalogProducts, cartItems, history } = params;
  const ai = getAIClient();

  const systemInstruction = `You are LuxeStore's AI Shopping Concierge & Styling Expert. Help customers discover luxury items.`;
  const userMessage = `User Question: "${query}"\nCatalog: ${JSON.stringify((catalogProducts || []).slice(0, 10))}\nCart: ${JSON.stringify(cartItems || [])}`;

  const response = await generateContentWithFallback(ai, {
    model: "gemini-3.5-flash",
    contents: userMessage,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reply: { type: Type.STRING },
          recommendedProductIds: { type: Type.ARRAY, items: { type: Type.STRING } },
          followUpSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["reply"]
      }
    }
  });

  return safeExtractJson(response.text || "{}", {
    reply: "I would be delighted to assist you with our catalog selection. How can I help refine your luxury search today?",
    recommendedProductIds: [],
    followUpSuggestions: ["Show me new arrivals", "Explore luxury watches", "Discover bestsellers"]
  });
}

export async function enhanceProductCopy(params: any) {
  const { productName, originalDescription, brandName, categoryName } = params;
  const ai = getAIClient();

  const systemInstruction = `You are a world-class e-commerce copywriter. Enhance this product listing.`;
  const promptText = `Product Name: ${productName}\nBrand: ${brandName || ''}\nCategory: ${categoryName || ''}\nDraft: ${originalDescription || ''}`;

  const response = await generateContentWithFallback(ai, {
    model: "gemini-3.5-flash",
    contents: promptText,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          enhancedTitle: { type: Type.STRING },
          shortSummary: { type: Type.STRING },
          detailedDescription: { type: Type.STRING },
          keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
          seoMetaDescription: { type: Type.STRING },
          recommendedTags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["enhancedTitle", "shortSummary", "detailedDescription", "keyFeatures", "seoMetaDescription"]
      }
    }
  });

  return safeExtractJson(response.text || "{}", {
    enhancedTitle: productName,
    shortSummary: originalDescription || "Exceptional luxury craftsmanship.",
    detailedDescription: originalDescription || "Crafted to perfection using the finest materials.",
    keyFeatures: ["Master craftsmanship", "Premium luxury grade", "Signature design"],
    seoMetaDescription: `Discover the ${productName} exclusively at LuxeStore.`
  });
}
