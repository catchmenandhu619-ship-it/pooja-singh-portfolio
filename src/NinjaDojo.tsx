import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'

const NINJA_SKILLS = [
  {
    num: '01',
    turtle: 'LEONARDO',
    maskColor: '#00D9FF',
    rgbColor: '0, 217, 255',
    category: 'Frontend Development',
    title: 'REACT\nWARRIOR',
    desc: 'Pixel-perfect UI, scroll animations, and interactive design systems forged in the fires of performance.',
    image: '/assets/turtles/A_4K_UHD_3D_character_202606192232.jpeg',
    skills: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Scroll Hooks'],
    tagline: 'BLUE LEADERSHIP',
  },
  {
    num: '02',
    turtle: 'RAPHAEL',
    maskColor: '#FF3D2E',
    rgbColor: '255, 61, 46',
    category: 'Motion Design',
    title: 'ANIMATION\nMASTER',
    desc: 'Scroll-driven effects, gesture-based interactions, and cinematic transitions that slice through the ordinary.',
    image: '/assets/turtles/A_4K_UHD_3D_character_202606192233.jpeg',
    skills: ['Gesture UI', 'Scroll Transforms', 'AnimatePresence', 'SVG Paths', '3D Perspective'],
    tagline: 'RED PASSION',
  },
  {
    num: '03',
    turtle: 'DONATELLO',
    maskColor: '#A020F0',
    rgbColor: '160, 32, 240',
    category: 'Video Craft',
    title: 'CINEMA\nINGENIOUS',
    desc: 'Color grading, sound design, pacing—every frame engineered for maximum narrative impact and engagement.',
    image: '/assets/turtles/A_4K_UHD_3D_character_202606192234.jpeg',
    skills: ['Premiere Pro', 'DaVinci Resolve', 'Sound Design', 'Color Grading', 'Motion Graphics'],
    tagline: 'PURPLE GENIUS',
  },
  {
    num: '04',
    turtle: 'MICHELANGELO',
    maskColor: '#FF8C00',
    rgbColor: '255, 140, 0',
    category: 'AI Workflows',
    title: 'GENERATIVE\nWIZARD',
    desc: 'Midjourney, HeyGen, Sora—pushing the boundary of creative possibility with cutting-edge AI pipelines.',
    image: '/assets/turtles/A_4K_UHD_3D_character_202606192235.jpeg',
    skills: ['Midjourney', 'HeyGen', 'Sora', 'ChatGPT', 'Generative AI'],
    tagline: 'ORANGE PARTY DUDE',
  },
]

