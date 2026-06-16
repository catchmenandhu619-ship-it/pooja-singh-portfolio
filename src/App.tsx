import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, usePresence } from 'motion/react'
import {
  ArrowUpRight,
  Award,
  Clapperboard,
  Cpu,
  Crown,
  Image as ImageIcon,
  Megaphone,
  Sparkles,
  X,
} from 'lucide-react'

const NAV_LINKS = ['Work', 'About', 'Skills', 'Contact']
const CONTACT_EMAIL = 'mailto:Poojasingh10099@gmail.com'

const STATS: [string, string, string][] = [
  ['100', '%', 'On-Time Delivery'],
  ['30', '%', 'Faster With AI'],
  ['10', '+', 'Creative Tools'],
]

const SKILL_PILLS = [
  { icon: Clapperboard, label: 'Video Editing' },
  { icon: Sparkles, label: 'Motion Graphics' },
  { icon: ImageIcon, label: 'Thumbnail Design' },
  { icon: Cpu, label: 'AI Workflows' },
  { icon: Megaphone, label: 'Social Content' },
]

const CHAPTERS = [
  {
    name: 'YouTube Edits',
    desc: 'High-retention edits for education and startup channels',
    image: 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624247/01_udnber.png',
  },
  {
    name: 'Motion Graphics',
    desc: 'Dynamic text animations and visual storytelling',
    image: 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624374/02_pmvxxl.png',
  },
  {
    name: 'Thumbnail Design',
    desc: 'High-CTR thumbnails and social media carousels',
    image: 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624236/03_hcp3jc.png',
  },
  {
    name: 'Brand Decks',
    desc: 'Presentation decks and visual aids with strict brand consistency',
    image: 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624256/04_get63z.png',
  },
  {
    name: 'AI Content',
    desc: 'Generative AI workflows — Midjourney, HeyGen, Sora and beyond',
    image: 'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624251/05_kz1tyu.png',
  },
]

const PTERODACTYL_IMG =
  'https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779625001/ChatGPT_Image_May_23_2026_12_24_44_PM_1_lv1dne.png'

const DINO_VIDEO =
  'https://res.cloudinary.com/dsdxaxkiz/video/upload/v1779624998/magnific_use-img-2-as-the-exact-ba_Piu3X0W42C_wnrc8f.mp4'

/**
 * Sand/particle dissolve transition driven by an SVG filter chain
 * (turbulence -> displacement -> offset -> blur -> alpha fade).
 * Works inside AnimatePresence via usePresence.
 */
