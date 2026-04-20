import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function ContactPage() {
  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell page-hero">
        <MotionItem>
          <p className="eyebrow">Talk to our team</p>
          <h1 className="heading-1">Request a marketplace demo or discuss a live feedstock opportunity.</h1>
          <p className="lede">
            Connect with Rare Earth Rescue to list feedstock, join as a verified recycler, explore
            pricing intelligence, or discuss strategic secondary sourcing.
          </p>
        </MotionItem>
      </section>

      <MotionSection className="section-gap shell contact-layout">
        <MotionItem className="form-panel panel">
          <h2 className="heading-2">Request a demo</h2>
          <div className="form-grid mt-6">
            <Field label="Full name" defaultValue="Jordan Lee" />
            <Field label="Company" defaultValue="Continental Recovery Systems" />
            <Field label="Role" defaultValue="Director of Procurement" />
            <SelectField
              label="Primary interest"
              options={["Buying feedstock", "Listing supply", "Pricing intelligence", "Strategic partnership"]}
            />
          </div>
          <div className="field mt-5">
            <label htmlFor="message">Message</label>
            <textarea
              className="textarea"
              defaultValue="We are looking to source verified motor and magnet-bearing feedstock across North America with assay-backed documentation for larger lots."
              id="message"
            />
          </div>
          <div className="hero-actions mt-6">
            <Button>Submit Request</Button>
            <Button href="/marketplace" variant="secondary">
              View Marketplace
            </Button>
          </div>
        </MotionItem>

        <div className="contact-grid">
          {[
            {
              title: "Marketplace team",
              copy: "New listings, recycler verification, procurement requests, and live transaction support.",
            },
            {
              title: "Commercial partnerships",
              copy: "OEM sourcing programs, strategic feedstock partnerships, and ecosystem collaboration.",
            },
            {
              title: "Pricing intelligence",
              copy: "Market signals, category-level trends, and data products for critical material sourcing teams.",
            },
          ].map((card) => (
            <MotionItem key={card.title}>
              <article className="contact-card panel float-hover">
                <strong>{card.title}</strong>
                <p>{card.copy}</p>
              </article>
            </MotionItem>
          ))}
        </div>
      </MotionSection>
    </motion.main>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input className="input" defaultValue={defaultValue} />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select className="select" defaultValue={options[0]}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
