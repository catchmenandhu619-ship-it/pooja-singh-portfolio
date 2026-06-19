// TRexScrollHero.tsx — scroll-driven 3D "What I Do" section for Pooja Singh portfolio.
// Adapted from Claude Design "T-Rex Hero v2".
//
// PERFORMANCE ARCHITECTURE:
//   - Scroll progress (p) updates React state at most ~20/s (throttled)
//   - Ambient time (t) is stored in a REF — never triggers React re-renders
//   - The rAF loop updates the DOM canvas overlay and DOM elements directly
//   - React only re-renders when the camera keyframe changes (5 discrete states)
//   This eliminates the 60fps React re-render storm that was freezing the browser.

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

// ─── canvas constants ─────────────────────────────────────────
const W = 1920, H = 1080
const BG = '#F1ECE2'
const INK = '#15110D'
const ACCENT_CSS = 'oklch(0.62 0.205 33)'          // for CSS props
const ACCENT_RGB = '#C94A28'                        // fallback for canvas
const MONO = "'Space Mono', ui-monospace, monospace"
const DISP = "'Archivo', system-ui, sans-serif"

// ─── math ────────────────────────────────────────────────────
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const lerp   = (a: number, b: number, t: number) => a + (b - a) * t
const TAU    = Math.PI * 2

