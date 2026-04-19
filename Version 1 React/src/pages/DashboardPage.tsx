import staticDashboardHtml from "../static-html/dashboard.html?raw";
import { StaticHtmlPage } from "../components/static/StaticHtmlPage";

export function DashboardPage() {
  return <StaticHtmlPage rawHtml={staticDashboardHtml} />;
}
