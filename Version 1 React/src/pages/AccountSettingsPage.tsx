import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pageEnter } from "../lib/motion";
import { AccountRole } from "../lib/accountRole";
import { useAccountRole } from "../hooks/useAccountRole";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

const roleOptions: { id: AccountRole; title: string; copy: string }[] = [
  { id: "recycler", title: "Recycler", copy: "Procure, compare, and bid on feedstock opportunities." },
  { id: "supplier", title: "Supplier", copy: "Prepare, list, and coordinate sell-side feedstock programs." },
  { id: "both", title: "Both", copy: "Operate both buy-side and sell-side workflows from one account." },
];

export function AccountSettingsPage() {
  const { accountRole, initialAccountRole, updateAccountRole } = useAccountRole();
  const [selectedRole, setSelectedRole] = useState<AccountRole>(accountRole);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusTone, setStatusTone] = useState<"success" | "neutral" | "error">("neutral");

  useEffect(() => {
    setSelectedRole(accountRole);
  }, [accountRole]);

  const saveRole = async () => {
    if (selectedRole === accountRole) {
      setStatusMessage("Your account role is already up to date.");
      setStatusTone("neutral");
      return;
    }

    try {
      setIsSaving(true);
      setStatusMessage("");
      await updateAccountRole(selectedRole);
      setStatusMessage("Account role updated. Your dashboard access has been refreshed.");
      setStatusTone("success");
    } catch (error: any) {
      const message =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        error?.message ||
        "We could not update your account role right now.";
      setStatusMessage(message);
      setStatusTone("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell section-gap pt-10 lg:pt-14">
        <div className="rounded-[34px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.97),rgba(244,236,224,0.9))] p-6 shadow-[0_28px_80px_rgba(46,41,31,0.08)] lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e0d7c9] pb-5">
            <div className="max-w-3xl">
              <p className="eyebrow mb-0">Account details</p>
              <h1 className="mt-2 font-display text-[2rem] leading-[0.98] tracking-[-0.06em] text-[#11283d] sm:text-[2.35rem]">
                Manage role access across supplier and recycler workflows.
              </h1>
              <p className="mt-4 max-w-[46rem] text-[1rem] leading-8 text-[#5a6a78]">
                Your initial account path is preserved for reference, but you can change your working role here as your operating model evolves.
              </p>
            </div>

            <Link className="button-ghost" to="/dashboard">
              Back to dashboard
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-[#ddd4c7] bg-white/82 px-5 py-5">
              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                Current access
              </span>
              <strong className="mt-3 block font-display text-[1.5rem] tracking-[-0.04em] text-[#11283d] capitalize">
                {accountRole}
              </strong>
            </div>
            <div className="rounded-[24px] border border-[#ddd4c7] bg-white/82 px-5 py-5">
              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                Role chosen at signup
              </span>
              <strong className="mt-3 block font-display text-[1.5rem] tracking-[-0.04em] text-[#11283d] capitalize">
                {initialAccountRole}
              </strong>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {roleOptions.map((role) => {
              const isActive = selectedRole === role.id;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`rounded-[26px] border p-5 text-left transition ${
                    isActive
                      ? "border-[#b38a4e] bg-[linear-gradient(145deg,rgba(184,139,60,0.12),rgba(111,138,85,0.08))] shadow-[0_16px_42px_rgba(46,41,31,0.06)]"
                      : "border-[#ddd4c7] bg-white/82 hover:-translate-y-0.5 hover:border-[#d3c4ad]"
                  }`}
                >
                  <strong className="block font-display text-[1.3rem] tracking-[-0.04em] text-[#11283d]">
                    {role.title}
                  </strong>
                  <p className="mt-3 text-[0.94rem] leading-7 text-[#556576]">{role.copy}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              className={`button button-primary ${isSaving ? "is-disabled" : ""}`}
              type="button"
              onClick={saveRole}
              disabled={isSaving}
            >
              {isSaving ? "Updating..." : "Update role"}
            </button>
            <Link className="button button-secondary" to="/get-started">
              Review access paths
            </Link>
          </div>

          {statusMessage ? (
            <div className="auth-feedback mt-5" data-tone={statusTone}>
              {statusMessage}
            </div>
          ) : null}
        </div>
      </section>
    </motion.main>
  );
}
