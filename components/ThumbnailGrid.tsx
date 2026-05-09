'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

const TOTAL_THUMBS = 50;
const THUMBNAILS: string[] = Array.from(
  { length: TOTAL_THUMBS },
  (_, i) => `/thumbnails/thumb-${String(i + 1).padStart(2, '0')}.jpg`
);

const GRID_SIZE = 12;
const PIXEL_SIZE = 24;
const HOLD_DURATION = 3000;
const MORPH_FPS = 20;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface CellHandle {
  trigger: (newSrc: string, done: () => void) => void;
}

const PixelCell = forwardRef<CellHandle, { src: string }>(function PixelCell({ src }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [showCanvas, setShowCanvas] = useState(false);

  const getPixelData = useCallback((canvas: HTMLCanvasElement, source: CanvasImageSource): ImageData => {
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, 0, 0, PIXEL_SIZE, PIXEL_SIZE);
    return ctx.getImageData(0, 0, PIXEL_SIZE, PIXEL_SIZE);
  }, []);

  useImperativeHandle(ref, () => ({
    trigger(newSrc: string, done: () => void) {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img || !img.complete) { done(); return; }

      const w = img.naturalWidth || 200;
      const h = img.naturalHeight || 200;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      const drawAtRes = (source: CanvasImageSource, res: number) => {
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(source, 0, 0, res, res);
        ctx.drawImage(canvas, 0, 0, res, res, 0, 0, w, h);
      };

      const morphPixels = (fromData: ImageData, toData: ImageData, t: number) => {
        const out = ctx.createImageData(PIXEL_SIZE, PIXEL_SIZE);
        for (let i = 0; i < out.data.length; i += 4) {
          out.data[i]     = fromData.data[i]     + (toData.data[i]     - fromData.data[i]) * t;
          out.data[i + 1] = fromData.data[i + 1] + (toData.data[i + 1] - fromData.data[i + 1]) * t;
          out.data[i + 2] = fromData.data[i + 2] + (toData.data[i + 2] - fromData.data[i + 2]) * t;
          out.data[i + 3] = 255;
        }
        ctx.putImageData(out, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, 0, 0, PIXEL_SIZE, PIXEL_SIZE, 0, 0, w, h);
      };

      // Phase 1: Gradually pixelate (lose resolution)
      const downLevels = [PIXEL_SIZE * 8, PIXEL_SIZE * 4, PIXEL_SIZE * 2, PIXEL_SIZE];
      let dStep = 0;
      drawAtRes(img, downLevels[0]);
      setShowCanvas(true);
      dStep = 1;

      const fromData = getPixelData(canvas, img);
      let toData: ImageData | null = null;
      let morphWaiting = false;

      const doPixelateDown = () => {
        if (dStep < downLevels.length) {
          drawAtRes(img, downLevels[dStep]);
          dStep++;
          setTimeout(doPixelateDown, 150);
        } else {
          if (toData) doMorph(toData);
          else morphWaiting = true;
        }
      };
      setTimeout(doPixelateDown, 150);

      // Phase 2: Morph pixel colors over HOLD_DURATION
      const doMorph = (td: ImageData) => {
        let frame = 0;
        const totalFrames = Math.floor(HOLD_DURATION / (1000 / MORPH_FPS));
        const interval = setInterval(() => {
          frame++;
          const t = frame / totalFrames;
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          morphPixels(fromData, td, Math.min(eased, 1));
          if (frame >= totalFrames) {
            clearInterval(interval);
            done();
            doUnpixelate();
          }
        }, 1000 / MORPH_FPS);
      };

      // Phase 3: Gradually unpixelate (gain resolution)
      const nextImg = new Image();
      const doUnpixelate = () => {
        const upLevels = [PIXEL_SIZE, PIXEL_SIZE * 2, PIXEL_SIZE * 4, PIXEL_SIZE * 8];
        let uStep = 0;
        const step = () => {
          if (uStep < upLevels.length) {
            drawAtRes(nextImg, upLevels[uStep]);
            uStep++;
            setTimeout(step, 150);
          } else {
            setShowCanvas(false);
          }
        };
        setTimeout(step, 100);
      };

      nextImg.onload = () => {
        toData = getPixelData(canvas, nextImg);
        drawAtRes(img, PIXEL_SIZE);
        if (morphWaiting) doMorph(toData);
      };
      nextImg.src = newSrc;
    },
  }));

  return (
    <div className="thumb-cell">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src={src} alt="" style={{ opacity: showCanvas ? 0 : 1 }} />
      <canvas ref={canvasRef} className={showCanvas ? 'is-visible' : ''} />
    </div>
  );
});

export default function ThumbnailGrid() {
  const [slots, setSlots] = useState<string[]>(THUMBNAILS.slice(0, GRID_SIZE));
  const cellRefs = useRef<(CellHandle | null)[]>(Array(GRID_SIZE).fill(null));
  const slotsRef = useRef(slots);
  slotsRef.current = slots;
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setSlots(shuffle(THUMBNAILS).slice(0, GRID_SIZE));
    }
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const cycle = () => {
      const slotIdx = Math.floor(Math.random() * GRID_SIZE);
      const current = slotsRef.current;
      const currentlyVisible = new Set(current);
      const available = THUMBNAILS.filter((t) => !currentlyVisible.has(t));
      const pool = available.length > 0 ? available : THUMBNAILS.filter((t) => t !== current[slotIdx]);
      const newSrc = pool[Math.floor(Math.random() * pool.length)];

      const cell = cellRefs.current[slotIdx];
      if (cell) {
        cell.trigger(newSrc, () => {
          setSlots((prev) => {
            const next = [...prev];
            next[slotIdx] = newSrc;
            return next;
          });
        });
      }

      timeout = setTimeout(cycle, 5500);
    };

    timeout = setTimeout(cycle, 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="thumb-grid" aria-hidden="true">
      {slots.map((src, i) => (
        <PixelCell key={i} src={src} ref={(r) => { cellRefs.current[i] = r; }} />
      ))}
    </div>
  );
}
