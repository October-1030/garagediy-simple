export type SpaceId = "one-car" | "two-car" | "single-wall";
export type PresetId = "starter" | "work-store" | "full-wall";
export type CabinetKind = "tall" | "wall" | "base" | "drawers";

export type CabinetUnit = {
  id: string;
  kind: CabinetKind;
  x: number;
  width: number;
  price: number;
  label: string;
};

export type CabinetPreset = {
  id: PresetId;
  name: string;
  description: string;
  bestFor: string;
  basePrice: number;
  units: Omit<CabinetUnit, "id">[];
};

export const spaceOptions = [
  {
    id: "one-car" as const,
    name: "One-car garage",
    detail: "A focused setup for one vehicle bay",
    width: 12,
    height: 8,
  },
  {
    id: "two-car" as const,
    name: "Two-car garage",
    detail: "More wall space for family storage",
    width: 20,
    height: 9,
  },
  {
    id: "single-wall" as const,
    name: "Single wall",
    detail: "Measure one clear wall yourself",
    width: 10,
    height: 8,
  },
];

export const cabinetPresets: CabinetPreset[] = [
  {
    id: "starter",
    name: "Starter Wall",
    description: "Tall storage, wall cabinets, and a clean work surface.",
    bestFor: "Everyday storage",
    basePrice: 1548,
    units: [
      { kind: "tall", x: 2, width: 18, price: 478, label: "Tall cabinet" },
      { kind: "wall", x: 23, width: 24, price: 225, label: "Wall cabinet" },
      { kind: "wall", x: 49, width: 24, price: 225, label: "Wall cabinet" },
      { kind: "base", x: 23, width: 24, price: 275, label: "Base cabinet" },
      { kind: "base", x: 49, width: 24, price: 275, label: "Base cabinet" },
    ],
  },
  {
    id: "work-store",
    name: "Work + Store",
    description: "Adds drawers and more wall storage for projects and tools.",
    bestFor: "Weekend projects",
    basePrice: 2195,
    units: [
      { kind: "tall", x: 2, width: 17, price: 478, label: "Tall cabinet" },
      { kind: "wall", x: 22, width: 22, price: 225, label: "Wall cabinet" },
      { kind: "wall", x: 46, width: 22, price: 225, label: "Wall cabinet" },
      { kind: "drawers", x: 28, width: 29, price: 595, label: "Drawer cabinet" },
      { kind: "base", x: 60, width: 24, price: 275, label: "Base cabinet" },
    ],
  },
  {
    id: "full-wall",
    name: "Full Wall",
    description: "Maximum closed storage with two tall cabinets and a workspace.",
    bestFor: "Maximum storage",
    basePrice: 2890,
    units: [
      { kind: "tall", x: 2, width: 17, price: 478, label: "Tall cabinet" },
      { kind: "wall", x: 22, width: 22, price: 225, label: "Wall cabinet" },
      { kind: "wall", x: 46, width: 22, price: 225, label: "Wall cabinet" },
      { kind: "drawers", x: 28, width: 27, price: 595, label: "Drawer cabinet" },
      { kind: "tall", x: 77, width: 17, price: 478, label: "Tall cabinet" },
    ],
  },
];

export function createUnits(presetId: PresetId): CabinetUnit[] {
  const preset = cabinetPresets.find((item) => item.id === presetId) ?? cabinetPresets[0];

  return preset.units.map((unit, index) => ({
    ...unit,
    id: `${preset.id}-${unit.kind}-${index}`,
  }));
}

export function currency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatFeet(feet: number, inches: number): string {
  return `${feet}′ ${inches}″`;
}