const E = {
  inOutCubic: (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2,
  outCubic:   (t: number) => 1 - Math.pow(1-t, 3),
  inCubic:    (t: number) => t * t * t,
  outExpo:    (t: number) => t >= 1 ? 1 : 1 - Math.pow(2, -10*t),
  outQuart:   (t: number) => 1 - Math.pow(1-t, 4),
}

const seg = (t: number, a: number, b: number, ease?: (t: number) => number) => {
  const p = clamp((t - a) / (b - a), 0, 1)
  return ease ? ease(p) : p
}
const ftw = (t: number, a: number, b: number, c: number, d: number) =>
  clamp(Math.min(seg(t, a, b, E.outCubic), 1 - seg(t, c, d, E.inCubic)), 0, 1)

// ─── camera keyframes ─────────────────────────────────────────
interface KF { p: number; target: [number, number]; s: number; rx: number; ry: number; rz: number }

const KFS: KF[] = [
  { p: 0.00, target: [960, 540],  s: 1.04, rx: 0,  ry: 0,    rz: 0    },
  { p: 0.22, target: [350, 480],  s: 2.55, rx: 0,  ry: -3.5, rz: -1.2 },
  { p: 0.46, target: [880, 360],  s: 1.85, rx: 0,  ry: 2.5,  rz: 0.6  },
  { p: 0.70, target: [1180, 740], s: 2.20, rx: 6,  ry: 0,    rz: 1.6  },
  { p: 1.00, target: [960, 560],  s: 0.92, rx: 0,  ry: 0,    rz: 0    },
]

function camAt(p: number) {
  for (let i = 0; i < KFS.length - 1; i++) {
    if (p <= KFS[i + 1].p) {
      const u = (p - KFS[i].p) / (KFS[i + 1].p - KFS[i].p || 1)
      const e = E.inOutCubic(u)
      const a = KFS[i], b = KFS[i + 1]
      return {
        s:  lerp(a.s, b.s, e),
        tx: lerp(a.target[0], b.target[0], e),
        ty: lerp(a.target[1], b.target[1], e),
        rx: lerp(a.rx, b.rx, e),
        ry: lerp(a.ry, b.ry, e),
        rz: lerp(a.rz, b.rz, e),
      }
    }
  }
  const last = KFS[KFS.length - 1]
  return { s: last.s, tx: last.target[0], ty: last.target[1], rx: last.rx, ry: last.ry, rz: last.rz }
}

const sceneIdx = (p: number) => p < 0.18 ? 0 : p < 0.40 ? 1 : p < 0.62 ? 2 : p < 0.84 ? 3 : 4

// ─── helpers ─────────────────────────────────────────────────
function mulberry(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pad(n: number) { return String(n).padStart(2, '0') }

// Precompute dust particle params (static)
const DUST = Array.from({ length: 28 }, (_, i) => {
  const r = mulberry(i * 9.13 + 7)
  return { x: r() * W, y: r() * H, sz: 1.2 + r() * 2.8,
    kx: 0.4 + r() * 1.0, ky: 0.3 + r() * 0.8, phx: r(), phy: r(),
    ax: 10 + r() * 30, ay: 30 + r() * 80, ph: r() }
})

// ═══════════════════════════════════════════════════════════════
//  Root component
// ═══════════════════════════════════════════════════════════════
export default function TRexScrollHero() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const pRef         = useRef(0)           // raw scroll progress (no state)
  const tRef         = useRef(0)           // ambient clock (no state)
  const rafRef       = useRef<number>(0)

  // DOM refs for elements that are updated directly in rAF (avoiding re-renders)
  const worldRef     = useRef<HTMLDivElement>(null)   // camera-world transform div
  const skeletonRef  = useRef<HTMLDivElement>(null)   // idle skeleton wrapper
  const headRef      = useRef<HTMLImageElement>(null)
  const tailRef      = useRef<HTMLImageElement>(null)
  const heartRef     = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null) // dust canvas
  const svgWorldRef  = useRef<SVGSVGElement>(null)    // world callout SVG
  const hudTLRef     = useRef<HTMLDivElement>(null)
  const hudTRRef     = useRef<HTMLDivElement>(null)
  const hudDotsRef   = useRef<HTMLDivElement>(null)
  const meterRef     = useRef<HTMLDivElement>(null)

  // Scene overlay refs
  const intro0Ref    = useRef<HTMLDivElement>(null)
  const scene1Ref    = useRef<HTMLDivElement>(null)
  const scene2Ref    = useRef<HTMLDivElement>(null)
  const scene3Ref    = useRef<HTMLDivElement>(null)
  const scene4Ref    = useRef<HTMLDivElement>(null)
  const pillsRef     = useRef<HTMLDivElement[]>([])
  const expRef       = useRef<HTMLDivElement>(null)

  // React state only for the frame-fit (only changes on resize — rare)
  const frameRef     = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ s: 1, ox: 0, oy: 0 })

  // Metre bar heights (static random)
  const METER = useMemo(() =>
    [5,8,11,7,13,9,6,14,8,10,6,4,9,11,7].map((k, i) => ({ k, ph: i * 0.7 })), [])

  // ── resize → fit ──
  useLayoutEffect(() => {
    const measure = () => {
      const el = frameRef.current; if (!el) return
      const vw = el.clientWidth, vh = el.clientHeight
      const s = Math.max(vw / W, vh / H)
      const ox = (vw - W * s) / 2
      const oy = (vh - H * s) / 2
      setFit(prev => (prev.s === s && prev.ox === ox && prev.oy === oy) ? prev : { s, ox, oy })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (frameRef.current) ro.observe(frameRef.current)
    return () => ro.disconnect()
  }, [])

  // ── scroll listener (throttled to ~20fps) ──
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const el = sectionRef.current; if (!el) return
        const rect = el.getBoundingClientRect()
        const total = el.offsetHeight - window.innerHeight
        pRef.current = clamp(total > 0 ? -rect.top / total : 0, 0, 1)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── main rAF loop — ALL animation runs here, zero React setState ──
  useEffect(() => {
    let start: number | null = null

    const tick = (ts: number) => {
      if (start == null) start = ts
      const t = (ts - start) / 1000
      tRef.current = t
      const p = pRef.current

      // camera
      const cam = camAt(p)
      const tx = W / 2 - cam.tx * cam.s
      const ty = H / 2 - cam.ty * cam.s

      // idle motion
      const idleY  = Math.sin(t * 0.55) * 1.8 + Math.sin(t * 0.27 + 1.3) * 1.0
      const idleX  = Math.sin(t * 0.33 + 0.6) * 1.2
      const idleR  = Math.sin(t * 0.30 + 0.7) * 0.22
      const breath = 0.55 + 0.45 * Math.sin(t * 1.15)
      const idleSY = 1 + breath * 0.006
      const idleSX = 1 + (1 - breath) * 0.003
      const headDeg = Math.sin(t * 0.85) * 2.8 + Math.sin(t * 0.41 + 1.2) * 1.0
      const tailDeg = Math.sin(t * 1.35) * 4.5 + Math.sin(t * 2.10 + 0.7) * 1.6

      // scene fades
      const A = [
        ftw(p, -0.10, -0.01, 0.16, 0.22),
        ftw(p, 0.20,  0.26,  0.36, 0.42),
        ftw(p, 0.42,  0.48,  0.58, 0.64),
        ftw(p, 0.66,  0.72,  0.80, 0.86),
        ftw(p, 0.86,  0.94,  2,    3),
      ]

      // ── update camera world ──
      if (worldRef.current) {
        worldRef.current.style.transform =
          `translate(${tx}px,${ty}px) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) rotateZ(${cam.rz}deg) scale(${cam.s})`
      }

      // ── update skeleton ──
      if (skeletonRef.current) {
        skeletonRef.current.style.transform =
          `translate(${idleX}px,${idleY}px) rotate(${idleR}deg) scale(${idleSX},${idleSY})`
      }
      if (headRef.current) headRef.current.style.transform = `rotate(${headDeg}deg)`
      if (tailRef.current) tailRef.current.style.transform = `rotate(${tailDeg}deg)`

      // ── heartbeat pulse ──
      if (heartRef.current) {
        const sc = 0.9 + breath * 0.25
        heartRef.current.style.transform = `translate(-50%,-50%) scale(${sc})`
        heartRef.current.style.opacity   = String(0.18 + breath * 0.22)
      }

      // ── dust canvas ──
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, W, H)
          ctx.fillStyle = INK
          for (const d of DUST) {
            const x  = d.x + Math.sin(t * d.kx + d.phx * TAU) * d.ax
            const yy = (d.y - (t * 18 + d.ph * H) % (H + 60) + (H + 60)) % (H + 60) - 30
            const o  = 0.06 + 0.16 * (0.5 + 0.5 * Math.sin(t * d.ky + d.phy * TAU))
            ctx.globalAlpha = o
            ctx.beginPath(); ctx.arc(x, yy, d.sz, 0, TAU); ctx.fill()
          }
          ctx.globalAlpha = 1
        }
      }

      // ── scene overlays ──
      updateOverlay(intro0Ref.current, A[0])
      updateOverlay(scene1Ref.current, A[1])
      updateOverlay(scene2Ref.current, A[2])
      updateOverlay(scene3Ref.current, A[3])
      updateOverlay(scene4Ref.current, A[4])

      // pill stagger inside scene4
      pillsRef.current.forEach((el, i) => {
        if (!el) return
        const pp = clamp((A[4] - i * 0.06) / 0.5, 0, 1)
        el.style.opacity   = String(pp)
        el.style.transform = `translateY(${(1 - pp) * 18}px)`
      })

      // experience strip delayed inside scene4
      if (expRef.current) {
        const ep = clamp((A[4] - 0.1) / 0.5, 0, 1)
        expRef.current.style.opacity   = String(ep)
        expRef.current.style.transform = `translateY(${(1 - ep) * 20}px)`
      }

      // ── HUD ──
      const sIdx = sceneIdx(p)
      const tcFrames = Math.floor(p * 24 * 18)
      const tc = `${pad(Math.floor(tcFrames/1440))}:${pad(Math.floor((tcFrames%1440)/24))}:${pad(tcFrames%24)}`
      const recBlink = (t % 1) < 0.5 ? 1 : 0.28

      if (hudTLRef.current) {
        const recDot = hudTLRef.current.querySelector<HTMLElement>('.rec-dot')
        if (recDot) recDot.style.opacity = String(recBlink)
        const tcEl = hudTLRef.current.querySelector<HTMLElement>('.tc')
        if (tcEl) tcEl.textContent = `TC ${tc}`
      }
      if (hudTRRef.current) {
        const scEl = hudTRRef.current.querySelector<HTMLElement>('.sc')
        if (scEl) scEl.textContent = `PORTFOLIO / 0${sIdx + 1}`
      }
      // progress dots
      if (hudDotsRef.current) {
        const dots = hudDotsRef.current.querySelectorAll<HTMLElement>('.dot')
        dots.forEach((d, i) => {
          d.style.width  = i === sIdx ? '38px' : '8px'
          d.style.background = i <= sIdx ? ACCENT_RGB : 'rgba(21,17,13,0.2)'
        })
      }
      // audio meter
      if (meterRef.current) {
        const bars = meterRef.current.querySelectorAll<HTMLElement>('.bar')
        bars.forEach((b, i) => {
          const h = 6 + (0.5 + 0.5 * Math.sin(t * METER[i].k + METER[i].ph)) * 30
          b.style.height = `${h}px`
        })
      }

      // ── world callout SVG (femur ripples only, rest is static) ──
      updateWorldSVG(svgWorldRef.current, p, t, A)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pills = ['Video Editing', 'Motion Graphics', 'Thumbnail Design', 'AI Workflows', 'Social Content']

  return (
    <div ref={sectionRef} id="about" style={{ height: '560vh', position: 'relative' }}>
      {/* ── sticky viewport canvas ── */}
      <div ref={frameRef} style={{
        position: 'sticky', top: 0, height: '100vh', width: '100%',
        overflow: 'hidden', background: BG, perspective: '2600px',
      }}>
        {/* 1920×1080 scaled canvas */}
        <div style={{
          position: 'absolute',
          left: fit.ox, top: fit.oy,
          width: W, height: H,
          transform: `scale(${fit.s})`, transformOrigin: '0 0',
        }}>
          {/* ── backdrop grids (static SVG, no rAF) ── */}
          <BackdropGridStatic />

          {/* ── camera world ── */}
          <div ref={worldRef} style={{
            position: 'absolute', inset: 0, transformStyle: 'preserve-3d',
            transform: `translate(0px,0px) scale(1)`,
            transformOrigin: '0 0', willChange: 'transform',
          }}>
            {/* skeleton wrapper */}
            <div ref={skeletonRef} style={{
              position: 'absolute', inset: 0,
              transform: 'translate(0,0) rotate(0deg) scale(1,1)',
              transformOrigin: '50% 94%', willChange: 'transform',
            }}>
              <img ref={tailRef} src="/assets/trex/trex-tail2.png" alt="" draggable={false} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                mixBlendMode: 'multiply', filter: 'contrast(1.10) brightness(0.99) saturate(0.92)',
                userSelect: 'none', pointerEvents: 'none',
                transform: 'rotate(0deg)', transformOrigin: '63.7% 46.9%', willChange: 'transform',
              }} />
              <img src="/assets/trex/trex-body2.png" alt="" draggable={false} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                mixBlendMode: 'multiply', filter: 'contrast(1.10) brightness(0.99) saturate(0.92)',
                userSelect: 'none', pointerEvents: 'none',
              }} />
              <img ref={headRef} src="/assets/trex/trex-head2.png" alt="" draggable={false} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                mixBlendMode: 'multiply', filter: 'contrast(1.10) brightness(0.99) saturate(0.92)',
                userSelect: 'none', pointerEvents: 'none',
                transform: 'rotate(0deg)', transformOrigin: '23.4% 33.1%', willChange: 'transform',
              }} />
            </div>

            {/* heartbeat pulse */}
            <div ref={heartRef} style={{
              position: 'absolute', left: 760, top: 460, width: 360, height: 360,
              transform: 'translate(-50%,-50%) scale(1)',
              background: `radial-gradient(circle, rgba(201,74,40,0.18) 0%, transparent 62%)`,
              mixBlendMode: 'multiply', pointerEvents: 'none', filter: 'blur(2px)',
            }} />

            {/* dust canvas (drawn in rAF) */}
            <canvas ref={canvasRef} width={W} height={H}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

            {/* world callout SVG — structure is static, rAF updates element styles */}
            <WorldSVGStatic svgRef={svgWorldRef} />
          </div>

          {/* ── scene overlays ── */}
          <div ref={intro0Ref} style={{
            position: 'absolute', left: 90, top: 200, width: 1050,
            opacity: 1, transform: 'translateY(0px)',
          }}>
            <EyebrowS text="VIDEO EDITING · MOTION GRAPHICS · AI CONTENT — 2026" />
            <HeadlineS lines={['RAW FOOTAGE', 'IN. STORIES', { t: 'OUT.', accent: true }]} a={1} />
            <SubS text="Video editor & motion designer turning uncut clips into scroll-stopping content — frame by frame, beat by beat." />
            <div style={{
              position: 'absolute', left: 0, bottom: -340,
              fontFamily: MONO, fontSize: 14, letterSpacing: '0.22em', color: INK,
              display: 'flex', alignItems: 'center', gap: 14, opacity: 0.85,
            }}>
              <span>SCROLL TO EXPLORE</span>
              <svg width="40" height="14" viewBox="0 0 40 14">
                <path d="M0 7h36M30 1l6 6-6 6" stroke={INK} strokeWidth="1.4" fill="none" />
              </svg>
            </div>
          </div>

          <div ref={scene1Ref} style={{
            position: 'absolute', right: 90, top: 160, width: 980, textAlign: 'right',
            opacity: 0, transform: 'translateY(28px)',
          }}>
            <EyebrowS text="01 — PRECISION / EVERY FRAME EARNS ITS PLACE" align="right" />
            <HeadlineS lines={['Detail-', { t: 'obsessed.', accent: true }]} a={1} size={188} align="right" />
            <SubS align="right" text="Cuts, colour, keyframes — every micro-decision made with intent. Nothing makes the timeline that doesn't serve the story." />
            <SpecS align="right" rows={[['TOOLS', 'Premiere · After FX'], ['STYLE', 'High-Retention'], ['DELIVERY', '100% On-Time']]} />
          </div>

          <div ref={scene2Ref} style={{
            position: 'absolute', left: 90, bottom: 90, width: 940,
            opacity: 0, transform: 'translateY(28px)',
          }}>
            <EyebrowS text="02 — STRUCTURE / STORY HAS A BACKBONE" />
            <HeadlineS lines={['Structure', { t: 'first.', accent: true }]} a={1} size={188} />
            <SubS text="Pacing and rhythm locked before a single effect is applied. The narrative arc comes first — the polish second." />
            <SpecS rows={[['FORMATS', 'YouTube · Reels · Ads'], ['RHYTHM', '24–60 FPS'], ['TOOLS', 'CapCut · Descript']]} />
          </div>

          <div ref={scene3Ref} style={{
            position: 'absolute', left: 90, top: 160, width: 900,
            opacity: 0, transform: 'translateY(28px)',
          }}>
            <EyebrowS text="03 — IMPACT / AI-AUGMENTED WORKFLOWS" />
            <HeadlineS lines={['Faster.', 'Smarter.', { t: 'Bolder.', accent: true }]} a={1} size={172} />
            <SubS text="Midjourney, HeyGen, Sora — AI workflows that deliver 30% faster production without losing a single frame of quality." />
          </div>

          {/* scene 4: profile — pills + experience strip */}
          <div ref={scene4Ref} style={{
            position: 'absolute', left: 0, right: 0, top: 80,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            opacity: 0, transform: 'translateY(30px)',
          }}>
            <EyebrowS text="PROFILE / 04 — TOOLKIT & EXPERIENCE" align="center" />

            <div style={{
              display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14,
              marginTop: 28, maxWidth: 1200,
            }}>
              {pills.map((label, i) => (
                <div key={label} ref={el => { if (el) pillsRef.current[i] = el }} style={{
                  opacity: 0, transform: 'translateY(18px)',
                  fontFamily: MONO, fontSize: 15, letterSpacing: '0.22em', fontWeight: 700,
                  padding: '14px 28px', border: `1.5px solid ${INK}`,
                  color: INK, borderRadius: 2,
                }}>
                  {label.toUpperCase()}
                </div>
              ))}
            </div>

            {/* experience strip */}
            <div ref={expRef} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36,
              marginTop: 28, maxWidth: 1340, width: '100%',
              padding: '40px 48px',
              background: 'rgba(241,236,226,0.94)',
              borderRadius: 4,
              opacity: 0, transform: 'translateY(20px)',
            }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.28em', color: ACCENT_CSS }}>2026 — ADDA EDUCATION</div>
                <div style={{ fontFamily: DISP, fontWeight: 800, fontSize: 38, letterSpacing: '-0.025em', marginTop: 12, color: INK, lineHeight: 1.05 }}>Video Editor</div>
                <div style={{ fontFamily: MONO, fontSize: 16, lineHeight: 1.65, color: 'rgba(21,17,13,0.7)', marginTop: 14, maxWidth: 500 }}>
                  High-engagement educational content with motion graphics — 100% on-time delivery across high-volume schedules.
                </div>
              </div>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.28em', color: ACCENT_CSS }}>2025 — 1TO10X (TECH STARTUP)</div>
                <div style={{ fontFamily: DISP, fontWeight: 800, fontSize: 38, letterSpacing: '-0.025em', marginTop: 12, color: INK, lineHeight: 1.05 }}>Creative Content &<br />Video Specialist</div>
                <div style={{ fontFamily: MONO, fontSize: 16, lineHeight: 1.65, color: 'rgba(21,17,13,0.7)', marginTop: 14, maxWidth: 500 }}>
                  Full production cycle — concept to delivery. Pioneered AI workflows, boosting production efficiency by 30%.
                </div>
              </div>
            </div>
          </div>

          {/* ── HUD (static structure; rAF updates text & styles) ── */}
          <div ref={hudTLRef} style={hudStyle('top', 28, 'left')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
              <span className="rec-dot" style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 9, background: ACCENT_CSS, opacity: 1 }} />
              REC
            </span>
            <span className="tc" style={{ color: 'rgba(21,17,13,0.5)' }}>TC 00:00:00</span>
          </div>
          <div ref={hudTRRef} style={{ ...hudStyle('top', 28, 'right'), textAlign: 'right' }}>
            <span>SPECIMEN · WHAT I DO</span>
            <span className="sc" style={{ color: 'rgba(21,17,13,0.5)' }}>PORTFOLIO / 01</span>
          </div>
          <div style={hudStyle('bottom', 28, 'left')}>
            <span style={{ color: 'rgba(21,17,13,0.5)' }}>POOJA SINGH · CREATIVE SPECIALIST · 2026</span>
          </div>

          {/* progress dots */}
          <div ref={hudDotsRef} style={{
            position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 14, alignItems: 'center',
            fontFamily: MONO, fontSize: 11, letterSpacing: '0.22em', color: 'rgba(21,17,13,0.5)',
          }}>
            <span>00</span>
            {[0,1,2,3,4].map(i => (
              <div key={i} className="dot" style={{
                width: i === 0 ? 38 : 8, height: 2,
                background: i === 0 ? ACCENT_RGB : 'rgba(21,17,13,0.2)',
                transition: 'width .35s ease, background .35s ease',
              }} />
            ))}
            <span>04</span>
          </div>

          {/* audio meter */}
          <div ref={meterRef} style={{ position: 'absolute', right: 30, bottom: 30, display: 'flex', alignItems: 'flex-end', gap: 4, height: 38 }}>
            {METER.map((_b, i) => (
              <div key={i} className="bar" style={{
                width: 4, height: 16,
                background: i % 5 === 0 ? ACCENT_CSS : INK, opacity: 0.55,
              }} />
            ))}
          </div>

          {/* corner ticks */}
          <CornerTicks />

          {/* vignette + grain */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 80% 80% at 50% 48%, transparent 55%, rgba(0,0,0,0.15) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            mixBlendMode: 'multiply', opacity: 0.06,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '200px 200px',
          }} />
        </div>
      </div>
    </div>
  )
}

