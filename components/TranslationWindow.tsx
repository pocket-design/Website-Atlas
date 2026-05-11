'use client';

import { useState } from 'react';

// ── Data ───────────────────────────────────────────────────────────────────
type Category = 'name' | 'place' | 'food' | 'family' | 'object';
type Seg      = string | { text: string; cat: Category };
type FilterId = 'all' | Category;

const STORY = `After class, Maya ducked into the corner store and picked up her grandmother's afternoon usual, a pack of biscuits and a carton of tea. The shopkeeper, who had known three generations of the family, slid an extra packet of toffees across the counter without being asked. Outside, the late afternoon rain hadn't quite let up, and Maya's bag thumped against her hip as she ran the four blocks home. Her grandmother would already be on the porch, watching the road, ready to scold her for being late and then ask, in the same breath, whether she'd remembered the tea.`;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all',    label: 'All adaptations' },
  { id: 'name',   label: 'Names' },
  { id: 'place',  label: 'Places' },
  { id: 'food',   label: 'Food & drink' },
  { id: 'family', label: 'Family terms' },
  { id: 'object', label: 'Everyday objects' },
];

const CAT: Record<Category, { bg: string; color: string }> = {
  name:   { bg: 'rgba(124,58,237,0.10)',  color: '#6D28D9' },
  place:  { bg: 'rgba(14,165,233,0.12)',  color: '#0369A1' },
  food:   { bg: 'rgba(234,88,12,0.10)',   color: '#C2410C' },
  family: { bg: 'rgba(22,163,74,0.10)',   color: '#15803D' },
  object: { bg: 'rgba(219,39,119,0.10)',  color: '#9D174D' },
};

function h(text: string, cat: Category): Seg { return { text, cat }; }

