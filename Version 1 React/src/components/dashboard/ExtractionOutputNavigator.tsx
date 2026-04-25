export function ExtractionOutputNavigator() {
  return (
    <article className="relative overflow-hidden rounded-[34px] border border-[#d9cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,236,224,0.92))] p-6 shadow-[0_24px_72px_rgba(46,41,31,0.07)]">
      <div className="absolute right-[-3rem] top-[-2rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(201,159,76,0.18),transparent_70%)] blur-2xl" />
      <div className="absolute bottom-[-2rem] left-[-2rem] h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(110,152,121,0.16),transparent_72%)] blur-2xl" />

      <div className="relative z-10">
        <p className="eyebrow !mb-0">Extraction output navigator</p>
        <h3 className="mt-2 font-display text-[1.55rem] leading-[1.02] tracking-[-0.05em] text-[#11283d]">
          From scrap input to extractable output.
        </h3>
        <p className="mt-3 max-w-[28rem] text-[0.92rem] leading-7 text-[#5a6a78]">
          A quick visual guide to how listed feedstock moves through recovery logic into metal outputs.
        </p>

        <div className="mt-8 grid gap-4">
          <FlowNode
            title="Input"
            body="Motors, HDDs, MRI systems, robotics"
            tone="bg-[#173550] text-white"
          />
          <FlowArrow />
          <FlowNode
            title="Processing"
            body="Sorting, teardown, verification, extraction"
            tone="bg-[#eef4ef] text-[#173550]"
          />
          <FlowArrow />
          <FlowNode
            title="Output"
            body="NdPr, SmCo, copper, steel, aluminum"
            tone="bg-[#f4ead8] text-[#173550]"
          />
        </div>
      </div>
    </article>
  );
}

function FlowNode({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: string;
}) {
  return (
    <div className={`rounded-[24px] border border-[#ddd4c7] px-5 py-4 shadow-[0_14px_34px_rgba(46,41,31,0.05)] ${tone}`}>
      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] opacity-80">
        {title}
      </span>
      <p className="mt-2 text-[0.92rem] leading-6">{body}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex justify-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd4c7] bg-white/84 text-[1rem] text-[#8d6d39] shadow-[0_10px_24px_rgba(46,41,31,0.04)]">
        →
      </div>
    </div>
  );
}
