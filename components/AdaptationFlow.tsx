'use client';

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';

const DEMO_STORY = `After class, Maya ducked into the corner store and picked up her grandmother's afternoon usual, a pack of biscuits and a carton of tea. The shopkeeper, who had known three generations of the family, slid an extra packet of toffees across the counter without being asked. Outside, the late afternoon rain hadn't quite let up, and Maya's bag thumped against her hip as she ran the four blocks home. Her grandmother would already be on the porch, watching the road, ready to scold her for being late and then ask, in the same breath, whether she'd remembered the tea.`;

/**
 * Each locale's adapted passage is broken into segments so we
 * can highlight only the words/phrases the engine changed.
 * Each highlight tags a BUCKET — one of the canonical entity
 * categories the adaptation engine transposes. Same-bucket
 * highlights across all 4 locales fire together, with a
 * tooltip naming the bucket as it activates. Capped at 5.
 */
const BUCKETS = [
  'Names localized',            // 0 — character names
  'Places localized',           // 1 — corner store + porch/window
  'Food & drink localized',     // 2 — biscuits, drink, bonus, callback
  'Family terms localized',     // 3 — kin
  'Everyday objects localized', // 4 — shopkeeper + bag
] as const;

type Segment = string | { hl: string; b: number };

type Locale = {
  key: string;
  countryCode: string;
  name: string;
  image: string;
  imageLabel: string;
  segments: Segment[];
};

