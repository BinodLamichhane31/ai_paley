import PageShell from '@/components/layout/PageShell'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'

export default function Solutions() {
  const fadeUp = useMemo(() => ({ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }), [])
  const stagger = useMemo(() => ({ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }), [])

  return (
    <PageShell>
      <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <motion.h1 variants={fadeUp} className="text-h1 font-bold mb-2">Solutions built for real teams</motion.h1>
        <motion.p variants={fadeUp} className="text-slate-600 dark:text-slate-300 max-w-2xl">Depth where it matters, guardrails by default, and measurable impact from week one.</motion.p>
      </motion.section>

      {/* Persona Switcher */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10">
        <PersonaTabs />
      </motion.section>

      {/* Feature Deep Dives */}
      <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[{ t: 'Knowledge Orchestration', d: 'Connect KBs and sources; unify answers with citations.' }, { t: 'Workflow Automation', d: 'Trigger approvals and service requests with context.' }, { t: 'Observability', d: 'Dashboards for adoption, CSAT, topics and gaps.' }].map((f) => (
          <motion.div key={f.t} variants={fadeUp} className="card p-5">
            <div className="font-semibold mb-1">{f.t}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-3">{f.d}</div>
            <div className="h-28 rounded bg-slate-100 dark:bg-slate-800 mb-3" aria-hidden />
            <a href="/admin/dashboard" className="text-sm text-primary-600 hover:underline">See it in admin →</a>
          </motion.div>
        ))}
      </motion.section>

      {/* Before/After Comparison */}
      <motion.section initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="font-semibold mb-2">Before</div>
          <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-300">
            <li>• Long ticket queues and repetitive questions</li>
            <li>• Knowledge scattered across tools</li>
            <li>• Slow approvals and manual routing</li>
          </ul>
        </div>
        <div className="card p-5">
          <div className="font-semibold mb-2">After</div>
          <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-300">
            <li>• Instant answers with citations</li>
            <li>• Automated workflows and guardrails</li>
            <li>• Clear analytics and continuous improvements</li>
          </ul>
        </div>
      </motion.section>

      {/* Alternatives Matrix */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="p-2 text-left">Capability</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Generic Chatbots</th>
                <th className="p-2 text-left">AI-Solutions</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Cited Answers', '✕', '△', '✓'],
                ['Workflow Automation', '✕', '△', '✓'],
                ['Admin Analytics', '✕', '△', '✓'],
                ['SSO & Compliance', '△', '△', '✓'],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-2">{row[0]}</td>
                  <td className="p-2">{row[1]}</td>
                  <td className="p-2">{row[2]}</td>
                  <td className="p-2">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Case Studies Strip */}
      <motion.section initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 grid md:grid-cols-2 gap-4">
        {[{ m: '↗ 24% CSAT', t: 'Global retailer improves employee support' }, { m: '↓ 38% Ticket Volume', t: 'Technology company automates IT helpdesk' }].map((c) => (
          <div key={c.t} className="card p-5">
            <div className="text-primary-600 font-semibold mb-1">{c.m}</div>
            <div className="font-medium">{c.t}</div>
          </div>
        ))}
      </motion.section>

      {/* Compliance & Data Residency */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 card p-6">
        <div className="font-semibold mb-2">Compliance & Data Residency</div>
        <div className="grid md:grid-cols-2 gap-4 items-center">
          <div className="text-sm text-slate-600 dark:text-slate-300">We support EU/US data residency and standard processing terms. Region selection available on request.</div>
          <div className="h-32 rounded bg-slate-100 dark:bg-slate-800" aria-label="Region map placeholder" />
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-primary-500/10 to-accent/10" />
        <div className="relative p-6 md:p-8 flex items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Request a tailored demo</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">We’ll focus on your use cases and security needs.</div>
          </div>
          <a className="px-4 py-2 rounded-md bg-primary-600 text-white focus-ring" href="/schedule-demo">Request Demo</a>
        </div>
      </motion.section>
    </PageShell>
  )
}

function PersonaTabs() {
  const [tab, setTab] = useState<'Employees' | 'HR' | 'IT'>('Employees')
  const data: Record<typeof tab, { promise: string; features: string[]; caseStudy: string }> = {
    Employees: { promise: 'Answers in seconds, right where you work.', features: ['Self-serve help', 'Consistent guidance', 'Mobile ready'], caseStudy: 'Onboarding time ↓ 22%' },
    HR: { promise: 'Automate requests and policy questions.', features: ['PTO & benefits', 'Policy updates', 'Knowledge routing'], caseStudy: 'Policy tickets ↓ 35%' },
    IT: { promise: 'Deflect L1 and accelerate approvals.', features: ['Reset & unlock', 'Access requests', 'Incident triage'], caseStudy: 'L1 load ↓ 29%' },
  } as any
  const current = data[tab]
  return (
    <div className="card p-5">
      <div className="flex gap-2 mb-4">
        {(['Employees', 'HR', 'IT'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-md border ${tab===t?'bg-primary-600 text-white border-primary-600':'focus-ring'}`}>{t}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <div className="font-medium mb-2">{current.promise}</div>
          <div className="grid sm:grid-cols-3 gap-3">
            {current.features.map((f) => (
              <div key={f} className="card p-4 text-sm flex items-start gap-2"><Check className="size-4 text-accent" />{f}</div>
            ))}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-500">Mini case study</div>
          <div className="font-semibold">{current.caseStudy}</div>
          <div className="h-20 rounded bg-slate-100 dark:bg-slate-800 mt-2" aria-hidden />
        </div>
      </div>
    </div>
  )
}

