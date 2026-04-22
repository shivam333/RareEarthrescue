import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "rer-recycler-order-book";

type OrderBook = Record<string, number>;

export function useRecyclerOrderBook() {
  const [orderBook, setOrderBook] = useState<OrderBook>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setOrderBook(JSON.parse(stored) as OrderBook);
      }
    } catch {
      // Ignore storage parsing issues and fall back to an empty staged order book.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orderBook));
  }, [isHydrated, orderBook]);

  const totalLots = useMemo(
    () => Object.values(orderBook).reduce((sum, count) => sum + count, 0),
    [orderBook]
  );

  const totalItems = useMemo(
    () => Object.values(orderBook).filter((count) => count > 0).length,
    [orderBook]
  );

  return {
    orderBook,
    totalLots,
    totalItems,
    setLots(listingId: string, lots: number) {
      setOrderBook((current) => {
        if (lots <= 0) {
          const next = { ...current };
          delete next[listingId];
          return next;
        }

        return { ...current, [listingId]: lots };
      });
    },
    addLots(listingId: string, lots: number) {
      setOrderBook((current) => {
        const nextCount = (current[listingId] ?? 0) + lots;

        if (nextCount <= 0) {
          const next = { ...current };
          delete next[listingId];
          return next;
        }

        return { ...current, [listingId]: nextCount };
      });
    },
  };
}
