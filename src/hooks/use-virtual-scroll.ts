import { useState, useRef, useEffect, useMemo } from 'react';

interface UseVirtualScrollOptions<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualScrollState {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  totalHeight: number;
}

export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: UseVirtualScrollOptions<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = useMemo(
    () => items.length * itemHeight,
    [items.length, itemHeight]
  );

  const visibleCount = useMemo(
    () => Math.ceil(containerHeight / itemHeight),
    [containerHeight, itemHeight]
  );

  const startIndex = useMemo(
    () => Math.max(0, Math.floor(scrollTop / itemHeight) - overscan),
    [scrollTop, itemHeight, overscan]
  );

  const endIndex = useMemo(
    () => Math.min(items.length - 1, startIndex + visibleCount + overscan * 2),
    [items.length, startIndex, visibleCount, overscan]
  );

  const offsetY = useMemo(
    () => startIndex * itemHeight,
    [startIndex, itemHeight]
  );

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex + 1),
    [items, startIndex, endIndex]
  );

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLDivElement;
      setScrollTop(target.scrollTop);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return {
    containerRef,
    visibleItems,
    virtualScrollState: {
      startIndex,
      endIndex,
      offsetY,
      totalHeight,
    },
  };
}