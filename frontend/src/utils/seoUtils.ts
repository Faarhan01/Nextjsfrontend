/**
 * SEO & Routing Utilities for Mrbulk
 * Provides slug generation, canonical URLs, meta updates, and URL search parameter helpers
 */

export function decodeAndCleanText(text: string): string {
  if (!text) return '';
  let result = String(text);
  // Repeatedly decode in case of multi-encoding (e.g. %2520)
  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(result);
      if (decoded === result) break;
      result = decoded;
    } catch {
      break;
    }
  }
  // Replace HTML entity artifacts
  result = result.replace(/&amp;/gi, '&');
  return result;
}

export function slugify(text: string): string {
  if (!text) return '';
  const cleaned = decodeAndCleanText(text);
  return cleaned
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function deslugify(slug: string): string {
  if (!slug) return '';
  const cleaned = decodeAndCleanText(slug);
  return cleaned
    .replace(/[-_]+/g, ' ')
    .replace(/\band\b/gi, '&')
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      if (word === '&') return '&';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function formatCategoryName(slugOrName: string, categories: { name: string; id?: string | number }[] = []): string {
  if (!slugOrName) return 'All';
  const decoded = decodeAndCleanText(slugOrName).trim();
  if (!decoded || decoded.toLowerCase() === 'all') return 'All';

  // 1. Direct match in categories list
  const directMatch = categories.find(
    (c) => c.name.toLowerCase() === decoded.toLowerCase() ||
           String(c.id).toLowerCase() === decoded.toLowerCase()
  );
  if (directMatch) return directMatch.name;

  // 2. Slugified match
  const slugTarget = slugify(decoded);
  const slugMatch = categories.find(
    (c) => slugify(c.name) === slugTarget ||
           slugify(c.name) === slugify(slugOrName)
  );
  if (slugMatch) return slugMatch.name;

  // 3. Match with 'and' vs '&' normalization
  const normalizedTarget = decoded.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
  const normMatch = categories.find((c) => {
    const cNorm = c.name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
    return cNorm === normalizedTarget;
  });
  if (normMatch) return normMatch.name;

  // 4. Default fallback: Clean and deslugify
  return deslugify(decoded);
}

export interface SearchFilterState {
  category?: string;
  brand?: string;
  sort?: string;
  color?: string;
  rating?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  search?: string;
  page?: number;
}

/**
 * Constructs an SEO-friendly URL for a product
 */
export function getProductUrl(productId: string, productName?: string): string {
  if (!productId) return '/shop';
  const slug = productName ? slugify(productName) : '';
  return slug ? `/product/${productId}-${slug}` : `/product/${productId}`;
}

/**
 * Constructs an SEO-friendly URL for a category archive
 */
export function getCategoryUrl(categoryName: string, filters?: SearchFilterState): string {
  if (!categoryName || categoryName === 'All' || categoryName === 'all') {
    return getShopUrl(filters);
  }
  const catSlug = slugify(categoryName);
  const basePath = `/category/${catSlug}`;
  return appendQueryParameters(basePath, filters, { omitCategory: true });
}

/**
 * Constructs an SEO-friendly URL for a brand archive
 */
export function getBrandUrl(brandName: string, filters?: SearchFilterState): string {
  if (!brandName || brandName === 'All' || brandName === 'all') {
    return getShopUrl(filters);
  }
  const brandSlug = slugify(brandName);
  const basePath = `/brand/${brandSlug}`;
  return appendQueryParameters(basePath, filters, { omitBrand: true });
}

/**
 * Constructs an SEO-friendly URL for shop / catalog
 */
export function getShopUrl(filters?: SearchFilterState): string {
  return appendQueryParameters('/shop', filters);
}

/**
 * Constructs an SEO-friendly URL for search
 */
export function getSearchUrl(query: string, filters?: SearchFilterState): string {
  return appendQueryParameters('/search', { ...filters, q: query });
}

/**
 * Constructs an SEO-friendly URL for all categories
 */
export function getCategoriesUrl(): string {
  return '/categories';
}

/**
 * Constructs an SEO-friendly URL for static and main pages
 */
export function getPageUrl(page: string): string {
  switch (page) {
    case 'home': return '/';
    case 'shop': return '/shop';
    case 'categories': return '/categories';
    case 'about': return '/about';
    case 'contact': return '/contact';
    case 'faq': return '/faq';
    case 'privacy-policy': return '/privacy-policy';
    case 'terms-and-conditions': return '/terms-and-conditions';
    case 'returns-policy': return '/returns-policy';
    case 'wishlist': return '/wishlist';
    case 'cart': return '/cart';
    case 'checkout': return '/checkout';
    case 'account': return '/account';
    case 'order-tracking': return '/order-tracking';
    case 'admin': return '/admin';
    default: return page.startsWith('/') ? page : `/${page}`;
  }
}

/**
 * Appends non-default filter query parameters to a base path
 */
export function appendQueryParameters(
  basePath: string,
  filters?: SearchFilterState,
  options?: { omitCategory?: boolean; omitBrand?: boolean }
): string {
  if (!filters) return basePath;
  const params = new URLSearchParams();

  const searchVal = filters.q || filters.search;
  if (searchVal && searchVal.trim()) {
    params.set('q', searchVal.trim());
  }
  if (!options?.omitCategory && filters.category && filters.category !== 'All' && filters.category !== 'all') {
    params.set('category', slugify(filters.category));
  }
  if (!options?.omitBrand && filters.brand && filters.brand !== 'All' && filters.brand !== 'all') {
    params.set('brand', slugify(filters.brand));
  }
  if (filters.sort && filters.sort !== 'random' && filters.sort !== 'featured') {
    params.set('sort', filters.sort);
  }
  if (filters.color && filters.color !== 'all') {
    params.set('color', filters.color);
  }
  if (filters.rating && filters.rating !== 'all') {
    params.set('rating', filters.rating);
  }
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    params.set('minPrice', filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined && filters.maxPrice < 10000) {
    params.set('maxPrice', filters.maxPrice.toString());
  }
  if (filters.page && filters.page > 1) {
    params.set('page', filters.page.toString());
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

/**
 * Dynamically updates document <title>, <meta name="description"> and <link rel="canonical">
 */
export function updateSEOMetadata(
  optionsOrTitle: string | {
    title: string;
    description?: string;
    canonicalPath: string;
  },
  descriptionArg?: string,
  canonicalPathArg?: string
) {
  if (typeof window === 'undefined') return;

  const options = typeof optionsOrTitle === 'string'
    ? {
        title: optionsOrTitle,
        description: descriptionArg,
        canonicalPath: canonicalPathArg || (window.location.pathname + window.location.search)
      }
    : optionsOrTitle;

  // Title
  document.title = options.title;

  // Description
  if (options.description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', options.description);
  }

  // Canonical Link
  const origin = window.location.origin;
  const cleanCanonicalPath = (options.canonicalPath || '/').split('#')[0]; // Remove hash fragment
  const fullCanonicalUrl = `${origin}${cleanCanonicalPath}`;

  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', fullCanonicalUrl);

  // OpenGraph URL
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', fullCanonicalUrl);
}

/**
 * Parse current URL pathname & query string into React state
 */
export function parseLocation(pathname: string, search: string) {
  const searchParams = new URLSearchParams(search);
  const cleanPath = pathname.replace(/\/$/, '') || '/';

  // Product Detail: /product/prod-1-pro-wireless-headphones or /product/prod-1
  const productMatch = cleanPath.match(/^\/product\/(.+)$/);
  if (productMatch) {
    const rawParam = productMatch[1];
    return {
      currentPage: 'product-detail' as const,
      rawProductId: rawParam,
    };
  }

  // Category Detail: /category/electronics
  const categoryMatch = cleanPath.match(/^\/category\/(.+)$/);
  if (categoryMatch) {
    const catSlug = decodeAndCleanText(categoryMatch[1]);
    return {
      currentPage: 'category-detail' as const,
      categorySlug: catSlug,
      sort: searchParams.get('sort') || undefined,
      brand: searchParams.get('brand') ? decodeAndCleanText(searchParams.get('brand')!) : undefined,
      color: searchParams.get('color') || undefined,
      rating: searchParams.get('rating') || undefined,
    };
  }

  // Brand: /brand/apple or /brand/sony
  const brandMatch = cleanPath.match(/^\/brand\/(.+)$/);
  if (brandMatch) {
    const brandSlug = decodeAndCleanText(brandMatch[1]);
    return {
      currentPage: 'shop' as const,
      brandSlug: brandSlug,
      sort: searchParams.get('sort') || undefined,
      category: searchParams.get('category') ? decodeAndCleanText(searchParams.get('category')!) : undefined,
    };
  }

  // Search: /search?q=wireless
  if (cleanPath === '/search') {
    return {
      currentPage: 'search-results' as const,
      q: searchParams.get('q') ? decodeAndCleanText(searchParams.get('q')!) : '',
      sort: searchParams.get('sort') || undefined,
      category: searchParams.get('category') ? decodeAndCleanText(searchParams.get('category')!) : undefined,
    };
  }

  // Static pages & shop
  switch (cleanPath) {
    case '/shop':
      return {
        currentPage: 'shop' as const,
        categorySlug: searchParams.get('category') ? decodeAndCleanText(searchParams.get('category')!) : undefined,
        brandSlug: searchParams.get('brand') ? decodeAndCleanText(searchParams.get('brand')!) : undefined,
        sort: searchParams.get('sort') || undefined,
        color: searchParams.get('color') || undefined,
        rating: searchParams.get('rating') || undefined,
        q: searchParams.get('q') ? decodeAndCleanText(searchParams.get('q')!) : '',
      };
    case '/categories':
      return { currentPage: 'categories' as const };
    case '/about':
      return { currentPage: 'about' as const };
    case '/contact':
      return { currentPage: 'contact' as const };
    case '/faq':
      return { currentPage: 'faq' as const };
    case '/privacy-policy':
      return { currentPage: 'privacy-policy' as const };
    case '/terms-and-conditions':
      return { currentPage: 'terms-and-conditions' as const };
    case '/returns-policy':
      return { currentPage: 'returns-policy' as const };
    case '/wishlist':
      return { currentPage: 'wishlist' as const };
    case '/cart':
      return { currentPage: 'cart' as const };
    case '/checkout':
      return { currentPage: 'checkout' as const };
    case '/account':
      return { currentPage: 'account' as const };
    case '/order-tracking':
      return { currentPage: 'order-tracking' as const };
    case '/admin':
      return { currentPage: 'admin' as const };
    case '/404':
    case '/not-found':
      return { currentPage: 'not-found' as const, requestedPath: cleanPath };
    case '/':
    case '/home':
      return { currentPage: 'home' as const };
    default:
      return { currentPage: 'not-found' as const, requestedPath: cleanPath };
  }
}
