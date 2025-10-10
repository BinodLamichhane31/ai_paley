import PageShell from '@/components/layout/PageShell'
import { motion, cubicBezier } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Shield, Users, Workflow, ArrowRight, Star, TrendingUp, Clock, Zap } from 'lucide-react'
import Hero from '@/components/hero/Hero'

export default function Home() {
  const fadeUp = useMemo(() => ({
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: cubicBezier(0.22, 1, 0.36, 1) } },
  }), [])

  const stagger = useMemo(() => ({
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  }), [])

  return (
    <PageShell>
      <Hero />

      {/* Key Features */}
      <motion.section 
        variants={stagger} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, amount: 0.2 }} 
        className="mt-20"
      >
        <motion.div variants={fadeUp} className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
            Why Choose <span className="text-gradient">AI-Solutions</span>?
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto px-4">
            Transform your organization with intelligent automation that delivers measurable results
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { 
              icon: <Zap className="size-6" />, 
              title: 'Lightning Fast', 
              description: 'Get instant responses to employee queries with our advanced AI technology.',
              color: 'from-yellow-500 to-orange-500'
            },
            { 
              icon: <Shield className="size-6" />, 
              title: 'Enterprise Security', 
              description: 'Bank-grade security with SSO integration and GDPR compliance built-in.',
              color: 'from-green-500 to-emerald-500'
            },
            { 
              icon: <TrendingUp className="size-6" />, 
              title: 'Proven ROI', 
              description: 'Average 40% reduction in support tickets and 60% faster resolution times.',
              color: 'from-blue-500 to-cyan-500'
            },
            { 
              icon: <Users className="size-6" />, 
              title: '24/7 Availability', 
              description: 'Never miss a query with round-the-clock intelligent assistance.',
              color: 'from-purple-500 to-pink-500'
            },
            { 
              icon: <Workflow className="size-6" />, 
              title: 'Seamless Integration', 
              description: 'Works with your existing tools and workflows without disruption.',
              color: 'from-indigo-500 to-blue-500'
            },
            { 
              icon: <Clock className="size-6" />, 
              title: 'Quick Deployment', 
              description: 'Get up and running in days, not months, with our streamlined setup.',
              color: 'from-red-500 to-rose-500'
            }
          ].map((feature) => (
            <motion.div 
              key={feature.title} 
              variants={fadeUp} 
              className="card-premium p-6 sm:p-8 group hover:scale-105 transition-all duration-500"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">{feature.title}</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 32 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        viewport={{ once: true }} 
        className="mt-20"
      >
        <div className="card-premium p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
              Ready to Transform Your Organization?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join hundreds of companies already using AI-Solutions to streamline their operations and boost productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 group w-full sm:w-auto" 
                href="/schedule-demo"
              >
                Start Your Free Trial
                <ArrowRight className="size-4 sm:size-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <a 
                className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto" 
                href="/events"
              >
                Watch Demo
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        variants={stagger} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, amount: 0.2 }} 
        className="mt-20"
      >
        <motion.div variants={fadeUp} className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto px-4">
            Get started in three simple steps and see results within days
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { 
              icon: <Users className="size-8" />, 
              title: '1. Discover', 
              description: 'We analyze your current processes and identify the highest-impact automation opportunities.',
              step: '01'
            },
            { 
              icon: <Workflow className="size-8" />, 
              title: '2. Deploy', 
              description: 'Our team sets up your AI assistant with custom workflows and integrations.',
              step: '02'
            },
            { 
              icon: <TrendingUp className="size-8" />, 
              title: '3. Measure', 
              description: 'Track real-time metrics and see the impact on your team\'s productivity.',
              step: '03'
            }
          ].map((step) => (
            <motion.div 
              key={step.title} 
              variants={fadeUp} 
              className="text-center group"
            >
              <div className="relative mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold">
                  {step.step}
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">{step.title}</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Latest Events Preview */}
      <EventsPreview />

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* FAQ */}
      <FaqAccordion />
    </PageShell>
  )
}


