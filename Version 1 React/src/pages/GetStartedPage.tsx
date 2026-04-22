import { motion } from "framer-motion";
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
      <AccessPathsSection
        eyebrow="Get Started"
        title="Choose the access path that best fits how you want to enter the recovery network."
        copy="Create an account when you are ready, then choose between a guided one-time order, recurring subscription access, or a more tailored enterprise engagement."
        compactIntro
        hideAccessStory
      />
    </motion.main>
  );
}
