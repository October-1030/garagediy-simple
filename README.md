# GarageDIY simple configurator

Independent repository: https://github.com/October-1030/garagediy-simple

A self-contained, low-friction garage cabinet planning prototype for ordinary U.S. homeowners. It provides a five-step flow for choosing a space, entering wall dimensions, selecting a preset, making simple cabinet adjustments, and reviewing a materials estimate.

## Run locally

Requirements: Node.js 20.9 or newer (Node.js 24 recommended).

```powershell
git clone https://github.com/October-1030/garagediy-simple.git
cd garagediy-simple
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tailscale path deployment

Build a path-aware production bundle before mounting it behind Tailscale Serve:

```powershell
$env:GARAGE_DIY_ASSET_PREFIX = "/garage-diy-simple"
$env:GARAGE_DIY_DIST_DIR = ".next-tailscale"
npm run build
npm run start -- --hostname 127.0.0.1 --port 3102
```

Tailscale strips the mounted request prefix before proxying to Next.js, while `GARAGE_DIY_ASSET_PREFIX` keeps JavaScript and CSS under the mounted URL. The normal local build continues to use `/`; these environment variables only affect the Tailscale-specific build.

## Quality checks

```powershell
npm run lint
npm run typecheck
npm run build
```

Or run all checks together:

```powershell
npm run check
```

## Prototype scope

- Versioned, validated automatic localStorage save; no account or backend required
- Three space choices and editable feet/inches dimensions
- Three cabinet presets
- Cabinet selection, left/right nudge, remove, and reset controls
- Inch-based geometry, boundary and overlap checks with 2-inch clearances
- Itemized cabinet, hardware and worktop estimate without preset surcharges
- Downloadable text plan and print / Save PDF; confirmation before starting over
- Responsive desktop and mobile layouts

The estimate is illustrative and is not a sales quote. Installation, tax, delivery, and site-specific work are excluded.

Run domain regression checks with Node.js 24: `node scripts/test-planner.mjs`.
The active interface is `src/components/simple-planner.tsx`; its geometry and pricing model is `src/lib/planner.ts`.
Dimensions commit on Apply or Continue, never during typing. The geometric fit check does not verify obstructions, depth, door swings or mounting requirements. Cabinet sizes and prices are illustrative, not manufacturer specifications.
Plans save only in the current browser and origin; switching from localhost to Tailscale does not transfer the saved plan. Download before clearing browser storage. Customer-service contact is intentionally deferred until a real email is supplied.
