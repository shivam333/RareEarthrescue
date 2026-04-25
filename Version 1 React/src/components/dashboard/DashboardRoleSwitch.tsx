import { DashboardMode } from "../../lib/accountRole";

export function DashboardRoleSwitch({
  activeMode,
  onChange,
  compact = false,
}: {
  activeMode: DashboardMode;
  onChange: (mode: DashboardMode) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-[#d8cfbf] bg-white/84 p-1 shadow-[0_16px_40px_rgba(46,41,31,0.06)] ${
        compact ? "gap-1" : "gap-2"
      }`}
    >
      {(["recycler", "supplier"] as const).map((mode) => {
        const isActive = activeMode === mode;

        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`rounded-full px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] transition ${
              compact ? "min-w-[7.3rem]" : "min-w-[8.4rem]"
            } ${
              isActive
                ? "bg-[#173550] text-white shadow-[0_12px_28px_rgba(23,53,80,0.18)]"
                : "text-[#6d7680] hover:bg-[#f3ecdf] hover:text-[#173550]"
            }`}
            aria-pressed={isActive}
          >
            {mode}
          </button>
        );
      })}
    </div>
  );
}
