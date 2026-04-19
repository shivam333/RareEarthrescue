import staticMarketplaceHtml from "../static-html/marketplace.html?raw";
import { StaticHtmlPage } from "../components/static/StaticHtmlPage";

export function MarketplacePage() {
  return <StaticHtmlPage rawHtml={staticMarketplaceHtml} />;
}
