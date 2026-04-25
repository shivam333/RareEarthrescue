import { UserButton, useAuth } from "@clerk/react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navItems } from "../../data/marketplaceData";
import { useRecyclerOrderBook } from "../../hooks/useRecyclerOrderBook";
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
  const { totalItems, totalLots } = useRecyclerOrderBook();

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
              <Button href="/get-started" variant="primary">
                Get Started
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/dashboard/checkout"
                className="inline-flex items-center gap-3 rounded-full border border-[#d8cfbf] bg-white/84 px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#173550] transition hover:-translate-y-0.5 hover:border-[#b38a4e]"
              >
                <span>Cart</span>
                <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-[#173550] px-2 py-1 text-[0.68rem] text-white">
                  {totalLots}
                </span>
                <span className="text-[0.66rem] text-[#8a7b65] normal-case tracking-normal">
                  {totalItems} listing{totalItems === 1 ? "" : "s"}
                </span>
              </Link>
              <Button href="/dashboard" variant="primary">
                Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <Button href="/dashboard/account" variant="ghost">
                  Account
                </Button>
                <div className="flex items-center rounded-full border border-[#d8cfbf] bg-white/84 px-1.5 py-1 shadow-[0_10px_24px_rgba(46,41,31,0.05)]">
                  <UserButton />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
