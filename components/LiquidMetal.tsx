'use client';

/**
 * LIQUID METAL — the ground the whole store sits on.
 *
 * A WebGL shader, not a gradient. Domain-warped fractal noise is what makes it
 * read as flowing metal rather than fog: the noise field is displaced by
 * another noise field, twice, which is why the highlights stretch and fold the
 * way molten material does.
 *
 * Touch anywhere and it ripples. Each touch is a real radial wavefront that
 * travels outward, decays with distance and age, and displaces the metal
 * underneath it — so two touches interfere the way water does rather than
 * playing two separate canned animations.
 *
 * Costs: one fullscreen triangle, capped at 1.5x device pixel ratio, ten
 * concurrent ripples in a ring buffer. It sits at z-index -10 behind
 * everything and never blocks a click.
 *
 * Degrades honestly — no WebGL, or prefers-reduced-motion, and it paints one
 * static frame instead of animating. The page never depends on it.
 */

import { useEffect, useRef } from 'react';

const MAX_RIPPLES = 10;

export function LiquidMetal({ accent = [0.79, 0.54, 0.24] as [number, number, number] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext('webgl', { antialias: false, alpha: true });
    if (!gl) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `
precision highp float;
uniform vec2 R; uniform float T; uniform vec3 ACC;
uniform vec3 RIP[${MAX_RIPPLES}];
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
  vec2 frag=gl_FragCoord.xy;
  vec2 uv=(frag-.5*R)/R.y;
  vec2 push=vec2(0.); float crest=0.;
  for(int i=0;i<${MAX_RIPPLES};i++){
    vec3 r=RIP[i];
    if(r.z<0.) continue;
    float age=T-r.z;
    if(age<0.||age>2.6) continue;
    vec2 d=(frag-r.xy)/R.y;
    float dist=length(d);
    float band=dist-age*0.62;
    float w=exp(-band*band*160.0);
    float fade=exp(-age*1.5)*exp(-dist*1.7);
    float wave=sin(band*46.0-age*7.0)*w*fade;
    push+=normalize(d+1e-5)*wave*0.075;
    crest+=wave;
  }
  vec2 suv=uv+push;
  float t=T*.034;
  vec2 q=vec2(fbm(suv*1.3+vec2(0.,t)),fbm(suv*1.3+vec2(4.6,1.1-t)));
  vec2 rr=vec2(fbm(suv*1.3+3.4*q+vec2(1.7,9.2)+t*.5),fbm(suv*1.3+3.4*q+vec2(8.3,2.8)-t*.35));
  float f=fbm(suv*1.45+3.4*rr);
  float band2=pow(sin(f*9.0+rr.y*3.2)*.5+.5,3.6);
  vec3 dark=vec3(.018,.017,.020);
  vec3 metal=vec3(.30,.26,.20);
  vec3 lit=vec3(.92,.88,.80);
  vec3 col=mix(dark,metal,smoothstep(.26,.86,f));
  col=mix(col,lit,band2*.26);
  col+=ACC*pow(1.-f,3.5)*.30;
  col+=vec3(1.0,.90,.72)*max(crest,0.)*0.42;
  col-=vec3(.09,.07,.04)*max(-crest,0.)*0.60;
  float d2=length(uv*vec2(.70,1.));
  col*=1.-smoothstep(.26,1.16,d2)*.84;
  gl_FragColor=vec4(col,1.);
}`;

    const sh = (type: number, src: string) => {
      const o = gl.createShader(type)!;
      gl.shaderSource(o, src);
      gl.compileShader(o);
      return o;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(pr, 'R');
    const uT = gl.getUniformLocation(pr, 'T');
    const uA = gl.getUniformLocation(pr, 'ACC');
    const uRIP = Array.from({ length: MAX_RIPPLES }, (_, i) =>
      gl.getUniformLocation(pr, `RIP[${i}]`),
    );
    gl.uniform3f(uA, accent[0], accent[1], accent[2]);

    let dpr = 1;
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = window.innerWidth * dpr;
      cv.height = window.innerHeight * dpr;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uR, cv.width, cv.height);
    };
    window.addEventListener('resize', size);
    size();

    const rips: [number, number, number][] = Array.from({ length: MAX_RIPPLES }, () => [0, 0, -1]);
    let next = 0;
    const t0 = performance.now();
    const now = () => (performance.now() - t0) / 1000;

    const drop = (cx: number, cy: number) => {
      if (reduced) return;
      rips[next] = [cx * dpr, (window.innerHeight - cy) * dpr, now()];
      next = (next + 1) % MAX_RIPPLES;
    };

    const onDown = (e: PointerEvent) => drop(e.clientX, e.clientY);
    let lastMove = 0;
    const onMove = (e: PointerEvent) => {
      if (e.buttons === 0) return;
      const n2 = performance.now();
      if (n2 - lastMove < 90) return;
      lastMove = n2;
      drop(e.clientX, e.clientY);
    };
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    const frame = () => {
      const T = now();
      gl.uniform1f(uT, T);
      for (let i = 0; i < MAX_RIPPLES; i++) {
        gl.uniform3f(uRIP[i], rips[i][0], rips[i][1], rips[i][2]);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    if (reduced) {
      gl.uniform1f(uT, 7);
      for (let i = 0; i < MAX_RIPPLES; i++) gl.uniform3f(uRIP[i], 0, 0, -1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
    };
  }, [accent]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
