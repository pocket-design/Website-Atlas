'use client';

import { useRef, useState, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
export type HeroCity = 'egypt' | 'japan' | 'newyork';

export type HeroBgConfig = {
  city:         HeroCity;
  cursorRadius: number;  // 80 – 500 px
  cursorDelay:  number;  // 0 (instant) – 0.92 (very lagged)
};

export const DEFAULT_HERO_CONFIG: HeroBgConfig = {
  city:         'japan',
  cursorRadius: 260,
  cursorDelay:  0,
};

export const CITY_IMAGES: Record<HeroCity, { lineart: string; realistic: string; label: string; icon: string }> = {
  egypt:   { lineart: '/assets/lineart-egypt.jpg',   realistic: '/assets/hero-egypt.jpg',   label: 'Egypt',    icon: '🏛️' },
  japan:   { lineart: '/assets/lineart-japan.jpg',   realistic: '/assets/hero-japan.jpg',   label: 'Japan',    icon: '⛩️' },
  newyork: { lineart: '/assets/lineart-newyork.jpg', realistic: '/assets/hero-newyork.jpg', label: 'New York', icon: '🗽' },
};

// ── Hook ───────────────────────────────────────────────────────────────────
export function useHeroBgConfig() {
  const radiusRef = useRef<number>(DEFAULT_HERO_CONFIG.cursorRadius);
  const lagRef    = useRef<number>(DEFAULT_HERO_CONFIG.cursorDelay);
  const [ui, setUi] = useState<HeroBgConfig>({ ...DEFAULT_HERO_CONFIG });

  const setCity = useCallback((city: HeroCity) => {
    setUi(prev => ({ ...prev, city }));
  }, []);

  const setRadius = useCallback((radius: number) => {
    radiusRef.current = radius;
    setUi(prev => ({ ...prev, cursorRadius: radius }));
  }, []);

  const setDelay = useCallback((delay: number) => {
    lagRef.current = delay;
    setUi(prev => ({ ...prev, cursorDelay: delay }));
  }, []);

  const reset = useCallback(() => {
    radiusRef.current = DEFAULT_HERO_CONFIG.cursorRadius;
    lagRef.current    = DEFAULT_HERO_CONFIG.cursorDelay;
    setUi({ ...DEFAULT_HERO_CONFIG });
  }, []);

  return { radiusRef, lagRef, ui, setCity, setRadius, setDelay, reset };
}

// ── DialKit UI ─────────────────────────────────────────────────────────────
type Props = {
  ui:        HeroBgConfig;
  setCity:   (c: HeroCity) => void;
  setRadius: (r: number)   => void;
  setDelay:  (d: number)   => void;
  reset:     () => void;
};

export function HeroBgDialKit({ ui, setCity, setRadius, setDelay, reset }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{
      position: 'absolute',
      bottom: 96, right: 16,
      zIndex: 20,
      fontFamily: 'var(--font-mallory-narrow), system-ui, sans-serif',
      userSelect: 'none',
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8, cursor: 'pointer',
          background: 'var(--ink)', color: 'var(--vellum)',
          borderRadius: open ? '8px 8px 0 0' : '8px',
          padding: '6px 10px 6px 12px',
          fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
          minWidth: 210,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--scarlet)', fontSize: 14 }}>◎</span> Scene Controls
        </span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>{open ? '▲' : '▼'}</span>
      </div>

      {/* Body */}
      {open && (
        <div style={{
          background: 'var(--vellum-tint-7)',
          border: '1px solid var(--vellum-shade-1)',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          padding: '12px 14px 14px',
          width: 210,
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        }}>

          {/* ── City Landscape ── */}
          <SectionLabel label="City Landscape" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            {(Object.keys(CITY_IMAGES) as HeroCity[]).map(id => {
              const { label, icon } = CITY_IMAGES[id];
              const active = ui.city === id;
              return (
                <button
                  key={id}
                  onClick={() => setCity(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 10px',
                    borderRadius: 6,
                    border: active
                      ? '1.5px solid var(--scarlet)'
                      : '1.5px solid var(--vellum-shade-1)',
                    background: active ? 'rgba(210,25,10,0.06)' : 'transparent',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--scarlet)' : 'var(--ink-tint-2)',
                    transition: 'all 0.15s',
                    width: '100%', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 15 }}>{icon}</span>
                  <span>{label}</span>
                  {active && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--scarlet)' }}>●</span>}
                </button>
              );
            })}
          </div>

          {/* ── Reveal ── */}
          <SectionLabel label="Reveal" />

          <SliderRow
            label="Cursor Radius"
            display={`${ui.cursorRadius}px`}
            min={80} max={500} step={10}
            value={ui.cursorRadius}
            onChange={setRadius}
          />

          <SliderRow
            label="Cursor Delay"
            display={
              ui.cursorDelay === 0
                ? 'Off'
                : `${Math.round(ui.cursorDelay * 700)}ms`
            }
            min={0} max={0.92} step={0.04}
            value={ui.cursorDelay}
            onChange={setDelay}
          />

          {/* Reset */}
          <button
            onClick={reset}
            style={{
              marginTop: 10, width: '100%', padding: '6px 0',
              background: 'transparent', border: '1px solid var(--vellum-shade-2)',
              borderRadius: 4, cursor: 'pointer', fontSize: 11,
              color: 'var(--ink-tint-3)', letterSpacing: '0.04em',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--scarlet)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--scarlet)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--vellum-shade-2)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-tint-3)';
            }}
          >
            RESET DEFAULTS
          </button>
        </div>
      )}
    </div>
  );
}

// ── Primitives ─────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ marginTop: 4, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 10, color: 'var(--ink-tint-4)', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--vellum-shade-1)' }} />
    </div>
  );
}

function SliderRow({ label, display, min, max, step, value, onChange }: {
  label: string; display: string;
  min: number; max: number; step: number; value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 8px', alignItems: 'center', marginBottom: 10 }}>
      <label style={{ fontSize: 11, color: 'var(--ink-tint-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <span style={{ fontSize: 11, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', minWidth: 36, textAlign: 'right' }}>
        {display}
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ gridColumn: '1 / -1', accentColor: 'var(--scarlet)', width: '100%', cursor: 'pointer' }}
      />
    </div>
  );
}
