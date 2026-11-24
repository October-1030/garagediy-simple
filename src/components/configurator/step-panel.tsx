import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Columns3,
  DoorOpen,
  Hammer,
  Home,
  MoveHorizontal,
  PackageCheck,
  RotateCcw,
  Ruler,
  Trash2,
  Warehouse,
} from "lucide-react";
import { cabinetPresets, currency, spaceOptions } from "@/lib/configurator";
import type { CabinetUnit, PresetId, SpaceId } from "@/lib/configurator";

type StepPanelProps = {
  step: number;
  spaceId: SpaceId;
  widthFeet: number;
  widthInches: number;
  heightFeet: number;
  heightInches: number;
  presetId: PresetId;
  units: CabinetUnit[];
  selectedUnitId: string | null;
  cabinetsCost: number;
  hardwareCost: number;
  total: number;
  onSpaceChange: (spaceId: SpaceId) => void;
  onDimensionChange: (field: "widthFeet" | "widthInches" | "heightFeet" | "heightInches", value: number) => void;
  onPresetChange: (presetId: PresetId) => void;
  onMoveUnit: (direction: -1 | 1) => void;
  onRemoveUnit: () => void;
  onResetUnits: () => void;
  onRestart: () => void;
  onBack: () => void;
  onNext: () => void;
};

const spaceIcons = {
  "one-car": Home,
  "two-car": Warehouse,
  "single-wall": DoorOpen,
};

const presetIcons = {
  starter: Columns3,
  "work-store": Hammer,
  "full-wall": PackageCheck,
};

const panelHeadings = [
  ["Choose your space", "Pick the option closest to your garage. You can fine-tune the measurements next."],
  ["Enter wall dimensions", "Measure the clear wall area where cabinets can go. We’ll handle the math."],
  ["Choose a cabinet preset", "Start with one practical layout. You can make small adjustments afterward."],
  ["Make simple adjustments", "Select a cabinet on the wall, then nudge it or remove it. That’s all you need."],
  ["Your project estimate", "A straightforward materials estimate based on your current plan."],
] as const;

