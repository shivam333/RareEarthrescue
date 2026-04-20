import { UserButton, useAuth } from "@clerk/react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navItems } from "../../data/marketplaceData";
import { Button } from "../ui/Button";

function BrandMark() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="39" className="logo-ring" />
      <path className="logo-arrow" d="M73 17l15 8-1 18-7-8" />
      <path className="logo-peak" d="M22 64L45 40l13 17 11-9 15 16" />
    </svg>
  );
}

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="site-header">
      <div className="shell header-shell">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <BrandMark />
          </span>
          <span className="brand-copy">
            <strong>Rare Earth Rescue</strong>
            <span>Digital infrastructure for recycled rare earth supply</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="site-nav">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          {!isLoaded || !isSignedIn ? (
            <>
              <Button href="/sign-in" variant={isHome ? "secondary" : "ghost"}>
                Sign In
              </Button>
              <Button href="/sign-in?mode=sign-up" variant="primary">
                Get Started
              </Button>
            </>
          ) : (
            <>
              <Button href="/dashboard" variant="primary">
                Dashboard
              </Button>
              <div className="flex items-center">
                <UserButton />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
