// Updated: 2026-06-17 23:43:56
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'
import Lenis from 'lenis'
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

// CloudFront-hosted ambient videos (same reliable host as the hero/contact videos).
const CF = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P'

const CHAPTERS = [
  {
    name: 'YouTube Edits',
    desc: 'High-retention edits for education and startup channels',
    ghost: 'EDITS',
    bg: '#0E0E0E',
    light: false,
    video: `${CF}/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4`,
  },
  {
    name: 'Motion Graphics',
    desc: 'Dynamic text animations and visual storytelling',
    ghost: 'MOTION',
    bg: '#FF3D2E',
    light: false,
    video: `${CF}/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4`,
  },
  {
    name: 'Thumbnail Design',
    desc: 'High-CTR thumbnails and social media carousels',
    ghost: 'THUMBS',
    bg: '#FCFCFC',
    light: true,
    video: `${CF}/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4`,
  },
  {
    name: 'Brand Decks',
    desc: 'Presentation decks and visual aids with strict brand consistency',
    ghost: 'BRAND',
    bg: '#0E0E0E',
    light: false,
    video: `${CF}/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4`,
  },
  {
    name: 'AI Content',
    desc: 'Generative AI workflows — Midjourney, HeyGen, Sora and beyond',
    ghost: 'AI',
    bg: '#FF3D2E',
    light: false,
    video: `${CF}/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4`,
  },
]

const TREX_VIDEO = '/assets/videos/Skeletal_T-rex_walking_white_void_202606172101.mp4'

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

// TOONHUB-style skills carousel: intro slide + 3 category slides, each with its
// own 3D figurine, colour-changing background, giant ghost title and skill list.
const SKILL_SLIDES = [
  {
    fig: '/assets/figurines/fig-1.png',
    bg: '#F4845F',
    ghost: 'SKILLS',
    title: 'My Skill Set',
    intro: 'The toolkit behind every scroll-stopping edit. Hit the arrow to explore each craft.',
    items: [] as string[],
  },
  {
    fig: '/assets/figurines/fig-4.png',
    bg: '#6EB5FF',
    ghost: 'TECHNICAL',
    title: 'Technical Skills',
    intro: '',
    items: ['Adobe Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator', 'Canva', 'CapCut', 'Descript', 'Motion Graphics'],
  },
  {
    fig: '/assets/figurines/fig-3.png',
    bg: '#E882B4',
    ghost: 'AI TOOLS',
    title: 'AI Toolset',
    intro: '',
    items: ['Midjourney', 'HeyGen', 'Sora', 'Gemini', 'Gamma', 'Minimax'],
  },
  {
    fig: '/assets/figurines/fig-2.png',
    bg: '#6BBF7A',
    ghost: 'CRAFT',
    title: 'Specializations',
    intro: '',
    items: ['Thumbnail Design', 'Video Editing', 'Social Content', 'Storyboarding', 'Color Grading', 'Brand Consistency'],
  },
]

function SkillsCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 640,
  )

  // Scroll drives the carousel: the section is tall and the visual is pinned,
  // so scrolling through it rotates the figurines between categories.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const idx = Math.min(
      SKILL_SLIDES.length - 1,
      Math.max(0, Math.floor(p * SKILL_SLIDES.length)),
    )
    setActiveIndex((cur) => (cur === idx ? cur : idx))
  })

  useEffect(() => {
    SKILL_SLIDES.forEach((s) => {
      const img = new Image()
      img.src = s.fig
    })
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollToSlide = (i: number) => {
    const sec = sectionRef.current
    if (!sec) return
    const travel = sec.offsetHeight - window.innerHeight
    const top = sec.offsetTop + travel * ((i + 0.5) / SKILL_SLIDES.length)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const center = activeIndex
  const left = (activeIndex + 3) % 4
  const right = (activeIndex + 1) % 4

  // Original TOONHUB depth animation: center large, sides small + blurred, back deepest.
  const roleStyle = (i: number): CSSProperties => {
    const base: CSSProperties = {
      position: 'absolute',
      aspectRatio: '0.6 / 1',
      transition:
        'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1)',
      willChange: 'transform, filter, opacity',
    }
    if (i === center)
      return {
        ...base,
        left: '50%',
        bottom: isMobile ? '30%' : 0,
        height: isMobile ? '46%' : '92%',
        transform: `translateX(-50%) scale(${isMobile ? 1.1 : 1.55})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
      }
    if (i === left)
      return {
        ...base,
        left: isMobile ? '16%' : '24%',
        bottom: isMobile ? '40%' : '14%',
        height: isMobile ? '15%' : '28%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
      }
    if (i === right)
      return {
        ...base,
        left: isMobile ? '84%' : '76%',
        bottom: isMobile ? '40%' : '14%',
        height: isMobile ? '15%' : '28%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
      }
    // back
    return {
      ...base,
      left: '50%',
      bottom: isMobile ? '40%' : '14%',
      height: isMobile ? '12%' : '22%',
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(4px)',
      opacity: 1,
      zIndex: 5,
    }
  }

  const slide = SKILL_SLIDES[activeIndex]

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full"
      style={{
        height: `${SKILL_SLIDES.length * 100}svh`,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className="sticky top-0 h-svh min-h-[640px] w-full overflow-hidden"
        style={{
          backgroundColor: slide.bg,
          transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundSize: '200px 200px',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Giant ghost title */}
        <div
          className="pointer-events-none absolute inset-x-0 flex select-none items-center justify-center"
          style={{ zIndex: 2, top: '14%' }}
        >
          <span
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(64px, 24vw, 340px)',
              color: '#fff',
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {slide.ghost}
          </span>
        </div>

        {/* Top-left label + counter */}
        <div
          className="absolute left-4 top-6 flex items-center gap-3 text-[11px] font-semibold uppercase text-white sm:left-10 lg:left-16"
          style={{ zIndex: 60, opacity: 0.9, letterSpacing: '0.18em' }}
        >
          <span>[ 04 ] Skills</span>
          <span className="opacity-60">
            0{activeIndex + 1} / 0{SKILL_SLIDES.length}
          </span>
        </div>

        {/* Carousel — all four figurines with depth (original animation) */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {SKILL_SLIDES.map((s, i) => (
            <div key={i} style={roleStyle(i)}>
              <img
                src={s.fig}
                alt={s.title}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom center',
                }}
              />
            </div>
          ))}
        </div>

        {/* Active category title + skills list (bottom-left) */}
        <div
          className="absolute bottom-24 left-4 right-4 sm:bottom-28 sm:left-10 sm:right-auto sm:max-w-md lg:left-16"
          style={{ zIndex: 60 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <h3
                className="text-white"
                style={{
                  fontFamily: 'Anton, sans-serif',
                  fontSize: 'clamp(30px, 5vw, 60px)',
                  lineHeight: 1.02,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                }}
              >
                {slide.title}
              </h3>

              {slide.intro ? (
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85 sm:text-base">
                  {slide.intro}
                </p>
              ) : (
                <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-0.5">
                  {slide.items.map((item, i) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 border-b border-white/20 py-1.5 text-white"
                    >
                      <span className="text-[10px] font-semibold tabular-nums text-white/50">
                        0{i + 1}
                      </span>
                      <span className="text-[13px] font-medium sm:text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll hint (bottom-left) */}
        <div
          className="absolute bottom-7 left-4 flex items-center gap-2 text-[11px] font-semibold uppercase text-white sm:left-10 lg:left-16"
          style={{ zIndex: 60, opacity: 0.85, letterSpacing: '0.18em' }}
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block text-base"
          >
            ↓
          </motion.span>
          {activeIndex < SKILL_SLIDES.length - 1 ? 'Scroll to explore' : 'Keep scrolling'}
        </div>

        {/* Progress dots (bottom-right) */}
        <div
          className="absolute bottom-9 right-4 flex gap-2 sm:right-10 lg:right-16"
          style={{ zIndex: 60 }}
        >
          {SKILL_SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to ${SKILL_SLIDES[i].title}`}
              onClick={() => scrollToSlide(i)}
              className="h-2.5 rounded-full bg-white transition-all duration-300"
              style={{ width: i === activeIndex ? 28 : 10, opacity: i === activeIndex ? 1 : 0.45 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Scroll-driven coverflow carousel for the work chapters — same transition
// language / fonts as the skills figurine carousel, adapted for video cards.
function WorkCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 640,
  )

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const idx = Math.min(
      CHAPTERS.length - 1,
      Math.max(0, Math.floor(p * CHAPTERS.length)),
    )
    setActiveIndex((cur) => (cur === idx ? cur : idx))
  })

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollToSlide = (i: number) => {
    const sec = sectionRef.current
    if (!sec) return
    const travel = sec.offsetHeight - window.innerHeight
    const top = sec.offsetTop + travel * ((i + 0.5) / CHAPTERS.length)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const prev = (activeIndex + CHAPTERS.length - 1) % CHAPTERS.length
  const next = (activeIndex + 1) % CHAPTERS.length

  // Coverflow depth: center card large + sharp, prev/next peek blurred, rest hidden.
  const roleStyle = (i: number): CSSProperties => {
    const base: CSSProperties = {
      position: 'absolute',
      top: '46%',
      aspectRatio: '16 / 9',
      borderRadius: 18,
      overflow: 'hidden',
      transition:
        'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), width 650ms cubic-bezier(0.4,0,0.2,1)',
      transform: 'translate(-50%, -50%)',
      willChange: 'transform, filter, opacity',
    }
    if (i === activeIndex)
      return {
        ...base,
        left: '50%',
        width: isMobile ? '86vw' : 'min(56vw, 880px)',
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 30,
        boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
      }
    if (i === prev)
      return {
        ...base,
        left: isMobile ? '12%' : '24%',
        width: isMobile ? '52vw' : 'min(32vw, 460px)',
        filter: 'blur(4px)',
        opacity: 0.5,
        zIndex: 20,
      }
    if (i === next)
      return {
        ...base,
        left: isMobile ? '88%' : '76%',
        width: isMobile ? '52vw' : 'min(32vw, 460px)',
        filter: 'blur(4px)',
        opacity: 0.5,
        zIndex: 20,
      }
    return {
      ...base,
      left: '50%',
      width: isMobile ? '40vw' : 'min(22vw, 320px)',
      filter: 'blur(8px)',
      opacity: 0,
      zIndex: 10,
    }
  }

  const slide = CHAPTERS[activeIndex]
  const fg = slide.light ? '#0E0E0E' : '#ffffff'

  return (
    <section
      ref={sectionRef}
      id="work-showcase"
      className="relative w-full"
      style={{
        height: `${CHAPTERS.length * 100}svh`,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className="sticky top-0 h-svh min-h-[640px] w-full overflow-hidden"
        style={{
          backgroundColor: slide.bg,
          transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundSize: '200px 200px',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Giant ghost title */}
        <div
          className="pointer-events-none absolute inset-x-0 flex select-none items-center justify-center"
          style={{ zIndex: 2, top: '8%' }}
        >
          <span
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(64px, 22vw, 320px)',
              color: fg,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              opacity: 0.9,
              transition: 'color 650ms cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {slide.ghost}
          </span>
        </div>

        {/* Top-left label + counter */}
        <div
          className="absolute left-4 top-6 flex items-center gap-3 text-[11px] font-semibold uppercase sm:left-10 lg:left-16"
          style={{ zIndex: 60, opacity: 0.9, letterSpacing: '0.18em', color: fg, transition: 'color 650ms cubic-bezier(0.4,0,0.2,1)' }}
        >
          <span>[ 03 ] Selected Work</span>
          <span className="opacity-60">
            0{activeIndex + 1} / 0{CHAPTERS.length}
          </span>
        </div>

        {/* Coverflow video cards */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {CHAPTERS.map((c, i) => (
            <div key={i} style={roleStyle(i)}>
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="h-full w-full object-cover"
                src={c.video}
              />
            </div>
          ))}
        </div>

        {/* Active chapter title + description (bottom-left) */}
        <div
          className="absolute bottom-24 left-4 right-4 sm:bottom-28 sm:left-10 sm:right-auto sm:max-w-md lg:left-16"
          style={{ zIndex: 60 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <h3
                style={{
                  fontFamily: 'Anton, sans-serif',
                  fontSize: 'clamp(30px, 5vw, 60px)',
                  lineHeight: 1.02,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: fg,
                }}
              >
                {slide.name}
              </h3>
              <p
                className="mt-3 max-w-sm text-sm leading-relaxed sm:text-base"
                style={{ color: fg, opacity: 0.85 }}
              >
                {slide.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll hint (bottom-left) */}
        <div
          className="absolute bottom-7 left-4 flex items-center gap-2 text-[11px] font-semibold uppercase sm:left-10 lg:left-16"
          style={{ zIndex: 60, opacity: 0.85, letterSpacing: '0.18em', color: fg, transition: 'color 650ms cubic-bezier(0.4,0,0.2,1)' }}
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block text-base"
          >
            ↓
          </motion.span>
          {activeIndex < CHAPTERS.length - 1 ? 'Scroll to explore' : 'Keep scrolling'}
        </div>

        {/* Progress dots (bottom-right) */}
        <div
          className="absolute bottom-9 right-4 flex gap-2 sm:right-10 lg:right-16"
          style={{ zIndex: 60 }}
        >
          {CHAPTERS.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to ${CHAPTERS[i].name}`}
              onClick={() => scrollToSlide(i)}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{ width: i === activeIndex ? 28 : 10, opacity: i === activeIndex ? 1 : 0.45, backgroundColor: fg }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
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

      {/* ============ SECTION 2: WHAT I DO (light) ============ */}
      <section
        id="about"
        className="relative z-20 flex w-full flex-col items-center bg-[#fcfcfc] px-6 pb-16 pt-24 text-[#111] sm:px-10 md:pb-24 md:pt-32 lg:px-16"
      >
        {/* Walking T-rex video background — single bright layer, no dark overlay */}
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden bg-white"
            style={{ height: 'min(75vw, 100%)' }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
              src={TREX_VIDEO}
            />
          </motion.div>
        )}

        {/* Section label */}
        <motion.div
          {...fadeUp}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 mb-10 text-[10px] uppercase tracking-[0.2em] drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] md:mb-12 md:text-[11px]"
        >
          <span className="text-crimson">[ 02 ]</span>{' '}
          <span className="font-semibold text-[#111]">What I Do</span>
        </motion.div>

        {/* Main statement */}
        <h2 className="relative z-10 mb-12 max-w-[1000px] text-center text-[2rem] font-medium leading-[1.12] tracking-tight text-[#111] drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] md:mb-16 md:text-[3.2rem] lg:text-[3.8rem]">
          <MaskReveal>
            Raw footage in. Scroll-stopping stories out — editing, motion and
            design built to make brands{' '}
            <span className="text-crimson">impossible to ignore.</span>
          </MaskReveal>
        </h2>

        {/* Skill pills */}
        <motion.div
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

      {/* ============ SECTION 3: SELECTED WORK ============ */}
      <section id="work" className="relative z-30 flex w-full flex-col bg-white text-gray-900">
        {/* Heading area */}
        <div className="relative z-10 flex flex-col justify-between gap-10 px-6 pb-14 pt-24 sm:px-10 md:pt-32 lg:px-16 xl:flex-row xl:items-end">
          <h2 className="max-w-3xl text-[1.8rem] font-medium leading-[1.15] tracking-tight text-gray-900 md:text-[3rem] lg:text-[3.4rem]">
            <MaskReveal>
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
            </MaskReveal>
          </h2>

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

        {/* Section footer line */}
        <div className="relative z-10 px-6 py-8 text-[10px] uppercase tracking-widest text-gray-400 sm:px-10 lg:px-16">
          CUT. GRADE. SHIP. REPEAT.
        </div>
      </section>

      {/* ============ SECTION 3.5: WORK SHOWCASE CAROUSEL ============ */}
      <WorkCarousel />

      {/* ============ SECTION 3.6: SKILLS CAROUSEL (figurines) ============ */}
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