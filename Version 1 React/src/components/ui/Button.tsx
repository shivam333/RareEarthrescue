import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cx } from "../../lib/cx";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
}: ButtonProps) {
  const classes = cx(
    variant === "primary" && "button-primary",
    variant === "secondary" && "button-secondary",
    variant === "ghost" && "button-ghost",
    className
  );

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a className={classes} href={href}>
          {children}
        </a>
      );
    }

    return (
      <Link className={classes} to={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
