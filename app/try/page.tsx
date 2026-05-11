'use client';

import { useState, useRef, useEffect } from 'react';
import NavBar from '@/components/NavBar';

const ALL_LOCALES = [
  { code: 'de', flag: 'de', label: 'German' },
  { code: 'br', flag: 'br', label: 'Portuguese (BR)' },
  { code: 'jp', flag: 'jp', label: 'Japanese' },
  { code: 'ke', flag: 'ke', label: 'Swahili' },
  { code: 'fr', flag: 'fr', label: 'French' },
  { code: 'in', flag: 'in', label: 'Hindi' },
  { code: 'es', flag: 'es', label: 'Spanish' },
  { code: 'kr', flag: 'kr', label: 'Korean' },
];

function LocaleChevrons() {
  return (
    <svg className="locale-chevrons" width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
      <path d="M2.5 5.5L5 3L7.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 8.5L5 11L7.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SquareLoader({ finishing }: { finishing: boolean }) {
  const [squares, setSquares] = useState<boolean[]>(() => Array(9).fill(false));
  const minRedRef = useRef(2);

  useEffect(() => {
    if (finishing) {
      let fill = minRedRef.current;
      let cancelled = false;
      const ramp = () => {
        if (cancelled) return;
        fill = Math.min(fill + 2, 9);
        setSquares(() => {
          const next = Array(9).fill(false);
          const indices = new Set<number>();
          while (indices.size < fill) indices.add(Math.floor(Math.random() * 9));
          indices.forEach((i) => { next[i] = true; });
          return next;
        });
        if (fill < 9) setTimeout(ramp, 140);
        else setSquares(Array(9).fill(true));
      };
      ramp();
      return () => { cancelled = true; };
    }
  }, [finishing]);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setSquares(() => {
        const next = Array(9).fill(false);
        const count = minRedRef.current + Math.floor(Math.random() * 3);
        const indices = new Set<number>();
        while (indices.size < Math.min(count, 9)) indices.add(Math.floor(Math.random() * 9));
        indices.forEach((i) => { next[i] = true; });
        return next;
      });
      if (!cancelled) setTimeout(tick, 320 + Math.random() * 200);
    };
    tick();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="try-loader-grid">
      {squares.map((on, i) => (
        <div key={i} className={`try-loader-sq${on ? ' on' : ''}`} />
      ))}
    </div>
  );
}

const SOURCE_LOCALES = [
  { code: 'en', flag: 'us', label: 'English' },
  { code: 'de', flag: 'de', label: 'German' },
  { code: 'br', flag: 'br', label: 'Portuguese (BR)' },
  { code: 'jp', flag: 'jp', label: 'Japanese' },
  { code: 'fr', flag: 'fr', label: 'French' },
  { code: 'in', flag: 'in', label: 'Hindi' },
  { code: 'es', flag: 'es', label: 'Spanish' },
  { code: 'kr', flag: 'kr', label: 'Korean' },
];

