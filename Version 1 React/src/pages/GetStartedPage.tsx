import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AccessPathsSection } from "../components/auth/AccessPathsSection";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function GetStartedPage() {
  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="section shell auth-shell auth-shell-centered">
        <div className="auth-page-layout auth-page-layout-centered">
          <div className="auth-copy auth-copy-centered">
            <p className="eyebrow">Get Started</p>
            <h1 className="auth-title">Choose the access path that fits your recovery workflow.</h1>
            <p className="auth-subcopy">
              Start with a one-time transaction, move into recurring subscription access, or talk
              to us about a more tailored enterprise program.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link className="button button-secondary" to="/sign-in">
              Already have an account? Sign In
            </Link>
            <Link className="button button-primary" to="/sign-in?mode=sign-up">
              Create account
            </Link>
          </div>
        </div>
      </section>

      <AccessPathsSection />
    </motion.main>
  );
}
