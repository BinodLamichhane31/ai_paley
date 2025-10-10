import { motion } from 'framer-motion'
import { Bot, Cog, LineChart, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'
import { useMemo } from 'react'
import '@/styles/overlays.css'

export default function Hero() {
  const fadeUp = useMemo(() => ({ 
    hidden: { opacity: 0, y: 32 }, 
    show: { opacity: 1, y: 0 } 
  }), [])
  
  const stagger = useMemo(() => ({ 
    hidden: {}, 
    show: { transition: { staggerChildren: 0.15 } } 
  }), [])

  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 sm:p-8 md:p-12 lg:p-16 gradient-surface">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-accent-50/50 dark:from-primary-950/20 dark:via-transparent dark:to-accent-950/20"></div>
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-primary-400/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 sm:w-80 sm:h-80 bg-gradient-to-tr from-accent-400/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        <motion.div 
          variants={stagger} 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true, amount: 0.3 }} 
          className="space-y-8"
        >
          <motion.div variants={fadeUp} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
              <Sparkles className="size-4" />
              <span>AI-Powered Solutions</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              Transform Your
              <span className="block text-gradient">Employee Experience</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Streamline support, automate routine tasks, and deliver instant answers with our 
              <span className="font-semibold text-slate-900 dark:text-slate-100"> AI-powered virtual assistant platform</span>.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-start">
            <a 
              className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 group w-full sm:w-auto text-center" 
              href="/schedule-demo"
            >
              Schedule a Demo
              <ArrowRight className="size-4 sm:size-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
            <a 
              className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto text-center" 
              href="/events"
            >
              Join Our Events
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="size-2 bg-accent-500 rounded-full animate-pulse"></div>
              <span>Avg response &lt;24h</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="size-4" />
              <span>GDPR-aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4" />
              <span>Enterprise-ready</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} 
          viewport={{ once: true }} 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          <Tile 
            icon={<Bot className="size-5" />} 
            title="AI Assistant" 
            description="Intelligent responses 24/7"
            delay={0}
          />
          <Tile 
            icon={<Cog className="size-5" />} 
            title="Automation" 
            description="Streamline workflows"
            delay={0.1}
          />
          <Tile 
            icon={<LineChart className="size-5" />} 
            title="Analytics" 
            description="Track performance metrics"
            delay={0.2}
          />
          <div className="card-premium p-0 overflow-hidden col-span-1 sm:col-span-2" aria-label="Product demo">
            <div className="h-40 sm:h-48 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5"></div>
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,45%,rgba(59,130,246,0.1),55%,transparent)] bg-[length:200%_100%] animate-[shimmer_3s_ease_infinite]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl sm:text-6xl opacity-20">🤖</div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-2 bg-accent-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Live Demo</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Interactive AI assistant in action</p>
            </div>
          </div>
        </motion.div>
      </div><br/><br/>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-500 animate-bounce-subtle"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <div className="size-5 sm:size-6 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center">
            <div className="size-1.5 sm:size-2 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
          </div>
          <span className="text-xs hidden sm:block">Scroll to explore</span>
        </div>
      </motion.div>
    </section>
  )
}

function Tile({ icon, title, description, delay = 0 }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="card-premium p-4 sm:p-6 group cursor-pointer"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="size-10 sm:size-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-primary-500/25 transition-all duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-sm sm:text-base">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}


