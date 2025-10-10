import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import ChatDock from '@/components/widgets/ChatDock'

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="container-page">{children}</div>
      <Footer />
      <ChatDock />
    </div>
  )
}


