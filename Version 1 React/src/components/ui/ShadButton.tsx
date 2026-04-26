import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold tracking-[-0.01em] transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9C47A]/40",
  {
    variants: {
      variant: {
        primary:
          "bg-[linear-gradient(145deg,#D9C47A,#C8AA48)] text-white shadow-[0_18px_40px_rgba(184,139,60,0.22)] hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(184,139,60,0.28)]",
        secondary:
          "border border-[#DCE3EF] bg-white/84 text-[#0F1115] hover:-translate-y-0.5 hover:border-[#D9C47A] hover:bg-white",
        ghost: "text-[#6D7484] hover:text-[#0F1115] hover:bg-white/60",
        subtle:
          "border border-[rgba(104,90,59,0.12)] bg-[rgba(255,255,255,0.7)] text-[#6D7484] hover:border-[rgba(159,116,44,0.28)] hover:text-[#0F1115]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-4 py-2 text-xs uppercase tracking-[0.12em]",
        lg: "h-12 px-6 py-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ShadButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const ShadButton = React.forwardRef<HTMLButtonElement, ShadButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);

ShadButton.displayName = "ShadButton";

export { ShadButton, buttonVariants };