function SandTransitionImage({ src, alt }: { src: string; alt: string }) {
  const [isPresent, safeToRemove] = usePresence()
  const filterId = useRef(`sand-${Math.random().toString(36).slice(2, 9)}`)
  const dispRef = useRef<SVGFEDisplacementMapElement>(null)
  const offsetRef = useRef<SVGFEOffsetElement>(null)
  const blurRef = useRef<SVGFEGaussianBlurElement>(null)
  const matrixRef = useRef<SVGFEColorMatrixElement>(null)

  useEffect(() => {
    const DURATION = 900
    const entering = isPresent
    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1)
      const eased = entering ? 1 - Math.pow(1 - t, 4) : Math.pow(t, 3)
      // p = how dissolved the image is (0 = fully visible)
      const p = entering ? 1 - eased : eased
      dispRef.current?.setAttribute('scale', String(150 * p))
      offsetRef.current?.setAttribute('dy', String(entering ? -80 * p : 120 * p))
      offsetRef.current?.setAttribute('dx', String(entering ? -30 * p : 30 * p))
      blurRef.current?.setAttribute('stdDeviation', String(6 * p))
      const alpha = Math.max(0, 1 - p * 1.2)
      matrixRef.current?.setAttribute(
        'values',
        `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${alpha} 0`,
      )
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else if (!entering) {
        safeToRemove?.()
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isPresent, safeToRemove])

  return (
    <>
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <filter id={filterId.current} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="4" result="noise" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="0" />
          <feOffset ref={offsetRef} dx="0" dy="0" />
          <feGaussianBlur ref={blurRef} stdDeviation="0" />
          <feColorMatrix
            ref={matrixRef}
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          />
        </filter>
      </svg>
      <img
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        className="absolute inset-0 m-auto h-[80%] w-[80%] object-contain mix-blend-lighten"
        style={{ filter: `url(#${filterId.current})` }}
      />
    </>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeChapter, setActiveChapter] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null)
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [videoThumbnails, setVideoThumbnails] = useState<{ [key: string]: string }>({})
  const contactVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % CHAPTERS.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), 2800)
    return () => clearTimeout(timer)
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
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4"
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
          <h1 className="animate-fade-up-delay-1 font-display uppercase leading-[0.9] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)]">
            <span className="block text-[clamp(2.75rem,min(7.5vw,10.5vh),6.75rem)]">
              Create<span className="text-crimson">.</span>
            </span>
            <span className="block text-[clamp(2.75rem,min(7.5vw,10.5vh),6.75rem)]">
              Captivate<span className="text-crimson">.</span>
            </span>
            <span className="block text-[clamp(2.75rem,min(7.5vw,10.5vh),6.75rem)]">
              Convert<span className="text-crimson">.</span>
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

      {/* ============ SECTION 2: WHAT I DO (light) ============ */}
      <section
        id="about"
        className="relative z-20 flex w-full flex-col items-center bg-[#fcfcfc] px-6 pb-16 pt-24 text-[#111] sm:px-10 md:pb-24 md:pt-32 lg:px-16"
      >
        {/* Walking-dinosaur video playing behind the text (delayed reveal) */}
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
              src={DINO_VIDEO}
            />
          </motion.div>
        )}

        {/* Section label */}
        <motion.div
          {...fadeUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 mb-10 text-[10px] uppercase tracking-[0.2em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] md:mb-12 md:text-[11px]"
        >
          <span className="text-crimson">[ 02 ]</span>{' '}
          <span className="font-semibold text-gray-900">What I Do</span>
        </motion.div>

        {/* Main statement */}
        <motion.h2
          {...fadeUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative z-10 mb-12 max-w-[1000px] text-center text-[2rem] font-medium leading-[1.12] tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] md:mb-16 md:text-[3.2rem] lg:text-[3.8rem]"
        >
          Raw footage in. Scroll-stopping stories out — editing, motion and
          design built to make brands{' '}
          <span className="text-crimson">impossible to ignore.</span>
        </motion.h2>

        {/* Skill pills */}
        <motion.div
          id="skills"
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="relative z-10 mb-14 flex flex-wrap items-center justify-center gap-3 md:mb-20 md:gap-4"
        >
          {SKILL_PILLS.map(({ icon: Icon, label }) => (
            <motion.button
              key={label}
              variants={{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex items-center gap-2 rounded-full border border-gray-400 bg-white/75 px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-gray-800 backdrop-blur-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-colors duration-300 hover:border-black hover:bg-black hover:text-white"
            >
              <Icon size={14} strokeWidth={2} />
              {label}
            </motion.button>
          ))}
        </motion.div>

        {/* Experience strip */}
        <motion.div
          {...fadeUp}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 grid w-full max-w-[1000px] gap-10 rounded-xl border-t border-gray-300 bg-black/85 px-8 py-12 sm:grid-cols-2 sm:px-12 sm:py-14"
        >
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.25em] text-crimson drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:text-[14px]">
              2026 — Adda Education
            </div>
            <div className="mt-3 font-display text-3xl font-medium tracking-[0.03em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:text-4xl">
              Video Editor
            </div>
            <p className="mt-3 max-w-sm text-[14px] leading-[1.7] text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] sm:text-[15px]">
              High-engagement educational video content with motion graphics —
              100% on-time delivery across high-volume schedules.
            </p>
          </div>
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.25em] text-crimson drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:text-[14px]">
              2025 — 1to10X (Tech Startup)
            </div>
            <div className="mt-3 font-display text-3xl font-medium tracking-[0.03em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:text-4xl">
              Creative Content & Video Specialist
            </div>
            <p className="mt-3 max-w-sm text-[14px] leading-[1.7] text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] sm:text-[15px]">
              Owned the full production cycle — concept, shoot, edit. Pioneered
              generative AI workflows, boosting production efficiency by 30%.
            </p>
          </div>
        </motion.div>

        {/* Spacer — room for the pterodactyl from the next section to overlap upward */}
        <div className="min-h-[220px] w-full md:min-h-[450px]" />

        {/* Bottom text */}
        <div className="pointer-events-none relative z-10 mt-16 hidden w-full max-w-[1200px] justify-between text-[10px] font-medium uppercase tracking-widest text-gray-500 md:flex">
          <span>I DON'T JUST EDIT VIDEOS.</span>
          <span>POOJA SINGH (C) 2026</span>
        </div>
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
        <motion.h2
          {...fadeUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="mb-16 text-center font-display text-[2.5rem] font-medium leading-tight tracking-tight text-gray-900 md:mb-20 md:text-[3.5rem]"
        >
          Recent Works & Productions
        </motion.h2>

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
                initial: { opacity: 0, y: 30 },
                whileInView: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="group relative aspect-video overflow-hidden rounded-lg bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer"
              onClick={() => setSelectedVideo(videoId)}
              style={{
                backgroundImage: videoThumbnails[videoId] ? `url('${videoThumbnails[videoId]}')` : `url('https://res.cloudinary.com/dxh4m2kyv/video/upload/so_2/${['Project1_jlclkr', 'Project2_rs2hyp', 'Project3_txa12o', 'Project4_qdgp7e', 'Project5_nk5klx', 'Project6_dfg7yu', 'Project7_np6piy', 'Project8_nlwa4s'][idx]}.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
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

      {/* ============ SECTION 3: SELECTED WORK ============ */}
      <section id="work" className="relative z-30 flex w-full flex-col bg-white text-gray-900">
        {/* Pterodactyl flying overlap into the section above */}
        <motion.img
          src={PTERODACTYL_IMG}
          alt=""
          initial={{ x: '-50%', y: '-65%', opacity: 0 }}
          whileInView={{ x: '-50%', y: '-78%', opacity: 1 }}
          viewport={{ once: true, margin: '100px' }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="pointer-events-none absolute left-1/2 top-0 z-0 w-[160vw] max-w-none opacity-25 md:w-[1100px]"
        />

        {/* Heading area */}
        <div className="relative z-10 flex flex-col justify-between gap-10 px-6 pb-14 pt-24 sm:px-10 md:pt-32 lg:px-16 xl:flex-row xl:items-end">
          <motion.h2
            {...fadeUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-3xl text-[1.8rem] font-medium leading-[1.15] tracking-tight text-gray-900 md:text-[3rem] lg:text-[3.4rem]"
          >
            Work that doesn't just{' '}
            <span className="mx-2 inline-flex translate-y-[-4px] gap-2 align-middle md:mx-3 md:gap-3">
              {[Clapperboard, Sparkles, ImageIcon].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-400 transition-colors duration-300 hover:border-crimson hover:bg-crimson hover:text-white md:h-14 md:w-14"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </span>
              ))}
            </span>
            look good — <span className="text-crimson">it performs.</span>
          </motion.h2>

          <motion.div
            {...fadeUp}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
            className="shrink-0"
          >
            <p className="mb-6 text-[9px] uppercase leading-relaxed tracking-widest text-gray-500 md:text-[10px]">
              I don't just make content
              <br />I make content that converts
            </p>
            <div className="flex flex-wrap gap-3">
              {['Strategic', 'Brand-Aligned', 'High-Retention'].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-gray-300 px-5 py-2 text-[9px] uppercase tracking-widest text-gray-600 transition-colors duration-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                >
                  {pill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* AGGRESSIVE NEW DESIGN - Skills Showcase */}
        <div className="relative z-10 px-6 py-20 sm:px-10 md:py-32 lg:px-16">
          {/* Chapter Gallery - Integrated */}
          <div className="mb-24 flex flex-col items-center gap-8">
            <div className="relative h-40 w-full max-w-lg md:h-56">
              <AnimatePresence mode="wait">
                <SandTransitionImage
                  key={activeChapter}
                  src={CHAPTERS[activeChapter].image}
                  alt={CHAPTERS[activeChapter].name}
                />
              </AnimatePresence>
            </div>
            <motion.div
              key={activeChapter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h3 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">{CHAPTERS[activeChapter].name}</h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">{CHAPTERS[activeChapter].desc}</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-gray-500">
                <span className="text-lg font-bold text-crimson">0{activeChapter + 1}</span>
                <span>/</span>
                <span>05</span>
              </div>
            </motion.div>
          </div>

          {/* Three Categories - Full Width Showcase */}
          <div className="space-y-20">
            {/* Technical Skills - Bold Red Theme */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="mb-8 flex items-center gap-4">
                <div className="h-1 w-12 bg-gradient-to-r from-crimson to-crimson/50" />
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-crimson md:text-3xl">Technical Skills</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-crimson/30 to-transparent" />
              </div>
              <motion.div
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: '-50px' }}
                transition={{ staggerChildren: 0.06, delayChildren: 0.1 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {['Adobe Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator', 'Canva', 'CapCut', 'Descript', 'Motion Graphics'].map((skill, idx) => (
                  <motion.div
                    key={skill}
                    variants={{
                      initial: { opacity: 0, rotateX: -20, y: 20 },
                      whileInView: { opacity: 1, rotateX: 0, y: 0 },
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="group relative h-32 cursor-pointer"
                    style={{ perspective: '1000px' }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-full w-full rounded-xl border-2 border-crimson/30 bg-gradient-to-br from-crimson/5 to-white p-4 transition-all duration-300 hover:border-crimson hover:shadow-[0_0_30px_rgba(255,61,46,0.2)]"
                    >
                      <div className="flex h-full flex-col justify-between">
                        <div className="h-8 w-8 rounded-full bg-crimson/10 group-hover:bg-crimson/20 transition-colors" />
                        <p className="text-sm font-bold text-gray-900 md:text-base">{skill}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* AI Toolset - Bold Purple Theme */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="mb-8 flex items-center gap-4">
                <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-purple-600/50" />
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-purple-600 md:text-3xl">AI Toolset</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
              </div>
              <motion.div
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: '-50px' }}
                transition={{ staggerChildren: 0.06, delayChildren: 0.15 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {['Midjourney', 'HeyGen', 'Sora', 'Gemini', 'Gamma', 'Minimax'].map((tool) => (
                  <motion.div
                    key={tool}
                    variants={{
                      initial: { opacity: 0, rotateX: -20, y: 20 },
                      whileInView: { opacity: 1, rotateX: 0, y: 0 },
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="group relative h-32 cursor-pointer"
                    style={{ perspective: '1000px' }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotateZ: -2 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-full w-full rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-white p-4 transition-all duration-300 hover:border-purple-600 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]"
                    >
                      <div className="flex h-full flex-col justify-between">
                        <div className="h-8 w-8 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors" />
                        <p className="text-sm font-bold text-gray-900 md:text-base">{tool}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Specializations - Bold Amber Theme */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="mb-8 flex items-center gap-4">
                <div className="h-1 w-12 bg-gradient-to-r from-amber-600 to-amber-600/50" />
                <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-amber-600 md:text-3xl">Specializations</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-500/30 to-transparent" />
              </div>
              <motion.div
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: '-50px' }}
                transition={{ staggerChildren: 0.06, delayChildren: 0.2 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {['Thumbnail Design', 'Video Editing', 'Social Content', 'Storyboarding', 'Color Grading', 'Brand Consistency'].map((spec) => (
                  <motion.div
                    key={spec}
                    variants={{
                      initial: { opacity: 0, rotateX: -20, y: 20 },
                      whileInView: { opacity: 1, rotateX: 0, y: 0 },
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="group relative h-32 cursor-pointer"
                    style={{ perspective: '1000px' }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotateZ: 2 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-full w-full rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-white p-4 transition-all duration-300 hover:border-amber-600 hover:shadow-[0_0_30px_rgba(217,119,6,0.2)]"
                    >
                      <div className="flex h-full flex-col justify-between">
                        <div className="h-8 w-8 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors" />
                        <p className="text-sm font-bold text-gray-900 md:text-base">{spec}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Section footer line */}
        <div className="relative z-10 px-6 py-8 text-[10px] uppercase tracking-widest text-gray-400 sm:px-10 lg:px-16">
          CUT. GRADE. SHIP. REPEAT.
        </div>
      </section>

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
