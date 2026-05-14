export type SceneName = 'transpose' | 'knowledge' | 'strategy' | 'triage' | 'validation' | 'graph';

const SCENE_IMAGES: Record<SceneName, string> = {
  transpose:  '/assets/bento-transpose.jpg',
  knowledge:  '/assets/bento-longprose.jpg',
  strategy:   '/assets/bento-strategy.jpg',
  triage:     '/assets/bento-genre.jpg',
  validation: '/assets/bento-validation.jpg',
  graph:      '/assets/bento-graph.jpg',
};

export default function BentoGraphic({ scene }: { scene: SceneName }) {
  return (
    <div className="bcell-graphic" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={SCENE_IMAGES[scene]} alt="" />
    </div>
  );
}
