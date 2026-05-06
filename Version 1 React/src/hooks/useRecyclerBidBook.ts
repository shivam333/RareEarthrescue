import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "rer-recycler-bid-book";
const SYNC_EVENT = "rer-bid-book-sync";

export type RecyclerBidRecord = {
  listingId: string;
  sourceId: string;
  listingTitle: string;
  bidPricePerKg: number;
  quantityTons: number;
  totalBid: number;
  submittedAt: string;
  status: "active" | "updated";
};

function readStoredBidBook(): RecyclerBidRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as RecyclerBidRecord[]) : [];
  } catch {
    return [];
  }
}

export function useRecyclerBidBook() {
  const [bidBook, setBidBook] = useState<RecyclerBidRecord[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setBidBook(readStoredBidBook());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bidBook));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  }, [bidBook, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const syncBidBook = () => {
      const nextBidBook = readStoredBidBook();
      setBidBook((current) =>
        JSON.stringify(current) === JSON.stringify(nextBidBook) ? current : nextBidBook,
      );
    };

    window.addEventListener("storage", syncBidBook);
    window.addEventListener(SYNC_EVENT, syncBidBook);

    return () => {
      window.removeEventListener("storage", syncBidBook);
      window.removeEventListener(SYNC_EVENT, syncBidBook);
    };
  }, [isHydrated]);

  const bidMap = useMemo(
    () => Object.fromEntries(bidBook.map((record) => [record.listingId, record])),
    [bidBook],
  );

  return {
    bidBook,
    bidMap,
    activeBidCount: bidBook.length,
    hasBid(listingId: string) {
      return Boolean(bidMap[listingId]);
    },
    saveBid(nextBid: RecyclerBidRecord) {
      setBidBook((current) => [
        nextBid,
        ...current.filter((record) => record.listingId !== nextBid.listingId),
      ]);
    },
  };
}
