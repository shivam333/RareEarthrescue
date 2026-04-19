import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeUp, stagger } from "../../lib/motion";
import { cx } from "../../lib/cx";

export function MotionSection({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={stagger}
    >
      {children}
    </motion.section>
  );
}

export function MotionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cx(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}
