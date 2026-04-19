import staticSupplierHtml from "../static-html/supplier-onboarding.html?raw";
import { StaticHtmlPage } from "../components/static/StaticHtmlPage";

export function SupplierOnboardingPage() {
  return <StaticHtmlPage rawHtml={staticSupplierHtml} />;
}
