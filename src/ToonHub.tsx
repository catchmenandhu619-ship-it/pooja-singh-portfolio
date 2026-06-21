import { useRef, useEffect, useState } from 'react'
import { motion, useScroll } from 'motion/react'

const SKILLS_DATA = [
  {
    bg: '#FF3D2E',
    panel: '#FF6B5B',
    title: 'WARRIOR MASTER',
    skills: ['Premiere Pro', 'After Effects', 'Color Grading', 'Reels & Shorts'],
    image: '/assets/turtles/A_cinematic_character_portrait_of_202606172157.jpeg',
  },
  {
    bg: '#6BBF7A',
    panel: '#85CC92',
    title: 'GUARDIAN EXPERT',
    skills: ['Photoshop', 'Illustrator', 'Canva Pro', 'Brand Guides'],
    image: '/assets/turtles/A_cinematic_character_portrait_of_202606172157 (1).jpeg',
  },
  {
    bg: '#E882B4',
    panel: '#ED9DC4',
    title: 'NINJA WIZARD',
    skills: ['Kinetic Text', 'Motion Design', 'Lower Thirds', 'Animation'],
    image: '/assets/turtles/3D_animation_style_character_mockup,_202606210339 (1).jpeg',
  },
  {
    bg: '#6EB5FF',
    panel: '#8DC4FF',
    title: 'MASTER INNOVATOR',
    skills: ['Midjourney', 'HeyGen', 'Sora AI', 'ChatGPT'],
    image: '/assets/turtles/3D_animation_style_character_mockup,_202606210339 (2).jpeg',
  },
]

export function ToonHub() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Map scroll progress (0-1) to active index (0-3)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const index = Math.floor(latest * SKILLS_DATA.length)
      setActiveIndex(Math.min(index, SKILLS_DATA.length - 1))
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    SKILLS_DATA.forEach((skill) => {
      const img = new Image()
      img.src = skill.image
    })
  }, [])

  return (
    <div ref={containerRef} style={{ height: `${SKILLS_DATA.length * 100}vh`, position: 'relative' }}>
      {SKILLS_DATA.map((skill, idx) => (
        <motion.div
          key={idx}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: skill.bg,
            fontFamily: "'Inter', sans-serif",
            overflow: 'hidden',
            pointerEvents: idx === activeIndex ? 'auto' : 'none',
          }}
          animate={{
            opacity: idx === activeIndex ? 1 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Grain overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 50,
              opacity: 0.4,
              backgroundSize: '200px 200px',
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Giant ghost text */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 2,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(90px, 28vw, 380px)',
                fontWeight: 900,
                color: 'white',
                opacity: 0.08,
                lineHeight: 1,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              SKILLS
            </div>
          </motion.div>

          {/* Top-left brand label */}
          <motion.div
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1rem',
              zIndex: 60,
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'white',
                opacity: 0.9,
                letterSpacing: '0.18em',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              TOONHUB
            </div>
          </motion.div>

          {/* Character image */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              zIndex: 10,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <motion.img
              src={skill.image}
              alt={skill.title}
              draggable={false}
              style={{
                height: isMobile ? '70%' : '85%',
                width: 'auto',
                maxWidth: '90%',
                objectFit: 'contain',
                objectPosition: 'bottom center',
              }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Skills panel */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: isMobile ? '1.5rem' : '4rem',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: skill.panel,
              padding: isMobile ? '1rem' : '1.5rem',
              borderRadius: '12px',
              zIndex: 60,
              maxWidth: '90%',
              width: isMobile ? '100%' : 'auto',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p
              style={{
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: isMobile ? '0.875rem' : '1rem',
                color: 'white',
                opacity: 0.9,
                letterSpacing: '0.15em',
                marginBottom: '0.75rem',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {skill.title}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {skill.skills.map((s, i) => (
                <motion.span
                  key={s}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    color: 'white',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 60,
              textAlign: 'center',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                color: 'white',
                opacity: 0.6,
                fontSize: '14px',
                marginBottom: '8px',
              }}
            >
              ↓
            </motion.div>
            <div
              style={{
                color: 'white',
                opacity: 0.5,
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Scroll to explore
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
