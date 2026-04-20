import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { MotionItem } from "../components/ui/Motion";
import { Stepper } from "../components/marketplace/Stepper";
import { recyclerSteps } from "../data/marketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function RecyclerOnboardingPage() {
  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell page-hero">
        <MotionItem>
          <p className="eyebrow">Recycler onboarding</p>
          <h1 className="heading-1">Secure fragmented supply with more procurement intelligence.</h1>
          <p className="lede">
            Join as a verified recycler, refiner, processor, or OEM reverse logistics team and
            define exactly which categories, assays, and regions fit your procurement model.
          </p>
        </MotionItem>
      </section>

      <section className="shell onboarding-layout">
        <aside className="form-sidebar">
          <MotionItem>
            <div className="panel">
              <h3 className="heading-3 mb-4">Application steps</h3>
              <Stepper items={recyclerSteps} />
            </div>
          </MotionItem>
        </aside>

        <MotionItem className="form-panel panel">
          <span className="badge">Step 1 of 4</span>
          <h2 className="heading-2 mt-4">Build your recycler profile</h2>
          <p className="section-copy body-copy mt-3">
            Help Rare Earth Rescue route relevant feedstock opportunities to your procurement team.
          </p>

          <div className="form-grid mt-6">
            <Field label="Company name" defaultValue="Northshore Magnet Recovery" />
            <SelectField
              label="Buyer type"
              options={["Magnet recycler", "Hydromet processor", "Pyromet processor", "OEM reverse logistics team"]}
            />
            <Field label="Primary processing facility" defaultValue="Rotterdam, Netherlands" />
            <Field label="Sourcing coverage" defaultValue="Europe and North America" />
            <Field label="Target feedstock categories" defaultValue="NdFeB magnet scrap, motor fractions, manufacturing scrap" />
            <Field label="Preferred lot size" defaultValue="5-25 MT, with repeat monthly sourcing preferred" />
            <Field label="Assay requirement" defaultValue="Preferred for 10 MT+ lots; photo validation accepted on pilot batches" />
            <Field label="Procurement contact" defaultValue="Mila Jensen, Senior Buyer" />
          </div>

          <div className="field mt-5">
            <label htmlFor="recycler-notes">Capability notes</label>
            <textarea
              className="textarea"
              defaultValue="We process sintered magnet scrap and selected motor-derived streams with preference for verified lots, documented source industries, and staged logistics support for cross-border shipments."
              id="recycler-notes"
            />
            <span className="field-help">
              Describe accepted forms, contamination thresholds, and how you prefer to receive supply opportunities.
            </span>
          </div>

          <div className="hero-actions mt-6">
            <Button href="/contact">Continue to Qualification</Button>
            <Button href="/marketplace" variant="secondary">
              Preview Live Supply
            </Button>
          </div>
        </MotionItem>
      </section>
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
