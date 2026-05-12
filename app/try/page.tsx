'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import NavBar from '@/components/NavBar';
import { ALL_LOCALES as LOCALE_META, SOURCE_LOCALES as SOURCE_LOCALE_META } from '@/lib/locales';
import type { LocaleMeta } from '@/lib/locales';

const ALL_LOCALES = LOCALE_META.map((l: LocaleMeta) => ({ code: l.code, flag: l.countryCode, label: l.name }));

function Tooltip({ label, children }: { label: string; children: React.ReactElement }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ x: rect.left + rect.width / 2, y: rect.top });
      setShow(true);
    }
  };

  return (
    <span ref={ref} onMouseEnter={handleEnter} onMouseLeave={() => setShow(false)} style={{ display: 'inline-flex' }}>
      {children}
      {show && createPortal(
        <span className="portal-tooltip" style={{ left: pos.x, top: pos.y }}>
          <span className="portal-tooltip-pill">{label}</span>
          <span className="portal-tooltip-notch" />
        </span>,
        document.body
      )}
    </span>
  );
}


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

const SOURCE_LOCALES = SOURCE_LOCALE_META.map((l: LocaleMeta) => ({ code: l.code, flag: l.countryCode, label: l.name }));

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
        <span className="locale-picker-name">{selected.label} (auto)</span>
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

type Mapping = { source: string; target: string };

const DEMO_MAPPINGS: Record<string, Mapping[]> = {
  de: [
    { source: 'Maya', target: 'Lena' },
    { source: 'corner store', target: 'Späti' },
    { source: 'Elm Street', target: 'Lindenstraße' },
    { source: 'biscuits', target: 'Butterkekse' },
    { source: 'tea', target: 'Apfelschorle' },
    { source: 'Mr. Farhan', target: 'Herr Yılmaz' },
    { source: 'grandmother', target: 'Oma' },
  ],
  fr: [
    { source: 'Maya', target: 'Camille' },
    { source: 'corner store', target: "l'épicerie" },
    { source: 'Elm Street', target: 'Rue du Faubourg' },
    { source: 'biscuits', target: 'petits-beurre' },
    { source: 'tea', target: 'thé à la menthe' },
    { source: 'Mr. Farhan', target: 'M. Belkacem' },
    { source: 'grandmother', target: 'mamie' },
  ],
  in: [
    { source: 'Maya', target: 'प्रिया' },
    { source: 'corner store', target: 'किराना दुकान' },
    { source: 'Elm Street', target: 'गली' },
    { source: 'biscuits', target: 'पारले-जी' },
    { source: 'tea', target: 'चाय पत्ती' },
    { source: 'Mr. Farhan', target: 'शर्मा अंकल' },
    { source: 'grandmother', target: 'नानी' },
  ],
  ta: [
    { source: 'Maya', target: 'மாயா' },
    { source: 'corner store', target: 'மளிகைக்கடை' },
    { source: 'Elm Street', target: 'அண்ணா சாலை' },
    { source: 'biscuits', target: 'பிஸ்கட்' },
    { source: 'tea', target: 'டீ' },
    { source: 'Mr. Farhan', target: 'முருகன் அண்ணா' },
    { source: 'grandmother', target: 'பாட்டி' },
  ],
  es: [
    { source: 'Maya', target: 'Lucía' },
    { source: 'corner store', target: 'tienda de barrio' },
    { source: 'Elm Street', target: 'Calle Mayor' },
    { source: 'biscuits', target: 'galletas María' },
    { source: 'tea', target: 'Cola Cao' },
    { source: 'Mr. Farhan', target: 'Don Paco' },
    { source: 'grandmother', target: 'abuela' },
  ],
  it: [
    { source: 'Maya', target: 'Giulia' },
    { source: 'corner store', target: 'alimentari' },
    { source: 'Elm Street', target: 'Via dei Tigli' },
    { source: 'biscuits', target: 'biscotti' },
    { source: 'tea', target: 'tè' },
    { source: 'Mr. Farhan', target: 'Signor Ferrara' },
    { source: 'grandmother', target: 'nonna' },
  ],
  jp: [
    { source: 'Maya', target: '舞' },
    { source: 'corner store', target: 'コンビニ' },
    { source: 'Elm Street', target: '桜通り' },
    { source: 'biscuits', target: 'おせんべい' },
    { source: 'tea', target: '緑茶' },
    { source: 'Mr. Farhan', target: '田中のおじさん' },
    { source: 'grandmother', target: 'おばあちゃん' },
  ],
  nl: [
    { source: 'Maya', target: 'Fleur' },
    { source: 'corner store', target: 'buurtwinkel' },
    { source: 'Elm Street', target: 'Lindelaan' },
    { source: 'biscuits', target: 'stroopwafels' },
    { source: 'tea', target: 'thee' },
    { source: 'Mr. Farhan', target: 'Meneer De Vries' },
    { source: 'grandmother', target: 'oma' },
  ],
  br: [
    { source: 'Maya', target: 'Mariana' },
    { source: 'corner store', target: 'mercadinho' },
    { source: 'Elm Street', target: 'Rua das Flores' },
    { source: 'biscuits', target: 'biscoitos Maria' },
    { source: 'tea', target: 'Guaraná' },
    { source: 'Mr. Farhan', target: 'Seu Antônio' },
    { source: 'grandmother', target: 'vovó' },
  ],
};

