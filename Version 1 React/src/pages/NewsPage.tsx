import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { articleCards, commodityTickers } from "../data/newsData";

const sectionTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const newsTracks = [
  {
    title: "Public announcements",
    body: "Federal policy, domestic critical mineral strategy, and industrial policy signals shaping recovery economics.",
  },
  {
    title: "REO and feedstock signals",
    body: "Practical market context around NdPr, magnet-bearing scrap, buyer pull, and feedstock utilization.",
  },
  {
    title: "Customer perspective",
    body: "Operator feedback from scrappers, dismantlers, ITAD teams, and recyclers navigating fragmented supply.",
  },
];

const editorialNotes = [
  {
    label: "Coverage lens",
    value: "North America first",
    body: "Focused on domestic recovery capacity, recycler utilization, and supply chain resilience.",
  },
  {
    label: "Signal quality",
    value: "Commercially relevant",
    body: "We prioritize announcements and articles that affect sourcing, pricing, and operating decisions.",
  },
  {
    label: "Why it matters",
    value: "Better coordination",
    body: "Public signals matter when they help buyers secure supply and help suppliers uncover hidden value pools.",
  },
];

function NewsCard({
  badge,
  title,
  body,
  meta,
  image,
  href,
}: (typeof articleCards)[number]) {
  const content = (
    <>
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,40,61,0.04),rgba(17,40,61,0.62))]" />
        <div className="absolute left-5 top-5">
          <span className="inline-flex rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur">
            {badge}
          </span>
        </div>
      </div>

      <div className="p-6">
        <strong className="block font-display text-[1.18rem] leading-[1.04] tracking-[-0.04em] text-[#11283d]">
          {title}
        </strong>
        <p className="mt-3 text-[0.97rem] leading-7 text-[#5b6c79]">{body}</p>
        <span className="mt-5 block text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#8a7b65]">
          {meta}
        </span>
      </div>
    </>
  );

  const className =
    "group overflow-hidden rounded-[30px] border border-[#dacfbf] bg-[rgba(255,252,247,0.94)] shadow-[0_22px_60px_rgba(46,41,31,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-[#315e53]/24";

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <article className={className}>{content}</article>
  );
}

