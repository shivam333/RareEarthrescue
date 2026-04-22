import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DashboardMaterialTile } from "../../data/dashboardMarketplaceData";

export function MaterialTileGrid({
  tiles,
  compact = false,
  hrefMode = "public",
}: {
  tiles: DashboardMaterialTile[];
  compact?: boolean;
  hrefMode?: "public" | "dashboard";
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {tiles.map((tile, index) => (
        <motion.div
          key={tile.title}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: index * 0.06 }}
          whileHover={{ y: -6 }}
        >
          <Link
            to={hrefMode === "dashboard" ? tile.dashboardHref : tile.publicHref}
            className={`group relative block overflow-hidden rounded-[28px] border border-[#d9cfbf] shadow-[0_24px_70px_rgba(46,41,31,0.08)] ${
              compact ? "min-h-[11.5rem]" : "min-h-[14rem]"
            }`}
          >
            <img
              src={tile.image}
              alt={tile.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${tile.accent}`} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,13,18,0.08),rgba(7,13,18,0.62))]" />
            <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white">
              <span className="inline-flex w-fit rounded-full border border-white/18 bg-white/12 px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] backdrop-blur">
                Feedstock focus
              </span>
              <strong
                className={`mt-4 block font-display tracking-[-0.04em] ${
                  compact ? "text-[1.12rem] leading-[1.02]" : "text-[1.3rem] leading-[1.02]"
                }`}
              >
                {tile.title}
              </strong>
              <p className={`mt-2 max-w-[18rem] text-white/82 ${compact ? "text-[0.8rem] leading-6" : "text-[0.88rem] leading-6"}`}>
                {tile.subtitle}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
