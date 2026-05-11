'use client';

import { useState } from 'react';

// ── Types & Data ──────────────────────────────────────────────────────────
type Category = 'name' | 'place' | 'food' | 'family' | 'object';
type Seg      = string | { text: string; cat: Category };
type FilterId = 'all' | Category;
type Phase    = 'canvas' | 'adapting' | 'adapted';

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all',    label: 'All adaptations' },
  { id: 'name',   label: 'Names' },
  { id: 'place',  label: 'Places' },
  { id: 'food',   label: 'Food & drink' },
  { id: 'family', label: 'Family terms' },
  { id: 'object', label: 'Everyday objects' },
];

const CAT: Record<Category, { bg: string; color: string }> = {
  name:   { bg: 'rgba(124,58,237,0.12)', color: '#6D28D9' },
  place:  { bg: 'rgba(14,165,233,0.12)', color: '#0369A1' },
  food:   { bg: 'rgba(234,88,12,0.10)',  color: '#C2410C' },
  family: { bg: 'rgba(22,163,74,0.10)',  color: '#15803D' },
  object: { bg: 'rgba(219,39,119,0.10)', color: '#9D174D' },
};

function h(text: string, cat: Category): Seg { return { text, cat }; }

const CARDS: { country: string; flag: string; imgGrad: string; segs: Seg[] }[] = [
  {
    country: 'GERMANY', flag: '🇩🇪',
    imgGrad: 'linear-gradient(160deg,#2C1A00 0%,#7A5010 40%,#C4913A 75%,#E8D09A 100%)',
    segs: [
      'Nach dem Unterricht schlüpfte ', h('Lena','name'), ' in den ', h('Späti','place'),
      ' und holte ', h('Omas','family'), ' übliche Nachmittagsmischung, eine Tüte ',
      h('Butterkekse','food'), ' und eine Flasche ', h('Apfelschorle','food'),
      '. Der ', h('Inhaber','name'), ', der die Familie seit drei Generationen kannte, schob ihr unaufgefordert noch ein paar ',
      h('Salzstangen','food'), ' über die Theke. Draußen wollte der Spätsommerregen nicht aufhören, und ',
      h('Lenas','name'), ' ', h('Beutel','object'), ' schlug bei jedem Schritt gegen ihre Hüfte. Oma würde schon ',
      h('am Küchenfenster','place'), ' sitzen und fragen, ob sie an die ', h('Schorle','food'), ' gedacht hätte.',
    ],
  },
  {
    country: 'BRAZIL', flag: '🇧🇷',
    imgGrad: 'linear-gradient(160deg,#002800 0%,#1a5c1a 35%,#3E9142 65%,#A8D5A2 100%)',
    segs: [
      'Depois da aula, ', h('Mariana','name'), ' entrou no ', h('mercadinho','place'),
      ' da esquina e pegou o de sempre da ', h('vovó','family'), ', um pacote de ',
      h('biscoitos Maria','food'), ' e uma garrafa de ', h('Guaraná','food'),
      '. O ', h('dono','name'), ', que conhecia a família há três gerações, empurrou um saquinho de ',
      h('bala de banana','food'), ' sem precisar pedir. A ',
      h('sacola','object'), ' de Mariana batia enquanto ela corria. A vovó já estaria na ',
      h('varanda','place'), ', pronta para perguntar se ela tinha lembrado do ', h('Guaraná','food'), '.',
    ],
  },
  {
    country: 'JAPAN', flag: '🇯🇵',
    imgGrad: 'linear-gradient(160deg,#05051a 0%,#121240 35%,#2a3d7c 65%,#5A6EC4 100%)',
    segs: [
      '放課後、', h('貫','name'), 'は近所の', h('コンビニ','place'),
      'に駆け込み、', h('おばあちゃん','family'), 'の夕方の定番、',
      h('おせんべい','food'), 'の袋と冷たい', h('緑茶のペットボトル','food'),
      'を手に取った。', h('レジのおじさん','name'), 'は', h('小さな飴の袋','food'),
      'をそっと置いた。貫の', h('バッグ','object'),
      'は走るたびに腰に当たっていた。おばあちゃんはきっと縁側で「', h('お茶','food'), 'は買ったの？」と訊くに違いなかった。',
    ],
  },
  {
    country: 'KENYA', flag: '🇰🇪',
    imgGrad: 'linear-gradient(160deg,#4A0A00 0%,#8B2200 35%,#C94E1A 65%,#F0A070 100%)',
    segs: [
      'After class, ', h('Wanjiku','name'), ' ducked into the ', h('duka','place'),
      ' on the corner and picked up ', h("cucu's",'family'),
      ' afternoon usual, a packet of ', h('Marie biscuits','food'),
      ' and a small thermos of strong ', h('chai','food'),
      '. ', h('Mzee Kamau','name'), ' slid a twist of ',
      h('mabuyu sweets','food'), ' across the counter. Wanjiku\'s ',
      h('kiondo','object'), ' bumped against her hip as she ran home. Cucu would already be on the ',
      h('verandah','place'), ', ready to ask whether she\'d remembered the ', h('chai','food'), '.',
    ],
  },
];

const STORY_PREVIEW = 'After class, Maya ducked into the corner store and picked up her grandmother\'s afternoon usual, a pack of biscuits and a carton of tea…';

