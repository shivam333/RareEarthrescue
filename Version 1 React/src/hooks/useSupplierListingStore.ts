import { useEffect, useMemo, useState } from "react";
import {
  dashboardMaterialTiles,
  DashboardBidListing,
  DashboardLocationFilter,
  DashboardLotSize,
  DashboardSourceId,
} from "../data/dashboardMarketplaceData";
import {
  dashboardAuctionListings,
  dashboardLiveListings,
} from "../data/recyclerMarketData";
import { supplierActiveListings, SupplierActiveListing } from "../data/supplierListingsData";

export type SupplierStoreFamilyId = DashboardSourceId | "specialized-products";
export type SupplierPackageStatus = "draft" | "live-floor" | "live-bid";

export type SupplierStoredLineItem = {
  id: string;
  subcategoryLabel: string;
  manufacturer: string;
  modelFamily: string;
  partNumber: string;
  quantityKg: string;
  floorPriceKg: string;
  packaging: string;
  condition: string;
  detailMode: "yes" | "no" | "";
  authorization: string;
  releasePath: string;
  isBelowRange: boolean;
};

export type SupplierListingPackage = {
  id: string;
  familyId: SupplierStoreFamilyId;
  familyLabel: string;
  subcategoryId: string;
  subcategoryLabel: string;
  packageTitle: string;
  evidenceNotes: string;
  status: SupplierPackageStatus;
  createdAt: string;
  updatedAt: string;
  lineItems: SupplierStoredLineItem[];
};

const STORAGE_KEY = "rer-supplier-listing-packages";
const SYNC_EVENT = "rer-supplier-listing-sync";
const SPECIALIZED_PRODUCTS_IMAGE =
  "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1400&q=80";

function readStoredSupplierPackages() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as SupplierListingPackage[]) : [];
  } catch {
    return [];
  }
}

