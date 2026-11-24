# Validation record

## Engineering checks

- `npm run lint`: passed
- `npm run typecheck`: passed
- `npm run build`: passed
- Production route `/`: statically prerendered
- Browser console warnings/errors: none in the production preview

## Core workflow verification

The production build was exercised in the Codex in-app browser at `http://127.0.0.1:3100/`.

1. Selected **Two-car garage**: wall preview changed from `12′ 0″ × 8′ 0″` to `20′ 0″ × 9′ 0″`.
2. Changed wall width to `18 ft`: the measurement and accessible preview label updated.
3. Selected **Work + Store**: estimate updated to `$2,425` before cabinet removal.
4. Selected the drawer cabinet and used **Move right**: its SVG x-position changed from `254.2` to `273.4`.
5. Removed the drawer cabinet: the estimate dropped and the cabinet count updated.
6. Opened **Estimate**: the project estimate panel and ready-to-review confirmation were both visible.

## Responsive verification

- Concept-native desktop viewport: `1536 × 1024`
- Mobile viewport: `390 × 844`
- Mobile document width stayed within the viewport (`scrollWidth 375`, viewport content width 375 after scrollbar allocation).
- Progress rail, visualizer, selection rows, primary CTA, and estimate band remained readable without horizontal overflow.

## Fidelity ledger

| Comparison point | Concept evidence | Browser evidence | Result |
| --- | --- | --- | --- |
| Palette | True white, deep navy, orange action/measurement | Same locked tokens in production | Match |
| First viewport | Quiet header, five-step rail, large wall view, right controls | Same composition at 1536 × 1024 | Match |
| Cabinet treatment | Navy elevation with warm worktop and subtle shadow | Code-native interactive SVG with matching treatment | Match |
| Measurement treatment | Orange width/height rules and labels | Same color, placement, and hierarchy | Match |
| Controls | White selection rows with orange selected state | Same selected state, radius, and typography | Match |
| Estimate | Bottom band with cabinets, hardware, total | Same information architecture and hierarchy | Match |
| Typography | Bold navy headings, compact UI labels | System-local humanist sans stack, explicit control sizes | Match with offline-safe substitution |
| Responsive behavior | Desktop tool expected to continue cleanly | Mobile stack tested at 390 × 844 | Match |

## Intentional implementation decisions

- The concept shows several inputs at once for visual completeness. The production prototype presents them one step at a time to meet the requested low-barrier homeowner workflow.
- The central cabinet drawing is a code-native SVG, not a raster asset, so cabinets remain selectable and adjustable.
- The app uses an offline-safe local system font stack instead of requesting a web font.

## Above-the-fold copy check

The implemented first viewport uses only the approved brand, help, progress, planner, wall-preview, step-panel, and estimate copy documented in `docs/design-system.md`. No eyebrow label, badge, fake metric, unrelated product claim, or marketing section was added.
