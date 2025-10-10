import PageShell from '@/components/layout/PageShell'
import DemoForm from '@/components/forms/DemoForm'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

export default function ScheduleDemo() {
  const [submitted, setSubmitted] = useState<{ emailSent: boolean } | null>(null)
  return (
    <PageShell>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Schedule a Demo</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">Tell us about your needs and we’ll reach out shortly.</p>
          {!submitted ? (
            <DemoForm onSuccess={(emailSent) => setSubmitted({ emailSent })} />
          ) : (
            <div className="card p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="size-6 text-accent mt-0.5" />
                <div>
                  <div className="font-semibold">Request received!</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">We’ll review and get back to you shortly.{submitted.emailSent ? ' A confirmation email was sent.' : ''}</div>
                </div>
              </div>
              <div className="mt-4 text-sm">
                What’s next:
                <ul className="list-disc ml-5 mt-1 text-slate-600 dark:text-slate-300">
                  <li>We’ll reach out to align on your goals</li>
                  <li>We’ll propose a tailored walkthrough</li>
                </ul>
              </div>
              <div className="mt-4 flex gap-3 text-sm">
                <a href="/events" className="btn-outline">Browse Events</a>
                <a href="#" className="btn-outline">Read Docs</a>
              </div>
            </div>
          )}
          <div className="mt-6 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span className="badge">GDPR</span>
            <span className="badge">No spam</span>
            <span className="badge">Avg reply &lt; 1 business day</span>
          </div>
          <div className="mt-4 text-sm">
            Prefer email? <a className="text-primary-600 hover:underline" href="mailto:sales@ai-solutions.test">sales@ai-solutions.test</a> or <a className="text-primary-600 hover:underline" href="#">support</a>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-4">
            <div className="font-semibold">Why book?</div>
            <ul className="text-sm text-slate-600 dark:text-slate-300 mt-2 list-disc ml-5">
              <li>Tailored walkthrough</li>
              <li>Roadmap fit</li>
              <li>Security Q&amp;A</li>
            </ul>
          </div>
          <div className="card p-4">Fast setup, measurable outcomes</div>
          <div className="card p-4">Security-first, enterprise ready</div>
          <div className="card p-4">Trusted by modern teams</div>
        </div>
      </div>
    </PageShell>
  )
}

