import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { MotionItem } from "../components/ui/Motion";
import { Stepper } from "../components/marketplace/Stepper";
import { supplierSteps } from "../data/marketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function SupplierOnboardingPage() {
  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell page-hero">
        <MotionItem>
          <p className="eyebrow">Supplier onboarding</p>
          <h1 className="heading-1">Bring rare-earth-bearing feedstock to market with more structure.</h1>
          <p className="lede">
            Designed for scrapyards, dismantlers, ITAD firms, industrial processors, motor
            recyclers, salvage operators, and aggregators listing feedstock for verified buyers.
          </p>
        </MotionItem>
      </section>

      <section className="shell onboarding-layout">
        <aside className="form-sidebar">
          <MotionItem>
            <div className="panel">
              <h3 className="heading-3 mb-4">Application steps</h3>
              <Stepper items={supplierSteps} />
            </div>
          </MotionItem>
        </aside>

        <MotionItem className="form-panel panel">
          <BadgeRow label="Step 1 of 4" />
          <h2 className="heading-2 mt-4">Create your supplier profile</h2>
          <p className="section-copy body-copy mt-3">
            Tell the platform who you are, which materials you handle, and where your feedstock is located.
          </p>

          <div className="form-grid mt-6">
            <Field label="Company name" defaultValue="Great Lakes Recovery Partners" />
            <SelectField label="Seller type" options={["Motor recycler", "ITAD firm", "Industrial scrap processor", "Auto dismantler"]} />
            <Field label="Headquarters" defaultValue="Detroit, Michigan, USA" />
            <Field label="Operating region" defaultValue="North America" />
            <Field label="Primary material categories" defaultValue="Traction motors, NdFeB magnets, HDD assemblies" />
            <Field label="Typical monthly volume" defaultValue="25-60 MT equivalent across mixed streams" />
            <Field label="Primary contact" defaultValue="Avery Singh, Commercial Director" />
            <Field label="Email" defaultValue="avery@greatlakesrecovery.com" />
          </div>

          <div className="field mt-5">
            <label htmlFor="supplier-notes">Material listing notes</label>
            <textarea
              className="textarea"
              defaultValue="We generate recurring traction motor and HDD magnet streams with photo documentation, pallet-level tracking, and periodic assay support for larger lots."
              id="supplier-notes"
            />
            <span className="field-help">
              Describe recurring supply, source industries, packaging, and what buyers should know before bidding.
            </span>
          </div>

          <div className="hero-actions mt-6">
            <Button href="/contact">Continue to Verification</Button>
            <Button href="/marketplace" variant="secondary">
              Preview Marketplace
            </Button>
          </div>
        </MotionItem>
      </section>
    </motion.main>
  );
}

function BadgeRow({ label }: { label: string }) {
  return <span className="badge">{label}</span>;
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
