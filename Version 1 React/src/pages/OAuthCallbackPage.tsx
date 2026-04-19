import { useClerk } from "@clerk/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { pageEnter } from "../lib/motion";
import { normalizeRedirectPath, toAbsoluteAppUrl } from "../lib/site";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function OAuthCallbackPage() {
  const clerk = useClerk();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectTarget = normalizeRedirectPath(params.get("redirect"));

    clerk
      .handleRedirectCallback({
        signInUrl: toAbsoluteAppUrl("/sign-in"),
        signUpUrl: toAbsoluteAppUrl("/sign-in?mode=sign-up"),
        continueSignUpUrl: toAbsoluteAppUrl(
          `/sign-in?mode=sign-up&step=role&redirect=${encodeURIComponent(redirectTarget)}`
        ),
        signInFallbackRedirectUrl: toAbsoluteAppUrl(redirectTarget),
        signInForceRedirectUrl: toAbsoluteAppUrl(redirectTarget),
        signUpFallbackRedirectUrl: toAbsoluteAppUrl(
          `/sign-in?mode=sign-up&step=role&redirect=${encodeURIComponent(redirectTarget)}`
        ),
        signUpForceRedirectUrl: toAbsoluteAppUrl(
          `/sign-in?mode=sign-up&step=role&redirect=${encodeURIComponent(redirectTarget)}`
        ),
      })
      .catch((callbackError: any) => {
        const message =
          callbackError?.errors?.[0]?.longMessage ||
          callbackError?.errors?.[0]?.message ||
          callbackError?.message ||
          "We could not complete the social sign-in flow.";
        setError(message);
      });
  }, [clerk]);

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell page-hero">
        <div className="mx-auto max-w-3xl">
          <div className="panel grid gap-6 p-8 text-center sm:p-10">
            <p className="eyebrow mb-0">Secure redirect</p>
            <h1 className="heading-2 mx-auto max-w-[14ch]">Completing your secure sign-in</h1>
            <p className="body-copy">
              Rare Earth Rescue is finalizing your authentication with Clerk and redirecting you back into the platform.
            </p>
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#e4d8c8] border-t-[#12293f]" />
            {error ? (
              <div className="rounded-[18px] border border-[rgba(198,120,105,0.28)] bg-[rgba(198,120,105,0.12)] px-4 py-3 text-sm leading-7 text-[#8c473c]">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </motion.main>
  );
}