function TweakModal({ locales, onClose }: { locales: string[]; onClose: () => void }) {
  const [activeLocale, setActiveLocale] = useState(locales[0]);
  const [mappings, setMappings] = useState<Record<string, Mapping[]>>(() => {
    const initial: Record<string, Mapping[]> = {};
    locales.forEach((code) => {
      initial[code] = (DEMO_MAPPINGS[code] || []).map((m) => ({ ...m }));
    });
    return initial;
  });

  const updateMapping = (index: number, value: string) => {
    setMappings((prev) => {
      const next = { ...prev };
      next[activeLocale] = [...next[activeLocale]];
      next[activeLocale][index] = { ...next[activeLocale][index], target: value };
      return next;
    });
  };

  const deleteMapping = (index: number) => {
    setMappings((prev) => {
      const next = { ...prev };
      next[activeLocale] = next[activeLocale].filter((_, i) => i !== index);
      return next;
    });
  };

  return (
    <div className="tweak-overlay" onClick={onClose}>
      <div className="tweak-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tweak-header">
          <h2 className="tweak-title">Change mappings</h2>
          <p className="tweak-subtitle">Removing or editing a mapping will reflow the adapted prose to accommodate the change(s).</p>
        </div>
        <div className="tweak-tabs">
          {locales.map((code) => {
            const locale = ALL_LOCALES.find((l) => l.code === code);
            return (
              <button
                key={code}
                className={`tweak-tab${activeLocale === code ? ' is-active' : ''}`}
                onClick={() => setActiveLocale(code)}
              >
                <span className={`locale-flag fi fi-${locale?.flag}`} aria-hidden="true" />
                {locale?.label}
              </button>
            );
          })}
        </div>
        <div className="tweak-body">
          {(mappings[activeLocale] || []).map((mapping, i) => (
            <div key={i} className="tweak-row">
              <span className="tweak-source">{mapping.source}</span>
              <span className="tweak-arrow">mapped to</span>
              <input
                className="tweak-input"
                value={mapping.target}
                onChange={(e) => updateMapping(i, e.target.value)}
              />
              <button className="icon-btn-tertiary tweak-delete" onClick={() => deleteMapping(i)} aria-label="Delete mapping" data-tooltip="Delete" disabled={(mappings[activeLocale] || []).length <= 3}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2.5 3.5h9M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M11 3.5l-.5 8a1 1 0 01-1 1h-5a1 1 0 01-1-1l-.5-8M5.5 6v4M8.5 6v4" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="tweak-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-brand" onClick={onClose}>Update</button>
        </div>
      </div>
    </div>
  );
}

type Chapter = { id: number; content: string };
type ChapterResult = { status: 'pending' | 'streaming' | 'done'; text: string };

let nextChapterId = 2;

function ChapterEditor({ chapters, onChange }: {
  chapters: Chapter[];
  onChange: (chapters: Chapter[]) => void;
}) {
  const lastChapterRef = useRef<HTMLDivElement>(null);
  const lastTextareaRef = useRef<HTMLTextAreaElement>(null);
  const prevCountRef = useRef(chapters.length);

  useEffect(() => {
    if (chapters.length > prevCountRef.current && lastChapterRef.current) {
      lastChapterRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => lastTextareaRef.current?.focus(), 300);
    }
    prevCountRef.current = chapters.length;
  }, [chapters.length]);

  const updateContent = (id: number, content: string) => {
    onChange(chapters.map((ch) => ch.id === id ? { ...ch, content } : ch));
  };

  const deleteChapter = (id: number) => {
    if (chapters.length <= 1) return;
    onChange(chapters.filter((ch) => ch.id !== id));
  };

  return (
    <div className="chapter-editor">
      {chapters.map((ch, idx) => (
        <div key={ch.id} className="chapter-block" ref={idx === chapters.length - 1 ? lastChapterRef : undefined}>
          <div className="chapter-header">
            <span className="chapter-title">Chapter {idx + 1}</span>
            <div className="chapter-actions">
              {chapters.length > 1 && (
                <Tooltip label="Delete chapter">
                  <button
                    className="icon-btn-tertiary"
                    onClick={() => deleteChapter(ch.id)}
                    aria-label="Delete chapter"
                  >
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M2.5 3.5h9M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M11 3.5l-.5 8a1 1 0 01-1 1h-5a1 1 0 01-1-1l-.5-8M5.5 6v4M8.5 6v4" />
                    </svg>
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
          <textarea
            ref={idx === chapters.length - 1 ? lastTextareaRef : undefined}
            className="try-textarea chapter-textarea"
            placeholder={`Write your chapter ${idx + 1} here...`}
            value={ch.content}
            onChange={(e) => updateContent(ch.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

function ChapterOutput({ chapterResults, onDelete }: {
  chapterResults: ChapterResult[];
  onDelete: (idx: number) => void;
}) {
  return (
    <div className="chapter-output">
      {chapterResults.map((cr, idx) => (
        <div key={idx} className="chapter-block chapter-block-output">
          <div className="chapter-header chapter-header-output">
            <span className={`chapter-title${cr.status === 'streaming' ? ' is-streaming' : ''}`}>
              {cr.status === 'pending' ? (
                <>Chapter {idx + 1} in progress<span className="chapter-ellipsis" /></>
              ) : cr.status === 'streaming' ? (
                <>Chapter {idx + 1} in progress<span className="chapter-ellipsis" /></>
              ) : (
                <>Chapter {idx + 1}</>
              )}
            </span>
            {cr.status === 'done' && chapterResults.length > 1 && (
              <div className="chapter-actions">
                <Tooltip label="Delete chapter">
                  <button
                    className="icon-btn-tertiary"
                    onClick={() => onDelete(idx)}
                    aria-label="Delete chapter"
                  >
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M2.5 3.5h9M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M11 3.5l-.5 8a1 1 0 01-1 1h-5a1 1 0 01-1-1l-.5-8M5.5 6v4M8.5 6v4" />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
          <div className="chapter-result-text">
            {cr.status === 'pending' ? null : cr.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TryPage() {
  const [chapters, setChapters] = useState<Chapter[]>([{ id: 1, content: '' }]);
  const [selectedLocales, setSelectedLocales] = useState<string[]>(['de', 'fr', 'jp']);
  const [activeTab, setActiveTab] = useState('de');
  const [isAdapting, setIsAdapting] = useState(false);
  const [results, setResults] = useState<Record<string, ChapterResult[]>>({});
  const [hasAdapted, setHasAdapted] = useState(false);
  const [showTweak, setShowTweak] = useState(false);

  const totalSource = chapters.map((c) => c.content).join('\n');
  const totalSourceWords = totalSource.trim() ? totalSource.trim().split(/\s+/).length : 0;
  const totalSourceChars = totalSource.length;

  const activeResults = results[activeTab] || [];
  const totalResultText = activeResults.map((r) => r.text).join('\n');
  const totalResultWords = totalResultText.trim() ? totalResultText.trim().split(/\s+/).length : 0;
  const totalResultChars = totalResultText.length;
  const hasAnyResult = activeResults.some((r) => r.status === 'done');

  const handleAdapt = () => {
    if (!totalSource.trim() || isAdapting) return;
    setIsAdapting(true);
    setResults({});

    const chapterCount = chapters.length;

    const initialResults: Record<string, ChapterResult[]> = {};
    selectedLocales.forEach((code) => {
      initialResults[code] = chapters.map(() => ({ status: 'pending' as const, text: '' }));
    });
    setResults(initialResults);

    selectedLocales.forEach((code) => {
      const locale = ALL_LOCALES.find((l) => l.code === code);
      chapters.forEach((ch, chIdx) => {
        const delay = chIdx * 2000 + 800;
        const streamDelay = delay + 1200;
        const doneDelay = streamDelay + 1500;

        setTimeout(() => {
          setResults((prev) => {
            const next = { ...prev };
            next[code] = [...(next[code] || [])];
            next[code][chIdx] = { status: 'streaming', text: '' };
            return next;
          });
        }, delay);

        setTimeout(() => {
          setResults((prev) => {
            const next = { ...prev };
            next[code] = [...(next[code] || [])];
            next[code][chIdx] = {
              status: 'streaming',
              text: `[${locale?.label} adaptation of Chapter ${chIdx + 1} will appear here once the Atlas API is connected.]`,
            };
            return next;
          });
        }, streamDelay);

        setTimeout(() => {
          setResults((prev) => {
            const next = { ...prev };
            next[code] = [...(next[code] || [])];
            next[code][chIdx] = {
              status: 'done',
              text: `[${locale?.label} adaptation of Chapter ${chIdx + 1} will appear here once the Atlas API is connected. This is a placeholder demonstrating the sequential chapter output.]`,
            };
            return next;
          });

          const isLastChapter = chIdx === chapterCount - 1;
          const isLastLocale = code === selectedLocales[selectedLocales.length - 1];
          if (isLastChapter && isLastLocale) {
            setHasAdapted(true);
            setIsAdapting(false);
          }
        }, doneDelay);
      });
    });
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
              <ChapterEditor chapters={chapters} onChange={setChapters} />
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
            <div className={`try-pane-body try-pane-output${hasAnyResult ? ' has-result' : ''}`}>
              {activeResults.length > 0 ? (
                <ChapterOutput
                  chapterResults={activeResults}
                  onDelete={(idx) => {
                    setResults((prev) => {
                      const next = { ...prev };
                      Object.keys(next).forEach((code) => {
                        next[code] = next[code].filter((_, i) => i !== idx);
                      });
                      return next;
                    });
                  }}
                />
              ) : isAdapting ? (
                <div className="try-loading">
                  <SquareLoader finishing={false} />
                  <p className="try-loading-text">Adapting your story...</p>
                </div>
              ) : (
                <div className="try-empty">
                  <p>Your adaptation will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom action bar — split half and half */}
        <div className="try-action-bar">
          <div className="try-action-half try-action-left">
            <div className="try-action-meta">
              <span className="try-meta-item">{totalSourceWords} words</span>
              <span className="try-meta-sep">·</span>
              <span className="try-meta-item">{totalSourceChars} characters</span>
            </div>
            <button
              className="btn-secondary chapter-add-btn-bar"
              onClick={() => setChapters((prev) => [...prev, { id: nextChapterId++, content: '' }])}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M8 3v10M3 8h10" />
              </svg>
              Add chapter
            </button>
            <button
              className={`${hasAdapted ? 'btn-secondary' : 'btn-brand'} try-adapt-btn`}
              disabled={!totalSource.trim() || isAdapting}
              onClick={handleAdapt}
            >
              {isAdapting ? (hasAdapted ? 'Regenerating...' : 'Adapting...') : hasAdapted ? <>Regenerate <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg></> : 'Adapt'}
            </button>
          </div>
          <div className="try-action-half try-action-right">
            <div className="try-action-meta">
              <span className="try-meta-item">{totalResultWords} words</span>
              <span className="try-meta-sep">·</span>
              <span className="try-meta-item">{totalResultChars} characters</span>
            </div>
            {hasAnyResult && (
              <>
                <button className="try-icon-btn" onClick={() => { setResults({}); setHasAdapted(false); }} aria-label="Clear" data-tooltip="Clear">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
                <button className="try-icon-btn" onClick={() => setShowTweak(true)} aria-label="Change mappings" data-tooltip="Change mappings">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4h3m3 0h6M2 8h6m3 0h3M2 12h1m3 0h8" />
                    <circle cx="7" cy="4" r="1.5" />
                    <circle cx="10" cy="8" r="1.5" />
                    <circle cx="5" cy="12" r="1.5" />
                  </svg>
                </button>
                <button className="btn-secondary" onClick={() => {
                  const text = activeResults.map((r, i) => `Chapter ${i + 1}\n\n${r.text}`).join('\n\n---\n\n');
                  const blob = new Blob([text], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `adapted-story-${activeTab}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v9m0 0l-3-3m3 3l3-3M3 13h10" />
                  </svg>
                  Download
                </button>
              </>
            )}
          </div>
        </div>
        </div>
      </main>
      {showTweak && (
        <TweakModal locales={selectedLocales} onClose={() => setShowTweak(false)} />
      )}
    </>
  );
}
