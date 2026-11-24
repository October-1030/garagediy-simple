export const catalog = {
  tall: { name: 'Tall cabinet', width: 30, height: 80, bottom: 0, price: 478, hardware: 24, top: 0 },
  wall: { name: 'Wall cabinet', width: 30, height: 24, bottom: 56, price: 225, hardware: 18, top: 0 },
  base: { name: 'Base cabinet', width: 30, height: 36, bottom: 0, price: 275, hardware: 24, top: 35 },
  drawers: { name: 'Drawer cabinet', width: 30, height: 36, bottom: 0, price: 595, hardware: 36, top: 35 },
};
export type Kind = keyof typeof catalog;
export type Unit = { id: string; kind: Kind; x: number };
export type Plan = { version: 1; space: string; width: number; height: number; preset: string; units: Unit[] };
export const presets = ['Starter', 'Work & store', 'Full wall'];
export function makeUnits(preset: string): Unit[] {
  const units: Unit[] = [{ id: 't1', kind: 'tall', x: 2 }, { id: 'w1', kind: 'wall', x: 34 }, { id: 'w2', kind: 'wall', x: 66 }, { id: 'b1', kind: preset === 'Starter' ? 'base' : 'drawers', x: 34 }, { id: 'b2', kind: 'base', x: 66 }];
  if (preset === 'Full wall') units.push({ id: 't2', kind: 'tall', x: 98 });
  return units;
}
export function initialPlan(): Plan { return { version: 1, space: 'One-car garage', width: 144, height: 96, preset: 'Starter', units: makeUnits('Starter') }; }
export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
export const measurement = (value: number) => `${Math.floor(value / 12)}′ ${value % 12}″`;
export function estimate(units: Unit[]) {
  const cabinets = units.reduce((sum, u) => sum + catalog[u.kind].price, 0);
  const hardware = units.reduce((sum, u) => sum + catalog[u.kind].hardware, 0);
  const tops = units.reduce((sum, u) => sum + catalog[u.kind].top, 0);
  return { cabinets, hardware, tops, total: cabinets + hardware + tops };
}
export function fitIssues(plan: Plan): string[] {
  const issues: string[] = [];
  if (!plan.units.length) issues.push('Add a preset before viewing an estimate.');
  if (plan.units.some(u => u.x < 2 || u.x + catalog[u.kind].width > plan.width - 2 || catalog[u.kind].bottom + catalog[u.kind].height > plan.height - 2)) issues.push('Cabinets extend beyond usable wall space. Remove cabinets or increase the wall size.');
  if (plan.units.some((a, i) => plan.units.slice(i + 1).some(b => {
    const ca = catalog[a.kind], cb = catalog[b.kind];
    return a.x < b.x + cb.width + 2 && b.x < a.x + ca.width + 2 && ca.bottom < cb.bottom + cb.height && cb.bottom < ca.bottom + ca.height;
  }))) issues.push('Cabinets need at least 2 inches of horizontal clearance.');
  return issues;
}
export function moveUnit(plan: Plan, id: string, delta: number): Plan | null {
  const next = { ...plan, units: plan.units.map(u => u.id === id ? { ...u, x: u.x + delta } : u) };
  return fitIssues(next).length ? null : next;
}
export function parsePlan(raw: string): Plan | null {
  try {
    const p = JSON.parse(raw) as Plan;
    if (p.version !== 1 || !['One-car garage', 'Two-car garage', 'Single wall'].includes(p.space) || !presets.includes(p.preset) || !Number.isInteger(p.width) || p.width < 72 || p.width > 480 || !Number.isInteger(p.height) || p.height < 84 || p.height > 168 || !Array.isArray(p.units) || p.units.length > 6) return null;
    if (p.units.some(u => !u || typeof u.id !== 'string' || !Object.hasOwn(catalog, u.kind) || !Number.isInteger(u.x) || u.x < 0 || u.x > 480) || new Set(p.units.map(u => u.id)).size !== p.units.length) return null;
    return { version: 1, space: p.space, width: p.width, height: p.height, preset: p.preset, units: p.units.map(({ id, kind, x }) => ({ id, kind, x })) };
  } catch { return null; }
}
