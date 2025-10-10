import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 sm:mt-20 border-t border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-950/50 dark:to-slate-900/50">
      <div className="container-page py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-8 sm:size-10 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm sm:text-lg">AI</span>
              </div>
              <span className="font-bold text-xl sm:text-2xl text-slate-900 dark:text-slate-100">AI-Solutions</span>
            </div>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
              Transform your employee experience with intelligent AI assistants that streamline support, 
              automate workflows, and deliver instant answers 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a 
                className="btn-primary group text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3" 
                href="/schedule-demo"
              >
                Get Started
                <ArrowRight className="size-3 sm:size-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <a 
                className="btn-outline text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3" 
                href="/events"
              >
                Join Events
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base sm:text-lg">Quick Links</h3>
            <nav className="space-y-2 sm:space-y-3">
              <a 
                href="/" 
                className="block text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Home
              </a>
              <a 
                href="/solutions" 
                className="block text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Solutions
              </a>
              <a 
                href="/events" 
                className="block text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Events
              </a>
              <a 
                href="/reviews" 
                className="block text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Reviews
              </a>
              <a 
                href="/schedule-demo" 
                className="block text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Schedule Demo
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base sm:text-lg">Contact</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="size-6 sm:size-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Mail className="size-3 sm:size-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">Email</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">hello@ai-solutions.com</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="size-6 sm:size-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Phone className="size-3 sm:size-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">Phone</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">+1 (555) 123-4567</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="size-6 sm:size-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <MapPin className="size-3 sm:size-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">Office</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">San Francisco, CA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
              © {new Date().getFullYear()} AI-Solutions. All rights reserved.
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a 
                href="#" 
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


