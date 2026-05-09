'use client';

import { useEffect, useRef, useState } from 'react';

const THUMBNAILS: string[] = [];

// Populated at module load from the filenames in public/thumbnails
const RAW_NAMES = [
  'PFM_A-Cop-in-Deep-Cover_Thumbnail_V5.jpg',
  'PFM_The Beastborn Heiress_Thumbnail_1.jpg',
  'Half-Blood,-Twice-Claimed---v2.jpg',
  'PFM_Kc_Thumbnail_V3.jpg',
  'PFM_Signed-and-Bound_Thumbnail_V17.jpg',
  'Skill-Kill---V02.jpg',
  'PFM_The Fallen Creator_Thumbnail_10.jpg',
  'PFM_Carl-Morris-Detective-Of-The-Torn_Thumbnail_V3.jpg',
  'The-Vampire-Prince-V08.jpg',
  'Debts of Conscience V1.jpg',
  'The-Thirteenth-Floor-Detective-V04.jpg',
  'Twice Born Empress V4.jpg',
  'No-Longer-Your-Luna---v1.jpg',
  'PFM_The-Secret-Life-Of-An-Accidental-Heiress_Thumbnail_V19.jpg',
  'The-Immortal---A-Man-Called-God---v1.jpg',
  'Twice Born Empress V2.jpg',
  'sherpa-thumbnail.jpg',
  'Before-The-Alpha-Remarried---v2.jpg',
  'The-Thirteenth-Floor-Detective-V05.jpg',
  'A-Deal-With-The-Duke-V14.jpg',
  'The-Silverpine-Vows---v1.jpg',
  'When-You-Walked-In--V2.jpg',
  'To-Love-You-Again---v04.jpg',
  'A-Deal-With-The-Duke-V05.jpg',
  'My Fair Assassin V3.jpg',
  'PFM_Asphalt-Giganten_Thumbnail_V3.jpg',
  'The-Perfect-Lie---v2.jpg',
  'Badge of Vengeance V1.jpg',
  'The-Cost-of-Crime---v1.jpg',
  'PFM_The Tomboy Luna_Thumbnail_2.jpg',
  'PFM_Beneath a Broken Sky_Thumbnail_4.jpg',
  'PFM_Royal-Stitches_Thumbnail_V6.jpg',
  'Beauty and the Billionaire V1.jpg',
  'Villains-are-Destined-to-Die-_V2.jpg',
  'Umgarnt-von-einem-Vampir---v2.jpg',
  'PFM_After Darkness Falls_Thumbnail_3.jpg',
  'PFM_Her Dark Kingdom_Thumbnail_2.jpg',
  'Justice-After-Dark-V04.jpg',
  'My Fair Assassin V1.jpg',
  'Lord of the Truth V2.jpg',
  'The-General-Out-of-Time---v2.jpg',
];

for (const name of RAW_NAMES) {
  THUMBNAILS.push('/thumbnails/' + encodeURIComponent(name));
}

const GRID_SIZE = 12;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ThumbnailGrid() {
  const [slots, setSlots] = useState<string[]>(() => {
    const initial = shuffle(THUMBNAILS).slice(0, GRID_SIZE);
    return initial;
  });
  const [fadingSlot, setFadingSlot] = useState(-1);
  const visibleRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    visibleRef.current = new Set(slots);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const cycle = () => {
      const slotIdx = Math.floor(Math.random() * GRID_SIZE);
      setFadingSlot(slotIdx);

      setTimeout(() => {
        setSlots((prev) => {
          const next = [...prev];
          const currentlyVisible = new Set(prev);
          const available = THUMBNAILS.filter((t) => !currentlyVisible.has(t));
          const pool = available.length > 0 ? available : THUMBNAILS.filter((t) => t !== prev[slotIdx]);
          const newThumb = pool[Math.floor(Math.random() * pool.length)];

          next[slotIdx] = newThumb;
          return next;
        });

        setFadingSlot(-1);
      }, 180);

      timeoutRef.current = setTimeout(cycle, 3000);
    };

    timeoutRef.current = setTimeout(cycle, 1500);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className="thumb-grid" aria-hidden="true">
      {slots.map((src, i) => (
        <div key={i} className={'thumb-cell' + (fadingSlot === i ? ' is-fading' : '')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" />
        </div>
      ))}
    </div>
  );
}
