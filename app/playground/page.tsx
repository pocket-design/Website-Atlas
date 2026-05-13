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

function SourceLocaleSwitcher({ selected, onSelect }: {
  selected: typeof SOURCE_LOCALES[0];
  onSelect: (locale: typeof SOURCE_LOCALES[0]) => void;
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
              onClick={() => { onSelect(opt); setOpen(false); }}
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

function LocaleTab({ locale, isActive, onActivate, onClose }: {
  locale: typeof ALL_LOCALES[0];
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
}) {
  return (
    <div className={`locale-card-locale try-locale-chip${isActive ? ' is-active' : ''}`}>
      <button className="locale-picker-btn" onClick={onActivate}>
        <span className={`locale-flag fi fi-${locale.flag}`} aria-hidden="true" />
        <span className="locale-picker-name">{locale.label}</span>
      </button>
      <button
        className="try-locale-close-btn"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label={`Remove ${locale.label}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  );
}

function AddLocaleTabButton({ onClick, isActive }: { onClick: () => void; isActive: boolean }) {
  return (
    <div className={`locale-card-locale try-locale-chip try-locale-add-wrap${isActive ? ' is-active' : ''}`}>
      <button className="locale-picker-btn try-locale-add-btn" onClick={onClick} aria-label="Add locale">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden="true">
          <path d="M8 3v10M3 8h10" />
        </svg>
      </button>
    </div>
  );
}

function LocalePickerGrid({ exclude, onPick, title, wiggle }: {
  exclude: string[];
  onPick: (code: string) => void;
  title: string;
  wiggle?: boolean;
}) {
  const available = ALL_LOCALES.filter((l) => !exclude.includes(l.code));
  return (
    <div className="try-pick-locale">
      <p className={`try-pick-hint${wiggle ? ' is-wiggling' : ''}`}>{title}</p>
      <div className={`try-pick-grid${wiggle ? ' is-wiggling' : ''}`}>
        {available.map((opt) => (
          <button key={opt.code} className="try-pick-chip" onClick={() => onPick(opt.code)}>
            <span className={`locale-flag fi fi-${opt.flag}`} aria-hidden="true" />
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

type StorySample = { id: string; title: string; tag: string; chapters: string[] };

const SAMPLES_BY_LOCALE: Record<string, StorySample[]> = {
  en: [
    {
      id: 'coming-of-age',
      title: 'The corner store',
      tag: 'Coming-of-age',
      chapters: [
        `After class, Maya ducked into the corner store on Elm Street and picked up her grandmother's afternoon usual — a pack of biscuits and a carton of tea. The shopkeeper, Mr. Farhan, who had known three generations of the family, slid an extra packet of toffees across the counter without being asked.`,
        `Outside, the late afternoon rain hadn't quite let up, and Maya's bag thumped against her hip as she ran the four blocks home past St. Joseph's Church. The street smelled of wet asphalt and frying onions from Dev's cart near the intersection, and somewhere behind her a bicycle bell rang twice, impatient and sharp.`,
        `Her grandmother would already be on the porch, watching the road, ready to scold her for being late and then ask, in the same breath, whether she'd remembered the tea. Maya patted the warm packet inside her bag and slowed, just for a moment, to catch her breath before the gate.`,
      ],
    },
    {
      id: 'mystery',
      title: 'The 11:47',
      tag: 'Mystery',
      chapters: [
        `The 11:47 was eleven minutes late, which Inspector Halloway had come to expect from the Glenwood line and which gave him exactly enough time to finish the crossword and notice the woman in the green coat for the second night in a row.`,
        `She sat three benches down, same coat, same paperback held at the same angle — though tonight she wasn't turning the pages. Halloway folded the newspaper carefully, the way his father had taught him, and waited.`,
        `When the headlights finally cut around the bend, the woman did not look up. She did not, in fact, do anything at all. Halloway rose, crossed the platform toward her, one hand already inside his coat — and stopped two paces short when he saw what was in her lap.`,
      ],
    },
    {
      id: 'romance',
      title: 'Three conditions',
      tag: 'Romance',
      chapters: [
        `Priya had agreed to be her cousin's maid of honour on three conditions: no karaoke, no matchmaking aunties, and absolutely no Arjun. By the second day of the wedding, all three had been violated, and the karaoke wasn't even the worst of it.`,
        `He was leaning against the mandap now, suit jacket slung over one shoulder like he hadn't spent six years pretending she didn't exist. "You changed your hair," he said, as if that were a normal opening line at someone else's wedding.`,
        `Priya picked a marigold petal off her dupatta and considered, very seriously, walking into the sea. The aunties were watching. They were always watching. She gave him a smile that her grandmother would have called dangerous, and asked, very politely, what exactly he was doing here.`,
      ],
    },
  ],
  de: [
    {
      id: 'coming-of-age',
      title: 'Im Späti',
      tag: 'Coming-of-age',
      chapters: [
        `Nach dem Unterricht schlüpfte Lena in den Späti an der Lindenstraße und kaufte das Nachmittagsritual ihrer Oma — eine Packung Butterkekse und eine Flasche Apfelschorle.`,
        `Herr Yılmaz, der drei Generationen der Familie kannte, schob ihr ungefragt eine kleine Tüte Toffees über die Theke und brummte etwas über das Wetter.`,
        `Draußen hatte der späte Nieselregen noch nicht ganz aufgehört, und Lenas Tasche schlug gegen ihre Hüfte, als sie die vier Häuserblocks nach Hause rannte, vorbei an der alten Kirche und dem Bäckerladen.`,
      ],
    },
    {
      id: 'mystery',
      title: 'Die 23:47',
      tag: 'Mystery',
      chapters: [
        `Die 23:47 hatte elf Minuten Verspätung, was Kommissar Hallweger von der Glenwood-Linie inzwischen erwartete und ihm genau genug Zeit gab, das Kreuzworträtsel zu beenden.`,
        `Genug Zeit auch, die Frau im grünen Mantel zum zweiten Abend in Folge zu bemerken. Sie saß drei Bänke weiter, gleicher Mantel — doch heute blätterte sie keine Seite um.`,
        `Als die Scheinwerfer endlich um die Kurve schnitten, blickte die Frau nicht auf. Sie tat überhaupt nichts. Hallweger erhob sich langsam und ging über den Bahnsteig auf sie zu, eine Hand bereits in der Manteltasche.`,
      ],
    },
    {
      id: 'romance',
      title: 'Drei Bedingungen',
      tag: 'Romance',
      chapters: [
        `Lena hatte zugestimmt, Brautjungfer ihrer Cousine zu werden, unter drei Bedingungen: kein Karaoke, keine kuppelnden Tanten und absolut kein Stefan.`,
        `Am zweiten Hochzeitstag waren alle drei Bedingungen verletzt — und das Karaoke war nicht einmal das Schlimmste daran.`,
        `Er lehnte jetzt am Geländer, das Sakko über der Schulter, als hätte er nicht sechs Jahre lang so getan, als gäbe es sie nicht. "Du hast deine Haare verändert," sagte er, als wäre das eine normale Begrüßung auf der Hochzeit einer Fremden.`,
      ],
    },
  ],
  fr: [
    {
      id: 'coming-of-age',
      title: "L'épicerie du coin",
      tag: 'Coming-of-age',
      chapters: [
        `Après les cours, Camille poussa la porte de l'épicerie de la rue du Faubourg et prit le goûter habituel de sa mamie — un paquet de petits-beurre et un thé à la menthe.`,
        `Monsieur Belkacem, qui connaissait trois générations de la famille, fit glisser un sachet de caramels sur le comptoir sans qu'elle ait à demander, en marmonnant quelque chose sur la pluie.`,
        `Dehors, la pluie de fin d'après-midi n'avait pas tout à fait cessé, et Camille courut les quatre rues jusqu'à chez elle, le sac battant contre sa hanche, en passant devant la vieille église et la boulangerie.`,
      ],
    },
    {
      id: 'mystery',
      title: 'Le 23h47',
      tag: 'Mystery',
      chapters: [
        `Le 23h47 avait onze minutes de retard, ce que l'inspecteur Halloway avait fini par attendre de la ligne de Glenwood et qui lui laissait juste le temps de finir les mots croisés.`,
        `Assez de temps aussi pour remarquer la femme au manteau vert pour la deuxième soirée d'affilée. Elle était assise trois bancs plus loin, même manteau — mais ce soir, elle ne tournait aucune page.`,
        `Quand les phares découpèrent enfin le tournant, la femme ne leva pas les yeux. Elle ne fit, en fait, absolument rien. Halloway se leva lentement et traversa le quai vers elle, une main déjà glissée à l'intérieur de son manteau.`,
      ],
    },
    {
      id: 'romance',
      title: 'Trois conditions',
      tag: 'Romance',
      chapters: [
        `Camille avait accepté d'être demoiselle d'honneur à trois conditions : pas de karaoké, pas de tantes entremetteuses, et absolument pas d'Antoine.`,
        `Dès le deuxième jour du mariage, les trois conditions avaient été violées, et le karaoké n'était même pas le pire.`,
        `Il était adossé contre la balustrade, la veste sur l'épaule, comme s'il n'avait pas passé six ans à faire semblant qu'elle n'existait pas. "Tu as changé de coiffure," dit-il, comme si c'était une entrée en matière normale au mariage de quelqu'un d'autre.`,
      ],
    },
  ],
  es: [
    {
      id: 'coming-of-age',
      title: 'La tienda del barrio',
      tag: 'Coming-of-age',
      chapters: [
        `Después de clase, Lucía se metió en la tienda de barrio de la Calle Mayor y compró la merienda habitual de su abuela — un paquete de galletas María y un Cola Cao.`,
        `Don Paco, que conocía a tres generaciones de la familia, le deslizó un puñado de caramelos sobre el mostrador sin que ella tuviera que pedirlo, murmurando algo sobre la lluvia.`,
        `Afuera, la llovizna no había terminado del todo, y Lucía corrió las cuatro manzanas hasta casa con la mochila golpeándole la cadera, pasando por delante de la iglesia vieja y la panadería de la esquina.`,
      ],
    },
    {
      id: 'mystery',
      title: 'El 23:47',
      tag: 'Mystery',
      chapters: [
        `El 23:47 llevaba once minutos de retraso, algo que el inspector Halloway había llegado a esperar de la línea de Glenwood y que le daba el tiempo justo para terminar el crucigrama.`,
        `Tiempo suficiente también para reparar en la mujer del abrigo verde por segunda noche consecutiva. Estaba sentada tres bancos más allá, mismo abrigo — pero esta noche no pasaba ni una sola página.`,
        `Cuando los faros por fin recortaron la curva, la mujer no levantó la vista. No hizo, de hecho, absolutamente nada. Halloway se levantó despacio y cruzó el andén hacia ella, una mano ya dentro del abrigo.`,
      ],
    },
    {
      id: 'romance',
      title: 'Tres condiciones',
      tag: 'Romance',
      chapters: [
        `Lucía había aceptado ser dama de honor de su prima con tres condiciones: nada de karaoke, nada de tías casamenteras y, sobre todo, nada de Diego.`,
        `Para el segundo día de la boda, las tres condiciones habían sido violadas, y el karaoke ni siquiera era lo peor.`,
        `Él estaba apoyado en la barandilla, la chaqueta colgando del hombro como si no hubiera pasado seis años fingiendo que ella no existía. "Te has cortado el pelo," dijo, como si fuera un comienzo normal en la boda de otra persona.`,
      ],
    },
  ],
  it: [
    {
      id: 'coming-of-age',
      title: "L'alimentari",
      tag: 'Coming-of-age',
      chapters: [
        `Dopo la scuola, Giulia entrò nell'alimentari di Via dei Tigli e prese la merenda pomeridiana della nonna — un pacchetto di biscotti e un tè.`,
        `Il signor Ferrara, che conosceva tre generazioni della famiglia, le fece scivolare un pacchetto di caramelle sul bancone senza che lei dovesse chiederlo, borbottando qualcosa sulla pioggia.`,
        `Fuori, la pioggia del tardo pomeriggio non era ancora finita, e Giulia corse i quattro isolati fino a casa con la borsa che le batteva sul fianco, passando davanti alla vecchia chiesa e al forno.`,
      ],
    },
    {
      id: 'mystery',
      title: 'Le 23:47',
      tag: 'Mystery',
      chapters: [
        `Le 23:47 erano in ritardo di undici minuti, cosa che l'ispettore Halloway ormai si aspettava dalla linea di Glenwood e che gli dava esattamente il tempo di finire il cruciverba.`,
        `Tempo sufficiente anche per notare la donna con il cappotto verde per la seconda sera di fila. Era seduta tre panche più in là, stesso cappotto — ma stasera non girava nemmeno una pagina.`,
        `Quando i fari finalmente tagliarono la curva, la donna non alzò lo sguardo. Non fece, in effetti, assolutamente nulla. Halloway si alzò lentamente e attraversò il binario verso di lei, una mano già infilata nel cappotto.`,
      ],
    },
    {
      id: 'romance',
      title: 'Tre condizioni',
      tag: 'Romance',
      chapters: [
        `Giulia aveva accettato di fare la damigella d'onore di sua cugina a tre condizioni: niente karaoke, niente zie combina-matrimoni e, soprattutto, niente Marco.`,
        `Al secondo giorno del matrimonio, tutte e tre erano state infrante — e il karaoke non era nemmeno il peggio.`,
        `Lui era appoggiato alla balaustra, la giacca sulla spalla, come se non avesse passato sei anni a fingere che lei non esistesse. "Ti sei cambiata i capelli," disse, come se fosse un'apertura normale al matrimonio di qualcun altro.`,
      ],
    },
  ],
  in: [
    {
      id: 'coming-of-age',
      title: 'किराना दुकान',
      tag: 'Coming-of-age',
      chapters: [
        `स्कूल के बाद, प्रिया गली के मोड़ पर वाली किराना दुकान में घुसी और नानी की दोपहर की आदत उठाई — पारले-जी का पैकेट और चाय पत्ती।`,
        `शर्मा अंकल, जो तीन पीढ़ियों से परिवार को जानते थे, बिना कुछ कहे एक टॉफी का पैकेट काउंटर पर सरका दिया, बारिश के बारे में कुछ बुदबुदाते हुए।`,
        `बाहर शाम की बारिश अभी पूरी तरह नहीं रुकी थी, और प्रिया का बैग कूल्हे से टकराते हुए वह चार ब्लॉक दूर घर तक भागती चली गई, पुराने मंदिर और गली के नुक्कड़ की चाय की दुकान को पार करते हुए।`,
      ],
    },
    {
      id: 'mystery',
      title: '11:47 की लोकल',
      tag: 'Mystery',
      chapters: [
        `11:47 की लोकल ग्यारह मिनट लेट थी, जैसा कि इंस्पेक्टर हलवाई को अब ग्लेनवुड लाइन से उम्मीद थी, और इससे उन्हें ठीक उतना समय मिल जाता था कि वे क्रॉसवर्ड पूरा कर सकें।`,
        `और इतना समय भी कि वे हरे कोट वाली महिला को लगातार दूसरी रात देख सकें। वह तीन बेंच दूर बैठी थी, वही कोट — मगर आज रात उसने एक पन्ना भी नहीं पलटा।`,
        `जब हेडलाइट्स ने आखिरकार मोड़ काटा, महिला ने ऊपर नहीं देखा। दरअसल, उसने कुछ भी नहीं किया। हलवाई धीरे से उठे और प्लेटफॉर्म पार करके उसकी ओर बढ़े, एक हाथ पहले से कोट के अंदर।`,
      ],
    },
    {
      id: 'romance',
      title: 'तीन शर्तें',
      tag: 'Romance',
      chapters: [
        `प्रिया ने कज़न की शादी में दुल्हन की सहेली बनने पर तीन शर्तें रखी थीं: न कराओके, न रिश्ता तय करने वाली बुआएं, और बिल्कुल भी अर्जुन नहीं।`,
        `शादी के दूसरे ही दिन तीनों शर्तें टूट चुकी थीं — और कराओके तो सबसे कम बुरी बात थी।`,
        `वह अब मंडप के पास खड़ा था, सूट का कोट कंधे पर लटका हुआ, जैसे उसने पिछले छह साल यह दिखावा न किया हो कि वह उसे जानता ही नहीं। "तूने बाल बदले हैं," उसने कहा, जैसे किसी और की शादी में यह कोई आम बात हो।`,
      ],
    },
  ],
  ta: [
    {
      id: 'coming-of-age',
      title: 'மளிகைக்கடை',
      tag: 'Coming-of-age',
      chapters: [
        `வகுப்பு முடிந்ததும், மாயா அண்ணா சாலையில் உள்ள மளிகைக்கடைக்குள் நுழைந்து பாட்டியின் மதிய பழக்கத்தை எடுத்தாள் — ஒரு பிஸ்கட் பாக்கெட் மற்றும் டீ.`,
        `முருகன் அண்ணா, மூன்று தலைமுறை குடும்பத்தை அறிந்தவர், கேட்காமலேயே ஒரு டாஃபி பாக்கெட்டை கவுன்டர் மீது நகர்த்தினார், மழையைப் பற்றி ஏதோ முணுமுணுத்தபடி.`,
        `வெளியே மாலை மழை இன்னும் முழுமையாக நிற்கவில்லை, மாயா தன் பையை இடுப்பில் தாக்கிக் கொண்டே நான்கு தெருக்கள் தாண்டி வீட்டை நோக்கி ஓடினாள், பழைய கோயிலையும் மூலையில் உள்ள டீக் கடையையும் கடந்து.`,
      ],
    },
    {
      id: 'mystery',
      title: '11:47 இரயில்',
      tag: 'Mystery',
      chapters: [
        `11:47 இரயில் பதினொரு நிமிடம் தாமதம், க்ளென்வுட் வழியில் இன்ஸ்பெக்டர் ஹால்வே இதை எதிர்பார்க்கத் தொடங்கியிருந்தார்.`,
        `குறுக்கெழுத்தை முடித்து, பச்சைக் கோட் அணிந்த அந்தப் பெண்ணை இரண்டாவது இரவாக கவனிக்க இது சரியான நேரம். அவள் மூன்று பெஞ்ச் தள்ளி அமர்ந்திருந்தாள், அதே கோட் — ஆனால் இன்றிரவு ஒரு பக்கமும் திருப்பவில்லை.`,
        `விளக்குகள் இறுதியாக வளைவைச் சுற்றியபோது, அந்தப் பெண் தலையை உயர்த்தவில்லை. உண்மையில் அவள் எதையும் செய்யவில்லை. ஹால்வே மெதுவாக எழுந்து, ஒரு கையை ஏற்கனவே கோட்டிற்குள் வைத்துக் கொண்டு, தளத்தைக் கடந்து அவளை நோக்கி நகர்ந்தார்.`,
      ],
    },
    {
      id: 'romance',
      title: 'மூன்று நிபந்தனைகள்',
      tag: 'Romance',
      chapters: [
        `மாயா தன் சகோதரியின் திருமணத்தில் தோழியாக இருக்க மூன்று நிபந்தனைகளை வைத்திருந்தாள்: காராஓகே இல்லை, பெண் பார்க்கும் சித்திகள் இல்லை, மற்றும் முற்றிலும் அர்ஜுன் இல்லை.`,
        `திருமணத்தின் இரண்டாவது நாளுக்குள், மூன்றும் மீறப்பட்டன — காராஓகே என்பது அதில் மிகச் சிறிய பிரச்சினையாக இருந்தது.`,
        `அவன் இப்போது மண்டபத்துக்கு அருகே சாய்ந்து நின்றிருந்தான், சூட்டின் கோட் ஒரு தோளில் தொங்கியபடி, கடந்த ஆறு வருடங்கள் அவளை அறியாதது போல் நடித்திராதது போல. "உன் தலைமுடியை மாற்றியிருக்கிறாய்," என்றான், அது வேறு யாரோ ஒருவரின் திருமணத்தில் ஒரு சாதாரண தொடக்க வரி போல.`,
      ],
    },
  ],
  jp: [
    {
      id: 'coming-of-age',
      title: 'コンビニにて',
      tag: 'Coming-of-age',
      chapters: [
        `授業の後、舞は桜通りのコンビニに立ち寄り、おばあちゃんの午後の定番を買った——おせんべいと緑茶。`,
        `三世代にわたって家族を知っている店主の田中のおじさんは、頼まれてもいないのに、キャンディの袋をカウンター越しにそっと差し出した。雨について何かをつぶやきながら。`,
        `外では、夕方の雨がまだ完全には止んでおらず、舞はカバンを腰に打ちつけながら、古いお寺と角の和菓子屋を通り過ぎ、四ブロック先の家まで走った。`,
      ],
    },
    {
      id: 'mystery',
      title: '11時47分の電車',
      tag: 'Mystery',
      chapters: [
        `11時47分の電車は十一分遅れていた——ハロウェイ刑事がグレンウッド線から予期するようになったことだ。クロスワードを終えるのにちょうど十分な時間だった。`,
        `緑のコートの女性に二晩連続で気づくのにも十分な時間だった。彼女は三つ向こうのベンチに座っていた、同じコート——だが今夜、彼女はページをめくっていなかった。`,
        `ヘッドライトがついにカーブを切ったとき、女性は顔を上げなかった。実のところ、何もしなかった。ハロウェイはゆっくりと立ち上がり、片手をすでにコートの中に入れたまま、彼女に向かってホームを横切った。`,
      ],
    },
    {
      id: 'romance',
      title: '三つの条件',
      tag: 'Romance',
      chapters: [
        `舞は従姉妹の結婚式でブライズメイドを務めることに三つの条件で同意した:カラオケなし、お見合いおばさんなし、そして絶対に健太なし。`,
        `結婚式の二日目までに、三つすべてが破られていた——そしてカラオケは一番ましな方だった。`,
        `彼は今、欄干に寄りかかっていた、上着を肩にかけて、まるで六年間彼女が存在しないふりをしていなかったかのように。「髪型変えたね」と彼は言った、まるで他人の結婚式での普通の挨拶であるかのように。`,
      ],
    },
  ],
  nl: [
    {
      id: 'coming-of-age',
      title: 'De buurtwinkel',
      tag: 'Coming-of-age',
      chapters: [
        `Na de les dook Fleur de buurtwinkel op de Lindelaan in en haalde de middagboodschappen van haar oma — een pak stroopwafels en een doos thee.`,
        `Meneer De Vries, die drie generaties van de familie kende, schoof zonder gevraagd te worden een extra zakje toffees over de toonbank en mompelde iets over de regen.`,
        `Buiten was de motregen nog niet helemaal opgehouden, en Fleur rende met haar tas tegen haar heup bonkend de vier straten naar huis, langs de oude kerk en de bakker op de hoek.`,
      ],
    },
    {
      id: 'mystery',
      title: 'De 23:47',
      tag: 'Mystery',
      chapters: [
        `De 23:47 had elf minuten vertraging, wat rechercheur Halloway inmiddels van de Glenwood-lijn was gaan verwachten en wat hem precies genoeg tijd gaf om het kruiswoordraadsel af te maken.`,
        `Genoeg tijd ook om de vrouw in de groene jas voor de tweede nacht op rij op te merken. Vanavond sloeg ze echter geen enkele bladzijde om.`,
        `Toen de koplampen eindelijk de bocht aansneden, keek de vrouw niet op. Ze deed eigenlijk helemaal niets. Halloway stond langzaam op en stak het perron over, een hand al binnen zijn jas.`,
      ],
    },
    {
      id: 'romance',
      title: 'Drie voorwaarden',
      tag: 'Romance',
      chapters: [
        `Fleur had ermee ingestemd bruidsmeisje van haar nicht te worden op drie voorwaarden: geen karaoke, geen koppel-tantes, en absoluut geen Lars.`,
        `Op de tweede dag van de bruiloft waren alle drie geschonden — en de karaoke was nog niet eens het ergste.`,
        `Hij leunde nu tegen de balustrade, zijn jasje over zijn schouder, alsof hij niet zes jaar had gedaan alsof ze niet bestond. "Je hebt je haar veranderd," zei hij, alsof dat een normale openingszin was op het bruiloft van iemand anders.`,
      ],
    },
  ],
  br: [
    {
      id: 'coming-of-age',
      title: 'O mercadinho',
      tag: 'Coming-of-age',
      chapters: [
        `Depois da aula, Mariana entrou no mercadinho da Rua das Flores e pegou as compras vespertinas da avó — um pacote de biscoitos Maria e uma garrafa de Guaraná.`,
        `Seu Antônio, que conhecia três gerações da família, empurrou um pacote extra de balas pelo balcão sem que ela precisasse pedir, resmungando alguma coisa sobre a chuva.`,
        `Lá fora, a garoa do fim de tarde ainda não havia parado, e Mariana correu as quatro quadras até em casa com a bolsa batendo no quadril, passando pela igreja antiga e a padaria da esquina.`,
      ],
    },
    {
      id: 'mystery',
      title: 'O 23h47',
      tag: 'Mystery',
      chapters: [
        `O 23h47 estava com onze minutos de atraso, algo que o inspetor Halloway já esperava da linha Glenwood e que lhe dava exatamente o tempo de terminar as palavras cruzadas.`,
        `Tempo suficiente também para reparar na mulher do casaco verde pela segunda noite seguida. Hoje, no entanto, ela não virava nenhuma página.`,
        `Quando os faróis finalmente cortaram a curva, a mulher não levantou os olhos. Não fez, na verdade, absolutamente nada. Halloway se levantou devagar e atravessou a plataforma em direção a ela, uma mão já dentro do casaco.`,
      ],
    },
    {
      id: 'romance',
      title: 'Três condições',
      tag: 'Romance',
      chapters: [
        `Mariana havia concordado em ser madrinha da prima com três condições: nada de karaokê, nada de tias casamenteiras e, definitivamente, nada de Rafael.`,
        `No segundo dia de casamento, todas as três haviam sido violadas — e o karaokê nem era o pior.`,
        `Ele estava encostado na grade, o paletó pendurado no ombro, como se não tivesse passado seis anos fingindo que ela não existia. "Mudou o cabelo," disse ele, como se fosse uma abertura normal no casamento de outra pessoa.`,
      ],
    },
  ],
};

function SamplePicker({ onPick, samples }: { onPick: (sample: StorySample) => void; samples: StorySample[] }) {
  return (
    <div className="try-samples">
      <div className="try-or-divider" aria-hidden="true">
        <span>or pick a sample</span>
      </div>
      <div className="try-sample-deck">
        {samples.map((s, i) => (
          <button
            key={s.id}
            className="try-sample-card"
            data-pos={i === 0 ? 'left' : i === samples.length - 1 ? 'right' : 'center'}
            onClick={() => onPick(s)}
          >
            <span className="try-sample-tag">{s.tag}</span>
            <span className="try-sample-title">{s.title}</span>
            <span className="try-sample-preview">{s.chapters.join(' ')}</span>
            <span className="try-sample-fade" aria-hidden="true" />
          </button>
        ))}
      </div>
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

const CHAPTER_CHAR_LIMIT = 2000;

function ChapterEditor({ chapters, onChange, onAddChapter, onDeleteChapter }: {
  chapters: Chapter[];
  onChange: (chapters: Chapter[]) => void;
  onAddChapter: () => void;
  onDeleteChapter: (id: number, idx: number) => void;
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

  return (
    <div className="chapter-editor">
      {chapters.map((ch, idx) => {
        const isLast = idx === chapters.length - 1;
        const charCount = ch.content.length;
        const overLimit = charCount > CHAPTER_CHAR_LIMIT;
        return (
          <div key={ch.id} className={`chapter-block${overLimit ? ' is-over-limit' : ''}`} ref={isLast ? lastChapterRef : undefined}>
            <div className="chapter-header">
              <span className="chapter-title">
                Chapter {idx + 1}
                {(overLimit || charCount > CHAPTER_CHAR_LIMIT * 0.9) && (
                  <span className={`chapter-count${overLimit ? ' is-over' : ' is-near'}`}>
                    ({charCount.toLocaleString()} / {CHAPTER_CHAR_LIMIT.toLocaleString()})
                  </span>
                )}
              </span>
              <div className="chapter-actions">
                {idx === 0 ? (
                  <Tooltip label="Clear chapter">
                    <button
                      className="icon-btn-tertiary"
                      onClick={() => updateContent(ch.id, '')}
                      aria-label="Clear chapter"
                      disabled={ch.content.length === 0}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                        <path d="M4 4l8 8M12 4l-8 8" />
                      </svg>
                    </button>
                  </Tooltip>
                ) : (
                  <Tooltip label="Delete chapter">
                    <button
                      className="icon-btn-tertiary"
                      onClick={() => onDeleteChapter(ch.id, idx)}
                      aria-label="Delete chapter"
                    >
                      <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2.5 3.5h9M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M11 3.5l-.5 8a1 1 0 01-1 1h-5a1 1 0 01-1-1l-.5-8M5.5 6v4M8.5 6v4" />
                      </svg>
                    </button>
                  </Tooltip>
                )}
                {isLast && (
                  <Tooltip label="Add chapter">
                    <button
                      className="icon-btn-tertiary chapter-add-inline"
                      onClick={onAddChapter}
                      aria-label="Add chapter"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                        <path d="M8 3v10M3 8h10" />
                      </svg>
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
            <textarea
              ref={isLast ? lastTextareaRef : undefined}
              className={`try-textarea chapter-textarea${overLimit ? ' is-over-limit' : ''}`}
              placeholder={idx === 0 ? 'Write your story here, or paste something...' : `Write chapter ${idx + 1} here...`}
              value={ch.content}
              onChange={(e) => updateContent(ch.id, e.target.value)}
            />
            {overLimit && (
              <p className="chapter-error" role="alert">
                Chapter exceeds the {CHAPTER_CHAR_LIMIT.toLocaleString()}-character limit by {(charCount - CHAPTER_CHAR_LIMIT).toLocaleString()}. Trim it down to adapt.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ChapterOutput({ chapterResults }: {
  chapterResults: ChapterResult[];
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
          </div>
          <div className="chapter-result-text">
            {cr.status === 'pending' ? null : cr.text}
          </div>
        </div>
      ))}
    </div>
  );
}

const ADAPT_FREE_LIMIT = 10;

export default function TryPage() {
  const [chapters, setChapters] = useState<Chapter[]>([{ id: 1, content: '' }]);
  const [sourceLocale, setSourceLocale] = useState(SOURCE_LOCALES[0]);
  const [selectedLocales, setSelectedLocales] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [pickingLocale, setPickingLocale] = useState(false);
  const [isAdapting, setIsAdapting] = useState(false);
  const [results, setResults] = useState<Record<string, ChapterResult[]>>({});
  const [showTweak, setShowTweak] = useState(false);
  const [lastAdaptedSource, setLastAdaptedSource] = useState<string>('');
  const [adaptCount, setAdaptCount] = useState(0);
  const [showRateLimit, setShowRateLimit] = useState(false);
  const [wiggleKey, setWiggleKey] = useState(0);
  const [adaptingMode, setAdaptingMode] = useState<'adapting' | 'regenerating' | 'updating' | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('atlas_adapt_count');
    if (stored) setAdaptCount(Number(stored) || 0);
  }, []);

  const hasAdapted = Object.values(results).some((arr) => arr.some((r) => r.status === 'done'));

  const currentSamples = SAMPLES_BY_LOCALE[sourceLocale.code] || SAMPLES_BY_LOCALE.en;

  const totalSource = chapters.map((c) => c.content).join('\n');
  const totalSourceWords = totalSource.trim() ? totalSource.trim().split(/\s+/).length : 0;
  const hasOverLimitChapter = chapters.some((c) => c.content.length > CHAPTER_CHAR_LIMIT);

  const activeResults = activeTab ? (results[activeTab] || []) : [];
  const totalResultText = activeResults.map((r) => r.text).join('\n');
  const totalResultWords = totalResultText.trim() ? totalResultText.trim().split(/\s+/).length : 0;
  const hasAnyResult = activeResults.some((r) => r.status === 'done');
  const showSamples = chapters.length === 1 && chapters[0].content.trim() === '';
  const showLocalePicker = selectedLocales.length === 0 || pickingLocale;
  const MAX_LOCALES = 3;

  const handlePickLocale = (code: string) => {
    setSelectedLocales((prev) => (prev.includes(code) ? prev : [...prev, code]));
    setActiveTab(code);
    setPickingLocale(false);
  };

  const handlePickSample = (sample: StorySample) => {
    const next = sample.chapters.map((content, i) => ({ id: i + 1, content }));
    setChapters(next);
    nextChapterId = next.length + 1;
    if (selectedLocales.length === 0) {
      setWiggleKey((k) => k + 1);
    }
  };

  const handleResetAll = () => {
    setChapters([{ id: 1, content: '' }]);
    nextChapterId = 2;
    setResults({});
    setIsAdapting(false);
    setAdaptingMode(null);
    setLastAdaptedSource('');
  };

  const handleDeleteChapter = (id: number, idx: number) => {
    if (chapters.length <= 1) return;
    setChapters((prev) => prev.filter((ch) => ch.id !== id));
    setResults((prev) => {
      const next: Record<string, ChapterResult[]> = {};
      Object.keys(prev).forEach((code) => {
        next[code] = prev[code].filter((_, i) => i !== idx);
      });
      return next;
    });
  };

  const sourceChanged = hasAdapted && lastAdaptedSource !== '' && lastAdaptedSource !== totalSource;
  const hasUnadaptedLocale = selectedLocales.some((c) => !(results[c]?.length));
  const adaptLabel = !hasAdapted
    ? 'Adapt'
    : sourceChanged
      ? 'Update'
      : hasUnadaptedLocale
        ? 'Adapt'
        : 'Regenerate';
  const adaptingLabel = adaptingMode === 'updating'
    ? 'Updating...'
    : adaptingMode === 'regenerating'
      ? 'Regenerating...'
      : 'Adapting...';

  const handleAdapt = () => {
    if (!totalSource.trim() || isAdapting || selectedLocales.length === 0 || hasOverLimitChapter) return;
    if (adaptCount >= ADAPT_FREE_LIMIT) {
      setShowRateLimit(true);
      return;
    }

    const mode: 'adapting' | 'regenerating' | 'updating' = sourceChanged
      ? 'updating'
      : (hasAdapted && !hasUnadaptedLocale)
        ? 'regenerating'
        : 'adapting';

    const needsFullRerun = sourceChanged || !hasAdapted || !hasUnadaptedLocale;
    const targetLocales = needsFullRerun
      ? selectedLocales
      : selectedLocales.filter((c) => !(results[c]?.length));
    if (targetLocales.length === 0) return;

    setIsAdapting(true);
    setAdaptingMode(mode);
    setLastAdaptedSource(totalSource);

    const newCount = adaptCount + 1;
    setAdaptCount(newCount);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('atlas_adapt_count', String(newCount));
    }

    setResults((prev) => {
      const next = { ...prev };
      targetLocales.forEach((code) => {
        next[code] = chapters.map(() => ({ status: 'pending' as const, text: '' }));
      });
      return next;
    });

    const chapterCount = chapters.length;
    targetLocales.forEach((code) => {
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
          const isLastLocale = code === targetLocales[targetLocales.length - 1];
          if (isLastChapter && isLastLocale) {
            setIsAdapting(false);
            setAdaptingMode(null);
          }
        }, doneDelay);
      });
    });
  };

  return (
    <>
      <NavBar centerLabel="Try out Atlas" ctaLabel="Learn more" ctaHref="/" />
      <main className="try-page">
        <div className="try-container">
        <div className="try-split">
          {/* Left: Source */}
          <div className="try-pane try-pane-source">
            <div className="try-pane-header">
              <div className="try-locale-chips">
                <SourceLocaleSwitcher selected={sourceLocale} onSelect={setSourceLocale} />
              </div>
            </div>
            <div className="try-pane-body">
              <ChapterEditor
                chapters={chapters}
                onChange={setChapters}
                onAddChapter={() => setChapters((prev) => [...prev, { id: nextChapterId++, content: '' }])}
                onDeleteChapter={handleDeleteChapter}
              />
              {showSamples && <SamplePicker onPick={handlePickSample} samples={currentSamples} />}
            </div>
          </div>

          {/* Right: Target */}
          <div className="try-pane try-pane-target">
            <div className="try-pane-header">
              <div className="try-locale-chips">
                {selectedLocales.map((code) => {
                  const locale = ALL_LOCALES.find((l) => l.code === code)!;
                  return (
                    <LocaleTab
                      key={code}
                      locale={locale}
                      isActive={activeTab === code && !pickingLocale}
                      onActivate={() => { setActiveTab(code); setPickingLocale(false); }}
                      onClose={() => {
                        setSelectedLocales((prev) => {
                          const next = prev.filter((c) => c !== code);
                          if (activeTab === code) {
                            setActiveTab(next[0] ?? '');
                          }
                          return next;
                        });
                        setResults((prev) => {
                          const next = { ...prev };
                          delete next[code];
                          return next;
                        });
                      }}
                    />
                  );
                })}
                {selectedLocales.length < MAX_LOCALES && selectedLocales.length > 0 && (
                  <AddLocaleTabButton
                    isActive={pickingLocale}
                    onClick={() => setPickingLocale((v) => !v)}
                  />
                )}
              </div>
            </div>
            <div className={`try-pane-body try-pane-output${hasAnyResult && !showLocalePicker ? ' has-result' : ''}`}>
              {showLocalePicker ? (
                <LocalePickerGrid
                  key={wiggleKey}
                  exclude={selectedLocales}
                  onPick={handlePickLocale}
                  title={selectedLocales.length === 0 ? 'Pick a locale to adapt to' : 'Try adaption for another locale'}
                  wiggle={wiggleKey > 0 && selectedLocales.length === 0}
                />
              ) : isAdapting && !hasAnyResult ? (
                <div className="try-loading">
                  <SquareLoader finishing={false} />
                  <p className="try-loading-text">Adapting your story...</p>
                </div>
              ) : activeResults.length > 0 ? (
                <ChapterOutput chapterResults={activeResults} />
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
            </div>
            {!(chapters.length === 1 && chapters[0].content.length === 0 && !hasAdapted) && (
              <button
                className="btn-secondary try-clear-btn"
                onClick={handleResetAll}
                disabled={isAdapting}
              >
                Clear all
              </button>
            )}
            {selectedLocales.length > 0 && (
              <button
                className={`${hasAdapted ? 'btn-secondary' : 'btn-brand'} try-adapt-btn`}
                disabled={!totalSource.trim() || isAdapting || hasOverLimitChapter}
                onClick={handleAdapt}
              >
                {isAdapting
                  ? adaptingLabel
                  : adaptLabel === 'Regenerate' || adaptLabel === 'Update' ? (
                      <>{adaptLabel} <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg></>
                    ) : adaptLabel}
              </button>
            )}
          </div>
          <div className="try-action-half try-action-right">
            <div className="try-action-meta">
              <span className="try-meta-item">{totalResultWords} words</span>
            </div>
            {hasAnyResult && (
              <>
                <button className="btn-secondary" onClick={() => setShowTweak(true)}>
                  Change mappings
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
      {showRateLimit && <RateLimitModal onClose={() => setShowRateLimit(false)} />}
    </>
  );
}

function RateLimitModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="tweak-overlay rate-limit-overlay" onClick={onClose}>
      <div className="tweak-modal rate-limit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rate-limit-body">
          <h2 className="rate-limit-title">You&apos;ve hit the free demo limit</h2>
          <p className="rate-limit-subtitle">
            You&apos;ve run {ADAPT_FREE_LIMIT} adaptations on this device. Create an account to keep adapting, save your work, and use the full Atlas API.
          </p>
          <div className="rate-limit-actions">
            <button className="btn-secondary" onClick={onClose}>Maybe later</button>
            <a className="btn-brand" href="/signin">Log in / Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
}