function EventsPreview() {
  type Ev = { _id: string; title: string; coverImageUrl?: string; description: string; startAt: string; endAt: string; location: string }
  const { data } = useQuery({
    queryKey: ['home-events'],
    queryFn: async () => {
      const res = await api.get('/events', { params: { published: 1 } })
      const all = res.data as Ev[]
      const upcoming = all.filter((e) => new Date(e.startAt) > new Date())
      return upcoming.slice(0, 3)
    },
  })
  
  if (!data || data.length === 0) return null
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 32 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }} 
      viewport={{ once: true }} 
      className="mt-20"
    >
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
          Upcoming Events
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto px-4">
          Join our exclusive events and learn from industry experts
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {data.map((ev, index) => (
          <motion.div 
            key={ev._id} 
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="card-premium overflow-hidden group hover:scale-105 transition-all duration-500"
          >
            {/* Cover Image */}
            <div className="h-32 sm:h-40 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
              {ev.coverImageUrl ? (
                <img 
                  src={ev.coverImageUrl} 
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-3xl sm:text-4xl font-bold">{ev.title.charAt(0)}</div>
                    <div className="text-xs sm:text-sm opacity-80">Event</div>
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs sm:text-sm font-medium">
                <div className="size-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span>Live Event</span>
              </div>
            </div>
            
            {/* Event Details */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3 line-clamp-2">{ev.title}</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 line-clamp-3 mb-3 sm:mb-4">{ev.description}</p>
            </div>
            
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <Clock className="size-3 sm:size-4" />
                <span>{new Date(ev.startAt).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <div className="size-3 sm:size-4 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                <span>{ev.location}</span>
              </div>
            </div>
            
            <a 
              className="btn-primary w-full group text-sm sm:text-base" 
              href={`/events/${ev._id}`}
            >
              Register Now
              <ArrowRight className="size-3 sm:size-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center mt-8 sm:mt-12">
        <a 
          className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4" 
          href="/events"
        >
          View All Events
        </a>
      </div>
    </motion.section>
  )
}

function TestimonialsCarousel() {
  const items = [
    { 
      q: '“We cut ticket volume by 38% in 90 days. The ROI was immediate and our team productivity soared.”', 
      n: 'Sarah Chen', 
      title: 'Operations Lead',
      company: 'TechCorp',
      r: 5 
    },
    { 
      q: '“Answers in seconds. Our employees love the instant support and we\'ve seen a 60% improvement in response times.”', 
      n: 'Michael Rodriguez', 
      title: 'HR Director',
      company: 'Global Solutions',
      r: 5 
    },
    { 
      q: '“Exceptional onboarding support and measurable impact. Our implementation was seamless and the results speak for themselves.”', 
      n: 'Jennifer Kim', 
      title: 'IT Manager',
      company: 'InnovateLabs',
      r: 5 
    },
  ]
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 5000)
    return () => clearInterval(t)
  }, [])
  const it = items[idx]
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 32 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }} 
      viewport={{ once: true }} 
      className="mt-20"
    >
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
          What Our Customers Say
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto px-4">
          Join hundreds of companies already transforming their operations with AI-Solutions
        </p>
      </div>
      
      <div className="card-premium p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`size-5 sm:size-6 ${i < it.r ? 'text-amber-400 fill-current' : 'text-slate-300 dark:text-slate-600'}`} 
                />
              ))}
            </div>
          </div>
          
          <blockquote className="text-lg sm:text-2xl md:text-3xl font-medium text-slate-900 dark:text-slate-100 mb-6 sm:mb-8 leading-relaxed px-4">
            {it.q}
          </blockquote>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="size-12 sm:size-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
              {it.n.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-center sm:text-left">
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">{it.n}</div>
              <div className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">{it.title}</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">{it.company}</div>
            </div>
          </div>
          
          <div className="flex justify-center gap-3">
            {items.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setIdx(i)} 
                className={`size-3 rounded-full transition-all duration-200 ${
                  i === idx 
                    ? 'bg-primary-600 scale-125' 
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                }`} 
                aria-label={`Go to testimonial ${i + 1}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function FaqAccordion() {
  const faqs = [
    { 
      q: 'How does pricing work?', 
      a: 'We offer flexible pricing tiers based on your organization size and usage needs. Our plans start at $99/month for small teams and scale with enterprise features like SSO, advanced analytics, and dedicated support. Contact us for a custom quote.' 
    },
    { 
      q: 'Is my data secure and compliant?', 
      a: 'Absolutely. We\'re SOC 2 Type II certified, GDPR compliant, and offer SSO integration with your existing identity providers. All data is encrypted in transit and at rest, with enterprise-grade security measures.' 
    },
    { 
      q: 'How quickly can we get started?', 
      a: 'Most teams are up and running within 1-2 weeks. Our streamlined onboarding process includes data migration, custom training, and gradual rollout to ensure smooth adoption across your organization.' 
    },
    { 
      q: 'What integrations do you support?', 
      a: 'We integrate with 100+ popular tools including Slack, Microsoft Teams, ServiceNow, Jira, Confluence, and most HR/IT systems. Our API also allows for custom integrations with your existing workflows.' 
    },
    { 
      q: 'Do you offer training and support?', 
      a: 'Yes! We provide comprehensive training for your team, including live sessions, documentation, and ongoing support. Our success team works with you to ensure maximum adoption and ROI.' 
    },
    { 
      q: 'Can I try before I buy?', 
      a: 'Absolutely! We offer a 14-day free trial with full access to all features. No credit card required, and our team will help you set up a pilot program to demonstrate value quickly.' 
    },
  ]
  const [open, setOpen] = useState<number | null>(0)
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 32 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }} 
      viewport={{ once: true }} 
      className="mt-20"
    >
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">
          Frequently Asked Questions
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto px-4">
          Everything you need to know about AI-Solutions
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="card-premium overflow-hidden"
            >
              <button 
                className="w-full text-left p-4 sm:p-6 focus-ring flex items-center justify-between group" 
                onClick={() => setOpen(open === i ? null : i)} 
                aria-expanded={open === i}
              >
                <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 pr-4">
                  {faq.q}
                </span>
                <div className={`size-6 sm:size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                  open === i 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  <span className="text-lg sm:text-xl font-medium">{open === i ? '–' : '+'}</span>
                </div>
              </button>
              {open === i && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 sm:px-6 pb-4 sm:pb-6"
                >
                  <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 text-sm sm:text-base">
            Still have questions? We're here to help!
          </p>
          <a 
            className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 group" 
            href="/schedule-demo"
          >
            Schedule a Demo
            <ArrowRight className="size-4 sm:size-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </motion.section>
  )
}



