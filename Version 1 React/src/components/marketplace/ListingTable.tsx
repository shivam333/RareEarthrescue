import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Listing } from "../../data/marketplaceData";
import { stagger, fadeUp } from "../../lib/motion";

export function ListingTable({ listings }: { listings: Listing[] }) {
  return (
    <motion.div
      className="table-card panel overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.14 }}
      variants={stagger}
    >
      <table className="listing-table">
        <thead>
          <tr>
            <th>Material</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Purity / notes</th>
            <th>Available</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <motion.tr className="listing-row" key={listing.id} variants={fadeUp}>
              <td>
                <div className="listing-title">
                  <strong className="table-title">{listing.title}</strong>
                  <span className="table-subtext">{listing.notes}</span>
                </div>
              </td>
              <td>{listing.category}</td>
              <td>{listing.quantity}</td>
              <td>{listing.location}</td>
              <td>{listing.assay}</td>
              <td>{listing.availableDate}</td>
              <td>
                <Link className="ghost-link" to={`/listing/${listing.id}`}>
                  View Details
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
