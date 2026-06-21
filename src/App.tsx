// Updated: 2026-06-19
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence, useScroll } from 'motion/react'
import Lenis from 'lenis'
import { NinjaDojo } from './NinjaDojo'
import {
  ArrowUpRight,
  Award,
  Crown,
  X,
} from 'lucide-react'

const NAV_LINKS = ['Work', 'About', 'Skills', 'Contact']
const CONTACT_EMAIL = 'mailto:Poojasingh10099@gmail.com'

const STATS: [string, string, string][] = [
  ['100', '%', 'On-Time Delivery'],
  ['30', '%', 'Faster With AI'],
  ['10', '+', 'Creative Tools'],
]



const DINO_VIDEO = '/assets/videos/dino_whatido.mp4'


const WORK_CHAPTERS = [
  {
    num: '01',
    category: 'YouTube Edits',
    title: 'HIGH-RETENTION\nEDITS',
    desc: 'Education & startup channels. High-energy hooks, zero dead frames — 100% on-time delivery.',
    ghost: 'EDITS',
    accent: '#FF3D2E',
    video: '/assets/videos/char_running.mp4',
  },
  {
    num: '02',
    category: 'Motion Graphics',
    title: 'KINETIC\nVISUAL STORIES',
    desc: 'Dynamic text, motion titles, animated storytelling — built to stop the scroll dead in its tracks.',
    ghost: 'MOTION',
    accent: '#FF3D2E',
    video: '/assets/videos/char_combat.mp4',
  },
  {
    num: '03',
    category: 'Thumbnail Design',
    title: 'HIGH-CTR\nTHUMBNAILS',
    desc: 'Click-bait done right. Social-first hooks that make audiences click before they know why.',
    ghost: 'THUMBS',
    accent: '#f0dfc4',
    video: '/assets/videos/char_standing.mp4',
  },
  {
    num: '04',
    category: 'Brand Decks',
    title: 'VISUAL BRAND\nLANGUAGE',
    desc: "Decks that don't just look good — they sell ideas. Brand-consistent, stakeholder-ready.",
    ghost: 'BRAND',
    accent: '#FF3D2E',
    video: '/assets/videos/char_leaning.mp4',
  },
  {
    num: '05',
    category: 'AI Content',
    title: 'GENERATIVE\nAI WORKFLOWS',
    desc: 'Midjourney · HeyGen · Sora · Minimax — generative pipelines that cut production time by 30%.',
    ghost: 'AI',
    accent: '#FF3D2E',
    video: '/assets/videos/char_jumping.mp4',
  },
]



const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
}

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const