function SourceLocaleSwitcher() {
  const [selected, setSelected] = useState(SOURCE_LOCALES[0]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="locale-card-locale try-locale-chip" ref={ref}>
      <button className="locale-picker-btn" onClick={() => setOpen(!open)}>
        <span className={`locale-flag fi fi-${selected.flag}`} aria-hidden="true" />
        <span className="locale-picker-name">{selected.label} (auto-detected)</span>
        <LocaleChevrons />
      </button>
      {open && (
        <div className="locale-dropdown" role="listbox">
          {SOURCE_LOCALES.filter((l) => l.code !== selected.code).map((opt) => (
            <button
              key={opt.code}
              className="locale-dropdown-item"
              onClick={() => { setSelected(opt); setOpen(false); }}
            >
              <span className={`locale-flag fi fi-${opt.flag}`} aria-hidden="true" />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LocaleSwitcher({ locale, isActive, onActivate, onSwitch, exclude }: {
  locale: typeof ALL_LOCALES[0];
  isActive: boolean;
  onActivate: () => void;
  onSwitch: (code: string) => void;
  exclude: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className={`locale-card-locale try-locale-chip${isActive ? ' is-active' : ''}`} ref={ref}>
      <button
        className="locale-picker-btn"
        onClick={() => { onActivate(); setOpen(!open); }}
      >
        <span className={`locale-flag fi fi-${locale.flag}`} aria-hidden="true" />
        <span className="locale-picker-name">{locale.label}</span>
        <LocaleChevrons />
      </button>
      {open && (
        <div className="locale-dropdown" role="listbox">
          {ALL_LOCALES.filter((l) => !exclude.includes(l.code)).map((opt) => (
            <button
              key={opt.code}
              className="locale-dropdown-item"
              onClick={() => { onSwitch(opt.code); setOpen(false); }}
            >
              <span className={`locale-flag fi fi-${opt.flag}`} aria-hidden="true" />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AddLocaleButton({ exclude, onAdd }: { exclude: string[]; onAdd: (code: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="locale-card-locale try-locale-chip try-locale-add-wrap" ref={ref}>
      <button className="locale-picker-btn try-locale-add-btn" onClick={() => setOpen(!open)}>
        <span>+</span>
        <span className="locale-picker-name">Add locale</span>
        <LocaleChevrons />
      </button>
      {open && (
        <div className="locale-dropdown" role="listbox">
          {ALL_LOCALES.filter((l) => !exclude.includes(l.code)).map((opt) => (
            <button
              key={opt.code}
              className="locale-dropdown-item"
              onClick={() => { onAdd(opt.code); setOpen(false); }}
            >
              <span className={`locale-flag fi fi-${opt.flag}`} aria-hidden="true" />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TryPage() {
  const [source, setSource] = useState('');
  const [selectedLocales, setSelectedLocales] = useState<string[]>(['de']);
  const [activeTab, setActiveTab] = useState('de');
  const [isAdapting, setIsAdapting] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  const handleAdapt = () => {
    if (!source.trim() || isAdapting) return;
    setIsAdapting(true);
    setResults({});

    setTimeout(() => {
      const adapted: Record<string, string> = {};
      selectedLocales.forEach((code) => {
        const locale = ALL_LOCALES.find((l) => l.code === code);
        adapted[code] = `[${locale?.label} adaptation of your story will appear here once the Atlas API is connected. This is a placeholder demonstrating the output panel.]`;
      });
      setResults(adapted);
      setIsAdapting(false);
    }, 3000);
  };

  return (
    <>
      <NavBar centerLabel="Atlas Adaptation Engine" ctaLabel="Learn more" ctaHref="/" />
      <main className="try-page">
        <div className="try-container">
        <div className="try-split">
          {/* Left: Source */}
          <div className="try-pane try-pane-source">
            <div className="try-pane-header">
              <div className="try-locale-chips">
                <SourceLocaleSwitcher />
              </div>
            </div>
            <div className="try-pane-body">
              <textarea
                ref={textareaRef}
                className="try-textarea"
                placeholder="Write or paste your story here..."
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>
          </div>

          {/* Right: Target */}
          <div className="try-pane try-pane-target">
            <div className="try-pane-header">
              <div className="try-locale-chips">
                {selectedLocales.map((code) => {
                  const locale = ALL_LOCALES.find((l) => l.code === code)!;
                  return (
                    <LocaleSwitcher
                      key={code}
                      locale={locale}
                      isActive={activeTab === code}
                      onActivate={() => setActiveTab(code)}
                      onSwitch={(newCode) => {
                        setSelectedLocales((prev) => prev.map((c) => c === code ? newCode : c));
                        if (activeTab === code) setActiveTab(newCode);
                      }}
                      exclude={selectedLocales}
                    />
                  );
                })}
                {selectedLocales.length < 3 && (
                  <AddLocaleButton
                    exclude={selectedLocales}
                    onAdd={(code) => {
                      setSelectedLocales((prev) => [...prev, code]);
                      setActiveTab(code);
                    }}
                  />
                )}
              </div>
            </div>
            <div className={`try-pane-body try-pane-output${results[activeTab] ? ' has-result' : ''}`}>
              {isAdapting ? (
                <div className="try-loading">
                  <SquareLoader finishing={false} />
                  <p className="try-loading-text">Adapting your story...</p>
                </div>
              ) : results[activeTab] ? (
                <div className="try-result-text">{results[activeTab]}</div>
              ) : (
                <div className="try-empty">
                  <p>Your adapted story will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom action bar — split half and half */}
        <div className="try-action-bar">
          <div className="try-action-half try-action-left">
            <div className="try-action-meta">
              <span className="try-meta-item">{source.trim() ? source.trim().split(/\s+/).length : 0} words</span>
              <span className="try-meta-sep">·</span>
              <span className="try-meta-item">{source.length} characters</span>
            </div>
            <button
              className="btn-brand try-adapt-btn"
              disabled={!source.trim() || isAdapting}
              onClick={handleAdapt}
            >
              {isAdapting ? 'Adapting...' : 'Adapt my story'}
            </button>
          </div>
          <div className="try-action-half try-action-right">
            <div className="try-action-meta">
              <span className="try-meta-item">{Object.keys(results).length} adaptations</span>
            </div>
            {Object.keys(results).length > 0 && (
              <>
                <button className="btn-secondary try-tweak-btn">
                  Tweak mappings
                </button>
                <button className="btn-secondary try-download-btn" onClick={() => {
                  const text = results[activeTab] || '';
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `adapted-story-${activeTab}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}>
                  Download
                </button>
              </>
            )}
          </div>
        </div>
        </div>
      </main>
    </>
  );
}
