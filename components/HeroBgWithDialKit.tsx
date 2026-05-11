'use client';

import HeroBg from './HeroBg';
import { HeroBgDialKit, useHeroBgConfig } from './HeroBgDialKit';

export default function HeroBgWithDialKit() {
  const {
    radiusRef, lagRef, cycleIntervalRef,
    ui,
    setMode, setCity, setRadius, setDelay, setCycleInterval, setPauseOnHover, reset,
  } = useHeroBgConfig();

  return (
    <>
      <HeroBg
        mode={ui.mode}
        city={ui.city}
        radiusRef={radiusRef}
        lagRef={lagRef}
        cycleIntervalRef={cycleIntervalRef}
        pauseOnHover={ui.pauseOnHover}
      />
      <HeroBgDialKit
        ui={ui}
        setMode={setMode}
        setCity={setCity}
        setRadius={setRadius}
        setDelay={setDelay}
        setCycleInterval={setCycleInterval}
        setPauseOnHover={setPauseOnHover}
        reset={reset}
      />
    </>
  );
}
