export async function extractAndScanUrl(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  if (!match) {
    return { text, scannedUrl: null };
  }

  const url = match[0];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await globalThis.fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return { text: `[Failed to fetch content from ${url}. Status: ${response.status}]`, url };
    }

    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'No Title';

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : html;
    const cleanText = bodyContent.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const snippet = cleanText.substring(0, 1500);
    return {
      url,
      title,
      snippet,
      fullText: `[Fetched URL: ${url}]\n[Title: ${title}]\n[Content Snippet: ${snippet}]`
    };
  } catch (error: any) {
    return {
      url,
      text: `[Error scanning URL ${url}: ${error.message || 'Timeout/Network failure'}]`
    };
  }
}
