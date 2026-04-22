import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "rer-recycler-order-book";
const SYNC_EVENT = "rer-order-book-sync";

type OrderBook = Record<string, number>;

function readStoredOrderBook(): OrderBook {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as OrderBook) : {};
  } catch {
    return {};
  }
}

export function useRecyclerOrderBook() {
  const [orderBook, setOrderBook] = useState<OrderBook>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setOrderBook(readStoredOrderBook());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orderBook));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  }, [isHydrated, orderBook]);

  useEffect(() => {
    if (!isHydrated) return;

    const syncOrderBook = () => {
      const nextOrderBook = readStoredOrderBook();
      setOrderBook((current) =>
        JSON.stringify(current) === JSON.stringify(nextOrderBook) ? current : nextOrderBook
      );
    };

    window.addEventListener("storage", syncOrderBook);
    window.addEventListener(SYNC_EVENT, syncOrderBook);

    return () => {
      window.removeEventListener("storage", syncOrderBook);
      window.removeEventListener(SYNC_EVENT, syncOrderBook);
    };
  }, [isHydrated]);

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
