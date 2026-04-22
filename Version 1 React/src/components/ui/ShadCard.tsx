import * as React from "react";
import { cn } from "../../lib/utils";

const ShadCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[30px] border border-[#ddd3c5] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(246,239,227,0.92))] shadow-[0_18px_55px_rgba(46,41,31,0.06)]",
        className
      )}
      {...props}
    />
  )
);
ShadCard.displayName = "ShadCard";

const ShadCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex flex-col space-y-2 p-6", className)} {...props} />
);
ShadCardHeader.displayName = "ShadCardHeader";

const ShadCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-display text-[1.3rem] tracking-[-0.04em] text-[#2f3426]", className)} {...props} />
  )
);
ShadCardTitle.displayName = "ShadCardTitle";

const ShadCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-[0.96rem] leading-7 text-[#6f6b57]", className)} {...props} />
  )
);
ShadCardDescription.displayName = "ShadCardDescription";

const ShadCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);
ShadCardContent.displayName = "ShadCardContent";

const ShadCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
);
ShadCardFooter.displayName = "ShadCardFooter";

export {
  ShadCard,
  ShadCardContent,
  ShadCardDescription,
  ShadCardFooter,
  ShadCardHeader,
  ShadCardTitle,
};