export function NewsPage() {
  const leadStory = articleCards[0];
  const supportingStories = articleCards.slice(1);

  return (
    <div className="bg-[#f7f1e6] text-[#11283d]">
      <main className="page bg-transparent">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(210,175,103,0.18),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(121,161,144,0.18),transparent_30%),linear-gradient(180deg,#fbf7ef_0%,#f4ebdb_52%,#f5efe4_100%)] pb-14 pt-32">
          <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(17,40,61,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(17,40,61,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute left-[-6rem] top-[-2rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,159,76,0.22),transparent_68%)] blur-3xl" />
          <div className="absolute bottom-[-8rem] right-[-6rem] h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(110,152,121,0.18),transparent_70%)] blur-3xl" />

          <div className="shell relative z-10">
            <motion.div {...sectionTransition} className="max-w-4xl">
              <p className="eyebrow !text-[#7e7668]">News</p>
              <h1 className="max-w-[12ch] font-display text-[clamp(3rem,5vw,5.4rem)] leading-[0.95] tracking-[-0.06em] text-[#11283d]">
                Policy, market, and recovery signals that move the network.
              </h1>
              <p className="mt-5 max-w-[44rem] text-[1.05rem] leading-8 text-[#445567] sm:text-[1.14rem]">
                Rare Earth Rescue curates public announcements, REO market context, technology signals,
                and operator perspective relevant to buyers, suppliers, and industrial recovery teams.
              </p>
            </motion.div>

            <motion.div
              {...sectionTransition}
              transition={{ delay: 0.08 }}
              className="mt-10 grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)]"
            >
              <article className="overflow-hidden rounded-[34px] border border-[#d7ccb9] bg-[rgba(255,252,247,0.92)] shadow-[0_24px_80px_rgba(46,41,31,0.1)]">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.78fr)]">
                  <div className="p-7 sm:p-8">
                    <span className="inline-flex rounded-full bg-[#f0e4d0] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#9a7337]">
                      Featured signal
                    </span>
                    <h2 className="mt-5 font-display text-[1.9rem] leading-[1.02] tracking-[-0.05em] text-[#11283d]">
                      {leadStory.title}
                    </h2>
                    <p className="mt-4 text-[1rem] leading-8 text-[#566777]">{leadStory.body}</p>
                    <p className="mt-5 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#8a7b65]">
                      {leadStory.meta}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <a
                        href={leadStory.href}
                        target="_blank"
                        rel="noreferrer"
                        className="button-primary"
                      >
                        Read announcement
                      </a>
                      <Link className="button-ghost" to="/contact">
                        Request strategic briefing
                      </Link>
                    </div>
                  </div>

                  <div className="relative min-h-[22rem] overflow-hidden">
                    <img
                      src={leadStory.image}
                      alt={leadStory.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(17,40,61,0.16),rgba(17,40,61,0.48))]" />
                  </div>
                </div>
              </article>

              <div className="grid gap-4">
                <article className="rounded-[30px] border border-[#d9cfbf] bg-[rgba(255,252,247,0.88)] p-6 shadow-[0_18px_50px_rgba(46,41,31,0.06)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="badge">Market tape</span>
                      <strong className="mt-3 block font-display text-[1.2rem] tracking-[-0.04em] text-[#11283d]">
                        Inputs we monitor around industrial recovery.
                      </strong>
                    </div>
                    <span className="rounded-full bg-[#edf4ef] px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#315e53]">
                      Updated daily
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {commodityTickers.map((ticker, index) => (
                      <motion.div
                        key={ticker.label}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.18 + index * 0.08, duration: 0.45 }}
                        className="rounded-[22px] border border-[#ddd4c7] bg-white/84 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#7d7568]">
                              {ticker.venue}
                            </span>
                            <strong className="mt-2 block font-display text-[1.08rem] tracking-[-0.03em] text-[#11283d]">
                              {ticker.label}
                            </strong>
                          </div>
                          <div className="text-right">
                            <span className="block text-[1.05rem] font-bold text-[#173550]">{ticker.value}</span>
                            <span className={`text-sm font-bold ${ticker.tone}`}>{ticker.move}</span>
                          </div>
                        </div>
                        <p className="mt-2 text-[0.8rem] leading-6 text-[#657686]">{ticker.note}</p>
                      </motion.div>
                    ))}
                  </div>
                </article>

                <article className="rounded-[30px] border border-[#d9cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(244,236,224,0.88))] p-6 shadow-[0_18px_50px_rgba(46,41,31,0.06)]">
                  <span className="badge">What this page covers</span>
                  <div className="mt-4 grid gap-3">
                    {newsTracks.map((track) => (
                      <div key={track.title} className="rounded-[22px] border border-[#e1d8cb] bg-white/72 p-4">
                        <strong className="block font-display text-[1rem] tracking-[-0.03em] text-[#11283d]">
                          {track.title}
                        </strong>
                        <p className="mt-2 text-sm leading-6 text-[#5e6d79]">{track.body}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="shell section-gap pt-10">
          <motion.div {...sectionTransition} className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Coverage</p>
              <h2 className="heading-2">A more detailed stream of public signals, technical developments, and operator validation.</h2>
            </div>
            <p className="max-w-[24rem] text-[0.98rem] leading-7 text-[#556576]">
              This is where public announcements, REO developments, and real marketplace perspective live instead of interrupting the main homepage narrative.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            {editorialNotes.map((note, index) => (
              <motion.article
                key={note.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="rounded-[28px] border border-[#dacfbf] bg-[rgba(255,252,247,0.92)] p-6 shadow-[0_18px_50px_rgba(46,41,31,0.06)]"
              >
                <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-[#8a7b65]">
                  {note.label}
                </span>
                <strong className="mt-4 block font-display text-[1.2rem] tracking-[-0.04em] text-[#11283d]">
                  {note.value}
                </strong>
                <p className="mt-3 text-[0.95rem] leading-7 text-[#5d6c79]">{note.body}</p>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            {supportingStories.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <NewsCard {...article} />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
