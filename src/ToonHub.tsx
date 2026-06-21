import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const IMAGES = [
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
    title: 'VIDEO MASTER',
    skills: ['Premiere Pro', 'After Effects', 'Color Grading', 'Reels & Shorts'],
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
    title: 'DESIGN EXPERT',
    skills: ['Photoshop', 'Illustrator', 'Canva Pro', 'Brand Guides'],
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
    title: 'MOTION WIZARD',
    skills: ['Kinetic Text', 'Motion Design', 'Lower Thirds', 'Animation'],
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
    title: 'AI INNOVATOR',
    skills: ['Midjourney', 'HeyGen', 'Sora AI', 'ChatGPT'],
  },
]

export function ToonHub() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const preloadImages = () => {
      IMAGES.forEach((img) => {
        const imgElement = new Image()
        imgElement.src = img.src
      })
    }
    preloadImages()
  }, [])

  const navigate = (direction: 'next' | 'prev') => {
    if (isAnimating) return
    setIsAnimating(true)

    setActiveIndex((prev) => (direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4))

    setTimeout(() => setIsAnimating(false), 650)
  }

  const current = IMAGES[activeIndex]
  const left = IMAGES[(activeIndex + 3) % 4]
  const right = IMAGES[(activeIndex + 1) % 4]
  const back = IMAGES[(activeIndex + 2) % 4]

  const getItemStyles = (role: 'center' | 'left' | 'right' | 'back') => {
    const base = {
      position: 'absolute' as const,
      aspectRatio: '0.6 / 1',
      width: 'auto',
      transition: 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)',
      willChange: 'transform, filter, opacity',
    }

    if (role === 'center') {
      return {
        ...base,
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '60%' : '92%',
        bottom: isMobile ? '22%' : 0,
      }
    }

    if (role === 'left') {
      return {
        ...base,
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(8px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '20%' : '30%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
      }
    }

    if (role === 'right') {
      return {
        ...base,
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(8px)',
        opacity: 0.85,
        zIndex: 10,
        left: isMobile ? '80%' : '70%',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
      }
    }

    // back
    return {
      ...base,
      transform: 'translateX(-50%) scale(1)',
      filter: 'blur(16px)',
      opacity: 1,
      zIndex: 5,
      left: '50%',
      height: isMobile ? '13%' : '22%',
      bottom: isMobile ? '32%' : '12%',
    }
  }

  return (
    <div
      style={{
        backgroundColor: current.bg,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
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

        {/* Giant ghost text "3D SHAPE" */}
        <div
          style={{
            position: 'absolute',
            inset: '0 auto 0 0',
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 2,
            top: '18%',
          }}
        >
          <div
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(90px, 28vw, 380px)',
              fontWeight: 900,
              color: 'white',
              opacity: 1,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            3D SHAPE
          </div>
        </div>

        {/* Top-left brand label */}
        <div style={{ position: 'absolute', top: '1.5rem', left: '1rem', zIndex: 60 }}>
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
        </div>

        {/* Carousel */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
          <div style={getItemStyles('center')}>
            <img
              src={current.src}
              alt="Center"
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'bottom center',
              }}
            />
          </div>
          <div style={getItemStyles('left')}>
            <img
              src={left.src}
              alt="Left"
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'bottom center',
              }}
            />
          </div>
          <div style={getItemStyles('right')}>
            <img
              src={right.src}
              alt="Right"
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'bottom center',
              }}
            />
          </div>
          <div style={getItemStyles('back')}>
            <img
              src={back.src}
              alt="Back"
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'bottom center',
              }}
            />
          </div>
        </div>

        {/* Bottom-left text + nav buttons */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '1rem',
            zIndex: 60,
            maxWidth: '320px',
          }}
          className="sm:bottom-20 sm:left-24"
        >
          <p
            style={{
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              color: 'white',
              opacity: 0.95,
              letterSpacing: '0.02em',
              fontFamily: "'Inter', sans-serif",
            }}
            className="sm:mb-3 sm:text-[22px]"
          >
            TOONHUB FIGURINES
          </p>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'white',
              opacity: 0.85,
              lineHeight: 1.6,
              marginBottom: '1rem',
              display: 'none',
              fontFamily: "'Inter', sans-serif",
            }}
            className="sm:block sm:mb-5 sm:text-sm"
          >
            The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.
          </p>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => navigate('prev')}
              style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: 'transparent',
                border: '2px solid white',
                borderRadius: '50%',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 150ms, background-color 150ms',
              }}
              className="sm:w-16 sm:h-16 hover:scale-108 hover:bg-white/10"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.12)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
              }}
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              onClick={() => navigate('next')}
              style={{
                width: '3rem',
                height: '3rem',
                backgroundColor: 'transparent',
                border: '2px solid white',
                borderRadius: '50%',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 150ms, background-color 150ms',
              }}
              className="sm:w-16 sm:h-16 hover:scale-108 hover:bg-white/10"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.12)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
              }}
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Bottom-right link "DISCOVER IT" */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1rem',
            zIndex: 60,
          }}
          className="sm:bottom-20 sm:right-10"
        >
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              color: 'white',
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'opacity 200ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = '0.95'
            }}
          >
            DISCOVER IT
            <ArrowRight
              size={20}
              strokeWidth={2.25}
              style={{
                width: '1.25rem',
                height: '1.25rem',
              }}
              className="sm:w-8 sm:h-8"
            />
          </a>
        </div>

        {/* Skills panel */}
        <div
          style={{
            position: 'absolute',
            bottom: isMobile ? '1rem' : '4rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: current.panel,
            padding: isMobile ? '1rem' : '1.5rem',
            borderRadius: '12px',
            zIndex: 60,
            maxWidth: '90%',
            width: isMobile ? '100%' : 'auto',
          }}
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
            {current.title}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {current.skills.map((skill) => (
              <span
                key={skill}
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
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
