'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useDialKit } from 'dialkit';
import { Dithering } from '@paper-design/shaders-react';
import type { DitheringShape, DitheringType } from '@paper-design/shaders';
import LinearDither from './LinearDither';

// 'linear' is a custom shape (see LinearDither.tsx) — Paper Shaders'
// Dithering doesn't ship a vertical-gradient pattern, so we hand off
// to a custom ShaderMount when the dial is set to 'linear'.
const DITHER_SHAPES = ['linear', 'simplex', 'warp', 'dots', 'wave', 'ripple', 'swirl', 'sphere'] as const;
type DitherShape = typeof DITHER_SHAPES[number];
const DITHER_TYPES  = ['8x8', '4x4', '2x2', 'random'] as const satisfies readonly DitheringType[];
const DITHER_BLEND_MODES = [
  'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
  'color-dodge', 'color-burn', 'hard-light', 'soft-light',
  'difference', 'exclusion', 'plus-lighter',
] as const;
type DitherBlendMode = typeof DITHER_BLEND_MODES[number];

type PaintingDef = { poster: string; video: string | null };
const PAINTINGS = {
  'Painting 1': { poster: '/assets/atlas-background.png',   video: '/assets/atlas-background-1.mp4' },
  'Painting 2': { poster: '/assets/atlas-background-2.png', video: '/assets/atlas-background.mp4'   },
  'Painting 3': { poster: '/assets/atlas-background-3.png', video: '/assets/atlas-background-3.mp4' },
  'Painting 4': { poster: '/assets/atlas-background-4.png', video: '/assets/atlas-background-4.mp4' },
} as const satisfies Record<string, PaintingDef>;
type PosterKey = keyof typeof PAINTINGS;
const POSTER_OPTIONS = Object.keys(PAINTINGS) as PosterKey[];

export default function HeroBackground() {
  const {
    poster, showVideo, flipH, gradientStart,
    dither, ditherShape, ditherType, ditherSize, ditherScale, ditherSpeed, ditherOpacity,
    ditherFadeStart, ditherFadeEnd, ditherBlend, softStrength,
  } = useDialKit('Hero', {
    poster: {
      type: 'select',
      options: POSTER_OPTIONS,
      default: 'Painting 4',
    },
    showVideo: true,
    flipH: false,
    // [default, min, max] — where the white fade begins as a %
    // of the page-bg height. Lower = taller white region.
    gradientStart: [82, 30, 95],
    // Dither overlay (Paper Shaders Dithering). Procedurally
    // dithered vellum over the painting, sharing the same start
    // line as the soft gradient so both transitions align.
    dither: true,
    ditherShape: { type: 'select', options: DITHER_SHAPES as unknown as string[], default: 'linear' },
    ditherType:  { type: 'select', options: DITHER_TYPES  as unknown as string[], default: '8x8' },
    ditherSize:    [2,    0.5, 20,   0.5],   // Bayer cell px size
    ditherScale:   [1.7,  0.1,  4,   0.05],  // pattern zoom
    ditherSpeed:   [0,    0,    1,   0.05],  // 0 = static
    ditherOpacity: [1,    0,    1,   0.05],
    // Mask gradient stops (% of dither band height): where dots
    // start becoming visible vs. where they reach full opacity.
    // This is the dither's intrinsic vertical fade.
    ditherFadeStart: [40,  0,   100, 5],
    ditherFadeEnd:   [100, 0,   100, 5],
    // CSS mix-blend-mode for compositing the dither over the
    // painting underneath. 'normal' = opaque vellum dots;
    // 'screen' / 'plus-lighter' = additive glow; 'soft-light'
    // = subtle whitening wash.
    ditherBlend: { type: 'select', options: DITHER_BLEND_MODES as unknown as string[], default: 'normal' },
    // Soft white ::after gradient — slide down to 0 for a
    // dither-only transition; up for a hybrid look.
    softStrength:    [1,   0,   1,   0.05],
  });

  const painting = PAINTINGS[(poster as PosterKey) ?? 'Painting 2'] ?? PAINTINGS['Painting 2'];
  const posterSrc = painting.poster;
  const videoSrc = painting.video;
  // Only attempt video playback when the toggle is on AND the
  // selected painting has a paired video.
  const videoActive = Boolean(showVideo && videoSrc);

  // Push the slider values into the CSS vars the gradient reads.
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--hero-gradient-start',
      `${gradientStart}%`,
    );
  }, [gradientStart]);
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--hero-soft-strength',
      `${softStrength}`,
    );
  }, [softStrength]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Mount/unmount the <video> based on toggle + paired video,
  // crossfading the poster out once the video can play. Reset
  // readiness whenever the painting (and therefore videoSrc)
  // changes so each new clip gets its own canplay handshake.
  useEffect(() => {
    setVideoReady(false);
    if (!videoActive) return;
    const v = videoRef.current;
    if (!v) return;
    if (v.readyState >= 3) {
      setVideoReady(true);
      return;
    }
    const handleReady = () => setVideoReady(true);
    v.addEventListener('canplay', handleReady, { once: true });
    return () => v.removeEventListener('canplay', handleReady);
  }, [videoActive, videoSrc]);

  return (
    <div className="page-bg" aria-hidden="true">
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        key={posterSrc}
        src={posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={88}
        style={{
          objectFit: 'cover',
          objectPosition: 'center top',
          opacity: videoActive && videoReady ? 0 : 1,
          transform: flipH ? 'scaleX(-1)' : undefined,
          transition: 'opacity 800ms ease-out',
        }}
      />
      {videoActive && videoSrc && (
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: videoReady ? 1 : 0,
            transform: flipH ? 'scaleX(-1)' : undefined,
            transition: 'opacity 800ms ease-out',
          }}
        />
      )}
      {dither && (() => {
        // Procedural Bayer-dithered vellum overlay. Sits above the
        // soft ::after gradient (z-index: 1) and shares its top edge
        // with --hero-gradient-start so both transitions align.
        // CSS mask fades the canvas in vertically; the 'linear'
        // shape additionally bakes a true threshold-dithered
        // gradient into the shader itself.
        const overlayStyle: React.CSSProperties = {
          position: 'absolute',
          top: `var(--hero-gradient-start)`,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: ditherOpacity,
          mixBlendMode: ditherBlend as DitherBlendMode,
          WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,0) ${ditherFadeStart}%, rgba(0,0,0,1) ${ditherFadeEnd}%)`,
          maskImage: `linear-gradient(to bottom, rgba(0,0,0,0) ${ditherFadeStart}%, rgba(0,0,0,1) ${ditherFadeEnd}%)`,
        };
        const shape = ditherShape as DitherShape;
        if (shape === 'linear') {
          return (
            <LinearDither
              colorBack="rgba(250, 249, 241, 0)"
              colorFront="#FAF9F1"
              type={ditherType as DitheringType}
              size={ditherSize}
              style={overlayStyle}
            />
          );
        }
        return (
          <Dithering
            colorBack="rgba(250, 249, 241, 0)"
            colorFront="#FAF9F1"
            shape={shape as DitheringShape}
            type={ditherType as DitheringType}
            size={ditherSize}
            scale={ditherScale}
            speed={ditherSpeed}
            style={overlayStyle}
          />
        );
      })()}
    </div>
  );
}
