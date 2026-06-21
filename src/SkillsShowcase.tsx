import { motion } from 'motion/react'

const SKILLS_SECTIONS = [
  {
    title: 'VIDEO EDITING MASTER',
    category: 'Video Production',
    description: 'Professional video editing with high-energy hooks and retention-focused storytelling.',
    skills: ['Premiere Pro', 'DaVinci Resolve', 'Color Grading', 'Sound Design', 'Motion Graphics'],
    video: '/assets/videos/Character_running_forward_holdin…_202606210218.mp4',
    textPosition: 'right',
    accentColor: '#FF3D2E',
  },
  {
    title: 'MOTION GRAPHICS WIZARD',
    category: 'Animation & Motion',
    description: 'Kinetic text animations and cinematic transitions that capture attention.',
    skills: ['After Effects', 'Kinetic Text', 'Lower Thirds', 'Transitions', 'SVG Animation'],
    video: '/assets/videos/Character_leaning_against_wall_202606210217.mp4',
    textPosition: 'left',
    accentColor: '#6BBF7A',
  },
  {
    title: 'DESIGN SPECIALIST',
    category: 'Creative Design',
    description: 'Stunning visual designs and brand-consistent creative solutions.',
    skills: ['Photoshop', 'Illustrator', 'Canva Pro', 'UI/UX Design', 'Brand Identity'],
    video: '/assets/videos/Character_standing_in_white_envi…_202606210213.mp4',
    textPosition: 'right',
    accentColor: '#E882B4',
  },
  {
    title: 'AI CONTENT INNOVATOR',
    category: 'Generative AI',
    description: 'Cutting-edge AI workflows that boost production efficiency by 30%.',
    skills: ['Midjourney', 'HeyGen', 'Sora AI', 'ChatGPT', 'AI Automation'],
    video: '/assets/videos/Ninja_turtle_and_Witcher_nodding_202606172302.mp4',
    textPosition: 'left',
    accentColor: '#6EB5FF',
  },
]

export function SkillsShowcase() {
  return (
    <div id="skills">
      {SKILLS_SECTIONS.map((section, idx) => (
        <motion.section
          key={idx}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full min-h-screen overflow-hidden flex items-center"
        >
          {/* Full-screen background video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            src={section.video}
          />

          {/* Overlay gradient for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                section.textPosition === 'right'
                  ? 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)'
                  : 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            }}
          />

          {/* Content container */}
          <div
            className="absolute inset-0 flex items-center"
            style={{
              paddingLeft: section.textPosition === 'left' ? 'clamp(2rem, 5vw, 4rem)' : 'auto',
              paddingRight: section.textPosition === 'right' ? 'clamp(2rem, 5vw, 4rem)' : 'auto',
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: section.textPosition === 'left' ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative z-10"
              style={{
                maxWidth: '450px',
                marginLeft: section.textPosition === 'left' ? 0 : 'auto',
                marginRight: section.textPosition === 'right' ? 0 : 'auto',
              }}
            >
              {/* Section number and category */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <span
                  className="text-sm font-bold uppercase tracking-widest"
                  style={{ color: section.accentColor }}
                >
                  [ {String(idx + 1).padStart(2, '0')} ] {section.category}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6"
                style={{
                  fontFamily: "'Anton', sans-serif",
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                }}
              >
                {section.title.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                    style={{ display: 'block' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base sm:text-lg text-white/85 mb-8 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {section.description}
              </motion.p>

              {/* Skills tags */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                {section.skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: `${section.accentColor}22`,
                      color: section.accentColor,
                      border: `1.5px solid ${section.accentColor}44`,
                      fontFamily: "'Inter', sans-serif",
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>

              {/* Accent line */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '60px' }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="h-1 rounded-full mt-8"
                style={{ backgroundColor: section.accentColor }}
              />
            </motion.div>
          </div>

          {/* Section indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute bottom-8 left-8 z-20"
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Skill {idx + 1} of {SKILLS_SECTIONS.length}
            </span>
          </motion.div>
        </motion.section>
      ))}
    </div>
  )
}