const ALL_LOCALES: Locale[] = [
  {
    key: 'de',
    countryCode: 'de',
    name: 'Germany',
    image: '/assets/berlin-locale.jpg',
    imageLabel: 'Berlin',
    segments: [
      'Nach dem Unterricht schlüpfte ',
      { hl: 'Lena', b: 0 },
      ' in den ',
      { hl: 'Späti', b: 1 },
      ' und holte ',
      { hl: 'Omas', b: 3 },
      ' übliche Nachmittagsmischung — eine Tüte ',
      { hl: 'Butterkekse', b: 2 },
      ' und eine Flasche ',
      { hl: 'Apfelschorle', b: 2 },
      '. Der ',
      { hl: 'Inhaber', b: 4 },
      ', der die Familie seit drei Generationen kannte, schob ihr unaufgefordert noch ein paar ',
      { hl: 'Salzstangen', b: 2 },
      ' über die Theke. Draußen wollte der Spätsommerregen nicht aufhören, und Lenas ',
      { hl: 'Beutel', b: 4 },
      ' schlug bei jedem Schritt gegen ihre Hüfte, als sie nach Hause rannte. Oma würde schon ',
      { hl: 'am Küchenfenster', b: 1 },
      ' sitzen, auf die Straße schauen und sie schimpfen — und im selben Atemzug fragen, ob sie an die ',
      { hl: 'Schorle', b: 2 },
      ' gedacht hätte.',
    ],
  },
  {
    key: 'br',
    countryCode: 'br',
    name: 'Brazil',
    image: '/assets/sao-paulo-locale.jpg',
    imageLabel: 'São Paulo',
    segments: [
      'Depois da aula, ',
      { hl: 'Mariana', b: 0 },
      ' entrou no ',
      { hl: 'mercadinho', b: 1 },
      ' da esquina e pegou o de sempre da ',
      { hl: 'vovó', b: 3 },
      ' — um pacote de ',
      { hl: 'biscoitos Maria', b: 2 },
      ' e uma garrafa de ',
      { hl: 'Guaraná', b: 2 },
      '. O ',
      { hl: 'dono', b: 4 },
      ', que conhecia a família há três gerações, empurrou para o balcão um saquinho de ',
      { hl: 'bala de banana', b: 2 },
      ' sem nem precisar pedir. Lá fora, a chuva de fim de tarde insistia em não parar, e a ',
      { hl: 'sacola', b: 4 },
      ' de Mariana batia contra o quadril enquanto ela corria pelas quatro quadras até em casa. A vovó já estaria ',
      { hl: 'na varanda', b: 1 },
      ', de olho na rua, pronta para brigar pelo atraso — e, no mesmo fôlego, perguntar se ela tinha lembrado do ',
      { hl: 'Guaraná', b: 2 },
      '.',
    ],
  },
  {
    key: 'jp',
    countryCode: 'jp',
    name: 'Japan',
    image: '/assets/tokyo-locale.jpg',
    imageLabel: 'Tokyo',
    segments: [
      '放課後、',
      { hl: '舞', b: 0 },
      'は近所の',
      { hl: 'コンビニ', b: 1 },
      'に駆け込み、',
      { hl: 'おばあちゃん', b: 3 },
      'の夕方の定番——',
      { hl: 'おせんべい', b: 2 },
      'の袋と冷たい',
      { hl: '緑茶のペットボトル', b: 2 },
      'を手に取った。三代にわたって家族のことを知っている',
      { hl: 'レジのおじさん', b: 4 },
      'は、何も言わずに',
      { hl: '小さな飴の袋', b: 2 },
      'をカウンターの隅にすっと置いた。外では夕暮れの雨がまだ降り止まず、舞の',
      { hl: 'バッグ', b: 4 },
      'は走るたびに腰に当たって音を立てた。おばあちゃんはきっともう',
      { hl: '縁側', b: 1 },
      'に出ていて、道を見ながら遅くなったと叱りつつ、同じ口で「',
      { hl: 'お茶', b: 2 },
      'は買ったの？」と訊くに違いなかった。',
    ],
  },
  {
    key: 'ke',
    countryCode: 'ke',
    name: 'Kenya',
    image: '/assets/nairobi-locale.jpg',
    imageLabel: 'Nairobi',
    segments: [
      'After class, ',
      { hl: 'Wanjiku', b: 0 },
      ' ducked into the ',
      { hl: 'duka', b: 1 },
      ' on the corner and picked up ',
      { hl: "cucu's", b: 3 },
      ' afternoon usual — a packet of ',
      { hl: 'Marie biscuits', b: 2 },
      ' and a small thermos of strong ',
      { hl: 'chai', b: 2 },
      '. ',
      { hl: 'Mzee Kamau', b: 4 },
      ', who had known three generations of the family, slid a small twist of ',
      { hl: 'mabuyu sweets', b: 2 },
      ' across the counter without a word. Outside, the late afternoon rain hadn’t quite let up, and Wanjiku’s ',
      { hl: 'kiondo', b: 4 },
      ' bumped against her hip as she ran the four blocks home. Cucu would already be on the ',
      { hl: 'verandah', b: 1 },
      ', watching the road, ready to scold her for being late and then ask, in the same breath, whether she’d remembered the ',
      { hl: 'chai', b: 2 },
      '.',
    ],
  },
  {
    key: 'fr',
    countryCode: 'fr',
    name: 'France',
    image: '/assets/paris-locale.jpg',
    imageLabel: 'Paris',
    segments: [
      "Après les cours, ",
      { hl: 'Camille', b: 0 },
      " s\u2019est glissée dans ",
      { hl: "l\u2019épicerie", b: 1 },
      " du coin pour prendre le rituel d\u2019après-midi de ",
      { hl: 'mamie', b: 3 },
      " — un paquet de ",
      { hl: 'petits-beurre', b: 2 },
      " et un berlingot de ",
      { hl: 'thé à la menthe', b: 2 },
      ". Le ",
      { hl: 'patron', b: 4 },
      ", qui connaissait la famille depuis trois générations, a glissé un petit sachet de ",
      { hl: 'caramels mous', b: 2 },
      " sur le comptoir sans qu\u2019on le lui demande. Dehors, la pluie de fin d\u2019après-midi ne s\u2019arrêtait pas, et le ",
      { hl: 'cabas', b: 4 },
      " de Camille lui battait la hanche tandis qu\u2019elle courait vers la maison. Mamie serait déjà ",
      { hl: 'à la fenêtre', b: 1 },
      ", guettant la rue, prête à la gronder pour son retard — et à demander, dans le même souffle, si elle avait pensé au ",
      { hl: 'thé', b: 2 },
      ".",
    ],
  },
  {
    key: 'in',
    countryCode: 'in',
    name: 'India',
    image: '/assets/mumbai-locale.jpg',
    imageLabel: 'Mumbai',
    segments: [
      'स्कूल के बाद, ',
      { hl: 'प्रिया', b: 0 },
      ' कोने की ',
      { hl: 'किराना दुकान', b: 1 },
      ' में घुसी और ',
      { hl: 'नानी', b: 3 },
      ' की शाम की हमेशा वाली चीज़ें उठाईं — एक पैकेट ',
      { hl: 'पारले-जी', b: 2 },
      ' और एक ',
      { hl: 'चाय पत्ती का डिब्बा', b: 2 },
      '। ',
      { hl: 'दुकानदार चाचा', b: 4 },
      ', जो तीन पीढ़ियों से परिवार को जानते थे, ने बिना कहे एक मुट्ठी ',
      { hl: 'इमली की गोलियाँ', b: 2 },
      ' काउंटर पर सरका दीं। बाहर शाम की बारिश अभी थमी नहीं थी, और प्रिया का ',
      { hl: 'झोला', b: 4 },
      ' कूल्हे से टकराता रहा जब वो चार गलियाँ दौड़कर घर पहुँची। नानी ज़रूर ',
      { hl: 'बरामदे', b: 1 },
      ' में खड़ी होंगी, सड़क की तरफ़ देखती हुई, देर से आने पर डाँटने को तैयार — और उसी साँस में पूछेंगी कि ',
      { hl: 'चाय पत्ती', b: 2 },
      ' लाई या नहीं।',
    ],
  },
  {
    key: 'es',
    countryCode: 'es',
    name: 'Spain',
    image: '/assets/madrid-locale.jpg',
    imageLabel: 'Madrid',
    segments: [
      'Después de clase, ',
      { hl: 'Lucía', b: 0 },
      ' entró en la ',
      { hl: 'tienda de barrio', b: 1 },
      ' y recogió lo de siempre para la ',
      { hl: 'abuela', b: 3 },
      ' — un paquete de ',
      { hl: 'galletas María', b: 2 },
      ' y un brick de ',
      { hl: 'Cola Cao', b: 2 },
      '. El ',
      { hl: 'tendero', b: 4 },
      ', que conocía a tres generaciones de la familia, deslizó un puñado de ',
      { hl: 'chupa chups', b: 2 },
      ' por el mostrador sin que nadie se lo pidiera. Fuera, la lluvia de última hora no paraba, y la ',
      { hl: 'bolsa de tela', b: 4 },
      ' de Lucía le golpeaba la cadera mientras corría las cuatro manzanas hasta casa. La abuela ya estaría ',
      { hl: 'en el balcón', b: 1 },
      ', mirando la calle, lista para reñirle por llegar tarde — y preguntar, sin tomar aire, si se había acordado del ',
      { hl: 'Cola Cao', b: 2 },
      '.',
    ],
  },
  {
    key: 'kr',
    countryCode: 'kr',
    name: 'South Korea',
    image: '/assets/seoul-locale.jpg',
    imageLabel: 'Seoul',
    segments: [
      '수업이 끝나고, ',
      { hl: '수진', b: 0 },
      '이는 동네 ',
      { hl: '편의점', b: 1 },
      '에 들러 ',
      { hl: '할머니', b: 3 },
      '의 오후 간식을 챙겼다 — ',
      { hl: '새우깡', b: 2 },
      ' 한 봉지와 ',
      { hl: '보리차', b: 2 },
      ' 한 병. ',
      { hl: '사장님', b: 4 },
      '은 삼대에 걸쳐 가족을 알고 있는 분이라, 아무 말 없이 ',
      { hl: '약과', b: 2 },
      ' 몇 개를 카운터 위에 슬쩍 놓아주셨다. 밖에선 늦은 오후의 비가 아직 그치지 않았고, 수진이의 ',
      { hl: '에코백', b: 4 },
      '이 뛸 때마다 엉덩이를 탁탁 쳤다. 할머니는 분명 ',
      { hl: '현관 앞', b: 1 },
      '에 나와 계실 거다 — 길을 내다보며 늦었다고 한소리 하시고는, 같은 숨에 ',
      { hl: '보리차', b: 2 },
      ' 사 왔냐고 물으실 거다.',
    ],
  },
];