export function NinjaDojo() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const newIndex = Math.floor(latest * NINJA_SKILLS.length)
    setActiveIndex(Math.min(newIndex, NINJA_SKILLS.length - 1))
  })

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full bg-black"
      style={{ height: `${NINJA_SKILLS.length * 100}vh` }}
    >
      {NINJA_SKILLS.map((skill, idx) => (
        <div
          key={idx}
          className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center"
        >
          {/* Background gradient with turtle's color */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: `radial-gradient(circle at 50% 50%, rgba(${skill.rgbColor}, 0.08) 0%, rgba(0,0,0,0.95) 100%)`,
            }}
            transition={{ duration: 0.6 }}
            style={{ zIndex: 1 }}
          />

          {/* Animated grid lines */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: idx === activeIndex ? 0.1 : 0.02 }}
            transition={{ duration: 0.6 }}
            style={{
              zIndex: 2,
              backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(${skill.rgbColor}, 0.05) 25%, rgba(${skill.rgbColor}, 0.05) 26%, transparent 27%, transparent 74%, rgba(${skill.rgbColor}, 0.05) 75%, rgba(${skill.rgbColor}, 0.05) 76%, transparent 77%, transparent),
                                linear-gradient(90deg, transparent 24%, rgba(${skill.rgbColor}, 0.05) 25%, rgba(${skill.rgbColor}, 0.05) 26%, transparent 27%, transparent 74%, rgba(${skill.rgbColor}, 0.05) 75%, rgba(${skill.rgbColor}, 0.05) 76%, transparent 77%, transparent)`,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Center glow circle */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 3 }}
          >
            <motion.div
              animate={{
                scale: idx === activeIndex ? [1, 1.15, 1] : 0.8,
                opacity: idx === activeIndex ? [0.15, 0.25, 0.15] : 0.05,
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                backgroundColor: skill.maskColor,
                filter: 'blur(80px)',
              }}
            />
          </motion.div>

          {/* Content container */}
          <div
            className="absolute inset-0 flex items-center justify-center px-8 sm:px-16"
            style={{ zIndex: 10 }}
          >
            <AnimatePresence mode="wait">
              {idx === activeIndex && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full flex items-center justify-center grid grid-cols-1 lg:grid-cols-3 gap-12"
                >
                  {/* Left: Text content */}
                  <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col justify-center"
                  >
                    {/* Tagline */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      style={{
                        color: skill.maskColor,
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      [ {skill.num} ] {skill.tagline}
                    </motion.div>

                    {/* Category */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.6)',
                        marginBottom: '1.5rem',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {skill.category}
                    </motion.div>

                    {/* Title */}
                    <h2 style={{
                      fontFamily: 'Anton, sans-serif',
                      fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
                      lineHeight: 0.95,
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.02em',
                      marginBottom: '1.5rem',
                      maxWidth: '450px',
                    }}>
                      {skill.title.split('\n').map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: 40, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {line}
                        </motion.div>
                      ))}
                    </h2>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.7,
                        color: 'rgba(255,255,255,0.5)',
                        maxWidth: '420px',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {skill.desc}
                    </motion.p>
                  </motion.div>

                  {/* Center: Turtle image with 3D perspective */}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden lg:flex items-center justify-center"
                    style={{
                      perspective: '1200px',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <motion.div
                      animate={{
                        rotateY: [0, 5, -5, 0],
                        rotateX: [0, -3, 3, 0],
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <motion.img
                        src={skill.image}
                        alt={skill.turtle}
                        className="h-auto w-full max-w-sm object-contain drop-shadow-2xl"
                        style={{
                          filter: `drop-shadow(0 0 40px rgba(${skill.rgbColor}, 0.4)) drop-shadow(0 40px 80px rgba(0,0,0,0.6))`,
                        }}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Right: Skills and energy indicators */}
                  <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col justify-center"
                  >
                    {/* Skill tags */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
                      {skill.skills.map((sk, si) => (
                        <motion.div
                          key={sk}
                          initial={{ opacity: 0, x: 30, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.4 + si * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{
                            padding: '10px 16px',
                            border: `1px solid ${skill.maskColor}44`,
                            backgroundColor: `${skill.maskColor}12`,
                            borderRadius: '6px',
                            color: skill.maskColor,
                            fontSize: '12px',
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            fontFamily: 'Inter, sans-serif',
                            backdropFilter: 'blur(8px)',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <motion.span
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: '3px',
                              backgroundColor: skill.maskColor,
                            }}
                            initial={{ height: 0 }}
                            animate={{ height: '100%' }}
                            transition={{
                              duration: 0.5,
                              delay: 0.45 + si * 0.08,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          />
                          <span style={{ marginLeft: '8px' }}>{sk}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Mastery bars */}
                    <div style={{ marginTop: '2rem' }}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.4)',
                          marginBottom: '8px',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        Mastery Level
                      </motion.div>
                      <motion.div
                        style={{
                          width: '100%',
                          height: '4px',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '95%' }}
                          transition={{
                            duration: 1.2,
                            delay: 0.7,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{
                            height: '100%',
                            backgroundColor: skill.maskColor,
                            borderRadius: '2px',
                            boxShadow: `0 0 20px ${skill.maskColor}`,
                          }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Top bar - section label */}
          <motion.div
            className="absolute top-0 left-0 right-0 px-8 sm:px-16 py-6 flex items-center justify-between"
            style={{ zIndex: 20, height: '7vh', backgroundColor: 'rgba(0,0,0,0.5)' }}
            animate={{
              borderBottomColor: idx === activeIndex ? `${skill.maskColor}44` : 'rgba(255,255,255,0.05)',
            }}
            transition={{ duration: 0.6 }}
          >
            <span style={{
              color: 'rgba(255,255,255,0.38)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}>
              [ 04 ] NINJA DOJO
            </span>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {NINJA_SKILLS.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === activeIndex ? 28 : 8,
                    backgroundColor: i === activeIndex ? skill.maskColor : 'rgba(255,255,255,0.15)',
                  }}
                  transition={{ duration: 0.45 }}
                  style={{
                    height: 2,
                    borderRadius: 1,
                    flexShrink: 0,
                    boxShadow: i === activeIndex ? `0 0 12px ${skill.maskColor}` : 'none',
                  }}
                />
              ))}
            </div>

            <span style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: '10px',
              letterSpacing: '0.14em',
              fontFamily: 'Inter, sans-serif',
            }}>
              {String(idx + 1).padStart(2, '0')} / {String(NINJA_SKILLS.length).padStart(2, '0')}
            </span>
          </motion.div>

          {/* Bottom bar - scroll hint */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 px-8 sm:px-16 flex items-center justify-between"
            style={{ zIndex: 20, height: '7vh', backgroundColor: 'rgba(0,0,0,0.7)', borderTop: `1px solid ${skill.maskColor}22` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}
              >
                ↓
              </motion.span>
              <span style={{
                color: 'rgba(255,255,255,0.25)',
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
              }}>
                Scroll to next master
              </span>
            </div>

            <motion.div
              animate={{ backgroundColor: skill.maskColor }}
              transition={{ duration: 0.6 }}
              style={{ width: 36, height: 2, borderRadius: 1 }}
            />
          </motion.div>
        </div>
      ))}
    </section>
  )
}
