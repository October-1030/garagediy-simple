import { Maximize2, MousePointer2 } from "lucide-react";
import type { CabinetKind, CabinetUnit } from "@/lib/configurator";
import { formatFeet } from "@/lib/configurator";

type GaragePreviewProps = {
  widthFeet: number;
  widthInches: number;
  heightFeet: number;
  heightInches: number;
  units: CabinetUnit[];
  selectedUnitId: string | null;
  onSelectUnit: (unitId: string) => void;
  isAdjusting: boolean;
};

const unitGeometry: Record<CabinetKind, { y: number; height: number }> = {
  tall: { y: 55, height: 240 },
  wall: { y: 55, height: 78 },
  base: { y: 190, height: 105 },
  drawers: { y: 190, height: 105 },
};

function CabinetDetails({ kind, x, y, width, height }: { kind: CabinetKind; x: number; y: number; width: number; height: number }) {
  if (kind === "drawers") {
    return (
      <>
        {[1, 2, 3, 4].map((row) => (
          <g key={row}>
            <line x1={x + 3} x2={x + width - 3} y1={y + (height / 4) * row} y2={y + (height / 4) * row} stroke="#60718a" strokeWidth="1" />
            <line x1={x + width * 0.42} x2={x + width * 0.58} y1={y + (height / 4) * row - 12} y2={y + (height / 4) * row - 12} stroke="#09182c" strokeWidth="2" />
          </g>
        ))}
      </>
    );
  }

  return (
    <>
      <line x1={x + width / 2} x2={x + width / 2} y1={y + 3} y2={y + height - 3} stroke="#60718a" strokeWidth="1" />
      <line x1={x + width / 2 - 3} x2={x + width / 2 - 3} y1={y + height * 0.42} y2={y + height * 0.58} stroke="#09182c" strokeWidth="2" strokeLinecap="round" />
      <line x1={x + width / 2 + 3} x2={x + width / 2 + 3} y1={y + height * 0.42} y2={y + height * 0.58} stroke="#09182c" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

export function GaragePreview({
  widthFeet,
  widthInches,
  heightFeet,
  heightInches,
  units,
  selectedUnitId,
  onSelectUnit,
  isAdjusting,
}: GaragePreviewProps) {
  return (
    <section aria-labelledby="preview-title" className="min-w-0 overflow-hidden rounded-2xl border border-[#d4deeb] bg-[#f5f8fc] shadow-[0_18px_55px_rgba(11,31,58,0.08)]">
      <div className="flex items-center justify-between border-b border-[#d4deeb] bg-white px-5 py-4 sm:px-6">
        <div>
          <h2 id="preview-title" className="text-base font-bold tracking-[-0.01em] text-[#0b1f3a]">Your wall plan</h2>
          <p className="mt-0.5 text-sm text-[#617089]">A simple front view — no design experience needed.</p>
        </div>
        <div className="hidden items-center gap-2 text-xs font-semibold text-[#617089] sm:flex">
          <Maximize2 aria-hidden="true" className="size-4" />
          Not to scale
        </div>
      </div>

      <div className="relative min-h-[390px] overflow-hidden bg-[#f0efec] sm:min-h-[500px]">
        <div className="absolute inset-x-0 bottom-0 h-[17%] border-t border-[#d2d0ca] bg-[linear-gradient(90deg,#d9d7d2_1px,transparent_1px)] bg-[size:88px_100%] bg-[#e5e3de]" />
        <svg viewBox="0 0 800 400" role="img" aria-label={`Garage cabinet plan for a ${formatFeet(widthFeet, widthInches)} by ${formatFeet(heightFeet, heightInches)} wall`} className="absolute inset-x-[2%] top-[5%] h-[84%] w-[96%]">
          <defs>
            <filter id="cabinet-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#0b1f3a" floodOpacity="0.16" />
            </filter>
          </defs>

          <line x1="76" x2="724" y1="30" y2="30" stroke="#f25416" strokeWidth="2" />
          <line x1="76" x2="76" y1="20" y2="40" stroke="#f25416" strokeWidth="2" />
          <line x1="724" x2="724" y1="20" y2="40" stroke="#f25416" strokeWidth="2" />
          <rect x="344" y="12" width="112" height="34" rx="17" fill="#f0efec" />
          <text x="400" y="35" textAnchor="middle" fill="#d9420c" fontSize="20" fontWeight="700">
            {formatFeet(widthFeet, widthInches)}
          </text>

          <line x1="744" x2="744" y1="55" y2="295" stroke="#f25416" strokeWidth="2" />
          <line x1="734" x2="754" y1="55" y2="55" stroke="#f25416" strokeWidth="2" />
          <line x1="734" x2="754" y1="295" y2="295" stroke="#f25416" strokeWidth="2" />
          <text x="765" y="180" fill="#d9420c" fontSize="18" fontWeight="700" transform="rotate(90 765 180)">
            {formatFeet(heightFeet, heightInches)}
          </text>

          <rect x="72" y="51" width="656" height="248" fill="none" stroke="#9aabc0" strokeWidth="1.5" strokeDasharray="5 5" rx="3" />

          {units.length === 0 ? (
            <g>
              <rect x="258" y="129" width="284" height="96" rx="12" fill="#ffffff" stroke="#d4deeb" />
              <text x="400" y="168" textAnchor="middle" fill="#0b1f3a" fontSize="18" fontWeight="700">Your wall is ready</text>
              <text x="400" y="198" textAnchor="middle" fill="#617089" fontSize="14">Choose a cabinet preset to fill this space.</text>
            </g>
          ) : null}

          {units.map((unit) => {
            const geometry = unitGeometry[unit.kind];
            const x = 80 + (unit.x / 100) * 640;
            const width = (unit.width / 100) * 640;
            const isSelected = selectedUnitId === unit.id;

            return (
              <g
                key={unit.id}
                role="button"
                tabIndex={isAdjusting ? 0 : -1}
                aria-label={`${unit.label}${isSelected ? ", selected" : ""}`}
                onClick={() => isAdjusting && onSelectUnit(unit.id)}
                onKeyDown={(event) => {
                  if (isAdjusting && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    onSelectUnit(unit.id);
                  }
                }}
                className={isAdjusting ? "cursor-pointer outline-none" : ""}
                filter="url(#cabinet-shadow)"
              >
                {isSelected ? (
                  <rect x={x - 5} y={geometry.y - 5} width={width + 10} height={geometry.height + 10} rx="5" fill="none" stroke="#f25416" strokeWidth="3" />
                ) : null}
                <rect x={x} y={geometry.y} width={width} height={geometry.height} rx="2" fill="#10284c" stroke="#09182c" strokeWidth="2" />
                <CabinetDetails kind={unit.kind} x={x} y={geometry.y} width={width} height={geometry.height} />
                {unit.kind === "base" || unit.kind === "drawers" ? (
                  <rect x={x - 2} y={geometry.y - 8} width={width + 4} height="10" rx="2" fill="#c89a64" stroke="#8c653c" strokeWidth="1" />
                ) : null}
              </g>
            );
          })}

          <line x1="72" x2="728" y1="300" y2="300" stroke="#9d9b96" strokeWidth="3" />
        </svg>

        {isAdjusting && units.length > 0 ? (
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#d4deeb] bg-white px-4 py-2 text-xs font-semibold whitespace-nowrap text-[#183a67] shadow-lg sm:bottom-7 sm:text-sm">
            <MousePointer2 aria-hidden="true" className="size-4 text-[#f25416]" />
            Select a cabinet to adjust
          </div>
        ) : null}
      </div>
    </section>
  );
}
