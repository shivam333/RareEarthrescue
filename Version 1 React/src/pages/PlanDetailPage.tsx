import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { MotionItem } from "../components/ui/Motion";
import {
  AuthRole,
  getPlanCardBySlug,
  getPlanDetailPath,
  PlanSlug,
  roleLabels,
} from "../data/authPlansData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

function isPlanSlug(value: string | undefined): value is PlanSlug {
  return value === "one-time-order" || value === "subscription";
}

function isAuthRole(value: string | undefined): value is AuthRole {
  return value === "recycler" || value === "supplier";
}

export function PlanDetailPage() {
  const { planSlug, role } = useParams<{ planSlug: string; role: string }>();

  if (!isPlanSlug(planSlug) || !isAuthRole(role)) {
    return (
      <motion.main className="page" {...pageMotionProps}>
        <section className="section shell">
          <div className="panel rounded-[32px] p-8">
            <p className="eyebrow">Plan details</p>
            <h1 className="max-w-[12ch] text-[3rem]">Plan detail not available.</h1>
            <p className="section-copy mt-4 max-w-[42rem]">
              The access-path detail you requested could not be found. Return to sign in to choose
              a valid path.
            </p>
            <div className="hero-actions mt-6">
              <Link className="button button-primary" to="/sign-in">
                Back to sign in
              </Link>
            </div>
          </div>
        </section>
      </motion.main>
    );
  }

  const planCard = getPlanCardBySlug(planSlug);
  const variant = planCard?.variants?.[role];

  if (!planCard || !variant) {
    return null;
  }

  const alternateRole: AuthRole = role === "recycler" ? "supplier" : "recycler";

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="section shell">
        <div className="rounded-[36px] border border-[rgba(104,90,59,0.14)] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(245,237,225,0.92))] p-7 shadow-[0_24px_80px_rgba(87,68,35,0.12)] lg:p-10">
          <MotionItem>
            <div className="flex flex-wrap items-center gap-3 text-[0.76rem] font-bold uppercase tracking-[0.16em] text-[#87775f]">
              <Link to="/sign-in" className="transition hover:text-[#2f3426]">
                Sign in
              </Link>
              <span>/</span>
              <span>{planCard.title}</span>
              <span>/</span>
              <span>{roleLabels[role]}</span>
            </div>
          </MotionItem>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <MotionItem>
              <span
                className={`inline-flex rounded-full px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] ${
                  planCard.featured
                    ? "bg-[rgba(111,138,85,0.14)] text-[#526946]"
                    : "bg-[rgba(184,139,60,0.14)] text-[#9f742c]"
                }`}
              >
                {planCard.shortLabel}
              </span>
              <h1 className="mt-5 max-w-[11ch] text-[clamp(3rem,5vw,5.6rem)] leading-[0.96] tracking-[-0.06em] text-[#2f3426]">
                {planCard.title}
              </h1>
              <p className="mt-4 max-w-[44rem] text-[1.08rem] leading-8 text-[#6f6b57]">
                {variant.detailTitle}
              </p>
              <p className="mt-4 max-w-[44rem] text-[1rem] leading-8 text-[#6f6b57]">
                {variant.detailSummary}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="button button-primary"
                  to={`/sign-in?mode=sign-up&plan=${planSlug}`}
                >
                  {planCard.cta}
                </Link>
                <Link className="button button-secondary" to={getPlanDetailPath(planSlug, alternateRole)}>
                  View {roleLabels[alternateRole]} path
                </Link>
              </div>
            </MotionItem>

            <MotionItem>
              <div className="rounded-[30px] border border-[rgba(104,90,59,0.12)] bg-[rgba(255,255,255,0.6)] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.76rem] font-bold uppercase tracking-[0.18em] text-[#87775f]">
                      Access path
                    </p>
                    <h2 className="mt-2 text-[1.7rem] leading-[1.05] tracking-[-0.05em] text-[#2f3426]">
                      {roleLabels[role]} workflow
                    </h2>
                  </div>
                  <span className="rounded-full border border-[rgba(104,90,59,0.12)] bg-[rgba(255,250,242,0.8)] px-4 py-2 text-[0.78rem] font-semibold text-[#6f6b57]">
                    {variant.shortLabel}
                  </span>
                </div>

                <div className="mt-6 grid gap-3">
                  {variant.bullets.map((bullet, index) => (
                    <motion.div
                      key={bullet}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="flex items-start gap-3 rounded-[18px] border border-[rgba(104,90,59,0.1)] bg-[rgba(255,252,247,0.85)] px-4 py-3"
                    >
                      <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-[rgba(111,138,85,0.14)] text-[0.82rem] font-bold text-[#526946]">
                        ✓
                      </span>
                      <span className="text-[0.98rem] leading-7 text-[#44505b]">{bullet}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </MotionItem>
          </div>
        </div>
      </section>

      <section className="shell auth-secondary-section">
        <div className="grid gap-5 lg:grid-cols-2">
          <MotionItem className="rounded-[30px] border border-[rgba(104,90,59,0.14)] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(247,239,227,0.92))] p-6 shadow-[0_18px_50px_rgba(87,68,35,0.08)]">
            <p className="eyebrow mb-0">Best for</p>
            <div className="mt-5 grid gap-3">
              {variant.bestFor.map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-[rgba(104,90,59,0.1)] bg-[rgba(255,255,255,0.62)] px-4 py-3 text-[0.98rem] leading-7 text-[#44505b]"
                >
                  {item}
                </div>
              ))}
            </div>
          </MotionItem>

          <MotionItem className="rounded-[30px] border border-[rgba(104,90,59,0.14)] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(247,239,227,0.92))] p-6 shadow-[0_18px_50px_rgba(87,68,35,0.08)]">
            <p className="eyebrow mb-0">Typical workflow</p>
            <div className="mt-5 grid gap-3">
              {variant.workflow.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[18px] border border-[rgba(104,90,59,0.1)] bg-[rgba(255,255,255,0.62)] px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[rgba(184,139,60,0.14)] text-[0.82rem] font-bold text-[#9f742c]">
                      0{index + 1}
                    </span>
                    <strong className="text-[1rem] tracking-[-0.03em] text-[#2f3426]">
                      {step.title}
                    </strong>
                  </div>
                  <p className="mt-3 pl-11 text-[0.96rem] leading-7 text-[#6f6b57]">{step.copy}</p>
                </div>
              ))}
            </div>
          </MotionItem>
        </div>
      </section>
    </motion.main>
  );
}
