"use client";

import { CircleHelp, X } from "lucide-react";
import { useMemo, useState } from "react";
import { EstimateBar } from "@/components/configurator/estimate-bar";
import { GaragePreview } from "@/components/configurator/garage-preview";
import { ProgressSteps } from "@/components/configurator/progress-steps";
import { StepPanel } from "@/components/configurator/step-panel";
import { cabinetPresets, createUnits, spaceOptions } from "@/lib/configurator";
import type { PresetId, SpaceId } from "@/lib/configurator";

type DimensionField = "widthFeet" | "widthInches" | "heightFeet" | "heightInches";

export function GarageConfigurator() {
  const [step, setStep] = useState(1);
  const [spaceId, setSpaceId] = useState<SpaceId>("one-car");
  const [widthFeet, setWidthFeet] = useState(12);
  const [widthInches, setWidthInches] = useState(0);
  const [heightFeet, setHeightFeet] = useState(8);
  const [heightInches, setHeightInches] = useState(0);
  const [presetId, setPresetId] = useState<PresetId>("starter");
  const [units, setUnits] = useState(() => createUnits("starter"));
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const preset = cabinetPresets.find((item) => item.id === presetId) ?? cabinetPresets[0];
  const cabinetsCost = useMemo(() => {
    if (units.length === 0) return 0;
    const unitBase = units.reduce((sum, unit) => sum + unit.price, 0);
    const presetAdjustment = Math.max(0, preset.basePrice - preset.units.reduce((sum, unit) => sum + unit.price, 0));
    return Math.round(unitBase + presetAdjustment);
  }, [preset, units]);
  const hardwareCost = Math.floor(cabinetsCost * 0.105);
  const total = cabinetsCost + hardwareCost;

  function changeSpace(nextSpaceId: SpaceId) {
    const option = spaceOptions.find((item) => item.id === nextSpaceId) ?? spaceOptions[0];
    setSpaceId(nextSpaceId);
    setWidthFeet(option.width);
    setWidthInches(0);
    setHeightFeet(option.height);
    setHeightInches(0);
  }

  function changeDimension(field: DimensionField, value: number) {
    const safeValue = Number.isFinite(value) ? value : 0;
    const limits: Record<DimensionField, [number, number]> = {
      widthFeet: [6, 40],
      widthInches: [0, 11],
      heightFeet: [7, 14],
      heightInches: [0, 11],
    };
    const [min, max] = limits[field];
    const nextValue = Math.min(max, Math.max(min, safeValue));
    const setters = { widthFeet: setWidthFeet, widthInches: setWidthInches, heightFeet: setHeightFeet, heightInches: setHeightInches };
    setters[field](nextValue);
  }

  function changePreset(nextPresetId: PresetId) {
    setPresetId(nextPresetId);
    setUnits(createUnits(nextPresetId));
    setSelectedUnitId(null);
  }

  function moveSelectedUnit(direction: -1 | 1) {
    if (!selectedUnitId) return;
    setUnits((current) => current.map((unit) => unit.id === selectedUnitId ? { ...unit, x: Math.min(100 - unit.width, Math.max(0, unit.x + direction * 3)) } : unit));
  }

  function removeSelectedUnit() {
    if (!selectedUnitId) return;
    setUnits((current) => current.filter((unit) => unit.id !== selectedUnitId));
    setSelectedUnitId(null);
  }

  function resetUnits() {
    setUnits(createUnits(presetId));
    setSelectedUnitId(null);
  }

  function restartPlan() {
    setSpaceId("one-car");
    setWidthFeet(12);
    setWidthInches(0);
    setHeightFeet(8);
    setHeightInches(0);
    setPresetId("starter");
    setUnits(createUnits("starter"));
    setSelectedUnitId(null);
    goToStep(1);
  }

  function goToStep(nextStep: number) {
    setStep(Math.min(5, Math.max(1, nextStep)));
    if (nextStep !== 4) setSelectedUnitId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-white pb-8">
      <header className="border-b border-[#d4deeb] bg-white">
        <div className="mx-auto flex h-18 max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <a href="#planner" aria-label="GarageDIY home" className="flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#f25416] focus-visible:ring-offset-2">
            <span aria-hidden="true" className="relative grid size-9 place-items-center overflow-hidden rounded-lg bg-[#10284c]">
              <span className="absolute bottom-0 h-3 w-full bg-[#f25416]" />
              <span className="relative h-4 w-5 border-x-2 border-t-2 border-white" />
            </span>
            <span className="text-[1.65rem] font-extrabold tracking-[-0.045em] text-[#10284c]">GarageDIY</span>
          </a>

          <button type="button" onClick={() => setHelpOpen((open) => !open)} aria-expanded={helpOpen} className="flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[#10284c] outline-none transition hover:bg-[#f5f8fc] focus-visible:ring-2 focus-visible:ring-[#183a67]">
            {helpOpen ? <X aria-hidden="true" className="size-5" /> : <CircleHelp aria-hidden="true" className="size-5" />}
            <span className="hidden sm:inline">Need help?</span>
          </button>
        </div>
        {helpOpen ? (
          <div className="border-t border-[#e2e8f0] bg-[#f5f8fc]">
            <div className="mx-auto flex max-w-[1500px] flex-col gap-1 px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
              <p className="font-semibold text-[#0b1f3a]">Measuring tip: only count clear, usable wall space.</p>
              <p className="text-[#617089]">Questions? Call 1-800-GARAGE-DIY · Mon–Sat, 8am–6pm CT</p>
            </div>
          </div>
        ) : null}
      </header>

      <ProgressSteps currentStep={step} onStepChange={goToStep} />

      <div id="planner" className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-10">
        <div className="mb-6 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-[#0b1f3a] sm:text-4xl">Plan your garage</h1>
          <p className="mt-2 text-base leading-7 text-[#617089]">Choose a few basics and get a practical cabinet plan with an instant materials estimate.</p>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.8fr)]">
          <GaragePreview
            widthFeet={widthFeet}
            widthInches={widthInches}
            heightFeet={heightFeet}
            heightInches={heightInches}
            units={units}
            selectedUnitId={selectedUnitId}
            onSelectUnit={setSelectedUnitId}
            isAdjusting={step === 4}
          />
          <StepPanel
            step={step}
            spaceId={spaceId}
            widthFeet={widthFeet}
            widthInches={widthInches}
            heightFeet={heightFeet}
            heightInches={heightInches}
            presetId={presetId}
            units={units}
            selectedUnitId={selectedUnitId}
            cabinetsCost={cabinetsCost}
            hardwareCost={hardwareCost}
            total={total}
            onSpaceChange={changeSpace}
            onDimensionChange={changeDimension}
            onPresetChange={changePreset}
            onMoveUnit={moveSelectedUnit}
            onRemoveUnit={removeSelectedUnit}
            onResetUnits={resetUnits}
            onRestart={restartPlan}
            onBack={() => goToStep(step - 1)}
            onNext={() => goToStep(step + 1)}
          />
        </div>

        <EstimateBar cabinetsCost={cabinetsCost} hardwareCost={hardwareCost} total={total} onViewEstimate={() => goToStep(5)} />

        <footer className="flex flex-col gap-2 px-1 pt-6 text-xs leading-5 text-[#617089] sm:flex-row sm:items-center sm:justify-between">
          <p>Estimates are for planning only and may change with final measurements, finishes, tax, and delivery.</p>
          <p className="font-semibold text-[#38516f]">GarageDIY simple planner · No account required</p>
        </footer>
      </div>
    </main>
  );
}
