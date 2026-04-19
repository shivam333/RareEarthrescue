import staticContactHtml from "../static-html/contact.html?raw";
import { StaticHtmlPage } from "../components/static/StaticHtmlPage";

export function ContactPage() {
  return <StaticHtmlPage rawHtml={staticContactHtml} />;
}