const DEFAULT_LOCALE_KEYS = ['de', 'br', 'jp', 'ke'];

/**
 * Hero half of the flow: the double-bordered input box with
 * Demo story / Take this global buttons. Renders inside the
 * .hero section so the globe sits behind it.
 */
export function HeroAdapter() {
  const [revealedWords, setRevealedWords] = useState(0);
  const [done, setDone] = useState(false);
  const words = useRef(DEMO_STORY.split(/(\s+)/)).current;
  const totalWords = useRef(words.filter((w) => !/^\s+$/.test(w)).length).current;

  useEffect(() => {
    let cancelled = false;
    let wordIdx = 0;

    const reveal = () => {
      if (cancelled) return;
      wordIdx++;
      setRevealedWords(wordIdx);

      if (wordIdx >= totalWords) {
        setDone(true);
        return;
      }

      const progress = wordIdx / totalWords;
      const delay = Math.max(10, 45 * (1 - progress * 0.85));
      setTimeout(reveal, delay);
    };

    reveal();
    return () => { cancelled = true; };
  }, [totalWords]);

  let wordCounter = 0;

  return (
    <div className="adapt-flow">
      <div className="adapt-input">
        <div className="adapt-input-inner">
          <div className="adapt-input-textarea story-stream" aria-label="Source story">
            {words.map((word, i) => {
              const isSpace = /^\s+$/.test(word);
              if (isSpace) return <Fragment key={i}>{word}</Fragment>;
              const idx = wordCounter++;
              const revealed = done || idx < revealedWords;
              return (
                <span key={i} className={revealed ? 'stream-word is-visible' : 'stream-word'}>
                  {word}
                </span>
              );
            })}
          </div>
        </div>
        <div className="adapt-input-actions">
          <button
            type="button"
            className="btn-global"
            onClick={() => {
              document.getElementById('locale-cascade')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Make my story global
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Cascade fold: SVG branches fanning into 4 locale cards.
 * On scroll into view, a bucket sequence kicks off:
 *   - Each bucket activates ALL matching highlights across
 *     all 4 cards in sync (same-category highlights light
 *     up together — drives home that the engine treats them
 *     as the same canonical thing across cultures).
 *   - A tooltip floats above one specific locale per bucket;
 *     the owner rotates so every card gets a spotlight turn.
 */

// One owner-card per bucket — rotation gives each locale a
// turn (DE bookends since 5 buckets / 4 cards leaves one
// repeat). Index is the locale's position in LOCALES.
const BUCKET_OWNERS = [0, 1, 2, 3, 0];

// Per-bucket timing — synced to the tooltipLife animation (3s)
const BUCKET_ACTIVE_MS = 3000; // matches animation duration
const BUCKET_PAUSE_MS  = 300;  // brief gap before next bucket starts

/**
 * Splits a locale's segments into individual word tokens.
 * Plain text gets split on whitespace boundaries; highlight
 * segments stay as single tokens (they're atomic phrases).
 */
type WordToken = { text: string; bucket?: number };

function tokenize(segments: Segment[]): WordToken[] {
  const tokens: WordToken[] = [];
  for (const seg of segments) {
    if (typeof seg === 'string') {
      const parts = seg.split(/(\s+)/);
      for (const p of parts) {
        if (p) tokens.push({ text: p });
      }
    } else {
      tokens.push({ text: seg.hl, bucket: seg.b });
    }
  }
  return tokens;
}

const SHEEN_TOTAL_MS = 2400;
const SHEEN_STEPS = 120;
const SHEEN_SETTLE_PAUSE_MS = 3000;

export function LocaleCascade() {
  const stripRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [currentBucket, setCurrentBucket] = useState(-1);
  const [isActive, setIsActive] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [progress, setProgress] = useState(-1);
  const [sheenDone, setSheenDone] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(DEFAULT_LOCALE_KEYS);
  const [slotReady, setSlotReady] = useState([false, false, false, false]);

  const handleSwap = (slotIndex: number, newKey: string) => {
    setSelectedKeys((prev) => {
      const next = [...prev];
      next[slotIndex] = newKey;
      return next;
    });
    setSlotReady((prev) => {
      const next = [...prev];
      next[slotIndex] = false;
      return next;
    });
  };

  const handleSlotReady = (slotIndex: number) => {
    setSlotReady((prev) => {
      const next = [...prev];
      next[slotIndex] = true;
      return next;
    });
  };

  const visibleLocales = selectedKeys.map(
    (key) => ALL_LOCALES.find((l) => l.key === key)!,
  );

  useLayoutEffect(() => {
    if (currentBucket < 0 || currentBucket >= BUCKETS.length) return;
    const strip = stripRef.current;
    if (!strip) return;
    const owner = BUCKET_OWNERS[currentBucket];
    // If the owner slot isn't ready, hide tooltip
    if (!slotReady[owner]) {
      setTooltipPos(null);
      return;
    }
    const card = strip.querySelectorAll<HTMLElement>('.locale-card')[owner];
    if (!card) return;
    const hl = card.querySelector<HTMLElement>(
      `.locale-highlight[data-bucket="${currentBucket}"]`,
    );
    if (!hl) return;
    const fragments = hl.getClientRects();
    const hlRect = fragments.length > 0 ? fragments[0] : hl.getBoundingClientRect();
    const stripRect = strip.getBoundingClientRect();
    setTooltipPos({
      x: hlRect.left + hlRect.width / 2 - stripRect.left,
      y: hlRect.top - stripRect.top,
    });
  }, [currentBucket, slotReady]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const cycleAt = (b: number) => {
      if (cancelled) return;
      setCurrentBucket(b);
      setIsActive(true);
      timeouts.push(
        setTimeout(() => {
          if (cancelled) return;
          setIsActive(false);
          timeouts.push(
            setTimeout(() => {
              if (cancelled) return;
              cycleAt((b + 1) % BUCKETS.length);
            }, BUCKET_PAUSE_MS),
          );
        }, BUCKET_ACTIVE_MS),
      );
    };

    const startSheen = () => {
      let step = 0;
      const interval = SHEEN_TOTAL_MS / SHEEN_STEPS;
      const easeInOut = (t: number) =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const tick = () => {
        if (cancelled) return;
        const linear = step / SHEEN_STEPS;
        setProgress(easeInOut(linear));
        step++;
        if (step <= SHEEN_STEPS) {
          timeouts.push(setTimeout(tick, interval));
        } else {
          timeouts.push(
            setTimeout(() => {
              if (cancelled) return;
              setSheenDone(true);
              timeouts.push(
                setTimeout(() => {
                  if (cancelled) return;
                  cycleAt(0);
                }, SHEEN_SETTLE_PAUSE_MS),
              );
            }, 200),
          );
        }
      };
      tick();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Unblur images immediately on scroll-in
        grid.querySelectorAll('.locale-card-image').forEach((el) => {
          el.classList.add('is-revealed');
        });
        timeouts.push(setTimeout(() => {
          if (!cancelled) startSheen();
        }, 1000));
      },
      { threshold: 0.4, rootMargin: '0px 0px -22% 0px' },
    );
    io.observe(grid);

    return () => {
      cancelled = true;
      io.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const hasTooltip = currentBucket >= 0 && currentBucket < BUCKETS.length && tooltipPos;

  return (
    <div className="adapt-flow">
      <CascadeBranches />

      <div ref={stripRef} className="cascade-strip">
        <div
          className={'cascade-tooltip' + (hasTooltip && isActive ? ' is-visible' : '')}
          data-bucket={currentBucket >= 0 ? currentBucket : undefined}
          style={tooltipPos ? { left: tooltipPos.x, top: tooltipPos.y } : { left: 0, top: 0 }}
          aria-hidden={!hasTooltip}
        >
          {currentBucket >= 0 && currentBucket < BUCKETS.length ? BUCKETS[currentBucket] : ''}
        </div>

        <div ref={gridRef} className="cascade-grid">
          {visibleLocales.map((l, i) => (
            <LocaleCard
              key={i}
              locale={l}
              slotIndex={i}
              progress={progress}
              sheenDone={sheenDone}
              isActive={isActive && slotReady[i]}
              currentBucket={currentBucket}
              selectedKeys={selectedKeys}
              onSwap={handleSwap}
              onReady={handleSlotReady}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LocaleCard({
  locale: l,
  slotIndex,
  progress: globalProgress,
  sheenDone: globalSheenDone,
  isActive,
  currentBucket,
  selectedKeys,
  onSwap,
  onReady,
}: {
  locale: Locale;
  slotIndex: number;
  progress: number;
  sheenDone: boolean;
  isActive: boolean;
  currentBucket: number;
  selectedKeys: string[];
  onSwap: (slotIndex: number, newKey: string) => void;
  onReady: (slotIndex: number) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [localProgress, setLocalProgress] = useState(-1);
  const [localSheenDone, setLocalSheenDone] = useState(false);
  const [sheenKey, setSheenKey] = useState(l.key);
  const hasSwapped = useRef(false);

  // Synchronous reset during render: if locale changed, stamp
  // a new sheenKey so ALL state from prior locale is ignored
  // until the effect fires and begins the new sheen.
  if (sheenKey !== l.key) {
    setSheenKey(l.key);
    setLocalProgress(-1);
    setLocalSheenDone(false);
    hasSwapped.current = true;
  }

  // Effective values: always grey if we've swapped and local
  // sheen hasn't completed for the current key. On initial load
  // (never swapped), use global progress.
  let effectiveProgress: number;
  let effectiveSheenDone: boolean;

  if (!hasSwapped.current) {
    effectiveProgress = globalProgress;
    effectiveSheenDone = globalSheenDone;
  } else {
    effectiveProgress = localProgress;
    effectiveSheenDone = localSheenDone;
  }

  // Report ready when global sheen finishes (initial load)
  useEffect(() => {
    if (!hasSwapped.current && globalSheenDone) {
      onReady(slotIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalSheenDone]);

  // Fire local sheen whenever sheenKey changes (locale swap)
  useEffect(() => {
    if (!hasSwapped.current) return;

    let step = 0;
    let cancelled = false;
    const targetKey = l.key;
    const interval = SHEEN_TOTAL_MS / SHEEN_STEPS;
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const tick = () => {
      if (cancelled) return;
      const linear = step / SHEEN_STEPS;
      setLocalProgress(easeInOut(linear));
      step++;
      if (step <= SHEEN_STEPS) {
        setTimeout(tick, interval);
      } else {
        setTimeout(() => {
          if (!cancelled) {
            setLocalSheenDone(true);
            onReady(slotIndex);
          }
        }, 200);
      }
    };
    setTimeout(tick, 300);

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheenKey]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const tokens = tokenize(l.segments);
  const nonWhitespaceCount = tokens.filter((t) => !/^\s+$/.test(t.text)).length;

  const revealedCount =
    effectiveProgress < 0 ? -1 : Math.floor(effectiveProgress * nonWhitespaceCount);

  let wordIdx = 0;

  return (
    <article className="locale-card">
      <div className="locale-card-locale" ref={pickerRef}>
        <button
          type="button"
          className="locale-picker-btn"
          onClick={() => setDropdownOpen((o) => !o)}
          aria-expanded={dropdownOpen}
          aria-haspopup="listbox"
        >
          <span
            className={`locale-flag fi fi-${l.countryCode}`}
            aria-hidden="true"
          />
          <span className="locale-picker-name">{l.name}</span>
          <svg
            className="locale-chevrons"
            width="10"
            height="14"
            viewBox="0 0 10 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2.5 5.5L5 3L7.5 5.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.5 8.5L5 11L7.5 8.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="locale-dropdown" role="listbox">
            {ALL_LOCALES.filter((opt) => !selectedKeys.includes(opt.key)).map(
              (opt) => (
                <button
                  key={opt.key}
                  type="button"
                  role="option"
                  className="locale-dropdown-item"
                  onClick={() => {
                    onSwap(slotIndex, opt.key);
                    setDropdownOpen(false);
                  }}
                >
                  <span
                    className={`locale-flag fi fi-${opt.countryCode}`}
                    aria-hidden="true"
                  />
                  <span>{opt.name}</span>
                </button>
              ),
            )}
          </div>
        )}
      </div>

      <div className={'locale-card-image' + (globalProgress > -1 ? ' is-revealed' : '')} aria-hidden="true">
        <Image
          src={l.image}
          alt={l.imageLabel}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="locale-card-text">
        {tokens.map((token, idx) => {
          const isWhitespace = /^\s+$/.test(token.text);
          if (isWhitespace) return <Fragment key={idx}>{token.text}</Fragment>;

          const myIdx = wordIdx++;
          const revealed = effectiveSheenDone || myIdx <= revealedCount;
          const isCurrent = !effectiveSheenDone && myIdx === revealedCount;

          const isHighlight = token.bucket !== undefined;
          const cyclingStarted = currentBucket >= 0 && effectiveSheenDone;
          const isFocused = isActive && currentBucket === token.bucket;
          const isDimmed = cyclingStarted && !isFocused;
          const cls =
            (isHighlight
              ? 'locale-highlight' +
                (effectiveSheenDone ? ' is-highlighted' : '') +
                (cyclingStarted && isFocused ? ' is-active' : '') +
                (cyclingStarted && isDimmed ? ' is-dimmed' : '')
              : 'sheen-word' + (cyclingStarted ? ' text-dimmed' : '')) +
            (revealed ? ' is-revealed' : '') +
            (isCurrent ? ' is-sheen-current' : '');

          return (
            <span
              key={idx}
              className={cls}
              {...(token.bucket !== undefined ? { 'data-bucket': token.bucket } : {})}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </article>
  );
}

export default function AdaptationFlow() {
  return (
    <>
      <HeroAdapter />
      <LocaleCascade />
    </>
  );
}

/**
 * Five SVG paths fanning out from a single anchor at the top
 * (just below the input box) into the centers of the 5 cards.
 * viewBox 0..1080 horizontally with preserveAspectRatio="none"
 * lets the paths stretch to whatever width the grid lands at.
 */
function CascadeBranches() {
  // Origin (540, 0) at center-top fanning to four column
  // centers (135, 405, 675, 945) for the 4-column grid.
  // Two layers: a static base hairline, plus a scarlet
  // shimmer overlay that fires once — all four pulses
  // simultaneously — when the cascade enters the viewport.
  const branches = [
    'M 540 0 C 540 56, 135 40, 135 96',
    'M 540 0 C 540 56, 405 40, 405 96',
    'M 540 0 C 540 56, 675 40, 675 96',
    'M 540 0 C 540 56, 945 40, 945 96',
  ];

  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          svg.classList.add('is-active');
          io.disconnect();
        }
      },
      // Delayed trigger — the cascade has to be ~30% above
      // the viewport bottom before the shimmer fires, so the
      // user has clearly arrived at the fold rather than just
      // glimpsing its top edge.
      { threshold: 0.6, rootMargin: '0px 0px -28% 0px' },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={svgRef}
      className="cascade-branches"
      viewBox="0 0 1080 96"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g className="branch-base">
        {branches.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className="branch-shimmer">
        {branches.map((d) => (
          <path key={d} d={d} pathLength="100" />
        ))}
      </g>
    </svg>
  );
}
