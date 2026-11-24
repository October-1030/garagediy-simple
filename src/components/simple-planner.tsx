"use client";

import { useEffect, useRef, useState } from 'react';
import { catalog, estimate, fitIssues, initialPlan, makeUnits, measurement, money, moveUnit, parsePlan, presets, type Plan } from '@/lib/planner';

const steps = ['Space', 'Size', 'Cabinets', 'Adjust', 'Estimate'];
const storageKey = 'garagediy-simple-plan-v1';
const draftFor = (p: Plan) => [String(Math.floor(p.width / 12)), String(p.width % 12), String(Math.floor(p.height / 12)), String(p.height % 12)];

export function SimplePlanner() {
  const [plan, setPlan] = useState(initialPlan);
  const [draft, setDraft] = useState(() => draftFor(initialPlan()));
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [selected, setSelected] = useState('');
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState('Loading saved plan…');
  const [notice, setNotice] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const raw = localStorage.getItem(storageKey);
        const restored = raw ? parsePlan(raw) : null;
        if (restored) { setPlan(restored); setDraft(draftFor(restored)); }
        if (raw && !restored) setNotice('The old saved plan could not be restored. A new plan is ready.');
      } catch { setNotice('Browser storage is unavailable. Download your plan before leaving.'); }
      setReady(true);
    });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(plan)); }
    catch { Promise.resolve().then(() => setSaved('Not saved — use Download plan.')); return; }
    Promise.resolve().then(() => setSaved('Saved on this device'));
  }, [plan, ready]);
  const issues = fitIssues(plan);
  const costs = estimate(plan.units);
  function navigate(next: number) {
    if (step === 1 && !commitDimensions()) return;
    const candidate = step === 1 ? { ...plan, width: Number(draft[0]) * 12 + Number(draft[1]), height: Number(draft[2]) * 12 + Number(draft[3]) } : plan;
    const nextIssues = fitIssues(candidate);
    if (next === 4 && nextIssues.length) { setNotice(nextIssues.join(' ')); return; }
    setStep(next); setReached(Math.max(reached, next)); setNotice('');
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); });
  }
  function commitDimensions() {
    const n = draft.map(Number);
    if (draft.some(v => !/^\d+$/.test(v)) || n[1] > 11 || n[3] > 11 || n[0] * 12 + n[1] < 72 || n[0] * 12 + n[1] > 480 || n[2] * 12 + n[3] < 84 || n[2] * 12 + n[3] > 168) {
      setNotice('Enter whole numbers: wall width 6–40 ft, height 7–14 ft, and inches 0–11.'); return false;
    }
    setPlan({ ...plan, width: n[0] * 12 + n[1], height: n[2] * 12 + n[3] }); setNotice(''); return true;
  }
  function move(delta: number) {
    const next = moveUnit(plan, selected, delta);
    if (next) { setPlan(next); setNotice('Cabinet moved 1 inch.'); }
    else setNotice('Move blocked: keep cabinets inside the wall with 2 inches of clearance.');
  }
  const summary = `GarageDIY planning estimate\n${plan.space} · ${measurement(plan.width)} wide × ${measurement(plan.height)} high\n\n${plan.units.map(u => `${catalog[u.kind].name} (${u.id}): 30 inches wide, left edge ${u.x} inches — ${money(catalog[u.kind].price)}`).join('\n')}\n\nCabinets: ${money(costs.cabinets)}\nHardware allowance: ${money(costs.hardware)}\nWorktops: ${money(costs.tops)}\nTotal: ${money(costs.total)}\n${issues.length ? 'UNRESOLVED: ' + issues.join(' ') : 'Geometric fit check passed.'}\nIllustrative catalog and prices, not a quote. Excludes tax, shipping, installation and wall preparation. Verify product specifications, doors, outlets and mounting before purchase.`;
  function download() {
    const url = URL.createObjectURL(new Blob([summary], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'GarageDIY-plan.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <main className="planner-shell">
    <header className="planner-header"><a href="#planner">Garage<span>DIY</span></a><small>No account required</small></header>
    <nav className="planner-steps no-print" aria-label="Planning steps">{steps.map((name, i) => <button key={name} disabled={!ready || i > reached} aria-current={step === i ? 'step' : undefined} onClick={() => navigate(i)}>{i + 1}. {name}</button>)}</nav>
    <h1 id="planner">A garage that works for you.</h1><p className="planner-intro">A few choices. A practical layout. A clear materials estimate.</p>
    <div className="planner-grid">
      <section className="planner-controls no-print" aria-busy={!ready}>
        <h2 ref={heading} tabIndex={-1}>{step + 1}. {['Choose your space', 'Measure your clear wall', 'Pick a starting layout', 'Make it yours', 'Your planning estimate'][step]}</h2>
        <fieldset disabled={!ready}>
          {step === 0 && <><p>Plan one straight wall at a time. You can change these suggested measurements next.</p>{[['One-car garage', 144, 96], ['Two-car garage', 240, 108], ['Single wall', 120, 96]].map(([name, width, height]) => <button className="choice" aria-pressed={plan.space === name} key={name} onClick={() => { if (plan.space === name) return; const next = { ...plan, space: String(name), width: Number(width), height: Number(height) }; setPlan(next); setDraft(draftFor(next)); }}>{name}<small>{measurement(Number(width))} wide × {measurement(Number(height))} high</small></button>)}</>}
          {step === 1 && <><p>Measure clear space, excluding doors, windows and utilities. Dimensions update when you apply or continue.</p><div className="dimension-grid">{['Wall width · feet', 'Wall width · inches', 'Wall height · feet', 'Wall height · inches'].map((label, i) => <label key={label}>{label}<input inputMode="numeric" value={draft[i]} onChange={e => setDraft(draft.map((v, j) => i === j ? e.target.value : v))} /></label>)}</div><button className="secondary" onClick={commitDimensions}>Apply measurements</button><p className="hint">Width 6–40 ft · Height 7–14 ft · Inches 0–11</p></>}
          {step === 2 && <><p>Illustrative 30-inch-wide cabinets. Choose a preset, then remove pieces to fit a smaller wall.</p>{presets.map(name => <button className="choice" aria-pressed={plan.preset === name} key={name} onClick={() => { setPlan({ ...plan, preset: name, units: makeUnits(name) }); setSelected(''); }} >{name}<strong>{money(estimate(makeUnits(name)).total)}</strong><small>{name === 'Full wall' ? '6 pieces · needs 10′ 10″ clear width' : '5 pieces · needs 8′ 2″ clear width'} · includes hardware & tops</small></button>)}</>}
          {step === 3 && <><p>Select a cabinet below or in the preview. Movement stops before a collision or wall edge.</p><div className="unit-list">{plan.units.map(u => <button key={u.id} aria-pressed={selected === u.id} onClick={() => setSelected(u.id)}>{catalog[u.kind].name} · {u.id}</button>)}</div><div className="actions"><button disabled={!selected} onClick={() => move(-1)}>← 1 inch</button><button disabled={!selected} onClick={() => move(1)}>1 inch →</button><button disabled={!selected} onClick={() => { setPlan({ ...plan, units: plan.units.filter(u => u.id !== selected) }); setSelected(''); setNotice('Cabinet and its associated hardware/worktop removed.'); }}>Remove</button></div><button className="secondary" onClick={() => { setPlan({ ...plan, units: makeUnits(plan.preset) }); setSelected(''); }}>Reset cabinet layout</button></>}
          {step === 4 && <><p className="estimate-total">{money(costs.total)}</p><dl className="costs"><div><dt>Cabinets ({plan.units.length})</dt><dd>{money(costs.cabinets)}</dd></div><div><dt>Hardware allowance</dt><dd>{money(costs.hardware)}</dd></div><div><dt>Worktops</dt><dd>{money(costs.tops)}</dd></div></dl><p className="hint">Hardware: $18/wall cabinet, $24/tall or base, $36/drawer cabinet. Worktops: $35/base or drawer cabinet. No preset surcharge.</p><div className="actions"><button onClick={download}>Download plan</button><button onClick={() => window.print()}>Print / Save PDF</button></div><button className="secondary" onClick={() => { if (window.confirm('Start over? This replaces the plan saved on this device. Download it first if you want to keep it.')) { const next = initialPlan(); setPlan(next); setDraft(draftFor(next)); setStep(0); setReached(0); setSelected(''); } }}>Start a new plan</button></>}
        </fieldset>
        <p role="status" className="notice">{notice}</p>
        <div className="step-actions"><button disabled={step === 0 || !ready} onClick={() => navigate(step - 1)}>Back</button>{step < 4 && <button className="primary" disabled={!ready || (step === 3 && issues.length > 0)} onClick={() => navigate(step + 1)}>{step === 3 ? 'View estimate' : 'Continue'} →</button>}</div>
        <small>{saved}</small>
      </section>
      <section className="planner-visual" aria-label="Wall preview">
        <div className="preview-heading"><h2>Your wall</h2><span>{measurement(plan.width)} × {measurement(plan.height)}</span></div>
        <svg viewBox={`-12 -12 ${plan.width + 24} ${plan.height + 24}`} role="group" aria-label="Front elevation in inches. Cabinet positions use actual planning dimensions.">
          <rect x="0" y="0" width={plan.width} height={plan.height} fill="#edf1f5" stroke="#b4c3d3" strokeWidth="0.5" />
          {plan.units.map(u => { const item = catalog[u.kind]; const y = plan.height - item.bottom - item.height; return <g key={u.id} role="button" aria-label={`${item.name} ${u.id}, ${u.x} inches from left`} aria-pressed={selected === u.id} tabIndex={step === 3 ? 0 : -1} onClick={() => { if (step === 3) setSelected(u.id); }} onKeyDown={e => { if (step === 3 && ['Enter', ' '].includes(e.key)) { e.preventDefault(); setSelected(u.id); } }}>
            <rect x={u.x} y={y} width={item.width} height={item.height} rx="0.6" fill="#183a57" stroke={selected === u.id ? '#f25416' : '#0b1f3a'} strokeWidth={selected === u.id ? 1 : 0.4} />
            <path d={`M ${u.x + 15} ${y + 1} V ${y + item.height - 1}`} stroke="#567087" strokeWidth="0.4" />
            <path d={`M ${u.x + 13} ${y + item.height / 2 - 3} v 6 M ${u.x + 17} ${y + item.height / 2 - 3} v 6`} stroke="#d9e1e8" strokeWidth="0.7" />
            {item.top > 0 && <rect x={u.x} y={y} width="30" height="1" fill="#cba777" />}
            <text x={u.x + 15} y={y + item.height - 4} textAnchor="middle" fill="white" fontSize="3">{u.id} · 30″</text>
          </g>; })}
        </svg>
        <p className={issues.length ? 'fit-warning' : 'fit-ok'}>{issues.length ? issues.join(' ') : '✓ Geometric fit checked · 2-inch edge and horizontal gaps'}</p>
        <p className="hint">Front elevation, not a construction drawing. Tall: 80″ high. Upper: 24″ high, bottom 56″ above floor. Base: 36″ including top. Verify obstructions, cabinet depth, door swing and mounting separately.</p>
      </section>
    </div>
    <section className="plan-summary"><h2>Plan details</h2><p>{plan.space} · {measurement(plan.width)} wide × {measurement(plan.height)} high</p><div className="summary-items">{plan.units.map(u => <p key={u.id}>{catalog[u.kind].name} ({u.id}) <span>{money(catalog[u.kind].price)}</span></p>)}</div><p>Cabinets {money(costs.cabinets)} + hardware {money(costs.hardware)} + tops {money(costs.tops)}</p><strong>{issues.length ? 'Draft materials subtotal' : 'Estimated materials total'}: {money(costs.total)}</strong></section>
    <footer>Illustrative products and prices — not a sales quote. Excludes tax, shipping, installation and wall preparation. Confirm measurements and manufacturer specifications before purchase.</footer>
  </main>;
}