// ── Sub-components ────────────────────────────────────────────────────────
function HighlightedText({ segs, filter }: { segs: Seg[]; filter: FilterId }) {
  return (
    <>
      {segs.map((seg, i) => {
        if (typeof seg === 'string') return <span key={i}>{seg}</span>;
        const dim = filter !== 'all' && filter !== seg.cat;
        return (
          <mark key={i} style={{
            background:  dim ? 'transparent' : CAT[seg.cat].bg,
            color:       dim ? 'var(--text-secondary)' : CAT[seg.cat].color,
            borderRadius: 3, padding: '0 2px',
            fontWeight: dim ? 400 : 500,
            transition: 'background 0.2s, color 0.2s',
          }}>
            {seg.text}
          </mark>
        );
      })}
    </>
  );
}

// ── Node Canvas ───────────────────────────────────────────────────────────
function NodeCanvas({ phase, onAdapt }: { phase: Phase; onAdapt: () => void }) {
  const processing = phase === 'adapting';

  return (
    <div className="tw-canvas">
      <div className="tw-canvas-flow">

        {/* Node 1 — Story */}
        <div className="tw-cn-node">
          <div className="tw-cn-head">
            <span className="tw-cn-icon" style={{ color: '#22C55E' }}>◈</span>
            <span>Story</span>
          </div>
          <div className="tw-cn-body">
            <p className="tw-cn-preview">{STORY_PREVIEW}</p>
          </div>
          <div className="tw-cn-port-row">
            <span className="tw-cn-port" style={{ background: '#22C55E' }} />
          </div>
        </div>

        {/* Wire 1 */}
        <div className="tw-cn-wire">
          <span className="tw-cn-dot" style={{ background: '#22C55E' }} />
          <div className="tw-cn-line" style={{ background: 'linear-gradient(to right,#22C55E,#F97316)' }} />
          <span className="tw-cn-dot" style={{ background: '#F97316' }} />
        </div>

        {/* Node 2 — Pocket Atlas (processor) */}
        <div className={`tw-cn-node tw-cn-atlas${processing ? ' is-processing' : ''}`}>
          <div className="tw-cn-head">
            <span className="tw-cn-icon" style={{ color: 'var(--scarlet)' }}>◎</span>
            <span>Pocket Atlas</span>
          </div>
          <div className="tw-cn-body">
            <div className="tw-cn-params">
              <div className="tw-cn-param"><span className="tw-cn-plabel">Markets</span><span className="tw-cn-pval">4</span></div>
              <div className="tw-cn-param"><span className="tw-cn-plabel">Model</span><span className="tw-cn-pval">Atlas Pro</span></div>
              <div className="tw-cn-param"><span className="tw-cn-plabel">Mode</span><span className="tw-cn-pval">Cultural AI</span></div>
            </div>
            {processing ? (
              <div className="tw-cn-loading">
                <span /><span /><span />
              </div>
            ) : (
              <button className="tw-adapt-btn" onClick={onAdapt}>
                Adapt my story
              </button>
            )}
          </div>
        </div>

        {/* Wire 2 */}
        <div className="tw-cn-wire">
          <span className="tw-cn-dot" style={{ background: '#F97316' }} />
          <div className="tw-cn-line" style={{ background: 'linear-gradient(to right,#F97316,#3B82F6)' }} />
          <span className="tw-cn-dot" style={{ background: '#3B82F6' }} />
        </div>

        {/* Node 3 — Output */}
        <div className="tw-cn-node">
          <div className="tw-cn-head">
            <span className="tw-cn-icon" style={{ color: '#3B82F6' }}>✦</span>
            <span>Adaptations</span>
          </div>
          <div className="tw-cn-body">
            <div className="tw-cn-langs">
              {CARDS.map(c => (
                <span key={c.country} className="tw-cn-lang">{c.flag} {c.country}</span>
              ))}
            </div>
          </div>
          <div className="tw-cn-port-row tw-cn-port-row-left">
            <span className="tw-cn-port" style={{ background: '#3B82F6' }} />
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Adapted View ──────────────────────────────────────────────────────────
function AdaptedView({ count, filter, setFilter }: {
  count: number; filter: FilterId; setFilter: (f: FilterId) => void;
}) {
  return (
    <div className="tw-adapted">
      <div className="tw-adapt-grid">
        {CARDS.slice(0, count).map((card, i) => (
          <div key={card.country} className="tw-adapt-card" style={{ animationDelay: `${i * 0.18}s` }}>
            <div className="tw-adapt-head">
              <span className="tw-adapt-flag">{card.flag}</span>
              <span className="tw-adapt-country">{card.country}</span>
              <span className="tw-adapt-sort">⇅</span>
            </div>
            <div className="tw-adapt-img" style={{ background: card.imgGrad }} />
            <p className="tw-adapt-text">
              <HighlightedText segs={card.segs} filter={filter} />
            </p>
          </div>
        ))}
      </div>

      {count === CARDS.length && (
        <div className="tw-chips">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`tw-chip${filter === f.id ? ' is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────
export default function TranslationWindow() {
  const [phase, setPhase]   = useState<Phase>('canvas');
  const [count, setCount]   = useState(0);
  const [filter, setFilter] = useState<FilterId>('all');

  const handleAdapt = () => {
    if (phase !== 'canvas') return;
    setPhase('adapting');
    setTimeout(() => {
      setPhase('adapted');
      CARDS.forEach((_, i) => setTimeout(() => setCount(i + 1), i * 240));
    }, 1100);
  };

  return (
    <div className="tw-window" id="twWindow">
      {phase !== 'adapted' ? (
        <NodeCanvas phase={phase} onAdapt={handleAdapt} />
      ) : (
        <AdaptedView count={count} filter={filter} setFilter={setFilter} />
      )}
    </div>
  );
}
