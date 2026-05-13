'use client';

/**
 * LocaleCascade — pulled from the `hardik` branch (originally
 * AdaptationFlow.tsx). Extracted pieces:
 *   • BUCKETS, Segment / Locale / WordToken types
 *   • ALL_LOCALES (9 hand-translated, bucket-tagged passages)
 *   • SquareLoader, tokenize, isMobile + bucket-owner maps
 *   • LocaleCascade + LocaleCard
 *   • CascadeBranches
 *
 * NOT extracted: HeroAdapter (already in components/HeroAdapter.tsx)
 *                AdaptationFlow default export (not needed on main)
 */

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import { DEFAULT_LOCALE_KEYS } from '@/lib/locales';

const BUCKETS = [
  'Names',            // 0 — character names
  'Places',           // 1 — corner store + porch/window
  'Food & drink',     // 2 — biscuits, drink, bonus, callback
  'Family terms',     // 3 — kin
  'Everyday objects', // 4 — shopkeeper + bag
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
      ' an der ',
      { hl: 'Lindenstraße', b: 1 },
      ' und holte ',
      { hl: 'Omas', b: 3 },
      ' übliche Nachmittagsmischung, eine Tüte ',
      { hl: 'Butterkekse', b: 2 },
      ' und eine Flasche ',
      { hl: 'Apfelschorle', b: 2 },
      '. ',
      { hl: 'Herr Yılmaz', b: 0 },
      ', der die Familie seit drei Generationen kannte, schob ihr unaufgefordert noch ein paar ',
      { hl: 'Salzstangen', b: 2 },
      ' über die Theke. Draußen wollte der Spätsommerregen nicht aufhören, und Lenas ',
      { hl: 'Beutel', b: 4 },
      ' schlug bei jedem Schritt gegen ihre Hüfte, als sie an der ',
      { hl: 'Johanneskirche', b: 1 },
      ' vorbei nach Hause rannte. Die Straße roch nach nassem Asphalt und Bratwurst von ',
      { hl: 'Mehmets', b: 0 },
      ' Imbisswagen. Sie kürzte durch die schmale Gasse zwischen ',
      { hl: 'Schneiders Schneiderei', b: 0 },
      ' und der alten Druckerei ab. ',
      { hl: 'Oma Gertrud', b: 3 },
      ' würde schon ',
      { hl: 'am Küchenfenster', b: 1 },
      ' sitzen, auf die Straße schauen und sie schimpfen, und im selben Atemzug fragen, ob sie an die ',
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
      ' da ',
      { hl: 'Rua das Flores', b: 1 },
      ' e pegou o de sempre da ',
      { hl: 'vovó', b: 3 },
      ', um pacote de ',
      { hl: 'biscoitos Maria', b: 2 },
      ' e uma garrafa de ',
      { hl: 'Guaraná', b: 2 },
      '. ',
      { hl: 'Seu Antônio', b: 0 },
      ', que conhecia a família há três gerações, empurrou para o balcão um saquinho de ',
      { hl: 'bala de banana', b: 2 },
      ' sem nem precisar pedir. Lá fora, a chuva de fim de tarde insistia em não parar, e a ',
      { hl: 'sacola', b: 4 },
      ' de Mariana batia contra o quadril enquanto ela corria pela ',
      { hl: 'Igreja de São Sebastião', b: 1 },
      '. A rua cheirava a asfalto molhado e a acarajé do carrinho do ',
      { hl: 'Dinho', b: 0 },
      '. Ela cortou pelo beco entre a ',
      { hl: 'alfaiataria do Seu Osvaldo', b: 0 },
      ' e a velha gráfica. ',
      { hl: 'Vovó Lourdes', b: 3 },
      ' já estaria ',
      { hl: 'na varanda', b: 1 },
      ', de olho na rua, pronta para brigar pelo atraso e, no mesmo fôlego, perguntar se ela tinha lembrado do ',
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
      'は',
      { hl: '桜通り', b: 1 },
      'の',
      { hl: 'コンビニ', b: 1 },
      'に駆け込み、',
      { hl: 'おばあちゃん', b: 3 },
      'の夕方の定番、',
      { hl: 'おせんべい', b: 2 },
      'の袋と冷たい',
      { hl: '緑茶のペットボトル', b: 2 },
      'を手に取った。',
      { hl: '田中のおじさん', b: 0 },
      'は三代にわたって家族のことを知っていて、何も言わずに',
      { hl: '小さな飴の袋', b: 2 },
      'をカウンターの隅にすっと置いた。外では夕暮れの雨がまだ降り止まず、舞の',
      { hl: 'バッグ', b: 4 },
      'は走るたびに腰に当たって音を立てた。',
      { hl: '聖マリア教会', b: 1 },
      'の前を通り過ぎ、',
      { hl: '健太さん', b: 0 },
      'の屋台から焼きそばの匂いが漂ってきた。',
      { hl: '山田仕立て屋', b: 0 },
      'と古い印刷所の間の路地を抜けた。',
      { hl: 'おばあちゃん', b: 3 },
      'はきっともう',
      { hl: '縁側', b: 1 },
      'に出ていて、道を見ながら遅くなったと叱りつつ、同じ口で「',
      { hl: 'お茶', b: 2 },
      'は買ったの？」と訊くに違いなかった。',
    ],
  },
  {
    key: 'it',
    countryCode: 'it',
    name: 'Italy',
    image: '/assets/rome-locale.jpg',
    imageLabel: 'Rome',
    segments: [
      'Dopo la scuola, ',
      { hl: 'Giulia', b: 0 },
      " \u00E8 entrata nell'",
      { hl: 'alimentari', b: 1 },
      ' in ',
      { hl: 'Via dei Tigli', b: 1 },
      ' e ha preso il solito della ',
      { hl: 'nonna', b: 3 },
      ', un pacchetto di ',
      { hl: 'biscotti', b: 2 },
      ' e una bottiglia di ',
      { hl: 't\u00E8', b: 2 },
      '. ',
      { hl: 'Il signor Ferrara', b: 0 },
      ', che conosceva la famiglia da tre generazioni, le ha fatto scivolare una manciata di ',
      { hl: 'caramelle', b: 2 },
      ' sul bancone senza dire niente. Fuori, la pioggia del tardo pomeriggio non si era ancora fermata, e la ',
      { hl: 'borsa', b: 4 },
      ' di Giulia le sbatteva sul fianco mentre correva oltre la ',
      { hl: 'Chiesa di San Giuseppe', b: 1 },
      '. La strada odorava di asfalto bagnato e cipolle fritte dal carretto di ',
      { hl: 'Salvatore', b: 0 },
      '. Ha tagliato per il vicolo tra la ',
      { hl: 'sartoria del vecchio Rossi', b: 0 },
      ' e la vecchia tipografia. La ',
      { hl: 'nonna', b: 3 },
      ' sarebbe gia stata in ',
      { hl: 'veranda', b: 1 },
      ', a guardare la strada, pronta a sgridarla per il ritardo e poi chiedere, nello stesso respiro, se si fosse ricordata del ',
      { hl: 'te', b: 2 },
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
      ", un paquet de ",
      { hl: 'petits-beurre', b: 2 },
      " et un berlingot de ",
      { hl: 'thé à la menthe', b: 2 },
      ". Le ",
      { hl: 'M. Belkacem', b: 0 },
      ", qui connaissait la famille depuis trois générations, a glissé un petit sachet de ",
      { hl: 'caramels mous', b: 2 },
      " sur le comptoir sans qu\u2019on le lui demande. Dehors, la pluie de fin d\u2019après-midi ne s\u2019arrêtait pas, et le ",
      { hl: 'cabas', b: 4 },
      " de Camille lui battait la hanche en passant devant ",
      { hl: "l\u2019église Saint-Sulpice", b: 1 },
      ". La rue sentait l\u2019asphalte mouillé et les crêpes du chariot de ",
      { hl: 'Youssef', b: 0 },
      ". Elle a coupé par la ruelle entre ",
      { hl: 'la mercerie de Mme Dupont', b: 0 },
      " et la vieille imprimerie. ",
      { hl: 'Mamie Colette', b: 3 },
      " serait déjà ",
      { hl: 'à la fenêtre', b: 1 },
      ", guettant la rue, prête à la gronder pour son retard et à demander, dans le même souffle, si elle avait pensé au ",
      { hl: 'thé', b: 2 },
      ".",
    ],
  },
  {
    key: 'in',
    countryCode: 'in',
    name: 'India (Hindi)',
    image: '/assets/mumbai-locale.jpg',
    imageLabel: 'Mumbai',
    segments: [
      'स्कूल के बाद, ',
      { hl: 'प्रिया', b: 0 },
      ' कोने की ',
      { hl: 'किराना दुकान', b: 1 },
      ' में घुसी और ',
      { hl: 'नानी', b: 3 },
      ' की शाम की हमेशा वाली चीज़ें उठाईं, एक पैकेट ',
      { hl: 'पारले-जी', b: 2 },
      ' और एक ',
      { hl: 'चाय पत्ती का डिब्बा', b: 2 },
      '। ',
      { hl: 'शर्मा अंकल', b: 0 },
      ', जो तीन पीढ़ियों से परिवार को जानते थे, ने बिना कहे एक मुट्ठी ',
      { hl: 'इमली की गोलियाँ', b: 2 },
      ' काउंटर पर सरका दीं। बाहर शाम की बारिश अभी थमी नहीं थी, और प्रिया का ',
      { hl: 'झोला', b: 4 },
      ' कूल्हे से टकराता रहा जब वो ',
      { hl: 'शिव मंदिर', b: 1 },
      ' के आगे से दौड़ी। गली में गीली सड़क और ',
      { hl: 'रज़्ज़ाक भाई', b: 0 },
      ' के ठेले से तले प्याज़ की महक आ रही थी। वो ',
      { hl: 'गोपाल दर्ज़ी', b: 0 },
      ' की दुकान और पुराने प्रिंटिंग प्रेस के बीच की तंग गली से निकली। ',
      { hl: 'नानी कमला', b: 3 },
      ' ज़रूर ',
      { hl: 'बरामदे', b: 1 },
      ' में खड़ी होंगी, सड़क की तरफ़ देखती हुई, देर से आने पर डाँटने को तैयार, और उसी साँस में पूछेंगी कि ',
      { hl: 'चाय पत्ती', b: 2 },
      ' लाई या नहीं।',
    ],
  },
  {
    key: 'ta',
    countryCode: 'in',
    name: 'India (Tamil)',
    image: '/assets/chennai-locale.jpg',
    imageLabel: 'Chennai',
    segments: [
      'பள்ளி முடிந்ததும், ',
      { hl: 'மாயா', b: 0 },
      ' தெரு முனையில் இருந்த ',
      { hl: 'மளிகைக்கடை', b: 1 },
      'க்குள் நுழைந்து ',
      { hl: 'பாட்டி', b: 3 },
      'யின் வழக்கமான மாலை பொருட்களை எடுத்தாள், ஒரு பாக்கெட் ',
      { hl: 'பிஸ்கட்', b: 2 },
      ' மற்றும் ஒரு ',
      { hl: 'டீ', b: 2 },
      ' பாக்கெட். ',
      { hl: 'முருகன் அண்ணா', b: 0 },
      ', மூன்று தலைமுறைகளாக குடும்பத்தை தெரிந்தவர், கேட்காமலே ஒரு கைப்பிடி ',
      { hl: 'மிட்டாய்', b: 2 },
      ' கவுண்டரில் நழுவ விட்டார். வெளியே மாலை மழை இன்னும் நிற்கவில்லை, மாயாவின் ',
      { hl: 'பை', b: 4 },
      ' அவள் இடுப்பில் மோதிக்கொண்டிருந்தது, ',
      { hl: 'கோயில்', b: 1 },
      ' கடந்து ஓடும்போது. தெரு ஈர தார் மற்றும் ',
      { hl: 'செல்வம் அண்ணா', b: 0 },
      'வின் கடையிலிருந்து வறுத்த வெங்காய வாசனை வீசியது. ',
      { hl: 'பழைய தையல்காரர்', b: 0 },
      ' கடைக்கும் பழைய அச்சகத்திற்கும் இடையே உள்ள சந்தில் குறுக்கே சென்றாள். ',
      { hl: 'பாட்டி', b: 3 },
      ' ஏற்கனவே ',
      { hl: 'திண்ணையில்', b: 1 },
      ' இருப்பாள், சாலையைப் பார்த்துக்கொண்டு, தாமதமாக வந்ததற்கு திட்ட தயாராக, அதே மூச்சில் ',
      { hl: 'டீ', b: 2 },
      ' வாங்கி வந்தாயா என்று கேட்பாள்.',
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
      ', un paquete de ',
      { hl: 'galletas María', b: 2 },
      ' y un brick de ',
      { hl: 'Cola Cao', b: 2 },
      '. El ',
      { hl: 'Don Paco', b: 0 },
      ', que conocía a tres generaciones de la familia, deslizó un puñado de ',
      { hl: 'chupa chups', b: 2 },
      ' por el mostrador sin que nadie se lo pidiera. Fuera, la lluvia de última hora no paraba, y la ',
      { hl: 'bolsa de tela', b: 4 },
      ' de Lucía le golpeaba la cadera mientras corría por delante de la ',
      { hl: 'Iglesia de San Isidro', b: 1 },
      '. La calle olía a asfalto mojado y a churros del puesto de ',
      { hl: 'Manolo', b: 0 },
      '. Cortó por el callejón entre la ',
      { hl: 'sastrería del señor Ramírez', b: 0 },
      ' y la vieja imprenta. ',
      { hl: 'La abuela Carmen', b: 3 },
      ' ya estaría ',
      { hl: 'en el balcón', b: 1 },
      ', mirando la calle, lista para reñirle por llegar tarde y preguntar, sin tomar aire, si se había acordado del ',
      { hl: 'Cola Cao', b: 2 },
      '.',
    ],
  },
  {
    key: 'nl',
    countryCode: 'nl',
    name: 'Netherlands',
    image: '/assets/amsterdam-locale.jpg',
    imageLabel: 'Amsterdam',
    segments: [
      'Na school dook ',
      { hl: 'Fleur', b: 0 },
      ' de ',
      { hl: 'buurtwinkel', b: 1 },
      ' in aan de ',
      { hl: 'Lindelaan', b: 1 },
      ' en pakte het vaste middagbestelling van ',
      { hl: 'oma', b: 3 },
      ', een pak ',
      { hl: 'stroopwafels', b: 2 },
      ' en een flesje ',
      { hl: 'thee', b: 2 },
      '. ',
      { hl: 'Meneer De Vries', b: 0 },
      ', die de familie al drie generaties kende, schoof zonder iets te zeggen een zakje ',
      { hl: 'dropjes', b: 2 },
      ' over de toonbank. Buiten was de late middagregen nog niet opgehouden, en de ',
      { hl: 'tas', b: 4 },
      ' van Fleur bonkte tegen haar heup terwijl ze langs de ',
      { hl: 'Grote Kerk', b: 1 },
      ' rende. De straat rook naar nat asfalt en gebakken uien van het karretje van ',
      { hl: 'Henk', b: 0 },
      '. Ze sneed door het steegje tussen de ',
      { hl: 'kleermakerij van oude Jansen', b: 0 },
      ' en de oude drukkerij. ',
      { hl: 'Oma', b: 3 },
      ' zou al op de ',
      { hl: 'veranda', b: 1 },
      ' zitten, de straat in turend, klaar om haar uit te foeteren omdat ze laat was en dan, in dezelfde adem, te vragen of ze aan de ',
      { hl: 'thee', b: 2 },
      ' had gedacht.',
    ],
  },
];


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
          while (indices.size < fill) {
            indices.add(Math.floor(Math.random() * 9));
          }
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

    const step = () => {
      if (cancelled) return;
      setSquares((prev) => {
        const redCount = prev.filter(Boolean).length;
        minRedRef.current = redCount;
        const next = Array(9).fill(false);
        const count = 2 + Math.floor(Math.random() * 4);
        const indices = new Set<number>();
        while (indices.size < count) {
          indices.add(Math.floor(Math.random() * 9));
        }
        indices.forEach((i) => { next[i] = true; });
        return next;
      });
      setTimeout(step, 160);
    };
    step();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="square-loader-grid">
      {squares.map((isRed, i) => (
        <div key={i} className={`square-loader-cell${isRed ? ' is-red' : ''}`} />
      ))}
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
const BUCKET_OWNERS_DESKTOP = [0, 1, 2, 3, 0];
const BUCKET_OWNERS_MOBILE  = [0, 0, 0, 0, 0];

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth <= 768;
}
const getBucketOwners = () => isMobile() ? BUCKET_OWNERS_MOBILE : BUCKET_OWNERS_DESKTOP;

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
  const [manualBucket, setManualBucket] = useState<number | null>(null);
  const cycleRef = useRef<{ cancel: () => void } | null>(null);
  const [overlayPhase, setOverlayPhase] = useState<'loading' | 'fading' | 'collapsing' | 'done'>('loading');
  const [loadingText, setLoadingText] = useState('Kicking things off');
  const [loaderFinishing, setLoaderFinishing] = useState(false);

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

  useEffect(() => {
    if (manualBucket !== null) return;
    if (currentBucket < 0 || currentBucket >= BUCKETS.length) return;
    const strip = stripRef.current;
    if (!strip) return;
    const owner = getBucketOwners()[currentBucket];
    if (!slotReady[owner]) {
      setTooltipPos(null);
      return;
    }

    const measure = () => {
      const grid = gridRef.current;
      if (!grid || !strip) return;
      const card = grid.querySelectorAll<HTMLElement>('.locale-card')[owner];
      if (!card) return;
      const hl = card.querySelector<HTMLElement>(
        `.locale-highlight[data-bucket="${currentBucket}"]`,
      );
      if (!hl) return;
      const fragments = hl.getClientRects();
      const hlRect = fragments.length > 0 ? fragments[0] : hl.getBoundingClientRect();
      const stripRect = strip.getBoundingClientRect();
      const rawX = hlRect.left + hlRect.width / 2 - stripRect.left;
      const tooltipHalfWidth = 80;
      const minX = tooltipHalfWidth;
      const maxX = stripRect.width - tooltipHalfWidth;
      setTooltipPos({
        x: Math.max(minX, Math.min(rawX, maxX)),
        y: hlRect.top - stripRect.top,
      });
    };

    requestAnimationFrame(measure);
  }, [currentBucket, slotReady, manualBucket, isActive]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const cycleAt = (b: number) => {
      if (cancelled) return;
      setManualBucket(null);
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

    cycleRef.current = {
      cancel: () => {
        cancelled = true;
        timeouts.forEach(clearTimeout);
      },
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

    const LOADING_MESSAGES = [
      'Kicking things off',
      'Contextualizing for 4 locales',
      'Localizing names and places',
      'Finalizing your adapted stories',
    ];

    const runLoadingSequence = () => {
      if (cancelled) return;
      setLoadingText(LOADING_MESSAGES[0]);

      let msgIdx = 0;
      const scheduleNext = () => {
        if (cancelled) return;
        const delay = 800 + Math.random() * 1200;
        timeouts.push(setTimeout(() => {
          if (cancelled) return;
          msgIdx++;
          if (msgIdx < LOADING_MESSAGES.length) {
            setLoadingText(LOADING_MESSAGES[msgIdx]);
            if (msgIdx === LOADING_MESSAGES.length - 1) {
              setLoaderFinishing(true);
              timeouts.push(setTimeout(() => {
                if (!cancelled) finishOverlay();
              }, 1000));
            } else {
              scheduleNext();
            }
          }
        }, delay));
      };
      scheduleNext();

      const finishOverlay = () => {
        if (cancelled) return;
        setOverlayPhase('fading');
        timeouts.push(setTimeout(() => {
          if (cancelled) return;
          // Hold blank white state for 300ms
          timeouts.push(setTimeout(() => {
            if (cancelled) return;
            setOverlayPhase('collapsing');
            grid.querySelectorAll('.locale-card-image').forEach((el) => {
              el.classList.add('is-revealed');
            });
            startSheen();
            timeouts.push(setTimeout(() => {
              if (cancelled) return;
              setOverlayPhase('done');
            }, 500));
          }, 300));
        }, 250));
      };
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timeouts.push(setTimeout(() => {
          if (!cancelled) runLoadingSequence();
        }, 300));
      },
      { threshold: 0.15 },
    );
    io.observe(grid);

    return () => {
      cancelled = true;
      io.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const handlePillClick = (bucketIdx: number) => {
    if (cycleRef.current) cycleRef.current.cancel();
    setManualBucket(bucketIdx);
    setCurrentBucket(bucketIdx);
    setIsActive(bucketIdx !== -2);
    setTooltipPos(null);
  };

  const hasTooltip = currentBucket >= 0 && currentBucket < BUCKETS.length && tooltipPos;

  return (
    <div className="adapt-flow">
      {/* <CascadeBranches /> is now rendered inside .hero, anchored to the
          bottom of the adapt-flow card, so it sits visually on top of the
          dial-kit background and the locale-cascade section can hold only
          the locale strip / overlay / tooltip layer. See app/page.tsx. */}

      <div ref={stripRef} className="cascade-strip">
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
          {overlayPhase !== 'done' && (
            <div className={`cascade-overlay${overlayPhase === 'fading' ? ' is-fading' : ''}${overlayPhase === 'collapsing' ? ' is-collapsing' : ''}`}>
              <div className="cascade-loader">
                <SquareLoader finishing={loaderFinishing} />
                <p className="cascade-loader-text">{loadingText}</p>
              </div>
            </div>
          )}
          {sheenDone && (
            <div className="cascade-pills">
              <button
                className={`cascade-pill${manualBucket === -2 ? ' is-selected-all' : ''}`}
                onClick={() => handlePillClick(-2)}
              >
                All adaptations
              </button>
              <span className="cascade-pills-sep" />
              {BUCKETS.map((label, i) => (
                <button
                  key={i}
                  className={`cascade-pill${manualBucket === i ? ' is-selected' : currentBucket === i && manualBucket === null ? ' is-active' : ''}`}
                  data-bucket={i}
                  onClick={() => handlePillClick(i)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div
          className={'cascade-tooltip' + (hasTooltip && isActive ? ' is-visible' : '')}
          data-bucket={currentBucket >= 0 ? currentBucket : undefined}
          style={tooltipPos ? { left: tooltipPos.x, top: tooltipPos.y } : { left: 0, top: 0 }}
          aria-hidden={!hasTooltip}
        >
          {currentBucket >= 0 && currentBucket < BUCKETS.length ? BUCKETS[currentBucket] : ''}
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
          const hasEverCycled = effectiveSheenDone && (currentBucket >= 0 || currentBucket === -2);
          const isFocused = isActive && currentBucket === token.bucket;
          const shouldDim = cyclingStarted && !isFocused;
          const cls =
            (isHighlight
              ? 'locale-highlight' +
                (effectiveSheenDone ? ' is-highlighted' : '') +
                (hasEverCycled ? ' hl-settled' : '') +
                (cyclingStarted && isFocused ? ' is-active' : '') +
                (shouldDim ? ' is-dimmed' : '')
              : 'sheen-word' + (shouldDim ? ' text-dimmed' : '')) +
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

export function CascadeBranches() {
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
  const dotRef = useRef<SVGCircleElement>(null);
  const dotStoppedRef = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const handleScroll = () => {
      const rect = svg.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.5) {
        svg.classList.add('is-active');
        dotStoppedRef.current = true;
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    const dot = dotRef.current;
    if (!svg || !dot) return;

    let cancelled = false;

    const animateDot = (pathEl: SVGPathElement) => {
      const length = pathEl.getTotalLength();
      const duration = 1200;
      const start = performance.now();
      dot.setAttribute('opacity', '1');

      const step = (now: number) => {
        if (cancelled || dotStoppedRef.current) {
          dot.setAttribute('opacity', '0');
          return;
        }
        const t = Math.min((now - start) / duration, 1);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const pt = pathEl.getPointAtLength(eased * length);
        dot.setAttribute('cx', String(pt.x));
        dot.setAttribute('cy', String(pt.y));
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          dot.setAttribute('opacity', '0');
          if (!dotStoppedRef.current) {
            setTimeout(fireNext, 1000);
          }
        }
      };
      requestAnimationFrame(step);
    };

    const fireNext = () => {
      if (cancelled || dotStoppedRef.current) return;
      const paths = svg.querySelectorAll<SVGPathElement>('defs path');
      const idx = Math.floor(Math.random() * paths.length);
      animateDot(paths[idx]);
    };

    const t = setTimeout(fireNext, 500);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="cascade-branches"
      viewBox="0 0 1080 96"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {branches.map((d, i) => (
          <path key={`def-${i}`} id={`branch-path-${i}`} d={d} />
        ))}
      </defs>
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
      <g className="branch-dots">
        <circle ref={dotRef} r="1" fill="var(--scarlet)" opacity="0" />
      </g>
    </svg>
  );
}

