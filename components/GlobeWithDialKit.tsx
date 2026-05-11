'use client';

import Globe from './Globe';
import { GlobeDialKit, useGlobeConfig } from './GlobeDialKit';

export default function GlobeWithDialKit() {
  const { configRef, ui, set, reset } = useGlobeConfig();

  return (
    <>
      <Globe configRef={configRef} />
      <GlobeDialKit ui={ui} set={set} reset={reset} />
    </>
  );
}
