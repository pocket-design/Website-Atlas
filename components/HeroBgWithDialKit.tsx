'use client';

import { useRef } from 'react';
import { useDialKit } from 'dialkit';
import HeroBg from './HeroBg';
import type { HeroCity, HeroMode } from './HeroBgDialKit';

const DIAL_CONFIG = {
  // ── V1 & V2 shared ──────────────────────────────────────────────────────
  Mode: {
    type:    'select' as const,
    options: [
      { value: 'v1', label: 'Hover Reveal' },
      { value: 'v2', label: 'Auto Cycle'   },
    ],
    default: 'v1',
  },

  // ── V1: Hover Reveal ─────────────────────────────────────────────────────
  City: {
    type:    'select' as const,
    options: [
      { value: 'egypt',   label: 'Egypt 🏛️'    },
      { value: 'japan',   label: 'Japan ⛩️'    },
      { value: 'newyork', label: 'New York 🗽' },
    ],
    default: 'japan',
  },
  'Cursor Radius': [260, 80,  500,  10  ] as [number, number, number, number],
  'Cursor Delay':  [0,   0,   0.92, 0.04] as [number, number, number, number],

  // ── V2: Auto Cycle ───────────────────────────────────────────────────────
  'Cycle Interval': [4, 1, 10, 0.5] as [number, number, number, number],
  'Pause on Hover': true,
};

export default function HeroBgWithDialKit() {
  const v = useDialKit('Scene Controls', DIAL_CONFIG);

  // Refs let the RAF / timer loops inside HeroBg read the latest value
  // without triggering re-renders on every frame.
  const radiusRef        = useRef<number>(260);
  const lagRef           = useRef<number>(0);
  const cycleIntervalRef = useRef<number>(4);

  radiusRef.current        = v['Cursor Radius'];
  lagRef.current           = v['Cursor Delay'];
  cycleIntervalRef.current = v['Cycle Interval'];

  return (
    <HeroBg
      mode={v.Mode           as HeroMode}
      city={v.City           as HeroCity}
      radiusRef={radiusRef}
      lagRef={lagRef}
      cycleIntervalRef={cycleIntervalRef}
      pauseOnHover={v['Pause on Hover']}
    />
  );
}
