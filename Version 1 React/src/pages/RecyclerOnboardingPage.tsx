import staticRecyclerHtml from "../static-html/recycler-onboarding.html?raw";
import { StaticHtmlPage } from "../components/static/StaticHtmlPage";

export function RecyclerOnboardingPage() {
  return <StaticHtmlPage rawHtml={staticRecyclerHtml} />;
}
