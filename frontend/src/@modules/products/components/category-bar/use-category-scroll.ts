'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface UseCategoryScrollOptions {
  selectedCategoryName?: string;
  itemCount?: number;
}

/**
 * Hook to manage smooth carousel navigation, bounds tracking, and touch/mouse dragging for CategoryBar.
 */
export function useCategoryScroll({
  selectedCategoryName,
  itemCount = 0,
}: UseCategoryScrollOptions = {}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  // Check whether scroll is at bounds
  const checkScrollBoundaries = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  // Update bounds on mount, resize, or item count changes
  useEffect(() => {
    checkScrollBoundaries();
    window.addEventListener('resize', checkScrollBoundaries);
    return () => window.removeEventListener('resize', checkScrollBoundaries);
  }, [checkScrollBoundaries, itemCount]);

  // Center selected category in view when selectedCategory changes or on initial mount
  useEffect(() => {
    if (selectedCategoryName && scrollContainerRef.current) {
      const activeBtn = scrollContainerRef.current.querySelector(
        `[data-category-name="${selectedCategoryName.toLowerCase()}"]`
      ) as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
    checkScrollBoundaries();
  }, [selectedCategoryName, checkScrollBoundaries]);

  // Smooth stepping on directional chevron click
  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollStep = Math.max(container.clientWidth * 0.6, 220);
    const target = direction === 'left' ? container.scrollLeft - scrollStep : container.scrollLeft + scrollStep;
    container.scrollTo({
      left: target,
      behavior: 'smooth',
    });
    setTimeout(checkScrollBoundaries, 350);
  }, [checkScrollBoundaries]);

  // Mouse drag & touch scrolling handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
    setDragDistance(0);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.3;
    setDragDistance(Math.abs(walk));
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
    checkScrollBoundaries();
  }, [isDragging, startX, scrollLeftState, checkScrollBoundaries]);

  const handleMouseUpOrLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    dragDistance,
    checkScrollBoundaries,
    handleScroll,
    handleMouseDown,
    handleMouseMove,
    handleMouseUpOrLeave,
  };
}
