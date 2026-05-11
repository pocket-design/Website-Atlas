'use client';

import { useEffect, useRef } from 'react';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import type { GlobeConfig } from './GlobeDialKit';
import { DEFAULT_CONFIG } from './GlobeDialKit';

// ── Helpers ───────────────────────────────────────────────────────────────
function degToRad(d: number) { return (d * Math.PI) / 180; }

// ── Country data ──────────────────────────────────────────────────────────
type Ring = [number, number][];
type CountryData = {
  id: number | string;
  drawRings: Ring[];
  minLat: number; maxLat: number;
};

// ── Component ─────────────────────────────────────────────────────────────
type Props = { configRef: React.RefObject<GlobeConfig> };

export default function Globe({ configRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    const hero = canvas.parentElement as HTMLElement|null;
    if(!hero) return;

    let W=0, H=0;
    const dpr = window.devicePixelRatio||1;
    const resize=()=>{
      const r=canvas.getBoundingClientRect();
      canvas.width =Math.max(1,Math.floor(r.width *dpr));
      canvas.height=Math.max(1,Math.floor(r.height*dpr));
      W=r.width; H=r.height;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    resize();
    window.addEventListener('resize',resize);

    // ── Country data ────────────────────────────────────────────────────
    let countries: CountryData[] = [];

    fetch('/assets/countries-110m.json')
      .then(r=>r.json())
      .then((topo:Topology)=>{
        const col = feature(topo, topo.objects.countries as Parameters<typeof feature>[1]);
        const feats = 'features' in col ? col.features : [];
        for(const f of feats){
          const g=f.geometry; if(!g) continue;
          const cd: CountryData = {
            id: f.id ?? 0,
            drawRings:[],
            minLat:Infinity,maxLat:-Infinity,
          };
          const addPoly=(poly: Ring[])=>{
            for(const ring of poly){
              cd.drawRings.push(ring);
              for(const [,la] of ring){
                if(la<cd.minLat)cd.minLat=la;
                if(la>cd.maxLat)cd.maxLat=la;
              }
            }
          };
          if(g.type==='Polygon') addPoly(g.coordinates as Ring[]);
          else if(g.type==='MultiPolygon') for(const p of g.coordinates) addPoly(p as Ring[]);
          countries.push(cd);
        }
      }).catch(()=>{});

    // ── State ────────────────────────────────────────────────────────────
    let rot=0;
    let mouseX=-9999,mouseY=-9999;

    // ── Grid ─────────────────────────────────────────────────────────────
    const latSteps=18,lonSteps=36;
    const gridPoints:{lat:number;lon:number}[]=[];
    for(let i=0;i<=latSteps;i++){
      const lat=Math.PI*(i/latSteps-0.5);
      for(let j=0;j<lonSteps;j++)
        gridPoints.push({lat,lon:(2*Math.PI*j)/lonSteps});
    }

    const reduceMotion=typeof window.matchMedia==='function'&&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Mouse ────────────────────────────────────────────────────────────
    const onMove=(e:MouseEvent)=>{
      const r=canvas.getBoundingClientRect();
      mouseX=e.clientX-r.left; mouseY=e.clientY-r.top;
    };
    const onLeave=()=>{ mouseX=-9999; mouseY=-9999; };
    hero.addEventListener('mousemove',onMove);
    hero.addEventListener('mouseleave',onLeave);

    // ── Draw loop ─────────────────────────────────────────────────────────
    let raf=0;
    const tick=()=>{
      const cfg:GlobeConfig=configRef.current??DEFAULT_CONFIG;
      rot+=reduceMotion?0:cfg.rotSpeed;
      ctx.clearRect(0,0,W,H);

      const R =Math.min(W*0.52,H*0.95);
      const cx=W*0.5, cy=H*0.96;
      if(R<60){ raf=requestAnimationFrame(tick); return; }

      const tiltRad=degToRad(cfg.tilt);
      const cosTilt=Math.cos(tiltRad),sinTilt=Math.sin(tiltRad);

      const project=(la:number,lo:number,r:number)=>{
        const cl=Math.cos(la);
        const x3=cl*Math.cos(lo+rot),y3=Math.sin(la),z3=cl*Math.sin(lo+rot);
        return{ x:cx+(x3*cosTilt-y3*sinTilt)*r, y:cy+(x3*sinTilt+y3*cosTilt)*r, z:z3 };
      };

      // ── Grid projection ────────────────────────────────────────────
      type P3={x:number;y:number;z:number};
      const gp:P3[]=gridPoints.map(p=>project(p.lat,p.lon,R));

      // ── Wireframe ──────────────────────────────────────────────────
      if(cfg.showWireframe){
        ctx.lineWidth=0.5;
        for(let i=0;i<=latSteps;i++){
          for(let j=0;j<lonSteps;j++){
            const a=gp[i*lonSteps+j],b=gp[i*lonSteps+((j+1)%lonSteps)];
            const alpha=Math.max(0,((a.z+b.z)*0.5+1)*0.5)*cfg.wireOpacity;
            ctx.strokeStyle=`rgba(28,28,28,${alpha.toFixed(3)})`;
            ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
          }
        }
        for(let j=0;j<lonSteps;j++){
          for(let i=0;i<latSteps;i++){
            const a=gp[i*lonSteps+j],b=gp[(i+1)*lonSteps+j];
            const alpha=Math.max(0,((a.z+b.z)*0.5+1)*0.5)*cfg.wireOpacity;
            ctx.strokeStyle=`rgba(28,28,28,${alpha.toFixed(3)})`;
            ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
          }
        }
      }

      // ── Country outlines ───────────────────────────────────────────
      if(cfg.showOutlines&&countries.length>0){
        ctx.lineWidth=0.7;
        for(const cd of countries){
          for(const ring of cd.drawRings){
            if(ring.length<2) continue;
            ctx.beginPath();
            let prevVis=false;
            for(let i=0;i<ring.length;i++){
              const {x,y,z}=project(degToRad(ring[i][1]),degToRad(ring[i][0]),R);
              const vis=z>-0.08;
              if(i===0) ctx.moveTo(x,y);
              else if(vis||prevVis) ctx.lineTo(x,y);
              else ctx.moveTo(x,y);
              prevVis=vis;
            }
            const s0=project(degToRad(ring[0][1]),degToRad(ring[0][0]),R);
            const depth=Math.max(0,(s0.z+1)*0.5);
            ctx.strokeStyle=`rgba(60,60,60,${(depth*cfg.outlineOpacity).toFixed(3)})`;
            ctx.stroke();
          }
        }
      }

      // ── Scarlet hover glow ─────────────────────────────────────────
      if(mouseX>-1000){
        const hR=cfg.hoverRadius,hR2=hR*hR;
        ctx.save();
        ctx.shadowColor='rgba(245,29,0,0.6)';ctx.shadowBlur=18;ctx.lineWidth=1.4;
        for(let i=0;i<=latSteps;i++){
          for(let j=0;j<lonSteps;j++){
            const a=gp[i*lonSteps+j],b=gp[i*lonSteps+((j+1)%lonSteps)];
            const d2=((a.x+b.x)/2-mouseX)**2+((a.y+b.y)/2-mouseY)**2;
            if(d2>hR2) continue;
            const t=1-Math.sqrt(d2)/hR,depth=Math.max(0,((a.z+b.z)*0.5+1)*0.5);
            ctx.strokeStyle=`rgba(245,29,0,${(t*t*0.9*depth).toFixed(3)})`;
            ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
          }
        }
        for(let j=0;j<lonSteps;j++){
          for(let i=0;i<latSteps;i++){
            const a=gp[i*lonSteps+j],b=gp[(i+1)*lonSteps+j];
            const d2=((a.x+b.x)/2-mouseX)**2+((a.y+b.y)/2-mouseY)**2;
            if(d2>hR2) continue;
            const t=1-Math.sqrt(d2)/hR,depth=Math.max(0,((a.z+b.z)*0.5+1)*0.5);
            ctx.strokeStyle=`rgba(245,29,0,${(t*t*0.9*depth).toFixed(3)})`;
            ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
          }
        }
        ctx.restore();
      }

      raf=requestAnimationFrame(tick);
    };
    tick();

    return()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',resize);
      hero.removeEventListener('mousemove',onMove);
      hero.removeEventListener('mouseleave',onLeave);
    };
  },[configRef]);

  return <canvas ref={canvasRef} className="globe-bg" aria-hidden="true" />;
}
