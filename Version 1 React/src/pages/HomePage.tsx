import staticHomeHtml from "../static-html/index.html?raw";
import { StaticHtmlPage } from "../components/static/StaticHtmlPage";

export function HomePage() {
  return <StaticHtmlPage rawHtml={staticHomeHtml} />;
}