// Word-by-word mask reveal (Artego-style): each word slides up out of a clip,
// staggered, when scrolled into view.
function RevealText({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const words = text.split(' ')
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
      style={{ display: 'inline' }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'bottom',
            paddingBottom: '0.12em',
            marginBottom: '-0.12em',
          }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            variants={{ hidden: { y: '120%' }, visible: { y: 0 } }}
            transition={{ duration: 0.7, ease: REVEAL_EASE }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

// Single-line clip reveal: slides arbitrary children (keeps accent spans / icons)
// up out of a mask when scrolled into view.
function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.span
      className={className}
      style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.12em' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.span
        style={{ display: 'block' }}
        variants={{ hidden: { y: '115%' }, visible: { y: 0 } }}
        transition={{ duration: 0.9, ease: REVEAL_EASE, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

// Scroll-driven work section — each of 5 character videos scrubs as user scrolls,
// smooth continuous playback mapped to scroll progress within each video's section.
function SkillsCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Determine which video and update its time based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (p: number) => {
      const videoIndex = Math.floor(p * WORK_CHAPTERS.length)
      const videoProgress = (p * WORK_CHAPTERS.length - videoIndex) % 1

      for (let i = 0; i < videoRefs.current.length; i++) {
        const video = videoRefs.current[i]
        if (!video) continue

        if (i === videoIndex) {
          const duration = video.duration
          if (duration > 0 && isFinite(duration)) {
            video.currentTime = videoProgress * duration
          }
        } else {
          video.currentTime = 0
        }
      }
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full bg-black"
      style={{ height: `${WORK_CHAPTERS.length * 100}svh` }}
    >
      {WORK_CHAPTERS.map((chapter, i) => (
        <div
          key={i}
          className="sticky top-0 h-svh overflow-hidden bg-black"
        >
          {/* ── FULL VIDEO BACKGROUND (SCROLL-DRIVEN SCRUBBING) ── */}
          <video
            ref={(el) => {
              videoRefs.current[i] = el
            }}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center' }}
            src={chapter.video}
          />

          {/* ── VIGNETTE OVERLAY ── */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              zIndex: 10,
              background: 'radial-gradient(ellipse 55% 60% at 50% 35%, transparent 0%, rgba(0,0,0,0.25) 58%, rgba(0,0,0,0.85) 100%)',
            }}
          />

          {/* ── FILM GRAIN ── */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              zIndex: 11,
              opacity: 0.22,
              backgroundSize: '160px 160px',
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
            }}
          />

          {/* ── SCANLINES ── */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              zIndex: 11,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
            }}
          />

          {/* ── CHAPTER INFO (bottom-left) ── */}
          <div
            className="pointer-events-none absolute bottom-8 left-8"
            style={{ zIndex: 20 }}
          >
            <div style={{ color: chapter.accent, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
              {chapter.num} — {chapter.category}
            </div>
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', color: 'white', lineHeight: 0.9, maxWidth: '350px', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              {chapter.title}
            </h3>
          </div>
        </div>
      ))}
    </section>
  )
}


export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null)
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [videoThumbnails, setVideoThumbnails] = useState<{ [key: string]: string }>({})
  const contactVideoRef = useRef<HTMLVideoElement>(null)

  // Lenis smooth/inertia scrolling (Artego-style premium scroll feel)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])



  // Vimeo Video Streaming - Instant Playback + High Quality
  useEffect(() => {
    const videoUrls = [
      'https://vimeo.com/1201241359',
      'https://vimeo.com/1201241358',
      'https://vimeo.com/1201241357',
      'https://vimeo.com/1201243199',
      'https://vimeo.com/1201243165',
      'https://vimeo.com/1201243162',
      'https://vimeo.com/1201243163',
      'https://vimeo.com/1201243164',
    ]

    // Preload links for browser hints
    videoUrls.forEach((url) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'video'
      link.href = url
      document.head.appendChild(link)
    })

    // Prefetch videos in background using fetch API (more aggressive)
    videoUrls.forEach((url) => {
      fetch(url, { priority: 'low' }).catch(() => {
        // Silently fail if prefetch not supported
      })
    })
  }, [])

  // Reset loading state when video changes
  useEffect(() => {
    setIsVideoLoading(true)
    setVideoAspectRatio(null)
  }, [selectedVideo])

  // Fetch Vimeo thumbnails
  useEffect(() => {
    const videoIds = [
      '1201241359',
      '1201241358',
      '1201241357',
      '1201243199',
      '1201243165',
      '1201243162',
      '1201243163',
      '1201243164',
    ]

    videoIds.forEach((videoId) => {
      fetch(`https://vimeo.com/api/v2/video/${videoId}.json`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data[0] && data[0].thumbnail_large) {
            setVideoThumbnails((prev) => ({
              ...prev,
              [videoId]: data[0].thumbnail_large,
            }))
          }
        })
        .catch(() => {
          // Silently fail if thumbnail fetch fails
        })
    })
  }, [])

  // Increase contact video playback speed
  useEffect(() => {
    if (contactVideoRef.current) {
      contactVideoRef.current.playbackRate = 1.8 // 1.8x speed (faster animation)
    }
  }, [])

  return (
    <>
      {/* ============ SECTION 1: HERO ============ */}
      <section className="relative flex min-h-svh w-full flex-col overflow-hidden bg-black">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-contain"
          style={{ objectPosition: 'center' }}
          src="/assets/videos/hero_main.mp4"
        />


        {/* Navbar */}
        <nav className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16 lg:py-7">
          <a
            href="#"
            className="font-display text-2xl tracking-[0.06em] text-white sm:text-3xl"
          >
            POOJA&nbsp;SINGH
          </a>

          <div className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 transition-colors hover:text-white"
              >
                {link}
              </a>
            ))}
          </div>

          <a
            href={CONTACT_EMAIL}
            className="hidden items-center gap-2 border border-white/25 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-all hover:border-crimson hover:bg-crimson/10 md:flex"
          >
            GET IN TOUCH
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="space-y-1.5 md:hidden"
          >
            <div className="h-0.5 w-6 bg-white" />
            <div className="h-0.5 w-6 bg-white" />
            <div className="h-0.5 w-4 bg-white" />
          </button>
        </nav>

        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm transition-all duration-500 md:hidden ${
            menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 sm:px-10">
            <span className="font-display text-2xl tracking-[0.06em] text-white sm:text-3xl">
              POOJA&nbsp;SINGH
            </span>
            <button aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X className="h-7 w-7 text-white" />
            </button>
          </div>

          <div className="flex h-[calc(100%-88px)] flex-col items-center justify-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="font-display text-5xl tracking-[0.04em] text-white transition-colors hover:text-crimson sm:text-6xl"
                style={{
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  transitionDelay: `${i * 80 + 100}ms`,
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                {link}
              </a>
            ))}

            <a
              href={CONTACT_EMAIL}
              onClick={() => setMenuOpen(false)}
              className="mt-4 flex items-center gap-2 border border-white/25 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-all hover:border-crimson hover:bg-crimson/10"
              style={{
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: `${NAV_LINKS.length * 80 + 100}ms`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              GET IN TOUCH
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Hero content */}
        <main className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-[clamp(1.5rem,4vh,3rem)] sm:px-10 lg:px-16">
          {/* Tagline */}
          <div className="animate-fade-up mb-[clamp(0.75rem,2.5vh,1.75rem)] flex items-center gap-3">
            <Crown className="h-4 w-4 text-crimson" />
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/75 sm:text-xs">
              Creative Content & Video Specialist
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display uppercase leading-[0.9] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)]">
            <span className="block text-[clamp(2.75rem,min(7.5vw,10.5vh),6.75rem)]">
              <MaskReveal delay={0.1}>
                Create<span className="text-crimson">.</span>
              </MaskReveal>
            </span>
            <span className="block text-[clamp(2.75rem,min(7.5vw,10.5vh),6.75rem)]">
              <MaskReveal delay={0.22}>
                Captivate<span className="text-crimson">.</span>
              </MaskReveal>
            </span>
            <span className="block text-[clamp(2.75rem,min(7.5vw,10.5vh),6.75rem)]">
              <MaskReveal delay={0.34}>
                Convert<span className="text-crimson">.</span>
              </MaskReveal>
            </span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up-delay-2 mt-[clamp(1rem,3vh,2rem)] max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
            I craft scroll-stopping videos and visuals
            <br />
            that don't just get views —{' '}
            <span className="font-semibold text-crimson">they convert.</span>
          </p>

          {/* CTA row */}
          <div className="animate-fade-up-delay-3 mt-[clamp(1.25rem,3.5vh,2.5rem)] flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="#work"
              className="group flex items-center gap-2 bg-white px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-black transition-colors duration-200 hover:bg-crimson hover:text-white sm:px-8 sm:py-4 sm:text-xs"
            >
              SEE MY WORK
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <div className="hidden items-center gap-3 sm:flex">
              <Award className="h-8 w-8 text-white/50" />
              <div className="text-[11px] font-medium uppercase leading-relaxed tracking-[0.15em] text-white/60">
                <div>AI-Powered</div>
                <div>Creative Workflow</div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="animate-fade-up-delay-4 mt-[clamp(1.5rem,4vh,3rem)] flex flex-wrap gap-8 sm:gap-14 lg:gap-20">
            {STATS.map(([value, unit, label]) => (
              <div key={label}>
                <div className="font-display text-[clamp(1.75rem,min(4vw,7vh),3.75rem)] text-white">
                  {value}
                  <span className="text-crimson">{unit}</span>
                </div>
                <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 sm:text-xs">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </main>
      </section>

      {/* ============ SECTION 2: WHAT I DO ============ */}
      <section id="about" className="relative z-20 flex w-full flex-col items-center overflow-hidden bg-white px-6 pb-16 pt-24 text-[#111] sm:px-10 md:pb-24 md:pt-32 lg:px-16">
        {/* Dinosaur video background — covers full section including career cards */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-white">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={DINO_VIDEO}
          />
        </div>

        {/* Section label */}
        <motion.div
          {...fadeUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 mb-6 text-center text-[10px] uppercase tracking-[0.2em] text-[#111] md:mb-8 md:text-[11px]"
        >
          <span className="text-crimson">[ 02 ]</span>{' '}
          <span className="font-semibold">What I Do</span>
        </motion.div>

        {/* Main heading */}
        <h2 className="relative z-10 mb-10 max-w-4xl text-center font-display text-[2.2rem] font-medium leading-tight tracking-tight text-[#111] drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] md:mb-14 md:text-[3.5rem]">
          <RevealText text="Raw footage in. Scroll-stopping stories out — editing, motion and design built to make brands" />
          {' '}<span className="text-crimson"><RevealText text="impossible to ignore." delay={0.3} /></span>
        </h2>

        {/* Skill pills */}
        <motion.div
          {...fadeUp}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="relative z-10 flex flex-wrap justify-center gap-3 md:gap-4"
        >
          {['Video Editing', 'Motion Graphics', 'Thumbnail Design', 'AI Workflows', 'Social Content'].map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-[#111]/20 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111] backdrop-blur-sm md:px-5 md:text-[12px]"
            >
              {skill}
            </span>
          ))}
        </motion.div>

        {/* Experience strip */}
        <motion.div
          {...fadeUp}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="relative z-10 mt-16 grid w-full max-w-[1000px] gap-10 rounded-xl border-t border-gray-300 bg-black/85 px-8 py-12 sm:grid-cols-2 sm:px-12 sm:py-14"
        >
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.25em] text-crimson sm:text-[14px]">
              2026 — Adda Education
            </div>
            <div className="mt-3 font-display text-3xl font-medium tracking-[0.03em] text-white sm:text-4xl">
              Video Editor
            </div>
            <p className="mt-3 max-w-sm text-[14px] leading-[1.7] text-white/85 sm:text-[15px]">
              High-engagement educational video content with motion graphics —
              100% on-time delivery across high-volume schedules.
            </p>
          </div>
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.25em] text-crimson sm:text-[14px]">
              2025 — 1to10X (Tech Startup)
            </div>
            <div className="mt-3 font-display text-3xl font-medium tracking-[0.03em] text-white sm:text-4xl">
              Creative Content & Video Specialist
            </div>
            <p className="mt-3 max-w-sm text-[14px] leading-[1.7] text-white/85 sm:text-[15px]">
              Owned the full production cycle — concept, shoot, edit. Pioneered
              generative AI workflows, boosting production efficiency by 30%.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ============ SECTION 2.5: PROJECTS PORTFOLIO ============ */}
      <section id="projects" className="relative z-25 w-full bg-white px-6 pb-20 pt-24 sm:px-10 md:pb-32 md:pt-36 lg:px-16">
        {/* Section label */}
        <motion.div
          {...fadeUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8 text-center text-[10px] uppercase tracking-[0.2em] text-gray-700 md:mb-10 md:text-[11px]"
        >
          <span className="text-crimson">[ 02.5 ]</span>{' '}
          <span className="font-semibold">My Projects</span>
        </motion.div>

        {/* Heading */}
        <h2 className="mb-16 text-center font-display text-[2.5rem] font-medium leading-tight tracking-tight text-gray-900 md:mb-20 md:text-[3.5rem]">
          <RevealText text="Recent Works & Productions" />
        </h2>

        {/* 8 Video Grid - Vimeo Streaming */}
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            '1201241359',
            '1201241358',
            '1201241357',
            '1201243199',
            '1201243165',
            '1201243162',
            '1201243163',
            '1201243164',
          ].map((videoId, idx) => (
            <motion.div
              key={idx + 1}
              variants={{
                initial: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
                whileInView: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' },
              }}
              transition={{ duration: 0.8, ease: REVEAL_EASE }}
              className="group relative aspect-video overflow-hidden rounded-lg bg-gray-900 shadow-lg transition-shadow duration-300 hover:shadow-2xl cursor-pointer"
              onClick={() => setSelectedVideo(videoId)}
            >
              {/* Thumbnail layer — scales in for a reveal, zooms on hover */}
              <motion.div
                variants={{ initial: { scale: 1.25 }, whileInView: { scale: 1 } }}
                transition={{ duration: 1, ease: REVEAL_EASE }}
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: videoThumbnails[videoId] ? `url('${videoThumbnails[videoId]}')` : `url('https://res.cloudinary.com/dxh4m2kyv/video/upload/so_2/${['Project1_jlclkr', 'Project2_rs2hyp', 'Project3_txa12o', 'Project4_qdgp7e', 'Project5_nk5klx', 'Project6_dfg7yu', 'Project7_np6piy', 'Project8_nlwa4s'][idx]}.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="text-white font-semibold">Project {idx + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          {...fadeUp}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          className="mt-16 flex justify-center md:mt-20"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-crimson px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-crimson/90 hover:shadow-lg"
          >
            View All Projects
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </section>

      {/* ============ SECTION 3: NINJA DOJO SKILLS ============ */}
      <NinjaDojo />

      {/* ============ SECTION 3.6: WORK SHOWCASE ============ */}
      <SkillsCarousel />

      {/* ============ SECTION 4: CONTACT (fullscreen hero video) ============ */}
      <section id="contact" className="relative min-h-screen overflow-hidden bg-[#f0f0ee]">
        {/* Background video - Robotic hand with increased speed */}
        <video
          ref={contactVideoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
        />

        {/* Foreground wrapper */}
        <div className="relative z-10 flex min-h-screen flex-col">

          {/* Hero content (bottom-left aligned) */}
          <div className="flex flex-1 items-end px-6 pb-10 sm:px-12 md:px-20 sm:pb-16 lg:px-28 lg:pb-20">
            <div className="max-w-sm">
              {/* Badge */}
              <a href="#" className="group mb-3 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-500 transition-colors duration-200 hover:text-blue-600">
                Let's Create Something Amazing
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>

              {/* Headline */}
              <h1 className="mb-3 text-[1.5rem] font-medium leading-[1.15] tracking-tight text-gray-900 sm:text-[1.75rem]">
                Get in Touch & Let's Collaborate
              </h1>

              {/* Subtext */}
              <p className="mb-6 text-[13px] font-normal text-gray-600 leading-relaxed">
                Ready to turn your vision into reality? I'm here to discuss your next creative project.
              </p>

              {/* Contact Details */}
              <div className="mb-6 space-y-3 text-[13px] text-gray-700">
                <a
                  href={CONTACT_EMAIL}
                  className="flex items-center gap-2 transition-colors hover:text-blue-600"
                >
                  <span className="font-semibold text-gray-900">Email:</span>
                  <span className="underline">Poojasingh10099@gmail.com</span>
                </a>
                <a
                  href="tel:+916205011981"
                  className="flex items-center gap-2 transition-colors hover:text-blue-600"
                >
                  <span className="font-semibold text-gray-900">Phone:</span>
                  <span className="underline">+91 62050 11981</span>
                </a>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Location:</span>
                  <span>Delhi, Shahdara</span>
                </div>
              </div>

              {/* CTA */}
              <a
                href={CONTACT_EMAIL}
                className="group inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-[13px] font-medium text-white transition-all duration-200 hover:bg-blue-600 hover:shadow-lg"
              >
                Send Me an Email
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </div>

          {/* Footer text */}
          <div className="relative z-20 border-t border-gray-300 bg-white/80 px-6 py-4 text-center text-[10px] uppercase tracking-widest text-gray-500 sm:px-10 lg:px-16">
            (C) 2026 Pooja Singh — Creative Content & Video Specialist
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-black rounded-lg overflow-hidden shadow-2xl"
              style={{
                maxWidth: videoAspectRatio && videoAspectRatio < 1 ? 'min(90vw, 500px)' : '95vw',
                maxHeight: '90vh',
                width: videoAspectRatio && videoAspectRatio < 1 ? 'min(90vw, 500px)' : '95vw',
                height: videoAspectRatio && videoAspectRatio < 1 ? '90vh' : 'auto',
                aspectRatio: videoAspectRatio || '16 / 9',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors duration-200"
              >
                <X className="h-6 w-6 text-white" />
              </button>

              {/* Loading Spinner */}
              {isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                    <span className="text-white text-sm font-medium">Loading video...</span>
                  </div>
                </div>
              )}

              {/* Vimeo Player */}
              <iframe
                src={`https://player.vimeo.com/video/${selectedVideo}?badge=0&autopause=0&player_id=0&app_id=58479`}
                className="h-full w-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                onLoad={() => {
                  setIsVideoLoading(false)
                  // Set default aspect ratio for portrait/landscape detection
                  setVideoAspectRatio(16 / 9)
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}