import { Check } from "lucide-react";

const steps = ["Space", "Size", "Cabinets", "Adjust", "Estimate"];

type ProgressStepsProps = {
  currentStep: number;
  onStepChange: (step: number) => void;
};

export function ProgressSteps({ currentStep, onStepChange }: ProgressStepsProps) {
  return (
    <nav aria-label="Garage planning steps" className="mx-auto w-full max-w-[1500px] px-5 py-5 sm:px-8 lg:px-10">
      <ol className="grid grid-cols-5 gap-1 sm:gap-3">
        {steps.map((label, index) => {
          const number = index + 1;
          const isActive = currentStep === number;
          const isComplete = currentStep > number;
          const isAvailable = number <= currentStep;

          return (
            <li key={label} className="relative flex min-w-0 items-center">
              <button
                type="button"
                disabled={!isAvailable}
                onClick={() => onStepChange(number)}
                aria-current={isActive ? "step" : undefined}
                className="group flex min-w-0 items-center gap-2 rounded-lg pr-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#f25416] focus-visible:ring-offset-2 disabled:cursor-default"
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full border text-sm font-bold transition-colors sm:size-9 ${
                    isActive
                      ? "border-[#f25416] bg-[#f25416] text-white"
                      : isComplete
                        ? "border-[#183a67] bg-[#183a67] text-white"
                        : "border-[#c8d2df] bg-white text-[#617089]"
                  }`}
                >
                  {isComplete ? <Check aria-hidden="true" className="size-4" strokeWidth={2.5} /> : number}
                </span>
                <span className={`hidden truncate text-sm font-semibold md:block ${isActive ? "text-[#0b1f3a]" : "text-[#617089]"}`}>
                  {label}
                </span>
              </button>
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={`mx-1 h-px min-w-2 flex-1 sm:mx-3 ${isComplete ? "bg-[#183a67]" : "bg-[#d4deeb]"}`}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