function NumberField({
  id,
  label,
  value,
  unit,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-[#0b1f3a]">{label}</span>
      <span className="flex h-13 items-center overflow-hidden rounded-xl border border-[#b9c6d6] bg-white transition focus-within:border-[#183a67] focus-within:ring-3 focus-within:ring-[#183a67]/10">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-full min-w-0 flex-1 px-4 text-lg font-bold text-[#0b1f3a] outline-none"
        />
        <span className="border-l border-[#d4deeb] bg-[#f5f8fc] px-3 py-4 text-sm font-semibold text-[#617089]">{unit}</span>
      </span>
    </label>
  );
}

export function StepPanel({
  step,
  spaceId,
  widthFeet,
  widthInches,
  heightFeet,
  heightInches,
  presetId,
  units,
  selectedUnitId,
  cabinetsCost,
  hardwareCost,
  total,
  onSpaceChange,
  onDimensionChange,
  onPresetChange,
  onMoveUnit,
  onRemoveUnit,
  onResetUnits,
  onRestart,
  onBack,
  onNext,
}: StepPanelProps) {
  const [heading, description] = panelHeadings[step - 1];
  const selectedUnit = units.find((unit) => unit.id === selectedUnitId);

  return (
    <aside aria-labelledby="panel-title" className="flex min-h-[560px] flex-col rounded-2xl border border-[#d4deeb] bg-white shadow-[0_18px_55px_rgba(11,31,58,0.08)]">
      <div className="border-b border-[#e2e8f0] px-5 py-5 sm:px-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#fff0e9] text-sm font-bold text-[#d9420c]">{step}</span>
          <h2 id="panel-title" className="text-xl font-bold tracking-[-0.02em] text-[#0b1f3a]">{heading}</h2>
        </div>
        <p className="text-sm leading-6 text-[#617089]">{description}</p>
      </div>

      <div className="flex-1 p-5 sm:p-6">
        {step === 1 ? (
          <div className="space-y-3">
            {spaceOptions.map((option) => {
              const Icon = spaceIcons[option.id];
              const selected = spaceId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSpaceChange(option.id)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition outline-none hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-[#f25416]/20 ${
                    selected ? "border-[#f25416] bg-[#fff8f4]" : "border-[#d4deeb] bg-white hover:border-[#9aabc0]"
                  }`}
                >
                  <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${selected ? "bg-[#f25416] text-white" : "bg-[#edf2f8] text-[#183a67]"}`}>
                    <Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-[#0b1f3a]">{option.name}</span>
                    <span className="mt-1 block text-sm leading-5 text-[#617089]">{option.detail}</span>
                  </span>
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full border ${selected ? "border-[#f25416] bg-[#f25416] text-white" : "border-[#b9c6d6]"}`}>
                    {selected ? <Check aria-hidden="true" className="size-4" strokeWidth={3} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#cbd9e8] bg-[#f5f8fc] p-4 text-sm leading-5 text-[#38516f]">
              <Ruler aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#183a67]" />
              Measure from wall to wall and from the floor to the ceiling. Round down if you’re unsure.
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberField id="width-feet" label="Wall width" value={widthFeet} unit="ft" min={6} max={40} onChange={(value) => onDimensionChange("widthFeet", value)} />
              <NumberField id="width-inches" label="Inches" value={widthInches} unit="in" min={0} max={11} onChange={(value) => onDimensionChange("widthInches", value)} />
              <NumberField id="height-feet" label="Wall height" value={heightFeet} unit="ft" min={7} max={14} onChange={(value) => onDimensionChange("heightFeet", value)} />
              <NumberField id="height-inches" label="Inches" value={heightInches} unit="in" min={0} max={11} onChange={(value) => onDimensionChange("heightInches", value)} />
            </div>
            <p className="mt-4 text-xs leading-5 text-[#617089]">Tip: Leave out the width of doors, water heaters, or other permanent obstacles.</p>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            {cabinetPresets.map((preset) => {
              const Icon = presetIcons[preset.id];
              const selected = presetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onPresetChange(preset.id)}
                  className={`w-full rounded-xl border p-4 text-left transition outline-none hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-[#f25416]/20 ${
                    selected ? "border-[#f25416] bg-[#fff8f4]" : "border-[#d4deeb] bg-white hover:border-[#9aabc0]"
                  }`}
                >
                  <span className="flex items-start gap-4">
                    <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${selected ? "bg-[#f25416] text-white" : "bg-[#edf2f8] text-[#183a67]"}`}>
                      <Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-bold text-[#0b1f3a]">{preset.name}</span>
                        <span className="text-sm font-bold text-[#0b1f3a]">From {currency(preset.basePrice)}</span>
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-[#617089]">{preset.description}</span>
                      <span className="mt-2 block text-xs font-semibold text-[#38516f]">Best for: {preset.bestFor}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        {step === 4 ? (
          <div>
            <div className={`rounded-xl border p-4 ${selectedUnit ? "border-[#f25416] bg-[#fff8f4]" : "border-[#d4deeb] bg-[#f5f8fc]"}`}>
              <div className="flex items-center gap-3">
                <span className={`grid size-11 place-items-center rounded-xl ${selectedUnit ? "bg-[#f25416] text-white" : "bg-white text-[#183a67]"}`}>
                  <MoveHorizontal aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="font-bold text-[#0b1f3a]">{selectedUnit ? selectedUnit.label : "Choose a cabinet"}</p>
                  <p className="mt-1 text-sm text-[#617089]">{selectedUnit ? "Selected on your wall plan" : "Click any cabinet in the preview"}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button type="button" disabled={!selectedUnit} onClick={() => onMoveUnit(-1)} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#b9c6d6] bg-white text-sm font-bold text-[#183a67] outline-none transition hover:bg-[#f5f8fc] focus-visible:ring-3 focus-visible:ring-[#183a67]/20 disabled:cursor-not-allowed disabled:opacity-40">
                <ArrowLeft aria-hidden="true" className="size-4" /> Move left
              </button>
              <button type="button" disabled={!selectedUnit} onClick={() => onMoveUnit(1)} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#b9c6d6] bg-white text-sm font-bold text-[#183a67] outline-none transition hover:bg-[#f5f8fc] focus-visible:ring-3 focus-visible:ring-[#183a67]/20 disabled:cursor-not-allowed disabled:opacity-40">
                Move right <ArrowRight aria-hidden="true" className="size-4" />
              </button>
              <button type="button" disabled={!selectedUnit} onClick={onRemoveUnit} className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-xl border border-[#efb4a0] bg-white text-sm font-bold text-[#b7330b] outline-none transition hover:bg-[#fff3ef] focus-visible:ring-3 focus-visible:ring-[#f25416]/20 disabled:cursor-not-allowed disabled:opacity-40">
                <Trash2 aria-hidden="true" className="size-4" /> Remove cabinet
              </button>
            </div>

            <button type="button" onClick={onResetUnits} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#38516f] outline-none hover:bg-[#f5f8fc] focus-visible:ring-2 focus-visible:ring-[#183a67]">
              <RotateCcw aria-hidden="true" className="size-4" /> Reset preset
            </button>
          </div>
        ) : null}

        {step === 5 ? (
          <div>
            <div className="rounded-2xl bg-[#10284c] p-5 text-white">
              <div className="flex items-center gap-3 text-[#bdd0e8]">
                <CircleDollarSign aria-hidden="true" className="size-5" />
                <span className="text-sm font-semibold">Estimated materials total</span>
              </div>
              <p className="mt-3 text-4xl font-bold tracking-[-0.04em]">{currency(total)}</p>
              <p className="mt-2 text-sm leading-5 text-[#bdd0e8]">Materials only. Installation not included.</p>
            </div>

            <dl className="mt-5 divide-y divide-[#e2e8f0] border-y border-[#e2e8f0]">
              <div className="flex items-center justify-between py-4 text-sm"><dt className="text-[#617089]">Cabinets</dt><dd className="font-bold text-[#0b1f3a]">{currency(cabinetsCost)}</dd></div>
              <div className="flex items-center justify-between py-4 text-sm"><dt className="text-[#617089]">Hardware</dt><dd className="font-bold text-[#0b1f3a]">{currency(hardwareCost)}</dd></div>
              <div className="flex items-center justify-between py-4 text-sm"><dt className="text-[#617089]">Cabinet pieces</dt><dd className="font-bold text-[#0b1f3a]">{units.length}</dd></div>
            </dl>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#edf8f2] p-4 text-sm leading-5 text-[#17613f]">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
              Your plan is ready to review with a GarageDIY specialist.
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-[#e2e8f0] p-5 sm:p-6">
        <div className="flex gap-3">
          {step > 1 ? (
            <button type="button" onClick={onBack} className="grid size-13 shrink-0 place-items-center rounded-xl border border-[#b9c6d6] bg-white text-[#183a67] outline-none transition hover:bg-[#f5f8fc] focus-visible:ring-3 focus-visible:ring-[#183a67]/20" aria-label="Go back one step">
              <ArrowLeft aria-hidden="true" className="size-5" />
            </button>
          ) : null}
          {step < 5 ? (
            <button type="button" onClick={onNext} className="flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-[#f25416] px-5 text-base font-bold text-white shadow-[0_8px_24px_rgba(242,84,22,0.24)] outline-none transition hover:bg-[#d9420c] focus-visible:ring-3 focus-visible:ring-[#f25416]/30 focus-visible:ring-offset-2">
              {step === 1 ? "Use this space" : step === 2 ? "Choose cabinets" : step === 3 ? "Adjust this layout" : "See estimate"}
              <ChevronRight aria-hidden="true" className="size-5" strokeWidth={2.5} />
            </button>
          ) : (
            <button type="button" onClick={onRestart} className="flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-[#f25416] px-5 text-base font-bold text-white shadow-[0_8px_24px_rgba(242,84,22,0.24)] outline-none transition hover:bg-[#d9420c] focus-visible:ring-3 focus-visible:ring-[#f25416]/30 focus-visible:ring-offset-2">
              <RotateCcw aria-hidden="true" className="size-5" /> Start a new plan
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
