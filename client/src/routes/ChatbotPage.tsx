import PageShell from '@/components/layout/PageShell'
import ChatDock from '@/components/widgets/ChatDock'

export default function ChatbotPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-bold mb-6">AI-Solutions Assistant</h1>
      <ChatDock />
    </PageShell>
  )
}

