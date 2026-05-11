/**
 * Maps ISO 3166-1 numeric country code → native script character string.
 * Countries not listed fall back to Latin.
 */

const LATIN     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const CYRILLIC  = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя';
const ARABIC    = 'ابتثجحخدذرزسشصضطظعغفقكلمنهويءإأآةى';
const DEVANAGARI= 'अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह';
const BENGALI   = 'অআইঈউঊএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ';
const HANZI     = '你好世界天月日山水火土木金中国家爱学永和平人心春夏秋冬風雨雪花鳥龍';
const HIRAGANA  = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
const KATAKANA  = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const HANGUL    = '가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허고노도로모보소오조초코토포호';
const THAI      = 'กขคงจฉชซญดตถทธนบปผพฟภมยรลวสหอฮ';
const LAO       = 'ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອ';
const KHMER     = 'កខគឃងចឆជឈញដឋឌឍណតថទធនបផពភមយរលវសហ';
const MYANMAR   = 'ကခဂဃငစဆဇဈညဋဌဍဎဏတထဒဓနနပဖဗဘမယရလဝသဟဠ';
const HEBREW    = 'אבגדהוזחטיכלמנסעפצקרשת';
const GREEK     = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω';
const GEORGIAN  = 'აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ';
const ARMENIAN  = 'ԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖ';
const TAMIL     = 'அஆஇஈඋஊஎஏஐஒஓஔகஙசஞடணதநபமயரலவழளறன';
const SINHALA   = 'අආඇඈඉඊඋඌඑඒඓඔඕඖකඛගඝචඡජඣටඨඩඪතථදධනපඵබභමයරලව';
const ETHIOPIC  = 'ሀለሐመሠረሰቀበተኀነአከወዐዘየደጀገጠጨጰጸፀፈፐ';
const TIBETAN   = 'ཀཁགངཅཆཇཉཏཐདནཔཕབམཙཚཛཝཞཟའཡརལཤསཧཨ';
const GUJARATI  = 'અઆઇઈઉઊએઐઓઔકખગઘચછજઝટઠડઢણતથદધનપફબભમ';
const TELUGU    = 'అఆఇఈఉఊఎఏఐఒఓఔకఖగఘచఛజఝటఠడఢణతథదధనపఫబభమయరలవ';
const KANNADA   = 'ಅಆಇಈಉಊಎಏಐಒಓಔಕಖಗಘಚಛಜಝಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಲವ';
const MALAYALAM = 'അആഇഈഉഊഎഏഐഒഓഔകഖഗഘചഛജഝടഠഡഢണതഥദധനപഫബഭമയരലവ';
const MONGOLIAN = 'ᠠᠡᠢᠣᠤᠥᠦᠧᠨᠩᠪᠫᠬᠭᠮᠯᠰᠱᠲᠳᠴᠵᠶᠷᠸᠹᠺᠻ';

