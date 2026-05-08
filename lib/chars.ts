// Multi-script character pool — every major living script we can fit
// so the globe and bento scenes read as "stories from everywhere".
export const MULTILINGUAL_CHARS: readonly string[] = (
  // Latin
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
  // Greek
  'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω' +
  // Cyrillic
  'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя' +
  // Armenian
  'ԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖ' +
  // Georgian
  'აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ' +
  // Hebrew
  'אבגדהוזחטיכלמנסעפצקרשת' +
  // Arabic
  'ابتثجحخدذرزسشصضطظعغفقكلمنهوي' +
  // Devanagari (Hindi, Sanskrit, Marathi)
  'अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह' +
  // Bengali
  'অআইঈউঊএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ' +
  // Gurmukhi (Punjabi)
  'ੳਅੲਸਹਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਵੜ' +
  // Gujarati
  'અઆઇઈઉઊએઐઓઔકખગઘચછજઝટઠડઢણતથદધનપફબભમયરલવશષસહ' +
  // Tamil
  'அஆஇஈஉஊஎஏஐஒஓஔகஙசஞடணதநபமயரலவழளறன' +
  // Telugu
  'అఆఇఈఉఊఎఏఐఒఓఔకఖగఘచఛజఝటఠడఢణతథదధనపఫబభమయరలవశషసహ' +
  // Kannada
  'ಅಆಇಈಉಊಎಏಐಒಓಔಕಖಗಘಚಛಜಝಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಲವಶಷಸಹ' +
  // Malayalam
  'അആഇഈഉഊഎഏഐഒഓഔകഖഗഘങചഛജഝഞടഠഡഢണതഥദധനപഫബഭമയരലവശഷസഹ' +
  // Sinhala
  'අආඇඈඉඊඋඌඑඒඓඔඕඖකඛගඝචඡජඣටඨඩඪණතථදධනපඵබභමයරලවශෂසහළ' +
  // Thai
  'กขคงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ' +
  // Lao
  'ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ' +
  // Khmer
  'កខគឃងចឆជឈញដឋឌឍណតថទធនបផពភមយរលវសហ' +
  // Tibetan
  'ཀཁགངཅཆཇཉཏཐདནཔཕབམཙཚཛཝཞཟའཡརལཤསཧཨ' +
  // Hanzi (Chinese, Kanji)
  '你好世界天月日山水火土木金中国家爱学永和平人心春夏秋冬風雨雪花鳥' +
  // Hiragana (Japanese)
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん' +
  // Katakana (Japanese)
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  // Hangul (Korean)
  '가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허고노도로모보소오조초코토포호' +
  // Ethiopic (Amharic)
  'ሀለሐመሠረሰቀበተኀነአከወዐዘየደጀገጠጨጰጸፀፈፐ' +
  // Cherokee
  'ᎠᎡᎢᎣᎤᎥᎦᎧᎨᎩᎪᎫᎬᎭᎮᎯᎰᎱᎲᎳᎴᎵᎶᎷᎸᎹᎺᎻᎼᎽᎾᎿ'
).split('');

export const pickChar = (): string =>
  MULTILINGUAL_CHARS[(Math.random() * MULTILINGUAL_CHARS.length) | 0];
