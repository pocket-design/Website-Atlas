import BentoGraphic from './BentoGraphic';

export default function BentoHeroRow() {
  return (
    <div className="bento-hero-row">
      <div className="bcell bento-hero-left">
        <BentoGraphic scene="transpose" />
        <div className="bento-hero-left-copy">
          <h3 className="t-h4">Full cultural transposition, not translation</h3>
          <p className="t-body-sm">
            Names become culturally native. A corner store becomes a Späti in Berlin, a konbini in Tokyo, a duka in Nairobi. Food, humor, family dynamics, and street-level details are rebuilt from scratch. <strong>Readers never sense a foreign origin.</strong>
          </p>
        </div>
      </div>
      <div className="bento-hero-stack">
        <div className="bcell">
          <h3 className="t-h4">Supports insanely long prose</h3>
          <p className="t-body-sm">
            Thousands of words, hundreds of episodes, entire seasons. <strong>Atlas stays perfectly consistent from first page to last.</strong>
          </p>
        </div>
        <div className="bcell">
          <h3 className="t-h4">Strategy-first architecture</h3>
          <p className="t-body-sm">
            Before changing a single word, Atlas generates a full strategy: tone, naming rules, geographic mappings. <strong>One document governs every downstream decision.</strong>
          </p>
        </div>
        <div className="bcell">
          <h3 className="t-h4">Self-healing validation</h3>
          <p className="t-body-sm">
            A verification pass flags conflicts and cultural mixing. <strong>Only broken items are surgically regenerated.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
