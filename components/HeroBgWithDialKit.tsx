'use client';

import HeroBg from './HeroBg';
import { HeroBgDialKit, useHeroBgConfig } from './HeroBgDialKit';

export default function HeroBgWithDialKit() {
  const { radiusRef, lagRef, ui, setCity, setRadius, setDelay, reset } = useHeroBgConfig();

  return (
    <>
      <HeroBg city={ui.city} radiusRef={radiusRef} lagRef={lagRef} />
      <HeroBgDialKit ui={ui} setCity={setCity} setRadius={setRadius} setDelay={setDelay} reset={reset} />
    </>
  );
}
