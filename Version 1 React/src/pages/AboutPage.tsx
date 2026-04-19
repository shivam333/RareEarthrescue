import staticAboutHtml from "../static-html/about.html?raw";
import { StaticHtmlPage } from "../components/static/StaticHtmlPage";

export function AboutPage() {
  return <StaticHtmlPage rawHtml={staticAboutHtml} />;
}
