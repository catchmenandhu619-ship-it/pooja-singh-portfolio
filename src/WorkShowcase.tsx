import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

const WORK_ITEMS = [
  {
    num: '01',
    category: 'YouTube Edits',
    title: 'HIGH-RETENTION\nEDITS',
    desc: 'Education & startup channels. High-energy hooks, zero dead frames — 100% on-time delivery.',
    accent: '#FF3D2E',
  },
  {
    num: '02',
    category: 'Motion Graphics',
    title: 'KINETIC\nVISUAL STORIES',
    desc: 'Dynamic text, motion titles, animated storytelling — built to stop the scroll dead in its tracks.',
    accent: '#FF3D2E',
  },
  {
    num: '03',
    category: 'Thumbnail Design',
    title: 'HIGH-CTR\nTHUMBNAILS',
    desc: 'Click-bait done right. Social-first hooks that make audiences click before they know why.',
    accent: '#f0dfc4',
  },
  {
    num: '04',
    category: 'Brand Decks',
    title: 'VISUAL BRAND\nLANGUAGE',
    desc: "Decks that don't just look good — they sell ideas. Brand-consistent, stakeholder-ready.",
    accent: '#FF3D2E',
  },
  {
    num: '05',
    category: 'AI Content',
    title: 'GENERATIVE\nAI WORKFLOWS',
    desc: 'Midjourney · HeyGen · Sora · Minimax — generative pipelines that cut production time by 30%.',
    accent: '#FF3D2E',
  },
]

export function WorkShowcase() {
  return (
    <section id="work" className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Main container with dynamic layout */}
      <div className="relative w-full h-full min-h-screen flex items-center justify-center px-6 py-16 lg:px-12">

        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="absolute top-12 left-6 lg:left-12 z-20"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            [ Creative Portfolio ]
          </span>
        </motion.div>

        {/* Central Video Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl w-full"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-auto object-contain drop-shadow-2xl"
            src="/assets/videos/Character_unaware_of_dinosaur_be_202606210854.mp4"
          />
        </motion.div>

        {/* Dynamic Text Grid - Positioned around video */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-full h-full max-w-6xl mx-auto">

            {/* TOP-LEFT Position - Item 01 */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: -40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: false, margin: '-100px' }}
              className="absolute top-0 left-0 p-4 pointer-events-auto"
            >
              <div className="backdrop-blur-sm bg-black/40 border border-white/10 rounded-lg p-5 hover:border-white/30 transition-all duration-300 max-w-xs group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: WORK_ITEMS[0].accent }}>
                    {WORK_ITEMS[0].num} — {WORK_ITEMS[0].category}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/50 group-hover:text-white/100 transition-colors" />
                </div>
                <h3 className="font-display text-lg font-black text-white mb-2 leading-tight uppercase" style={{ letterSpacing: '-0.02em' }}>
                  {WORK_ITEMS[0].title.replace('\n', ' ')}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-3">
                  {WORK_ITEMS[0].desc}
                </p>
                <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: WORK_ITEMS[0].accent }} />
              </div>
            </motion.div>

            {/* TOP-RIGHT Position - Item 02 */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: -40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: false, margin: '-100px' }}
              className="absolute top-0 right-0 p-4 pointer-events-auto"
            >
              <div className="backdrop-blur-sm bg-black/40 border border-white/10 rounded-lg p-5 hover:border-white/30 transition-all duration-300 max-w-xs group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: WORK_ITEMS[1].accent }}>
                    {WORK_ITEMS[1].num} — {WORK_ITEMS[1].category}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/50 group-hover:text-white/100 transition-colors" />
                </div>
                <h3 className="font-display text-lg font-black text-white mb-2 leading-tight uppercase" style={{ letterSpacing: '-0.02em' }}>
                  {WORK_ITEMS[1].title.replace('\n', ' ')}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-3">
                  {WORK_ITEMS[1].desc}
                </p>
                <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: WORK_ITEMS[1].accent }} />
              </div>
            </motion.div>

            {/* MIDDLE-LEFT Position - Item 03 */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: false, margin: '-100px' }}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 p-4 pointer-events-auto"
            >
              <div className="backdrop-blur-sm bg-black/40 border border-white/10 rounded-lg p-5 hover:border-white/30 transition-all duration-300 max-w-xs group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: WORK_ITEMS[2].accent }}>
                    {WORK_ITEMS[2].num} — {WORK_ITEMS[2].category}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/50 group-hover:text-white/100 transition-colors" />
                </div>
                <h3 className="font-display text-lg font-black text-white mb-2 leading-tight uppercase" style={{ letterSpacing: '-0.02em' }}>
                  {WORK_ITEMS[2].title.replace('\n', ' ')}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-3">
                  {WORK_ITEMS[2].desc}
                </p>
                <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: WORK_ITEMS[2].accent }} />
              </div>
            </motion.div>

            {/* MIDDLE-RIGHT Position - Item 04 */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              viewport={{ once: false, margin: '-100px' }}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 p-4 pointer-events-auto"
            >
              <div className="backdrop-blur-sm bg-black/40 border border-white/10 rounded-lg p-5 hover:border-white/30 transition-all duration-300 max-w-xs group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: WORK_ITEMS[3].accent }}>
                    {WORK_ITEMS[3].num} — {WORK_ITEMS[3].category}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/50 group-hover:text-white/100 transition-colors" />
                </div>
                <h3 className="font-display text-lg font-black text-white mb-2 leading-tight uppercase" style={{ letterSpacing: '-0.02em' }}>
                  {WORK_ITEMS[3].title.replace('\n', ' ')}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-3">
                  {WORK_ITEMS[3].desc}
                </p>
                <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: WORK_ITEMS[3].accent }} />
              </div>
            </motion.div>

            {/* BOTTOM-CENTER Position - Item 05 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: false, margin: '-100px' }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-4 pointer-events-auto"
            >
              <div className="backdrop-blur-sm bg-black/40 border border-white/10 rounded-lg p-5 hover:border-white/30 transition-all duration-300 max-w-xs group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: WORK_ITEMS[4].accent }}>
                    {WORK_ITEMS[4].num} — {WORK_ITEMS[4].category}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/50 group-hover:text-white/100 transition-colors" />
                </div>
                <h3 className="font-display text-lg font-black text-white mb-2 leading-tight uppercase" style={{ letterSpacing: '-0.02em' }}>
                  {WORK_ITEMS[4].title.replace('\n', ' ')}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-3">
                  {WORK_ITEMS[4].desc}
                </p>
                <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: WORK_ITEMS[4].accent }} />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
