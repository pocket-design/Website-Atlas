'use client';

import { useState, useRef, useEffect } from 'react';

const LOCALES = [
  { key: 'en', countryCode: 'us', name: 'English' },
  { key: 'de', countryCode: 'de', name: 'German' },
  { key: 'br', countryCode: 'br', name: 'Portuguese' },
  { key: 'jp', countryCode: 'jp', name: 'Japanese' },
  { key: 'fr', countryCode: 'fr', name: 'French' },
  { key: 'ke', countryCode: 'ke', name: 'Swahili' },
  { key: 'kr', countryCode: 'kr', name: 'Korean' },
  { key: 'in', countryCode: 'in', name: 'Hindi' },
  { key: 'es', countryCode: 'es', name: 'Spanish' },
];

function LocaleSelector({
  selected,
  onSelect,
  exclude,
}: {
  selected: string;
  onSelect: (key: string) => void;
  exclude: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const locale = LOCALES.find((l) => l.key === selected)!;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="locale-card-locale" ref={ref}>
      <button
        type="button"
        className="locale-picker-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={`locale-flag fi fi-${locale.countryCode}`} aria-hidden="true" />
        <span className="locale-picker-name">{locale.name}</span>
        <svg
          className="locale-chevrons"
          width="10"
          height="14"
          viewBox="0 0 10 14"
          fill="none"
          aria-hidden="true"
        >
          <path d="M2.5 5.5L5 3L7.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.5 8.5L5 11L7.5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="locale-dropdown" role="listbox">
          {LOCALES.filter((l) => l.key !== selected && l.key !== exclude).map((l) => (
            <button
              key={l.key}
              type="button"
              role="option"
              className="locale-dropdown-item"
              onClick={() => { onSelect(l.key); setOpen(false); }}
            >
              <span className={`locale-flag fi fi-${l.countryCode}`} aria-hidden="true" />
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const SAMPLE_STORIES = [
  `After class, Maya ducked into the corner store and picked up her grandmother's afternoon usual, a pack of biscuits and a carton of tea. The shopkeeper, who had known three generations of the family, slid an extra packet of toffees across the counter without being asked. Outside, the late afternoon rain hadn't quite let up, and Maya's bag thumped against her hip as she ran the four blocks home.`,
  `The old lighthouse keeper hadn't spoken to anyone in three years. Every evening he climbed the spiral staircase, lit the lamp, and watched the ships pass. One night a small boat appeared on the rocks below, its hull cracked open like an egg. He grabbed his coat and rope without thinking twice.`,
  `Ravi closed the shop at midnight, pulling down the rusty shutter with both hands. The street was empty except for a stray dog and the distant hum of a generator. He counted the day's earnings under the fluorescent tube, folded the notes carefully, and tucked them into his shirt pocket for the walk home.`,
  `The train was already moving when Sofia jumped on. She squeezed past a man selling roasted peanuts and found a window seat. The city gave way to fields, then hills, then nothing but sky. She pulled out her notebook and began writing the letter she had been putting off for months.`,
  `Jun-ho found the photograph in a box of his grandfather's things. Two young men in military uniforms, arms around each other's shoulders, grinning at the camera. On the back, a single line in faded ink: "Busan, summer of '53." He had never heard his grandfather mention a friend.`,
];

export default function TryItSection() {
  const [sourceLocale, setSourceLocale] = useState('en');
  const [targetLocale, setTargetLocale] = useState('de');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fillSample = () => {
    const story = SAMPLE_STORIES[Math.floor(Math.random() * SAMPLE_STORIES.length)];
    if (textareaRef.current) {
      textareaRef.current.value = story;
    }
  };

  return (
    <div className="tryit-wrapper">
      <div className="tryit-box-container">
        <div className="tryit-pane">
          <LocaleSelector selected={sourceLocale} onSelect={setSourceLocale} exclude={targetLocale} />
          <textarea ref={textareaRef} className="tryit-textarea" placeholder="Paste or write your story here..." rows={8} />
        </div>
        <div className="tryit-separator" />
        <div className="tryit-pane tryit-pane-right is-empty">
          <LocaleSelector selected={targetLocale} onSelect={setTargetLocale} exclude={sourceLocale} />
          <div className="tryit-textarea tryit-result" aria-label="Adapted output">
            <span className="tryit-empty">Adapted story will appear here.</span>
          </div>
        </div>
      </div>
      <div className="tryit-actions">
        <button type="button" className="btn-secondary" onClick={fillSample}>Sample story</button>
        <button type="button" className="btn-global">Adapt now</button>
      </div>
    </div>
  );
}
