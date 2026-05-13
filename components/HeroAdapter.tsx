'use client';

/**
 * HeroAdapter — typewriter demo card pulled from the `hardik` branch.
 *
 *  • Renders the full English DEMO_STORY in a centered 640px card.
 *  • Words start transparent and fade in one-by-one (45ms → 10ms,
 *    accelerating across the run).
 *  • Below the card a primary scarlet pill ("Adapt the story") scrolls
 *    smoothly to the Atlas Bento section (the closest analog on main
 *    of hardik's #locale-cascade fold).
 *
 * Source: hardik branch, components/AdaptationFlow.tsx :: HeroAdapter().
 * Differences from upstream:
 *   – DEMO_STORY is inlined (no @/lib/locales dependency)
 *   – Scroll target swapped from #locale-cascade → .atlas-bento
 *   – Tokens referenced in CSS map to main's design system aliases
 */

import { Fragment, useEffect, useRef, useState } from 'react';

const DEMO_STORY = `After class, Maya ducked into the corner store on Elm Street and picked up her grandmother's afternoon usual, a pack of biscuits and a carton of tea. The shopkeeper, Mr. Farhan, who had known three generations of the family, slid an extra packet of toffees across the counter without being asked. Outside, the late afternoon rain hadn't quite let up, and Maya's bag thumped against her hip as she ran the four blocks home past St. Joseph's Church. The street smelled of wet asphalt and frying onions from Dev's cart near the intersection, and somewhere behind her a bicycle bell rang twice, impatient and sharp. She cut through the narrow lane between old Ramesh's tailor shop and the Sullivan & Sons printing press, stepping over a puddle that had been there since monsoon began. Her grandmother Nani would already be on the porch, watching the road, ready to scold her for being late and then ask, in the same breath, whether she'd remembered the tea.`;

export default function HeroAdapter() {
  const [revealedWords, setRevealedWords] = useState(0);
  const [done, setDone] = useState(false);
  const words = useRef(DEMO_STORY.split(/(\s+)/)).current;
  const totalWords = useRef(
    words.filter((w) => !/^\s+$/.test(w)).length,
  ).current;

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
      // 45ms → ~10ms across the run — gentle acceleration
      const delay = Math.max(10, 45 * (1 - progress * 0.85));
      setTimeout(reveal, delay);
    };

    reveal();
    return () => {
      cancelled = true;
    };
  }, [totalWords]);

  let wordCounter = 0;

  return (
    <div className="adapt-flow">
      <div className="adapt-input">
        <div className="adapt-input-inner">
          <div
            className="adapt-input-textarea story-stream"
            aria-label="Source story"
          >
            {words.map((word, i) => {
              const isSpace = /^\s+$/.test(word);
              if (isSpace) return <Fragment key={i}>{word}</Fragment>;
              const idx = wordCounter++;
              const revealed = done || idx < revealedWords;
              return (
                <span
                  key={i}
                  className={
                    revealed ? 'stream-word is-visible' : 'stream-word'
                  }
                >
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
              // Hardik scrolls to #locale-cascade. That section doesn't exist
              // on main yet, so we scroll to the next visible fold instead.
              document
                .querySelector('.atlas-bento')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Adapt the story
          </button>
        </div>
      </div>
    </div>
  );
}
