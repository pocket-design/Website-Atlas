'use client';

import { useState } from 'react';

type Lang = 'de' | 'fr' | 'es';

const TRANSLATIONS: Record<Lang, { flag: string; name: string; paras: string[] }> = {
  de: {
    flag: '🇩🇪',
    name: 'German',
    paras: [
      'In einer kleinen Küstenstadt, in der jeden Morgen der Nebel hereinrollte wie eine sanfte Erinnerung an die Anwesenheit des Meeres, lebte eine junge Leuchtturmwärterin namens Elara.',
      'Sie hatte den Leuchtturm von ihrer Großmutter geerbt — zusammen mit dessen altem Logbuch, voller Geschichten von Schiffen, die durch die dunkelsten Stürme sicher nach Hause geleitet wurden.',
    ],
  },
  fr: {
    flag: '🇫🇷',
    name: 'French',
    paras: [
      'Dans une petite ville côtière, où le brouillard se déposait chaque matin comme un doux rappel de la présence de la mer, vivait une jeune gardienne de phare nommée Elara.',
      "Elle avait hérité du phare de sa grand-mère, ainsi que de son ancien journal de bord, rempli d'histoires de navires guidés sains et saufs à travers les tempêtes les plus sombres.",
    ],
  },
  es: {
    flag: '🇪🇸',
    name: 'Spanish',
    paras: [
      'En un pequeño pueblo costero, donde la niebla rodaba cada mañana como un suave recordatorio de la presencia del mar, vivía una joven farera llamada Elara.',
      'Había heredado el faro de su abuela, junto con su antiguo cuaderno de bitácora, repleto de historias de barcos guiados a salvo a casa a través de las tormentas más oscuras.',
    ],
  },
};

const LANGS: Lang[] = ['de', 'fr', 'es'];

export default function TranslationWindow() {
  const [activeLang, setActiveLang] = useState<Lang>('de');
  const [adapted, setAdapted] = useState(false);
  const [pending, setPending] = useState(false);

  const onAdapt = () => {
    if (pending || adapted) return;
    setPending(true);
    setTimeout(() => {
      setAdapted(true);
      setPending(false);
    }, 600);
  };

  const targetClass = `tw-panel tw-target${adapted ? ' is-adapted' : ''}`;
  const buttonClass = `tw-translate${adapted ? ' is-done' : ''}`;
  const buttonLabel = pending ? 'Adapting…' : adapted ? '✓ Adapted' : 'Go global';

  const paras = TRANSLATIONS[activeLang].paras;

  return (
    <div className="tw-window" id="twWindow">
      <div className="tw-grid">
        {/* Source — original */}
        <div className="tw-panel tw-source">
          <div className="tw-head">
            <div className="tw-lang">
              <span className="tw-flag" aria-hidden="true">🇺🇸</span>
              <span className="tw-lang-name">English</span>
            </div>
            <span className="tw-tag">Original</span>
          </div>
          <div className="tw-body">
            <p>
              In a small coastal town, where the fog rolled in every morning like a gentle reminder
              of the sea&apos;s presence, lived a young lighthouse keeper named Elara.
            </p>
            <p>
              She had inherited the lighthouse from her grandmother, along with its ancient logbook
              filled with stories of ships guided safely home through the darkest storms.
            </p>
          </div>
          <div className="tw-foot">
            <span className="tw-meta">
              <span className="tw-num">247</span> words
            </span>
            <button
              type="button"
              className={buttonClass}
              onClick={onAdapt}
              disabled={pending || adapted}
            >
              {buttonLabel}
              {!pending && !adapted && <span aria-hidden="true">→</span>}
            </button>
          </div>
        </div>

        {/* Target — adapted */}
        <div className={targetClass} id="twTargetPanel">
          <div className="tw-head">
            <div className="tw-tabs" role="tablist" aria-label="Target language">
              {LANGS.map((lang) => {
                const t = TRANSLATIONS[lang];
                const on = lang === activeLang;
                return (
                  <button
                    key={lang}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    className={'tw-tab' + (on ? ' is-active' : '')}
                    onClick={() => setActiveLang(lang)}
                  >
                    <span className="tw-flag" aria-hidden="true">{t.flag}</span>
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="tw-body">
            {!adapted ? (
              <p className="tw-placeholder">
                Click <strong>Go global</strong> to see your story adapted for the selected market —
                not just in language, but in cultural texture.
              </p>
            ) : (
              paras.map((p, i) => (
                <p
                  key={`${activeLang}-${i}`}
                  className="tw-fade"
                  style={{ animationDelay: `${(i * 0.12).toFixed(2)}s` }}
                >
                  {p}
                </p>
              ))
            )}
          </div>
          <div className="tw-foot">
            <span className="tw-meta tw-status">
              {adapted ? 'Adapted' : 'Awaiting adaptation'}
            </span>
            <span className="tw-meta">Pocket Atlas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