// ─── Direct DOM helper ────────────────────────────────────────
function updateOverlay(el: HTMLElement | null, a: number) {
  if (!el) return
  el.style.opacity   = String(a)
  el.style.transform = `translateY(${(1 - a) * 26}px)`
  el.style.pointerEvents = a > 0.5 ? 'auto' : 'none'
}

// ─── World SVG callouts (rAF updates ripples + reticle visibility) ──
function WorldSVGStatic({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  const SK    = [340, 470]
  const RIB_A = [620, 308], RIB_B = [1020, 308]
  const FEMUR = [1180, 740]
  const SPINE = '430,392 560,352 712,330 880,316 1040,308 1212,330 1418,370 1620,418 1846,470'

  return (
    <svg ref={el => { (svgRef as React.MutableRefObject<SVGSVGElement | null>).current = el }} viewBox={`0 0 ${W} ${H}`} width={W} height={H}
      style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
      {/* skull reticle (opacity updated by rAF) */}
      <g id="wg-reticle" opacity="0">
        {([ [-1,-1],[1,-1],[-1,1],[1,1] ] as [number,number][]).map(([dx, dy], i) => {
          const s = 70, k = 18
          const x = SK[0], y = SK[1]
          return <path key={i} fill="none" stroke={ACCENT_CSS} strokeWidth="2.4"
            d={`M${x+dx*s-dx*k},${y+dy*s} L${x+dx*s},${y+dy*s} L${x+dx*s},${y+dy*s-dy*k}`} />
        })}
        <circle id="wg-reticle-circle" cx={SK[0]} cy={SK[1]} r="36" fill="none" stroke={ACCENT_CSS} strokeWidth="1" opacity="0.5" />
        <line x1={SK[0]-8} y1={SK[1]} x2={SK[0]+8} y2={SK[1]} stroke={ACCENT_CSS} strokeWidth="1.4" />
        <line x1={SK[0]} y1={SK[1]-8} x2={SK[0]} y2={SK[1]+8} stroke={ACCENT_CSS} strokeWidth="1.4" />
      </g>
      {/* skull sweep line */}
      <line id="wg-sweep" x1={SK[0]-160} y1={SK[1]} x2={SK[0]+160} y2={SK[1]}
        stroke={ACCENT_CSS} strokeWidth="1.4" opacity="0" />
      {/* spine polyline */}
      <polyline id="wg-spine" points={SPINE} fill="none" stroke={ACCENT_CSS} strokeWidth="3"
        strokeDasharray="1700" strokeDashoffset="1700" opacity="0" strokeLinecap="round" />
      {/* spine dots group */}
      <g id="wg-spine-dots" opacity="0">
        {SPINE.split(' ').map((pt, i) => {
          const [x, y] = pt.split(',').map(Number)
          return <circle key={i} cx={x} cy={y} r="4" fill={BG} stroke={ACCENT_CSS} strokeWidth="2.2" />
        })}
      </g>
      {/* rib bracket */}
      <path id="wg-rib" d={`M${RIB_A[0]},${RIB_A[1]+14} L${RIB_A[0]},${RIB_A[1]} L${RIB_B[0]},${RIB_A[1]} L${RIB_B[0]},${RIB_B[1]+14}`}
        fill="none" stroke={INK} strokeWidth="1.6" opacity="0" />
      {/* femur dot */}
      <g id="wg-femur-dot" opacity="0">
        <circle cx={FEMUR[0]} cy={FEMUR[1]} r="4" fill={ACCENT_CSS} />
        <circle id="wg-femur-pulse" cx={FEMUR[0]} cy={FEMUR[1]} r="10" fill="none" stroke={ACCENT_CSS} strokeWidth="1.5" opacity="0.5" />
      </g>
      {/* femur ripples — 3 ellipses, rAF updates cx/cy/rx/ry/opacity */}
      <ellipse id="wg-ripple-0" cx={FEMUR[0]} cy={FEMUR[1]+230} rx="140" ry="26" fill="none" stroke={ACCENT_CSS} strokeWidth="1.4" opacity="0" />
      <ellipse id="wg-ripple-1" cx={FEMUR[0]} cy={FEMUR[1]+230} rx="140" ry="26" fill="none" stroke={ACCENT_CSS} strokeWidth="1.4" opacity="0" />
      <ellipse id="wg-ripple-2" cx={FEMUR[0]} cy={FEMUR[1]+230} rx="140" ry="26" fill="none" stroke={ACCENT_CSS} strokeWidth="1.4" opacity="0" />
    </svg>
  )
}

function updateWorldSVG(svg: SVGSVGElement | null, p: number, t: number, A: number[]) {
  if (!svg) return
  const a1 = A[1], a2 = A[2], a3 = A[3]
  const spP   = seg(p, 0.44, 0.58, E.outQuart)
  const pulse = 0.5 + 0.5 * Math.sin(t * 3)

  // reticle
  const reticle = svg.getElementById('wg-reticle') as SVGGElement | null
  if (reticle) reticle.setAttribute('opacity', String(a1))
  const retCircle = svg.getElementById('wg-reticle-circle') as SVGCircleElement | null
  if (retCircle) {
    retCircle.setAttribute('r', String(36 * (0.52 + 0.06 * pulse)))
    retCircle.setAttribute('opacity', String(0.35 + 0.35 * pulse))
  }

  // sweep line
  const sweep = svg.getElementById('wg-sweep') as SVGLineElement | null
  if (sweep) sweep.setAttribute('opacity', String(0.45 * a1))

  // spine
  const spinePoly = svg.getElementById('wg-spine') as SVGPolylineElement | null
  if (spinePoly) {
    spinePoly.setAttribute('opacity', String(0.9 * a2))
    spinePoly.setAttribute('stroke-dashoffset', String(1700 * (1 - spP)))
  }
  const spineDots = svg.getElementById('wg-spine-dots') as SVGGElement | null
  if (spineDots) {
    spineDots.setAttribute('opacity', String(a2))
    const circles = spineDots.querySelectorAll('circle')
    const visible = Math.floor(spP * circles.length)
    circles.forEach((c, i) => { c.setAttribute('opacity', i < visible ? '1' : '0') })
  }

  // rib
  const rib = svg.getElementById('wg-rib') as SVGPathElement | null
  if (rib) rib.setAttribute('opacity', String(0.6 * a2))

  // femur
  const femurDot = svg.getElementById('wg-femur-dot') as SVGGElement | null
  if (femurDot) femurDot.setAttribute('opacity', String(a3))
  const femurPulse = svg.getElementById('wg-femur-pulse') as SVGCircleElement | null
  if (femurPulse) femurPulse.setAttribute('r', String(10 + 4 * pulse))

  // ripples
  ;[0, 0.5, 1].forEach((off, i) => {
    const el = svg.getElementById(`wg-ripple-${i}`) as SVGEllipseElement | null
    if (!el) return
    const ph = ((t * 0.6 + off) % 1)
    el.setAttribute('rx', String(140 + ph * 220))
    el.setAttribute('ry', String(26 + ph * 40))
    el.setAttribute('opacity', String(a3 * (1 - ph) * 0.55))
  })
}

// ─── Static backdrop (no rAF updates needed) ─────────────────
function BackdropGridStatic() {
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 25 }, (_, i) => (
          <line key={'v'+i} x1={i*80} y1={0} x2={i*80} y2={H} stroke={INK} strokeWidth="1" opacity="0.035" />
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={'h'+i} x1={0} y1={i*80} x2={W} y2={i*80} stroke={INK} strokeWidth="1" opacity="0.035" />
        ))}
      </svg>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 50 }, (_, i) => (
          <line key={i} x1={i*40} y1={0} x2={i*40} y2={H} stroke={INK} strokeWidth="0.5" opacity="0.025" />
        ))}
        <line id="wg-ground" x1={60} y1={1006} x2={60} y2={1006} stroke={INK} strokeWidth="1.4" opacity="0.32" />
      </svg>
    </>
  )
}

