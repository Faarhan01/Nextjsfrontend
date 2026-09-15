'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { MockProduct } from '@/types';
import { getProductRating } from '@/utils/productRating';
import { formatCategoryName, decodeAndCleanText, getShopUrl, updateSEOMetadata } from '@/utils/seoUtils';
import { SortOption } from '@modules/store/components/refinement-list/sort-products';

interface UseStoreFiltersOptions {
  products: MockProduct[];
  categoriesProp?: any[];
  brandsProp?: any[];
  initialCategoryFilter?: string;
  initialBrandFilter?: string;
}

export function useStoreFilters({
  products,
  categoriesProp = [],
  brandsProp = [],
  initialCategoryFilter,
  initialBrandFilter,
}: UseStoreFiltersOptions) {
  // State for search, sorting, and filter selections
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() =>
    formatCategoryName(initialCategoryFilter || 'All', categoriesProp)
  );
  const [selectedBrand, setSelectedBrand] = useState<string>(() => {
    if (!initialBrandFilter || initialBrandFilter.toLowerCase() === 'all') return 'All';
    const cleaned = decodeAndCleanText(initialBrandFilter);
    const matched = brandsProp.find(
      (b) => b.name?.toLowerCase() === cleaned.toLowerCase() || b.title?.toLowerCase() === cleaned.toLowerCase()
    );
    return matched ? matched.name || matched.title : cleaned;
  });
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('random');
  const [gridView, setGridView] = useState<'cols-4' | 'list'>('cols-4');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Random score mapping for persistent random sorting until reshuffle
  const [randomScores, setRandomScores] = useState<Record<string, number>>({});

  const reshuffleRandom = useCallback(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      map[p.id] = Math.random();
    });
    setRandomScores(map);
  }, [products]);

  useEffect(() => {
    reshuffleRandom();
  }, [reshuffleRandom]);

  useEffect(() => {
    if (initialCategoryFilter) {
      setSelectedCategory(formatCategoryName(initialCategoryFilter, categoriesProp));
    }
  }, [initialCategoryFilter, categoriesProp]);

  useEffect(() => {
    if (initialBrandFilter) {
      if (initialBrandFilter.toLowerCase() === 'all') {
        setSelectedBrand('All');
      } else {
        const cleaned = decodeAndCleanText(initialBrandFilter);
        const matched = brandsProp.find((b) => b.name?.toLowerCase() === cleaned.toLowerCase());
        setSelectedBrand(matched ? matched.name : cleaned);
      }
    }
  }, [initialBrandFilter, brandsProp]);

  // Dynamically derive available categories from props and catalog
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    
    if (Array.isArray(categoriesProp)) {
      categoriesProp.forEach((c) => {
        const name = typeof c === 'string' ? c : c?.name;
        if (name) cats.add(name);
      });
    }

    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });

    return Array.from(cats);
  }, [categoriesProp, products]);

  // Dynamically derive available brands from props and catalog
  const availableBrands = useMemo(() => {
    const brs = new Set<string>();
    brs.add('All');

    if (Array.isArray(brandsProp)) {
      brandsProp.forEach((b) => {
        const name = typeof b === 'string' ? b : b?.name;
        if (name) brs.add(name);
      });
    }

    products.forEach((p) => {
      if (p.brand) brs.add(p.brand);
    });

    return Array.from(brs);
  }, [brandsProp, products]);

  // Update document title, description, and canonical link
  useEffect(() => {
    let title = 'Shop All Collections | Mrbulk';
    if (selectedCategory !== 'All' && selectedBrand !== 'All') {
      title = `${selectedBrand} ${selectedCategory} | Shop Mrbulk`;
    } else if (selectedCategory !== 'All') {
      title = `${selectedCategory} Collection | Shop Mrbulk`;
    } else if (selectedBrand !== 'All') {
      title = `${selectedBrand} Store | Mrbulk`;
    }
    const description = `Explore our curated selection of ${
      selectedCategory !== 'All' ? selectedCategory.toLowerCase() : 'wholesale & retail'
    } products at Mrbulk. Fast delivery across South Africa.`;
    const canonicalPath = getShopUrl({
      category: selectedCategory,
      brand: selectedBrand,
      sort: sortBy,
      search: searchQuery,
    });
    updateSEOMetadata(title, description, canonicalPath);
  }, [selectedCategory, selectedBrand, sortBy, searchQuery]);

  // Parse numeric price for sorting
  const getNumericPrice = (priceStr: string | number): number => {
    if (typeof priceStr === 'number') return priceStr;
    return parseFloat(String(priceStr).replace(/[^0-9.]/g, '')) || 0;
  };

  // Filtered and sorted products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter((p) => {
        if (!p.category) return false;
        return p.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
      });
    }

    // 2. Filter by brand
    if (selectedBrand && selectedBrand !== 'All') {
      result = result.filter((p) => {
        if (!p.brand) return false;
        return p.brand.toLowerCase().trim() === selectedBrand.toLowerCase().trim();
      });
    }

    // 3. Filter by rating
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      result = result.filter((p) => {
        const rating = getProductRating(p.id) || (p.rating ? parseFloat(String(p.rating)) : 4.8);
        return rating >= minRating;
      });
    }

    // 4. Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(query);
        const descMatch = p.description?.toLowerCase().includes(query);
        const catMatch = p.category?.toLowerCase().includes(query);
        const brandMatch = p.brand?.toLowerCase().includes(query);
        const tagMatch = p.tags?.some((t: string) => t.toLowerCase().includes(query));
        return nameMatch || descMatch || catMatch || brandMatch || tagMatch;
      });
    }

    // 5. Sort
    if (sortBy === 'random') {
      result.sort((a, b) => (randomScores[a.id] ?? 0) - (randomScores[b.id] ?? 0));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => String(b.id).localeCompare(String(a.id), undefined, { numeric: true }));
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => (getProductRating(b.id) || 4.8) - (getProductRating(a.id) || 4.8));
    }

    return result;
  }, [products, selectedCategory, selectedBrand, selectedRating, searchQuery, sortBy, randomScores]);

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedBrand !== 'All' ? 1 : 0) +
    (selectedRating !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const resetAllFilters = useCallback(() => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedRating('all');
    setSelectedColor('all');
    setSearchQuery('');
    setSortBy('random');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    availableCategories,
    selectedBrand,
    setSelectedBrand,
    availableBrands,
    selectedRating,
    setSelectedRating,
    selectedColor,
    setSelectedColor,
    sortBy,
    setSortBy,
    gridView,
    setGridView,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    reshuffleRandom,
    processedProducts,
    activeFiltersCount,
    resetAllFilters,
  };
}
