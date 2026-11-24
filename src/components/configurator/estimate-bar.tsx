import { Calculator, ChevronRight } from "lucide-react";
import { currency } from "@/lib/configurator";

type EstimateBarProps = {
  cabinetsCost: number;
  hardwareCost: number;
  total: number;
  onViewEstimate: () => void;
};

export function EstimateBar({ cabinetsCost, hardwareCost, total, onViewEstimate }: EstimateBarProps) {
  return (
    <section aria-label="Current project estimate" className="mt-5 overflow-hidden rounded-2xl border border-[#d4deeb] bg-white shadow-[0_12px_40px_rgba(11,31,58,0.07)]">
      <div className="grid items-center gap-4 p-4 sm:grid-cols-[1.25fr_0.8fr_0.8fr_1fr] sm:p-5 lg:grid-cols-[1.35fr_0.75fr_0.75fr_1.1fr]">
        <div className="flex items-center gap-3 sm:border-r sm:border-[#d4deeb] sm:pr-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#edf2f8] text-[#183a67]">
            <Calculator aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#0b1f3a]">Your estimate</p>
            <p className="mt-0.5 text-xs text-[#617089]">Materials only · updates as you plan</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-4 sm:contents">
          <div><dt className="text-xs text-[#617089]">Cabinets</dt><dd className="mt-1 text-base font-bold text-[#0b1f3a]">{currency(cabinetsCost)}</dd></div>
          <div><dt className="text-xs text-[#617089]">Hardware</dt><dd className="mt-1 text-base font-bold text-[#0b1f3a]">{currency(hardwareCost)}</dd></div>
        </dl>
        <button type="button" onClick={onViewEstimate} className="flex items-center justify-between gap-4 rounded-xl bg-[#fff3ed] px-4 py-3 text-left outline-none transition hover:bg-[#ffe6da] focus-visible:ring-3 focus-visible:ring-[#f25416]/25 sm:ml-2">
          <span><span className="block text-xs font-semibold text-[#a93b11]">Estimated total</span><span className="mt-0.5 block text-xl font-bold tracking-[-0.02em] text-[#d9420c]">{currency(total)}</span></span>
          <ChevronRight aria-hidden="true" className="size-5 text-[#d9420c]" />
        </button>
      </div>
    </section>
  );
}
