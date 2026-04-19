import staticListingDetailHtml from "../static-html/listing-detail.html?raw";
import { StaticHtmlPage } from "../components/static/StaticHtmlPage";

export function ListingDetailPage() {
  return <StaticHtmlPage rawHtml={staticListingDetailHtml} />;
}