// ISO numeric → character string
const MAP: Record<number, string> = {
  // ── Cyrillic ──────────────────────────────────────────────
  643: CYRILLIC,          // Russia
  804: CYRILLIC,          // Ukraine
  112: CYRILLIC,          // Belarus
  100: CYRILLIC,          // Bulgaria
  688: CYRILLIC,          // Serbia
  807: CYRILLIC,          // North Macedonia
  496: MONGOLIAN,         // Mongolia

  // ── Arabic ────────────────────────────────────────────────
  682: ARABIC,            // Saudi Arabia
  784: ARABIC,            // UAE
  818: ARABIC,            // Egypt
  504: ARABIC,            // Morocco
  788: ARABIC,            // Tunisia
  12:  ARABIC,            // Algeria
  434: ARABIC,            // Libya
  729: ARABIC,            // Sudan
  760: ARABIC,            // Syria
  368: ARABIC,            // Iraq
  400: ARABIC,            // Jordan
  422: ARABIC,            // Lebanon
  887: ARABIC,            // Yemen
  512: ARABIC,            // Oman
  634: ARABIC,            // Qatar
  48:  ARABIC,            // Bahrain
  414: ARABIC,            // Kuwait
  586: ARABIC,            // Pakistan  (Urdu)
  4:   ARABIC,            // Afghanistan (Dari/Pashto)
  706: ARABIC,            // Somalia
  478: ARABIC,            // Mauritania (partial)

  // ── Devanagari ────────────────────────────────────────────
  356: DEVANAGARI,        // India
  524: DEVANAGARI,        // Nepal

  // ── Bengali ───────────────────────────────────────────────
  50:  BENGALI,           // Bangladesh

  // ── Sinhala ───────────────────────────────────────────────
  144: SINHALA,           // Sri Lanka

  // ── CJK ───────────────────────────────────────────────────
  156: HANZI,             // China
  158: HANZI,             // Taiwan
  392: HIRAGANA + KATAKANA, // Japan
  410: HANGUL,            // South Korea
  408: HANGUL,            // North Korea

  // ── Southeast Asia ────────────────────────────────────────
  764: THAI,              // Thailand
  116: KHMER,             // Cambodia
  418: LAO,               // Laos
  104: MYANMAR,           // Myanmar

  // ── Hebrew ────────────────────────────────────────────────
  376: HEBREW,            // Israel

  // ── Greek ─────────────────────────────────────────────────
  300: GREEK,             // Greece
  196: GREEK,             // Cyprus

  // ── Caucasus ──────────────────────────────────────────────
  268: GEORGIAN,          // Georgia
  51:  ARMENIAN,          // Armenia

  // ── Ethiopic ──────────────────────────────────────────────
  231: ETHIOPIC,          // Ethiopia
  232: ETHIOPIC,          // Eritrea

  // ── Tibetan ───────────────────────────────────────────────
  64:  TIBETAN,           // Bhutan

  // ── Indic sub-scripts (Tamil, Telugu, Kannada, Malayalam) ─
  // India falls back to Devanagari above; these for reference

  // ── Latin (explicit, major) ───────────────────────────────
  840: LATIN, 124: LATIN, 484: LATIN, // USA, Canada, Mexico
  76:  LATIN, 32:  LATIN, 170: LATIN, 604: LATIN, 152: LATIN, // Brazil, Argentina, Colombia, Peru, Chile
  862: LATIN, 218: LATIN, 591: LATIN, 320: LATIN, 340: LATIN, // Venezuela, Ecuador, Panama, Guatemala, Honduras
  826: LATIN, 250: LATIN, 276: LATIN, 380: LATIN, 724: LATIN, // UK, France, Germany, Italy, Spain
  620: LATIN, 528: LATIN, 752: LATIN, 578: LATIN, 246: LATIN, // Portugal, Netherlands, Sweden, Norway, Finland
  208: LATIN, 372: LATIN, 56:  LATIN, 40:  LATIN, 756: LATIN, // Denmark, Ireland, Belgium, Austria, Switzerland
  616: LATIN, 203: LATIN, 348: LATIN, 642: LATIN, 703: LATIN, // Poland, Czech, Hungary, Romania, Slovakia
  191: LATIN, 705: LATIN, 70:  LATIN, 8:   LATIN, // Croatia, Slovenia, Bosnia, Albania
  233: LATIN, 428: LATIN, 440: LATIN, // Estonia, Latvia, Lithuania
  36:  LATIN, 554: LATIN, // Australia, New Zealand
  710: LATIN, 404: LATIN, 566: LATIN, 288: LATIN, // South Africa, Kenya, Nigeria, Ghana
  800: LATIN, 508: LATIN, 834: LATIN, 516: LATIN, // Uganda, Mozambique, Tanzania, Namibia
  360: LATIN, 458: LATIN, 608: LATIN, // Indonesia, Malaysia, Philippines
  702: HANZI + LATIN, // Singapore (bilingual)
};

const FALLBACK = LATIN;

/** Returns the native characters for a given ISO numeric country code. */
export function getCountryChars(id: number | string): string[] {
  const chars = MAP[Number(id)] ?? FALLBACK;
  return chars.split('');
}
