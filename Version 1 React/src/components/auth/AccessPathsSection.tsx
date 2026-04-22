import { useState } from "react";
import { useAuth } from "@clerk/react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  AuthRole,
  comparisonHelperItems,
  getPlanDetailPath,
  planCards,
  PlanSlug,
  roleLabels,
} from "../../data/authPlansData";

function isRoleDrivenPlan(planId: string): planId is PlanSlug {
  return planId === "one-time-order" || planId === "subscription";
}

type AccessPathsSectionProps = {
  eyebrow?: string;
  title?: string;
  copy?: string;
  compactIntro?: boolean;
  hideAccessStory?: boolean;
};

export function AccessPathsSection({
  eyebrow = "Access Paths",
  title = "Choose the operating depth that matches how you buy, sell, and scale recovery activity.",
  copy = "Keep account creation light, then move from a first transaction into recurring access or tailored enterprise support as your workflow becomes more complex.",
  compactIntro = false,
  hideAccessStory = false,
}: AccessPathsSectionProps) {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [selectedRole, setSelectedRole] = useState<AuthRole>("recycler");
  const [activeHelper, setActiveHelper] = useState("subscription");

  const accessStory = [
    "Start fast with a one-time transaction",
    "Scale into subscription when recovery activity becomes repeatable",
    "Move into enterprise services when operational complexity increases",
  ];

  return (
    <section id="plan-comparison" className="section shell auth-secondary-section">
      <div className={`section-header auth-secondary-header ${compactIntro ? "max-w-[56rem]" : ""}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className={compactIntro ? "max-w-[18ch] text-[clamp(2rem,3.6vw,3.35rem)] leading-[1.02] tracking-[-0.05em]" : ""}>
          {title}
        </h2>
        <p className={`section-copy ${compactIntro ? "max-w-[44rem] text-[1rem] leading-7 text-[#5d6c79]" : ""}`}>
          {copy}
        </p>
      </div>

      {!hideAccessStory ? (
        <div className="mt-8 rounded-[30px] border border-[rgba(104,90,59,0.12)] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(247,239,227,0.84))] p-5 shadow-[0_18px_50px_rgba(87,68,35,0.08)]">
          <div className="grid gap-3 lg:grid-cols-3">
            {accessStory.map((item, index) => (
              <div
                key={item}
                className="rounded-[22px] border border-[rgba(104,90,59,0.08)] bg-[rgba(255,255,255,0.56)] px-4 py-4"
              >
                <span className="text-[0.74rem] font-bold uppercase tracking-[0.18em] text-[#8d6d39]">
                  0{index + 1}
                </span>
                <p className="mt-3 text-[0.98rem] leading-7 text-[#44505b]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex items-center justify-center">
        <div className="inline-flex rounded-full border border-[rgba(104,90,59,0.12)] bg-[rgba(255,255,255,0.82)] p-1 shadow-[0_10px_30px_rgba(46,41,31,0.06)]">
          {(["recycler", "supplier"] as const).map((role) => {
            const isActive = selectedRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] transition ${
                  isActive
                    ? "bg-[linear-gradient(145deg,#b88b3c,#9f742c)] text-white shadow-[0_10px_24px_rgba(184,139,60,0.2)]"
                    : "text-[#6f6b57] hover:text-[#2f3426]"
                }`}
              >
                {roleLabels[role]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        {planCards.map((plan, index) => {
          const rolePlanId: PlanSlug | null = isRoleDrivenPlan(plan.id) ? plan.id : null;
          const planVariant = rolePlanId ? plan.variants?.[selectedRole] : undefined;

          return (
            <motion.article
              key={plan.id}
              className={`panel float-hover relative overflow-hidden rounded-[30px] border p-6 shadow-[0_20px_60px_rgba(87,68,35,0.08)] ${
                plan.featured
                  ? "border-[rgba(111,138,85,0.22)] bg-[linear-gradient(180deg,rgba(255,252,247,1),rgba(242,238,226,0.96))]"
                  : "border-[rgba(104,90,59,0.14)] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(246,239,227,0.94))]"
              } min-h-[36rem]`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <div
                className={`absolute right-[-3rem] top-[-3rem] h-36 w-36 rounded-full blur-3xl ${
                  plan.featured ? "bg-[rgba(111,138,85,0.14)]" : "bg-[rgba(184,139,60,0.12)]"
                }`}
                aria-hidden="true"
              />

              <div className="relative z-10 flex min-h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${
                        plan.featured
                          ? "bg-[rgba(111,138,85,0.14)] text-[#526946]"
                          : "bg-[rgba(184,139,60,0.14)] text-[#9f742c]"
                      }`}
                    >
                      {plan.shortLabel}
                    </span>
                    <h3 className="mt-4 text-[1.42rem] tracking-[-0.05em] text-[#2f3426]">
                      {plan.title}
                    </h3>
                    {plan.priceLabel ? (
                      <p className="mt-3 font-display text-[1.5rem] tracking-[-0.05em] text-[#11283d]">
                        {plan.priceLabel}
                      </p>
                    ) : null}
                    <p className="mt-3 text-[0.98rem] leading-7 text-[#6f6b57]">
                      {plan.summary}
                    </p>
                  </div>

                  {plan.featured ? (
                    <span className="rounded-full border border-[rgba(111,138,85,0.2)] bg-[rgba(111,138,85,0.1)] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#526946]">
                      Recommended
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-[#8a7b65]">
                  {plan.progression}
                </p>

                {planVariant ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${plan.id}-${selectedRole}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-5"
                    >
                      <p className="text-[0.98rem] leading-7 text-[#44505b]">{planVariant.summary}</p>
                      <div className="mt-5 grid gap-3">
                        {planVariant.bullets.slice(0, 6).map((bullet: string) => (
                          <div key={bullet} className="flex items-start gap-3">
                            <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-[rgba(111,138,85,0.14)] text-[0.82rem] font-bold text-[#526946]">
                              ✓
                            </span>
                            <span className="text-[0.95rem] leading-7 text-[#44505b]">{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="mt-5">
                    <div className="grid gap-3">
                      {plan.bullets?.map((bullet) => (
                        <div key={bullet} className="flex items-start gap-3">
                          <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-[rgba(184,139,60,0.14)] text-[0.82rem] font-bold text-[#9f742c]">
                            ✓
                          </span>
                          <span className="text-[0.95rem] leading-7 text-[#44505b]">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto flex flex-col gap-3 pt-6">
                  <button
                    className={`button ${plan.featured ? "button-primary" : "button-secondary"} button-block`}
                    type="button"
                    onClick={() => {
                      if (plan.planType) {
                        if (isSignedIn && rolePlanId) {
                          navigate(getPlanDetailPath(rolePlanId, selectedRole));
                          return;
                        }

                        navigate("/sign-in?mode=sign-up");
                        return;
                      }
                      navigate("/contact");
                    }}
                  >
                    {plan.cta}
                  </button>

                  {planVariant && rolePlanId ? (
                    <Link
                      className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-[#8d6d39] transition hover:text-[#2f3426]"
                      to={getPlanDetailPath(rolePlanId, selectedRole)}
                    >
                      Know more
                    </Link>
                  ) : (
                    <button
                      className="w-fit border-0 bg-transparent px-0 text-left text-[0.8rem] font-bold uppercase tracking-[0.16em] text-[#8d6d39] transition hover:text-[#2f3426]"
                      type="button"
                      onClick={() => navigate("/contact")}
                    >
                      Know more
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-6 rounded-[30px] border border-[rgba(104,90,59,0.12)] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(247,239,227,0.92))] p-6 shadow-[0_18px_50px_rgba(87,68,35,0.08)]">
        <div className="flex flex-col gap-4 border-b border-[rgba(104,90,59,0.1)] pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="plan-visual-label">Comparison helper</span>
            <h3 className="mt-3 text-[1.5rem] tracking-[-0.04em] text-[#2f3426]">
              A simple progression from first transaction to scaled operating model.
            </h3>
          </div>
          <p className="max-w-[38rem] text-[0.96rem] leading-7 text-[#6f6b57]">
            Use one-time access to start, move into subscription when activity becomes repeatable,
            and step into enterprise support when the workflow needs tailored coordination.
          </p>
        </div>

        <div className="mt-2 grid">
          {comparisonHelperItems.map((item) => {
            const isOpen = activeHelper === item.id;

            return (
              <motion.article
                key={item.id}
                className="border-b border-[rgba(104,90,59,0.1)] last:border-b-0"
              >
                <button
                  className="flex w-full items-center justify-between gap-4 border-0 bg-transparent py-5 text-left"
                  type="button"
                  onClick={() => setActiveHelper(isOpen ? "" : item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="text-[1rem] font-semibold tracking-[-0.02em] text-[#2f3426]">
                    {item.question}
                  </span>
                  <span className="text-[1.4rem] leading-none text-[#8d6d39]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[64rem] pb-5 text-[0.96rem] leading-7 text-[#6f6b57]">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
