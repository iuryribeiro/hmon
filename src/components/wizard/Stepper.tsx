"use client";

type Step = { key: string; label: string };

export function Stepper({
  steps,
  current,
}: {
  steps: Step[];
  current: number; // 0-based
}) {
  return (
    <ol className="flex items-center gap-3 overflow-x-auto pb-1">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.key} className="flex items-center">
            <div
              className={[
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm",
                done
                  ? "bg-[#18697A] text-white"
                  : active
                  ? "bg-[#F7CD3C] text-[#553614]"
                  : "bg-white text-[#253134] border border-black/10",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-5 w-5 place-content-center rounded-full text-xs",
                  done
                    ? "bg-white/20 text-white"
                    : active
                    ? "bg-[#553614]/10 text-[#553614]"
                    : "bg-black/5 text-[#253134]",
                ].join(" ")}
              >
                {i + 1}
              </span>
              <span className="whitespace-nowrap">{s.label}</span>
            </div>

            {i < steps.length - 1 && (
              <div className="mx-2 h-px w-8 sm:w-12 bg-black/10" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