function writeStoredSupplierPackages(packages: SupplierListingPackage[]) {
  if (typeof window === "undefined") {
    return packages;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  return packages;
}

function mapFamilyToSourceId(familyId: SupplierStoreFamilyId): DashboardSourceId {
  return familyId === "specialized-products" ? "other-items" : familyId;
}

function getFamilyVisual(familyId: SupplierStoreFamilyId) {
  if (familyId === "specialized-products") {
    return {
      title: "Specialized Products",
      image: SPECIALIZED_PRODUCTS_IMAGE,
    };
  }

  const tile = dashboardMaterialTiles.find((item) => item.id === familyId);

  return {
    title: tile?.title ?? "Supplier listing",
    image: tile?.image ?? SPECIALIZED_PRODUCTS_IMAGE,
  };
}

function toNumberValue(value: string) {
  const normalized = value.replace(/[^0-9.]/g, "");
  return normalized ? Number(normalized) : NaN;
}

function formatPerKg(value: number) {
  return `$${value.toFixed(2)}/kg`;
}

function formatPerTon(value: number) {
  return `$${Math.round(value * 1000).toLocaleString()} / ton`;
}

function formatQuantityKg(value: string) {
  const numeric = toNumberValue(value);
  return Number.isFinite(numeric) ? `${numeric.toLocaleString()} kg` : `${value} kg`;
}

function deriveLotSize(quantityKg: number): DashboardLotSize {
  if (quantityKg >= 15000) return "large";
  if (quantityKg >= 5000) return "mid";
  return "small";
}

function deriveLocationFilter(familyId: SupplierStoreFamilyId): DashboardLocationFilter {
  if (familyId === "specialized-products") return "usa";
  return "usa";
}

function formatPackageTimestamp(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Updated recently";
  }

  return `Updated ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}

function packageStatusLabel(status: SupplierPackageStatus, bidCount: number) {
  if (status === "live-bid") {
    return `${bidCount} bid${bidCount === 1 ? "" : "s"} live`;
  }

  return "Listed at floor price";
}

function mapPackageToMarketplaceListings(pkg: SupplierListingPackage): DashboardBidListing[] {
  if (pkg.status === "draft") {
    return [];
  }

  const { title: familyLabel, image } = getFamilyVisual(pkg.familyId);
  const sourceId = mapFamilyToSourceId(pkg.familyId);

  return pkg.lineItems.map((item, index) => {
    const floorPriceKg = toNumberValue(item.floorPriceKg);
    const quantityKg = toNumberValue(item.quantityKg);
    const bidCount = 3 + ((index + pkg.lineItems.length) % 5);
    const qualitySignal =
      item.detailMode === "no"
        ? "Platform review path active for unknown equipment details."
        : "Protected composition guidance applied from structured equipment matching.";

    return {
      id: `${pkg.id}-${item.id}`,
      sourceId,
      material: `${item.manufacturer} ${item.modelFamily} ${item.subcategoryLabel}`.trim(),
      category: item.subcategoryLabel,
      location:
        pkg.familyId === "specialized-products"
          ? "Verified U.S. secure release"
          : "Verified seller region",
      quantity: formatQuantityKg(item.quantityKg),
      openingBid: `${formatPerKg(floorPriceKg)} listing floor`,
      concentration: "Protected composition model applied",
      verification:
        pkg.status === "live-bid" ? "Bid live + platform matched" : "Listed at floor + platform matched",
      purityNotes: qualitySignal,
      availability: pkg.status === "live-bid" ? "Bid window open" : "Available at floor price",
      lotSize: deriveLotSize(quantityKg),
      locationFilter: deriveLocationFilter(pkg.familyId),
      pricePerTon: formatPerTon(floorPriceKg),
      availableLots: 1,
      sellerName: "Verified supplier network",
      sellerType: familyLabel,
      image,
      images: [image],
      detailTitle: `${item.subcategoryLabel} | ${item.manufacturer}`.trim(),
      detailSummary: `${pkg.packageTitle}. ${pkg.evidenceNotes}`,
      sourceStream: `${familyLabel} supplier package`,
      packaging: item.packaging,
      logistics:
        pkg.familyId === "specialized-products"
          ? "Secure logistics and controlled release coordination"
          : "Seller-managed pickup and shipment coordination",
      recoveryNotes:
        pkg.status === "live-bid"
          ? "This supplier package is open to recycler bidding with protected pricing guidance in the background."
          : "This supplier package is listed at floor price and available to qualified recycler buyers.",
    };
  });
}

function mapPackageToActiveListings(pkg: SupplierListingPackage): SupplierActiveListing[] {
  if (pkg.status === "draft") {
    return [];
  }

  const familyLabel = getFamilyVisual(pkg.familyId).title;

  return pkg.lineItems.map((item, index) => {
    const floorPriceKg = toNumberValue(item.floorPriceKg);
    const uplift = pkg.status === "live-bid" ? 1.08 + index * 0.01 : 1;
    const bidCount = pkg.status === "live-bid" ? 3 + ((index + pkg.lineItems.length) % 5) : 0;

    return {
      id: `${pkg.id}-${item.id}`,
      title: `${item.subcategoryLabel} | ${item.manufacturer}`.trim(),
      family: familyLabel,
      subcategory: item.subcategoryLabel,
      quantity: formatQuantityKg(item.quantityKg),
      floorPrice: formatPerKg(floorPriceKg),
      bestBid: formatPerKg(floorPriceKg * uplift),
      status: packageStatusLabel(pkg.status, bidCount),
      bidCount,
      updated: formatPackageTimestamp(pkg.updatedAt),
    };
  });
}

export function useSupplierListingStore() {
  const [packages, setPackages] = useState<SupplierListingPackage[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setPackages(readStoredSupplierPackages());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  }, [isHydrated, packages]);

  useEffect(() => {
    if (!isHydrated) return;

    const syncPackages = () => {
      const nextPackages = readStoredSupplierPackages();
      setPackages((current) =>
        JSON.stringify(current) === JSON.stringify(nextPackages) ? current : nextPackages,
      );
    };

    window.addEventListener("storage", syncPackages);
    window.addEventListener(SYNC_EVENT, syncPackages);

    return () => {
      window.removeEventListener("storage", syncPackages);
      window.removeEventListener(SYNC_EVENT, syncPackages);
    };
  }, [isHydrated]);

  const draftPackages = useMemo(
    () => packages.filter((pkg) => pkg.status === "draft"),
    [packages],
  );

  const publishedPackages = useMemo(
    () => packages.filter((pkg) => pkg.status !== "draft"),
    [packages],
  );

  const dynamicAuctionListings = useMemo(
    () =>
      [...publishedPackages]
        .filter((pkg) => pkg.status === "live-bid")
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .flatMap(mapPackageToMarketplaceListings),
    [publishedPackages],
  );

  const dynamicLiveListings = useMemo(
    () =>
      [...publishedPackages]
        .filter((pkg) => pkg.status === "live-floor")
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .flatMap(mapPackageToMarketplaceListings),
    [publishedPackages],
  );

  const dynamicActiveListings = useMemo(
    () =>
      [...publishedPackages]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .flatMap(mapPackageToActiveListings),
    [publishedPackages],
  );

  const mergedAuctionListings = useMemo(
    () => [...dynamicAuctionListings, ...dashboardAuctionListings],
    [dynamicAuctionListings],
  );

  const mergedLiveListings = useMemo(
    () => [...dynamicLiveListings, ...dashboardLiveListings],
    [dynamicLiveListings],
  );

  const mergedActiveListings = useMemo(
    () => [...dynamicActiveListings, ...supplierActiveListings],
    [dynamicActiveListings],
  );

  return {
    packages,
    draftPackages,
    publishedPackages,
    draftCount: draftPackages.length,
    publishedListingCount: dynamicActiveListings.length,
    dynamicAuctionListings,
    dynamicLiveListings,
    dynamicActiveListings,
    mergedAuctionListings,
    mergedLiveListings,
    mergedActiveListings,
    savePackage(nextPackage: SupplierListingPackage) {
      setPackages((current) =>
        writeStoredSupplierPackages([nextPackage, ...current.filter((pkg) => pkg.id !== nextPackage.id)]),
      );
    },
  };
}
