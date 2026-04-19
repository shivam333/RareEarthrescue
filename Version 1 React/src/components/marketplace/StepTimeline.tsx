import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../lib/motion";

type TimelineItem = {
  step: string;
  title: string;
  copy: string;
};

export function StepTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <motion.div
      className="timeline"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={stagger}
    >
      {items.map((item) => (
        <motion.article className="timeline-step" key={item.step} variants={fadeUp} whileHover={{ y: -6 }}>
          <span className="timeline-badge">{item.step}</span>
          <strong>{item.title}</strong>
          <p className="text-sm leading-7 text-muted">{item.copy}</p>
        </motion.article>
      ))}
    </motion.div>
  );
}