// ─── Atom components (pure static render — no state, no rAF) ──
type Line = string | { t: string; accent: boolean }

function EyebrowS({ text, align }: { text: string; align?: string }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 18, letterSpacing: '0.34em', color: ACCENT_CSS,
      textAlign: (align || 'left') as React.CSSProperties['textAlign'], marginBottom: 18,
      textShadow: `0 1px 12px ${BG}, 0 0px 28px ${BG}`,
    }}>{text}</div>
  )
}

function HeadlineS({ lines, size = 156, align }: { lines: Line[]; a?: number; size?: number; align?: string }) {
  return (
    <div style={{ textAlign: (align || 'left') as React.CSSProperties['textAlign'] }}>
      {lines.map((ln, i) => {
        const isObj  = typeof ln === 'object'
        const text   = isObj ? ln.t : ln
        const accent = isObj && ln.accent
        // static — always fully revealed (rAF controls parent opacity)
        return (
          <div key={i} style={{ lineHeight: `${size}px`, marginBottom: size * 0.04 }}>
            <span style={{
              display: 'inline-block',
              fontFamily: DISP, fontWeight: 900, fontSize: size, letterSpacing: '-0.035em',
              color: accent ? ACCENT_CSS : INK, lineHeight: 1,
              whiteSpace: 'nowrap',
              textShadow: `0 2px 20px ${BG}, 0 0px 40px ${BG}, 0 4px 8px ${BG}`,
              filter: `drop-shadow(0 0 20px ${BG})`,
            }}>{text}</span>
          </div>
        )
      })}
    </div>
  )
}

