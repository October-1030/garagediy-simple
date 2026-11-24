# GarageDIY simple configurator design system

## Concept source

- Primary concept: `docs/design-references/garage-diy-concept.png`
- Native concept size: 1536 × 1024
- Background lock: true white UI with a warm neutral wall/floor only inside the visualizer

## Visual tokens

- Primary text/cabinetry: `#0b1f3a`, `#10284c`
- Secondary navy: `#183a67`
- Muted text: `#617089`
- Border: `#d4deeb`
- Soft surface: `#f5f8fc`
- Action/measurement: `#f25416`
- Action hover: `#d9420c`
- Radius: 12px controls, 16px main frames
- Shadow: subtle cool navy at 7–8% opacity

## Typography and UI chrome

- Humanist sans-serif: Geist with Segoe UI fallback
- Display: 36px / 800 / tight tracking
- Panel heading: 20px / 700
- Body: 14–16px / 400–600
- Buttons: 14–16px / 700, explicit sizing on every control

## Container model and component families

- Quiet top header
- Five-step progress rail
- One large garage visualization frame
- One focused step panel
- One horizontal estimate summary band
- Reusable selection rows, dimension fields, primary/secondary buttons, and cabinet SVG units

## Icon inventory

- Header/help: outlined garage mark and CircleHelp
- Space: Home, Warehouse, DoorOpen
- Dimensions: Ruler
- Presets: Columns3, Hammer, PackageCheck
- Adjustment: MoveHorizontal, ArrowLeft/Right, Trash2, RotateCcw
- Estimate: Calculator, CircleDollarSign, CheckCircle2
- Stroke style: Lucide outline, 1.8–2px, 16–24px, navy or semantic color

## Allowed first-viewport copy

- GarageDIY
- Need help?
- Plan your garage
- Choose a few basics and get a practical cabinet plan with an instant materials estimate.
- Space, Size, Cabinets, Adjust, Estimate
- Your wall plan
- A simple front view — no design experience needed.
- Step-specific heading/description and controls
- Your estimate, Cabinets, Hardware, Estimated total

## Responsive continuation

- Desktop: two-column visualizer + panel, estimate band below
- Tablet/mobile: progress labels collapse, visualizer and controls stack, estimate values use a two-column row
