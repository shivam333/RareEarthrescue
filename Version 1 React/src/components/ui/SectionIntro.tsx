type SectionIntroProps = {
  eyebrow: string;
  title: string;
  copy?: string;
};

export function SectionIntro({ eyebrow, title, copy }: SectionIntroProps) {
  return (
    <div className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="heading-2">{title}</h2>
      {copy ? <p className="section-copy body-copy">{copy}</p> : null}
    </div>
  );
}
