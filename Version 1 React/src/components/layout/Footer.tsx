import { Link, useLocation } from "react-router-dom";

const groups = [
  {
    title: "Marketplace",
    links: [
      { label: "Listings", href: "/marketplace" },
      { label: "Listing Detail", href: "/listing/ndfeb-texas-18mt" },
      { label: "Dashboard Preview", href: "/dashboard" },
    ],
  },
  {
    title: "Participants",
    links: [
      { label: "Suppliers", href: "/supplier-onboarding" },
      { label: "Recyclers", href: "/recycler-onboarding" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
  {
    title: "Follow",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "Newsletter", href: "#" },
    ],
  },
];

export function Footer() {
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="39" className="logo-ring" />
                <path className="logo-arrow" d="M73 17l15 8-1 18-7-8" />
                <path className="logo-peak" d="M22 64L45 40l13 17 11-9 15 16" />
              </svg>
            </span>
            <span className="brand-copy">
              <strong>Rare Earth Rescue</strong>
              <span>Verified feedstock. Traceable secondary materials.</span>
            </span>
          </div>
          <p className="footer-note mt-4 max-w-[36ch]">
            The digital infrastructure layer for circular critical mineral supply chains.
          </p>
        </div>

        {groups.map((group) => (
          <div className="footer-group" key={group.title}>
            <strong>{group.title}</strong>
            <div className="footer-links">
              {group.links.map((link) =>
                link.href.startsWith("/") ? (
                  <Link key={link.label} to={link.href}>
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href} key={link.label}>
                    {link.label}
                  </a>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
