'use client';

import HeroBg from './HeroBg';
import { HeroBgDialKit, useHeroBgConfig } from './HeroBgDialKit';

export default function HeroBgWithDialKit() {
  const { radiusRef, ui, setCity, setRadius, reset } = useHeroBgConfig();

  return (
    <>
      <HeroBg city={ui.city} radiusRef={radiusRef} />
      <HeroBgDialKit ui={ui} setCity={setCity} setRadius={setRadius} reset={reset} />
    </>
  );
}
