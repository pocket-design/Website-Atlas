'use client';

import { useEffect, useRef } from 'react';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import { MULTILINGUAL_CHARS } from '@/lib/chars';
import { getCountryChars } from '@/lib/countryLanguages';
import type { GlobeConfig } from './GlobeDialKit';
import { DEFAULT_CONFIG } from './GlobeDialKit';

// ── City pairs [lat1,lon1,lat2,lon2] in degrees ───────────────────────────
const CITY_PAIRS: [number, number, number, number][] = [
  [40.71,-74.01, 51.51, -0.13], [51.51,-0.13, 28.61, 77.21],
  [28.61,77.21,  35.69,139.69], [35.69,139.69,-33.87,151.21],
  [-33.87,151.21,-23.55,-46.63],[-23.55,-46.63,6.52, 3.38],
  [6.52,3.38,    55.75,37.62],  [55.75,37.62,  39.91,116.39],
  [39.91,116.39,  1.35,103.82], [1.35,103.82,  48.85,  2.35],
  [48.85,2.35,   19.43,-99.13], [19.43,-99.13, 34.05,-118.24],
  [34.05,-118.24,41.88,-87.63], [41.88,-87.63,-34.61,-58.38],
  [-34.61,-58.38,33.89, 35.50], [33.89,35.50,  30.06, 31.25],
  [30.06,31.25,  -1.29, 36.82], [-1.29,36.82,  14.69,-17.44],
  [14.69,-17.44, 52.52, 13.40], [52.52,13.40,  43.65,-79.38],
  [43.65,-79.38, 25.20, 55.27], [25.20,55.27,  13.75,100.52],
  [13.75,100.52, 22.39,114.11], [22.39,114.11, 37.57,126.98],
];

const ARC_CHARS = CITY_PAIRS.map(() =>
  Array.from({ length: 30 }, () =>
    MULTILINGUAL_CHARS[(Math.random() * MULTILINGUAL_CHARS.length) | 0]
  )
);
const makeArcMeta = () =>
  CITY_PAIRS.map((_, i) => ({
    progress:  i / CITY_PAIRS.length,
    baseSpeed: 0.0014 + Math.random() * 0.0008,
    baseTail:  0.22   + Math.random() * 0.08,
  }));

// ── Helpers ───────────────────────────────────────────────────────────────
function degToRad(d: number) { return (d * Math.PI) / 180; }

function slerp(la1:number,lo1:number,la2:number,lo2:number,t:number):[number,number]{
  const [x1,y1,z1]=[Math.cos(la1)*Math.cos(lo1),Math.cos(la1)*Math.sin(lo1),Math.sin(la1)];
  const [x2,y2,z2]=[Math.cos(la2)*Math.cos(lo2),Math.cos(la2)*Math.sin(lo2),Math.sin(la2)];
  const dot=Math.max(-1,Math.min(1,x1*x2+y1*y2+z1*z2));
  const omega=Math.acos(dot);
  if(omega<0.0001) return [la1,lo1];
  const s=Math.sin(omega),a=Math.sin((1-t)*omega)/s,b=Math.sin(t*omega)/s;
  return [Math.asin(Math.max(-1,Math.min(1,a*z1+b*z2))),Math.atan2(a*y1+b*y2,a*x1+b*x2)];
}

/** Ray-casting PIP in lon/lat space. ring is [[lon,lat],...] */
function pointInRing(lat:number,lon:number,ring:[number,number][]): boolean {
  let inside=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const [xi,yi]=ring[i],[xj,yj]=ring[j];
    if(((yi>lat)!==(yj>lat))&&(lon<(xj-xi)*(lat-yi)/(yj-yi)+xi)) inside=!inside;
  }
  return inside;
}

// ── Country data ──────────────────────────────────────────────────────────
type Ring = [number, number][];
type CountryData = {
  id: number | string;
  polygons: Ring[][];           // [outerRing, ...holes][]
  drawRings: Ring[];            // flat list for outline drawing
  minLon: number; maxLon: number;
  minLat: number; maxLat: number;
};

type FillPoint = { lat: number; lon: number; char: string };

