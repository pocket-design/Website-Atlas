'use client';

import { useRef, useState, useCallback } from 'react';

export type GlobeConfig = {
  rotSpeed:       number;   // 0 – 0.006
  tilt:           number;   // 0 – 90 deg
  wireOpacity:    number;   // 0 – 0.30
  outlineOpacity: number;   // 0 – 0.60
  hoverRadius:    number;   // 60 – 420
  showOutlines:   boolean;
  showWireframe:  boolean;
};

export const DEFAULT_CONFIG: GlobeConfig = {
  rotSpeed:       0.0014,
  tilt:           45,
  wireOpacity:    0.09,
  outlineOpacity: 0.35,
  hoverRadius:    240,
  showOutlines:   true,
  showWireframe:  true,
};

export function useGlobeConfig() {
  const configRef = useRef<GlobeConfig>({ ...DEFAULT_CONFIG });
  const [ui, setUi]   = useState<GlobeConfig>({ ...DEFAULT_CONFIG });

  const set = useCallback(<K extends keyof GlobeConfig>(key: K, val: GlobeConfig[K]) => {
    configRef.current[key] = val;
    setUi(prev => ({ ...prev, [key]: val }));
  }, []);

  const reset = useCallback(() => {
    configRef.current = { ...DEFAULT_CONFIG };
    setUi({ ...DEFAULT_CONFIG });
  }, []);

  return { configRef, ui, set, reset };
}

// ── Tiny primitives ────────────────────────────────────────────────────────

type SliderProps = {
  label: string;
  value: number;
  min: number; max: number; step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
};
function Slider({ label, value, min, max, step, format, onChange }: SliderProps) {
  const display = format ? format(value) : value.toFixed(
    step < 0.01 ? 4 : step < 0.1 ? 2 : step < 1 ? 1 : 0
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 8px', alignItems: 'center', marginBottom: 10 }}>
      <label style={{ fontSize: 11, color: 'var(--ink-tint-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>
      <span style={{ fontSize: 11, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', minWidth: 36, textAlign: 'right' }}>{display}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ gridColumn: '1 / -1', accentColor: 'var(--scarlet)', width: '100%', cursor: 'pointer' }}
      />
    </div>
  );
}

type ToggleProps = {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
};
function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: 'var(--ink-tint-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', padding: 2,
          background: value ? 'var(--scarlet)' : 'var(--vellum-shade-2)',
          transition: 'background 0.2s',
          display: 'flex', alignItems: 'center',
          justifyContent: value ? 'flex-end' : 'flex-start',
        }}
      >
        <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div style={{ marginTop: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 10, color: 'var(--ink-tint-4)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--vellum-shade-1)' }} />
    </div>
  );
}

// ── Main DialKit panel ─────────────────────────────────────────────────────

type Props = {
  ui: GlobeConfig;
  set: <K extends keyof GlobeConfig>(key: K, val: GlobeConfig[K]) => void;
  reset: () => void;
};

export function GlobeDialKit({ ui, set, reset }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{
      position: 'absolute', top: 16, right: 16, zIndex: 20,
      fontFamily: 'var(--font-mallory-narrow), system-ui, sans-serif',
      userSelect: 'none',
    }}>
      {/* Header bar */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8, cursor: 'pointer',
          background: 'var(--ink)', color: 'var(--vellum)',
          borderRadius: open ? '8px 8px 0 0' : '8px',
          padding: '6px 10px 6px 12px',
          fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
          minWidth: 200,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--scarlet)', fontSize: 14 }}>◎</span> Globe Controls
        </span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>{open ? '▲' : '▼'}</span>
      </div>

      {/* Panel body */}
      {open && (
        <div style={{
          background: 'var(--vellum-tint-7)',
          border: '1px solid var(--vellum-shade-1)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          padding: '12px 14px 14px',
          width: 220,
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        }}>

          <Divider label="Globe" />
          <Slider label="Rotation Speed" value={ui.rotSpeed}  min={0} max={0.006} step={0.0001}
            format={v => v.toFixed(4)} onChange={v => set('rotSpeed', v)} />
          <Slider label="Tilt"           value={ui.tilt}      min={0} max={90}    step={1}
            format={v => `${v}°`}      onChange={v => set('tilt', v)} />
          <Toggle label="Wireframe"      value={ui.showWireframe} onChange={v => set('showWireframe', v)} />
          <Slider label="Wire Opacity"   value={ui.wireOpacity}   min={0} max={0.3} step={0.005}
            onChange={v => set('wireOpacity', v)} />
          <Toggle label="Country Outlines" value={ui.showOutlines} onChange={v => set('showOutlines', v)} />
          <Slider label="Outline Opacity" value={ui.outlineOpacity} min={0} max={0.6} step={0.01}
            onChange={v => set('outlineOpacity', v)} />

          <Divider label="Hover" />
          <Slider label="Glow Radius"   value={ui.hoverRadius}   min={60} max={420} step={10}
            format={v => `${v}px`}      onChange={v => set('hoverRadius', v)} />

          {/* Reset */}
          <button
            onClick={reset}
            style={{
              marginTop: 12, width: '100%', padding: '6px 0',
              background: 'transparent', border: '1px solid var(--vellum-shade-2)',
              borderRadius: 4, cursor: 'pointer', fontSize: 11,
              color: 'var(--ink-tint-3)', letterSpacing: '0.04em',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = 'var(--scarlet)'; (e.target as HTMLButtonElement).style.color = 'var(--scarlet)'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = 'var(--vellum-shade-2)'; (e.target as HTMLButtonElement).style.color = 'var(--ink-tint-3)'; }}
          >
            RESET DEFAULTS
          </button>
        </div>
      )}
    </div>
  );
}
