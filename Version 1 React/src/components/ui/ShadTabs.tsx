import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

const ShadTabs = TabsPrimitive.Root;

const ShadTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-auto items-center rounded-full border border-[#d8cfbf] bg-white/82 p-1 shadow-[0_10px_30px_rgba(46,41,31,0.06)]",
      className
    )}
    {...props}
  />
));
ShadTabsList.displayName = TabsPrimitive.List.displayName;

const ShadTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-[#6a7782] transition-all data-[state=active]:bg-[#2f3426] data-[state=active]:text-white data-[state=active]:shadow-[0_12px_30px_rgba(47,52,38,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a566]/40",
      className
    )}
    {...props}
  />
));
ShadTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const ShadTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-8 focus-visible:outline-none", className)}
    {...props}
  />
));
ShadTabsContent.displayName = TabsPrimitive.Content.displayName;

export { ShadTabs, ShadTabsContent, ShadTabsList, ShadTabsTrigger };