const CARDS: {
  country: string; flag: string; imgBg: string; segs: Seg[];
}[] = [
  {
    country: 'GERMANY', flag: '🇩🇪',
    imgBg: 'linear-gradient(160deg,#4a3000 0%,#8B6220 40%,#C4913A 70%,#E8C97A 100%)',
    segs: [
      'Nach dem Unterricht schlüpfte ', h('Lena','name'), ' in den ', h('Späti','place'),
      ' und holte ', h('Omas','family'), ' übliche Nachmittagsmischung, eine Tüte ',
      h('Butterkekse','food'), ' und eine Flasche ', h('Apfelschorle','food'),
      '. Der ', h('Inhaber','name'), ', der die Familie seit drei Generationen kannte, schob ihr unaufgefordert noch ein paar ',
      h('Salzstangen','food'), ' über die Theke. Draußen wollte der Spätsommerregen nicht aufhören, und ',
      h('Lenas','name'), ' ', h('Beutel','object'),
      ' schlug bei jedem Schritt gegen ihre Hüfte, als sie nach Hause rannte. Oma würde schon ',
      h('am Küchenfenster','place'), ' sitzen, die Straße schauen und sie schimpfen, und im selben Atemzug fragen, ob sie an die ',
      h('Schorle','food'), ' gedacht hätte.',
    ],
  },
  {
    country: 'BRAZIL', flag: '🇧🇷',
    imgBg: 'linear-gradient(160deg,#003d00 0%,#1a6b1a 35%,#4CAF50 65%,#A5D6A7 100%)',
    segs: [
      'Depois da aula, ', h('Mariana','name'), ' entrou no ', h('mercadinho','place'),
      ' da esquina e pegou o de sempre da ', h('vovó','family'), ', um pacote de ',
      h('biscoitos Maria','food'), ' e uma garrafa de ', h('Guaraná','food'),
      '. O ', h('dono','name'), ', que conhecia a família há três gerações, empurrou para o balcão um saquinho de ',
      h('bala de banana','food'), ' sem nem precisar pedir. Lá fora, a chuva de fim de tarde insistia em não parar, e a ',
      h('sacola','object'), ' de Mariana batia contra o quadril enquanto ela corria pelas quatro quadras até em casa. A vovó já estaria na ',
      h('varanda','place'), ', de olho na rua, pronta para brigar pelo atraso e, no mesmo fôlego, perguntar se ela tinha lembrado do ',
      h('Guaraná','food'), '.',
    ],
  },
  {
    country: 'JAPAN', flag: '🇯🇵',
    imgBg: 'linear-gradient(160deg,#0a0a1a 0%,#1a1a3e 35%,#2d4a8a 65%,#6B7FD4 100%)',
    segs: [
      '放課後、', h('貫','name'), 'は近所の', h('コンビニ','place'),
      'に駆け込み、', h('おばあちゃん','family'), 'の夕方の定番、',
      h('おせんべい','food'), 'の袋と冷たい', h('緑茶のペットボトル','food'),
      'を手に取った。三代にわたって家族のことを知っている', h('レジのおじさん','name'),
      'は、何も言わずに', h('小さな飴の袋','food'),
      'をカウンターの隣にすっと置いた。外では夕暮れの雨がまだ降り止まず、貫の',
      h('バッグ','object'), 'は走るたびに腰に当たって音を立てていた。おばあちゃんはきっともう縁側にいて、道を見ながら遅くもを叱りつつ、同じ口で「',
      h('お茶','food'), 'は買ったの？」と訊くに違いなかった。',
    ],
  },
  {
    country: 'KENYA', flag: '🇰🇪',
    imgBg: 'linear-gradient(160deg,#5D1A00 0%,#8B2500 35%,#D4531E 65%,#F5A05A 100%)',
    segs: [
      'After class, ', h('Wanjiku','name'), ' ducked into the ', h('duka','place'),
      ' on the corner and picked up ', h("cucu's",'family'),
      ' afternoon usual, a packet of ', h('Marie biscuits','food'),
      ' and a small thermos of strong ', h('chai','food'),
      '. ', h('Mzee Kamau','name'),
      ', who had known three generations of the family, slid a small twist of ',
      h('mabuyu sweets','food'), ' across the counter without a word. Outside, the late afternoon rain hadn\'t quite let up, and Wanjiku\'s ',
      h('kiondo','object'), ' bumped against her hip as she ran the four blocks home. Cucu would already be on the ',
      h('verandah','place'), ', watching the road, ready to scold her for being late and then ask, in the same breath, whether she\'d remembered the ',
      h('chai','food'), '.',
    ],
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────
function HighlightedText({ segs, filter }: { segs: Seg[]; filter: FilterId }) {
  return (
    <>
      {segs.map((seg, i) => {
        if (typeof seg === 'string') return <span key={i}>{seg}</span>;
        const dimmed = filter !== 'all' && filter !== seg.cat;
        return (
          <mark
            key={i}
            style={{
              background: dimmed ? 'transparent' : CAT[seg.cat].bg,
              color:      dimmed ? 'var(--text-secondary)' : CAT[seg.cat].color,
              borderRadius: 3,
              padding: '0 2px',
              fontWeight: dimmed ? 400 : 500,
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {seg.text}
          </mark>
        );
      })}
    </>
  );
}

function AdaptCard({
  card, filter, index,
}: {
  card: typeof CARDS[0]; filter: FilterId; index: number;
}) {
  return (
    <div
      className="tw-adapt-card"
      style={{ animationDelay: `${index * 0.22}s` }}
    >
      <div className="tw-adapt-head">
        <span className="tw-adapt-flag">{card.flag}</span>
        <span className="tw-adapt-country">{card.country}</span>
        <span className="tw-adapt-icon">◇</span>
      </div>
      <div className="tw-adapt-img" style={{ background: card.imgBg }} />
      <p className="tw-adapt-text">
        <HighlightedText segs={card.segs} filter={filter} />
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function TranslationWindow() {
  const [phase, setPhase]           = useState<'idle' | 'adapting' | 'done'>('idle');
  const [visibleCount, setVisible]  = useState(0);
  const [filter, setFilter]         = useState<FilterId>('all');

  const handleAdapt = () => {
    if (phase !== 'idle') return;
    setPhase('adapting');
    CARDS.forEach((_, i) => {
      setTimeout(() => {
        setVisible(i + 1);
        if (i === CARDS.length - 1) setPhase('done');
      }, 200 + i * 260);
    });
  };

  const showAdaptations = phase !== 'idle';

  return (
    <div className="tw-root">
      {/* ── Input card ── */}
      <div className="tw-input-wrap">
        <div className="tw-input-card">
          <p className="tw-input-text">{STORY}</p>
        </div>
        <button
          className={`tw-adapt-btn${phase !== 'idle' ? ' is-active' : ''}`}
          onClick={handleAdapt}
          disabled={phase !== 'idle'}
        >
          {phase === 'idle' ? 'Adapt my story' : phase === 'adapting' ? 'Adapting…' : '✓ Adapted'}
        </button>
      </div>

      {/* ── Fork connector ── */}
      {showAdaptations && (
        <svg className="tw-fork" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
          {/* vertical from button */}
          <line x1="500" y1="0"  x2="500" y2="24" stroke="var(--vellum-shade-2)" strokeWidth="1"/>
          {/* horizontal rail */}
          <line x1="125" y1="24" x2="875" y2="24" stroke="var(--vellum-shade-2)" strokeWidth="1"/>
          {/* drops to each card */}
          {[125, 375, 625, 875].map(x => (
            <line key={x} x1={x} y1="24" x2={x} y2="48" stroke="var(--vellum-shade-2)" strokeWidth="1"/>
          ))}
        </svg>
      )}

      {/* ── Adaptation grid ── */}
      {showAdaptations && (
        <div className="tw-adapt-wrap">
          <div className="tw-adapt-grid">
            {CARDS.slice(0, visibleCount).map((card, i) => (
              <AdaptCard key={card.country} card={card} filter={filter} index={i} />
            ))}
            {/* placeholder columns for cards not yet visible */}
            {Array.from({ length: CARDS.length - visibleCount }).map((_, i) => (
              <div key={`ph-${i}`} className="tw-adapt-card tw-adapt-placeholder" />
            ))}
          </div>

          {/* Filter tabs */}
          {phase === 'done' && (
            <div className="tw-filter-row">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  className={`tw-filter-btn${filter === f.id ? ' is-active' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
