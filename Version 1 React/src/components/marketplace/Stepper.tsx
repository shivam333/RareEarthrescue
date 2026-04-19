type StepperItem = {
  title: string;
  copy: string;
};

export function Stepper({ items }: { items: StepperItem[] }) {
  return (
    <div className="stepper">
      {items.map((item, index) => (
        <div className={`step ${index === 0 ? "active" : ""}`} key={item.title}>
          <div className="step-index">{index + 1}</div>
          <div>
            <strong>{item.title}</strong>
            <p className="muted mt-1 text-sm leading-6">{item.copy}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