function SubS({ text, align }: { text: string; align?: string }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 22, letterSpacing: '0.04em',
      color: 'rgba(21,17,13,0.9)', lineHeight: 1.55, marginTop: 30, maxWidth: 720,
      textAlign: (align || 'left') as React.CSSProperties['textAlign'],
      marginLeft: align === 'right' ? 'auto' : 0,
      textShadow: `0 1px 12px ${BG}, 0 0px 24px ${BG}`,
    }}>{text}</div>
  )
}

function SpecS({ rows, align }: { rows: [string, string][]; align?: string }) {
  return (
    <div style={{ marginTop: 34, display: 'flex', gap: 28, justifyContent: align === 'right' ? 'flex-end' : 'flex-start', flexWrap: 'wrap' }}>
      {rows.map(([k, v], i) => (
        <div key={i} style={{ borderLeft: `2px solid ${ACCENT_CSS}`, paddingLeft: 12, fontFamily: MONO }}>
          <div style={{ fontSize: 11, letterSpacing: '0.24em', color: 'rgba(21,17,13,0.5)' }}>{k}</div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.06em', color: INK, marginTop: 2 }}>{v}</div>
        </div>
      ))}
    </div>
  )
}

function CornerTicks() {
  const L = 26, off = 22, col = 'rgba(21,17,13,0.32)'
  const c = (top: boolean, left: boolean) => (
    <svg key={(top?'t':'b')+(left?'l':'r')} width={L} height={L}
      style={{ position: 'absolute', [top?'top':'bottom']: off, [left?'left':'right']: off, pointerEvents: 'none' }}>
      <path d={`M${left?0:L},${top?L:0} L${left?0:L},${top?0:L} L${left?L:0},${top?0:L}`}
        fill="none" stroke={col} strokeWidth="1.5" />
    </svg>
  )
  return <>{c(true,true)}{c(true,false)}{c(false,true)}{c(false,false)}</>
}

function hudStyle(vy: 'top'|'bottom', vx: number, side: 'left'|'right'): React.CSSProperties {
  return {
    position: 'absolute', [vy]: vx, [side]: vx,
    display: 'flex', flexDirection: 'column', gap: 4,
    fontFamily: MONO, fontSize: 13, letterSpacing: '0.14em', color: INK,
  }
}