function generateFill(country: CountryData, chars: string[], max=350): FillPoint[] {
  const { minLon, maxLon, minLat, maxLat } = country;
  const span = Math.max(maxLon-minLon, maxLat-minLat);
  const step = Math.max(0.8, span / Math.sqrt(max));
  const pts: FillPoint[] = [];
  let ci = 0;
  for(let la=minLat+step*0.5; la<maxLat && pts.length<max; la+=step){
    for(let lo=minLon+step*0.5; lo<maxLon && pts.length<max; lo+=step){
      let inside = false;
      for(const poly of country.polygons){
        if(pointInRing(la,lo,poly[0])){
          let inHole=false;
          for(let h=1;h<poly.length;h++) if(pointInRing(la,lo,poly[h])){ inHole=true; break; }
          if(!inHole){ inside=true; break; }
        }
      }
      if(inside) pts.push({ lat:degToRad(la), lon:degToRad(lo), char:chars[ci++%chars.length] });
    }
  }
  return pts;
}

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
            polygons:[],drawRings:[],
            minLon:Infinity,maxLon:-Infinity,minLat:Infinity,maxLat:-Infinity,
          };
          const addPoly=(poly: Ring[])=>{
            cd.polygons.push(poly);
            for(const ring of poly){
              cd.drawRings.push(ring);
              for(const [lo,la] of ring){
                if(lo<cd.minLon)cd.minLon=lo; if(lo>cd.maxLon)cd.maxLon=lo;
                if(la<cd.minLat)cd.minLat=la; if(la>cd.maxLat)cd.maxLat=la;
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

    // Hovered country fill
    let hoveredId: number|string|null = null;
    let fillPoints: FillPoint[] = [];
    let fillAlpha = 0; // 0→1 fade-in

    // Current projection params (updated each frame, read in mousemove)
    const projState = { R:0, cx:0, cy:0, cosTilt:1, sinTilt:0 };

    // Inverse-project screen (mx,my) → [latRad, lonRad] or null
    const inverseProject=(mx:number,my:number):[number,number]|null=>{
      const {R,cx,cy,cosTilt,sinTilt}=projState;
      if(R<10) return null;
      const x4=(mx-cx)/R, y4=(my-cy)/R;
      if(x4*x4+y4*y4>1) return null;
      // inverse tilt
      const x3= x4*cosTilt+y4*sinTilt;
      const y3=-x4*sinTilt+y4*cosTilt;
      const z3sq=1-x3*x3-y3*y3;
      if(z3sq<0) return null;
      const z3=Math.sqrt(z3sq);
      const lat=Math.asin(Math.max(-1,Math.min(1,y3)));
      const lon=Math.atan2(z3,x3)-rot;
      return [lat,lon];
    };

    // Find which country contains lat/lon (degrees)
    const findCountry=(latDeg:number,lonDeg:number):CountryData|null=>{
      // normalise lon to -180..180
      let lo=((lonDeg+180)%360+360)%360-180;
      const la=latDeg;
      for(const cd of countries){
        if(la<cd.minLat||la>cd.maxLat) continue;
        // loose lon check (handle antimeridian countries roughly)
        const lonSpan=cd.maxLon-cd.minLon;
        if(lonSpan<340&&(lo<cd.minLon-1||lo>cd.maxLon+1)) continue;
        for(const poly of cd.polygons){
          if(pointInRing(la,lo,poly[0])){
            let inHole=false;
            for(let h=1;h<poly.length;h++) if(pointInRing(la,lo,poly[h])){ inHole=true; break; }
            if(!inHole) return cd;
          }
        }
      }
      return null;
    };

    // ── Mouse ────────────────────────────────────────────────────────────
    const onMove=(e:MouseEvent)=>{
      const r=canvas.getBoundingClientRect();
      mouseX=e.clientX-r.left; mouseY=e.clientY-r.top;

      const latLon=inverseProject(mouseX,mouseY);
      if(!latLon){ hoveredId=null; fillPoints=[]; fillAlpha=0; return; }
      const [laRad,loRad]=latLon;
      const laDeg=laRad*180/Math.PI;
      const loDeg=loRad*180/Math.PI;
      const hit=findCountry(laDeg,loDeg);
      if(hit?.id!==hoveredId){
        hoveredId=hit?.id??null;
        fillAlpha=0;
        if(hit){
          const chars=getCountryChars(hit.id as number);
          fillPoints=generateFill(hit,chars);
        } else {
          fillPoints=[];
        }
      }
    };
    const onLeave=()=>{ mouseX=-9999;mouseY=-9999;hoveredId=null;fillPoints=[];fillAlpha=0; };
    hero.addEventListener('mousemove',onMove);
    hero.addEventListener('mouseleave',onLeave);

    // ── Grid ─────────────────────────────────────────────────────────────
    const latSteps=18,lonSteps=36;
    const gridPoints:{lat:number;lon:number}[]=[];
    for(let i=0;i<=latSteps;i++){
      const lat=Math.PI*(i/latSteps-0.5);
      for(let j=0;j<lonSteps;j++)
        gridPoints.push({lat,lon:(2*Math.PI*j)/lonSteps});
    }

    const arcMeta=makeArcMeta();
    const reduceMotion=typeof window.matchMedia==='function'&&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      // Store for mousemove inverse projection
      projState.R=R; projState.cx=cx; projState.cy=cy;
      projState.cosTilt=cosTilt; projState.sinTilt=sinTilt;

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

      // ── Country hover fill (native language chars) ─────────────────
      if(fillPoints.length>0){
        fillAlpha=Math.min(1,fillAlpha+0.06); // fade in over ~17 frames
        ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.font=`7px var(--font-mallory-narrow),system-ui,sans-serif`;
        for(const fp of fillPoints){
          const {x,y,z}=project(fp.lat,fp.lon,R*1.002);
          if(z<-0.05) continue;
          const depth=Math.max(0,(z+1)*0.5);
          const a=(fillAlpha*0.72*depth).toFixed(3);
          ctx.fillStyle=`rgba(28,28,28,${a})`;
          ctx.fillText(fp.char,x,y);
        }
      }

      // ── Simplified thin arcs (small chars, short tail) ─────────────
      if(cfg.showArcs){
        const STEPS=22;
        ctx.textAlign='center';ctx.textBaseline='middle';
        for(let i=0;i<Math.min(cfg.arcCount,CITY_PAIRS.length);i++){
          const [la1d,lo1d,la2d,lo2d]=CITY_PAIRS[i];
          const meta=arcMeta[i];
          const chars=ARC_CHARS[i];
          meta.progress+=meta.baseSpeed*cfg.arcSpeedMult;
          const tailLen=meta.baseTail*(cfg.tailLen/0.28);
          if(meta.progress>1+tailLen) meta.progress=-tailLen*0.3;
          const head=Math.min(1,Math.max(0,meta.progress));
          const tail=Math.min(1,Math.max(0,meta.progress-tailLen));
          if(head<=tail) continue;
          const la1=degToRad(la1d),lo1=degToRad(lo1d);
          const la2=degToRad(la2d),lo2=degToRad(lo2d);
          for(let s=0;s<=STEPS;s++){
            const t=tail+(s/STEPS)*(head-tail);
            const [la,lo]=slerp(la1,lo1,la2,lo2,t);
            const lift=1.012+0.018*Math.sin(Math.PI*t);
            const {x,y,z}=project(la,lo,R*lift);
            if(z<-0.10) continue;
            const depth=Math.max(0,(z+1)*0.5);
            const frac=s/STEPS;
            const opacity=frac*frac*0.75*depth;
            if(opacity<0.03) continue;
            const size=Math.round(cfg.charSizeMin+frac*(cfg.charSizeMax-cfg.charSizeMin));
            ctx.font=`${size}px var(--font-mallory-narrow),system-ui,sans-serif`;
            ctx.fillStyle=`rgba(210,25,10,${opacity.toFixed(3)})`;
            ctx.fillText(chars[(i*5+s)%chars.length],x,y);
          }
          // head dot
          const [hla,hlo]=slerp(la1,lo1,la2,lo2,head);
          const hp=project(hla,hlo,R*1.013);
          if(hp.z>-0.05){
            const depth=Math.max(0,(hp.z+1)*0.5);
            ctx.save();
            ctx.shadowColor='rgba(255,30,0,0.85)';ctx.shadowBlur=6;
            ctx.fillStyle=`rgba(255,45,10,${(0.9*depth).toFixed(3)})`;
            ctx.beginPath();ctx.arc(hp.x,hp.y,1.8,0,Math.PI*2);ctx.fill();
            ctx.restore();
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
