import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { MotionItem, MotionSection } from "../components/ui/Motion";
import { listings } from "../data/marketplaceData";
import { pageEnter } from "../lib/motion";

const pageMotionProps = {
  variants: pageEnter,
  initial: "hidden" as const,
  animate: "visible" as const,
  exit: "exit" as const,
};

export function ListingDetailPage() {
  const { id } = useParams();
  const listing = useMemo(() => listings.find((item) => item.id === id) ?? listings[0], [id]);
  const related = listings.filter((item) => item.id !== listing.id).slice(0, 3);

  return (
    <motion.main className="page" {...pageMotionProps}>
      <section className="shell page-hero">
        <MotionItem>
          <p className="eyebrow">Listing detail</p>
          <h1 className="heading-1">{listing.title}</h1>
          <p className="lede">
            Verified {listing.category.toLowerCase()} listing with documented source industry,
            quality metadata, and transaction support.
          </p>
        </MotionItem>
      </section>

      <section className="shell detail-layout">
        <div className="detail-main">
          <MotionItem className="gallery-grid">
            <article className="gallery-card panel">
              <img className="h-full w-full object-cover" src={listing.images[0]} alt={listing.title} />
            </article>
            <div className="gallery-stack">
              {listing.images.slice(1).map((image) => (
                <article className="gallery-card panel" key={image}>
                  <img className="h-full w-full object-cover" src={image} alt={listing.title} />
                </article>
              ))}
            </div>
          </MotionItem>

          <MotionSection className="detail-shell">
            <MotionItem>
              <article className="detail-card detail-section panel">
                <Badge>Verified seller</Badge>
                <div className="detail-grid mt-5">
                  {[
                    ["Category", listing.category],
                    ["Quantity", listing.quantity],
                    ["Form", listing.form],
                    ["Location", listing.location],
                    ["Available date", listing.availableDate],
                    ["Logistics", listing.logistics],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="detail-label">{label}</div>
                      <div className="detail-value">{value}</div>
                    </div>
                  ))}
                </div>
              </article>
            </MotionItem>

            <MotionItem>
              <article className="detail-card detail-section panel">
                <h3 className="heading-3">Composition and assay notes</h3>
                <table className="spec-table">
                  <tbody>
                    <tr><td>Source industry</td><td>{listing.sourceIndustry}</td></tr>
                    <tr><td>Assay status</td><td>{listing.assay}</td></tr>
                    <tr><td>Estimated concentration</td><td>{listing.concentration}</td></tr>
                    <tr><td>Seller type</td><td>{listing.sellerType}</td></tr>
                    <tr><td>Verification</td><td>{listing.verification}</td></tr>
                  </tbody>
                </table>
              </article>
            </MotionItem>

            <MotionItem>
              <article className="detail-card detail-section panel">
                <h3 className="heading-3">Seller notes</h3>
                <p>{listing.notes}</p>
              </article>
            </MotionItem>

            <MotionItem>
              <article className="detail-card detail-section panel">
                <h3 className="heading-3">Related listings</h3>
                <div className="card-grid-3 mt-5">
                  {related.map((item) => (
                    <article className="mini-card panel float-hover" key={item.id}>
                      <strong>{item.title}</strong>
                      <p>{item.location} • {item.form}</p>
                      <Link className="ghost-link mt-3 inline-flex" to={`/listing/${item.id}`}>
                        View listing
                      </Link>
                    </article>
                  ))}
                </div>
              </article>
            </MotionItem>
          </MotionSection>
        </div>

        <aside className="info-sidebar">
          <MotionSection className="panel-stack">
            <MotionItem>
              <div className="panel">
                <h3 className="heading-3 mb-4">Commercial actions</h3>
                <div className="panel-stack">
                  <Button className="w-full justify-center" href="/contact">
                    Submit Bid
                  </Button>
                  <Button className="w-full justify-center" href="/contact" variant="secondary">
                    Request Inquiry
                  </Button>
                  <Button className="w-full justify-center" href="/contact" variant="ghost">
                    Talk to Marketplace Team
                  </Button>
                </div>
              </div>
            </MotionItem>

            <MotionItem>
              <div className="panel">
                <h3 className="heading-3 mb-4">Verification</h3>
                <div className="panel-stack">
                  <div className="listing-meta">
                    <strong>KYC completed</strong>
                    <p>Business registration and seller review passed</p>
                  </div>
                  <div className="listing-meta">
                    <strong>Assay uploaded</strong>
                    <p>Certificate available after approved access</p>
                  </div>
                  <div className="listing-meta">
                    <strong>Traceability package</strong>
                    <p>Batch labels, source declaration, and photo validation are included.</p>
                  </div>
                </div>
              </div>
            </MotionItem>
          </MotionSection>
        </aside>
      </section>
    </motion.main>
  );
}
