'use client';

import { ShaderMount } from '@paper-design/shaders-react';
import type { CSSProperties } from 'react';

const DITHER_TYPE_TO_INT = { random: 1, '2x2': 2, '4x4': 3, '8x8': 4 } as const;
type DitherType = keyof typeof DITHER_TYPE_TO_INT;

// "Linear" dither: the underlying pattern is a vertical luminance
// ramp (0 at top, 1 at bottom). Bayer ordered dithering quantizes it
// to threshold dots, giving a true sparse-to-dense pixelated dissolve.
// Re-uses the same Bayer matrices and final blend math as
// @paper-design/shaders' Dithering shader.
const linearDitherFragmentShader = /* glsl */ `#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_pxSize;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_type;

out vec4 fragColor;

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
  0,  8,  2, 10,
 12,  4, 14,  6,
  3, 11,  1,  9,
 15,  7, 13,  5
);
const int bayer8x8[64] = int[64](
  0, 32,  8, 40,  2, 34, 10, 42,
 48, 16, 56, 24, 50, 18, 58, 26,
 12, 44,  4, 36, 14, 46,  6, 38,
 60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43,  1, 33,  9, 41,
 51, 19, 59, 27, 49, 17, 57, 25,
 15, 47,  7, 39, 13, 45,  5, 37,
 63, 31, 55, 23, 61, 29, 53, 21
);

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(fract(uv / float(size)) * float(size));
  int index = pos.y * size + pos.x;
  if (size == 2) return float(bayer2x2[index]) / 4.0;
  else if (size == 4) return float(bayer4x4[index]) / 16.0;
  else if (size == 8) return float(bayer8x8[index]) / 64.0;
  return 0.0;
}

void main() {
  float pxSize = max(u_pxSize, 1.0) * u_pixelRatio;
  vec2 pxSizeUV = gl_FragCoord.xy - 0.5 * u_resolution;
  pxSizeUV /= pxSize;
  vec2 canvasPixelizedUV = (floor(pxSizeUV) + 0.5) * pxSize;

  // gl_FragCoord origin is bottom-left, canvasPixelizedUV is centered.
  // Map y to [0,1] with 0 at top, 1 at bottom of the canvas — so the
  // gradient is dense at the bottom (full vellum) and sparse at top.
  float shape = 0.5 - canvasPixelizedUV.y / u_resolution.y;
  shape = clamp(shape, 0.0, 1.0);

  int type = int(floor(u_type));
  float dithering = 0.0;
  if (type == 1) {
    float res = step(hash21(canvasPixelizedUV), shape);
    vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
    vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
    float fgOpacity = u_colorFront.a;
    float bgOpacity = u_colorBack.a;
    vec3 color = fgColor * res;
    float opacity = fgOpacity * res;
    color += bgColor * (1.0 - opacity);
    opacity += bgOpacity * (1.0 - opacity);
    fragColor = vec4(color, opacity);
    return;
  } else if (type == 2) {
    dithering = getBayerValue(pxSizeUV, 2);
  } else if (type == 3) {
    dithering = getBayerValue(pxSizeUV, 4);
  } else {
    dithering = getBayerValue(pxSizeUV, 8);
  }
  dithering -= 0.5;
  float res = step(0.5, shape + dithering);

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float fgOpacity = u_colorFront.a;
  float bgOpacity = u_colorBack.a;
  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;
  color += bgColor * (1.0 - opacity);
  opacity += bgOpacity * (1.0 - opacity);
  fragColor = vec4(color, opacity);
}
`;

function parseColor(input: string): [number, number, number, number] {
  const s = input.trim();
  // #RRGGBB or #RGB
  if (s.startsWith('#')) {
    const hex = s.slice(1);
    const expand = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
    const r = parseInt(expand.slice(0, 2), 16) / 255;
    const g = parseInt(expand.slice(2, 4), 16) / 255;
    const b = parseInt(expand.slice(4, 6), 16) / 255;
    const a = expand.length === 8 ? parseInt(expand.slice(6, 8), 16) / 255 : 1;
    return [r, g, b, a];
  }
  // rgb(...) / rgba(...)
  const m = s.match(/rgba?\s*\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(',').map((p) => p.trim());
    const r = parseFloat(parts[0]) / 255;
    const g = parseFloat(parts[1]) / 255;
    const b = parseFloat(parts[2]) / 255;
    const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
    return [r, g, b, a];
  }
  return [0, 0, 0, 1];
}

type Props = {
  colorBack: string;
  colorFront: string;
  type: DitherType;
  size: number;
  className?: string;
  style?: CSSProperties;
};

export default function LinearDither({
  colorBack,
  colorFront,
  type,
  size,
  className,
  style,
}: Props) {
  return (
    <ShaderMount
      className={className}
      style={style}
      fragmentShader={linearDitherFragmentShader}
      uniforms={{
        u_pxSize: size,
        u_colorBack: parseColor(colorBack),
        u_colorFront: parseColor(colorFront),
        u_type: DITHER_TYPE_TO_INT[type],
      }}
    />
  );
}
