import { ReactNode } from "react";
import { cx } from "../../lib/cx";

type BadgeProps = {
  children: ReactNode;
  outline?: boolean;
};

export function Badge({ children, outline = false }: BadgeProps) {
  return <span className={cx("badge", outline && "bg-transparent")}>{children}</span>;
}
