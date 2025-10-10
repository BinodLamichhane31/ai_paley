import type { Request, Response } from 'express'
import { z } from 'zod'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { loadEnv } from '../config/env'

// Application context for RAG
const APP_CONTEXT = {
  company: 'AI-Solutions',
  description: 'A company that provides intelligent automation and AI solutions for businesses',
  services: [
    'AI Assistant Implementation',
    'Business Process Automation', 
    'Analytics and Insights',
    'Custom AI Solutions'
  ],
  pages: [
    { name: 'Home', path: '/', description: 'Main landing page with company overview' },
    { name: 'Solutions', path: '/solutions', description: 'Detailed information about AI services and solutions' },
    { name: 'Events', path: '/events', description: 'Upcoming events, webinars, and workshops' },
    { name: 'Reviews', path: '/reviews', description: 'Customer testimonials and reviews' },
    { name: 'Schedule Demo', path: '/schedule-demo', description: 'Request a personalized demo of our solutions' },
    { name: 'Gallery', path: '/gallery', description: 'Visual showcase of our work and success stories' }
  ],
  contact: {
    demo: 'Schedule a demo through /schedule-demo',
    admin: 'Admin panel available at /admin/login'
  }
}

// RAG-powered response system
function getRAGResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()
  
  // Navigation help
  if (message.includes('navigation') || message.includes('navigate') || message.includes('pages') || message.includes('menu')) {
    const pagesList = APP_CONTEXT.pages.map(p => `• **${p.name}** (${p.path}) - ${p.description}`).join('\n')
    return `Here are the main pages you can navigate to:\n\n${pagesList}\n\nYou can also use the navigation menu at the top of the page to explore these sections.`
  }
  
  // Company information
  if (message.includes('company') || message.includes('about') || message.includes('what is ai-solutions')) {
    return `${APP_CONTEXT.company} is ${APP_CONTEXT.description}. We offer:\n\n${APP_CONTEXT.services.map(s => `• ${s}`).join('\n')}\n\nWould you like to learn more about any specific service or schedule a demo?`
  }
  
  // Services
  if (message.includes('services') || message.includes('solutions') || message.includes('what do you offer')) {
    return `Our main services include:\n\n${APP_CONTEXT.services.map(s => `• ${s}`).join('\n')}\n\nVisit our Solutions page (${APP_CONTEXT.pages[1]?.path || '/solutions'}) for detailed information, or schedule a demo to see how we can help your business.`
  }
  
  // Demo requests
  if (message.includes('demo') || message.includes('schedule') || message.includes('meeting') || message.includes('consultation')) {
    return `Great! You can schedule a demo in several ways:\n\n• Visit ${APP_CONTEXT.contact.demo}\n• Fill out the demo request form with your details\n• We'll contact you to arrange a personalized demonstration\n\nThis will help us understand your specific needs and show you relevant solutions.`
  }
  
  // Events
  if (message.includes('event') || message.includes('webinar') || message.includes('workshop') || message.includes('upcoming')) {
    return `Check out our Events page (${APP_CONTEXT.pages[2]?.path || '/events'}) for:\n\n• Upcoming webinars and workshops\n• Event details and registration\n• Past event recordings\n• Industry insights and presentations\n\nYou can register for events directly from the Events page.`
  }
  
  // Reviews/Testimonials
  if (message.includes('review') || message.includes('testimonial') || message.includes('feedback') || message.includes('experience')) {
    return `Read customer reviews and testimonials on our Reviews page (${APP_CONTEXT.pages[3]?.path || '/reviews'}). You can also submit your own review to share your experience with our services.`
  }
  
  // Contact/Help
  if (message.includes('contact') || message.includes('help') || message.includes('support') || message.includes('assistance')) {
    return `I'm here to help! Here are your options:\n\n• **Navigation**: Ask me about pages and features\n• **Company Info**: Learn about our services and solutions\n• **Demo**: Schedule a personalized demonstration\n• **Events**: Find upcoming webinars and workshops\n• **Reviews**: Read customer testimonials\n\nWhat would you like to know more about?`
  }
  
  // Default helpful response
  return `I'm the AI-Solutions assistant! I can help you with:\n\n• **Navigation** - Find pages and features\n• **Company Information** - Learn about our AI solutions\n• **Services** - Explore what we offer\n• **Demos** - Schedule a personalized demonstration\n• **Events** - Find upcoming webinars\n• **Reviews** - Read customer testimonials\n\nWhat would you like to know about?`
}

export const ChatSchema = z.object({
  body: z.object({ messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().min(1) })) })
})

export async function chat(req: Request, res: Response) {
  try {
    const { messages } = (req as any).body as z.infer<typeof ChatSchema>['body']
    const env = loadEnv()
    const lastMessage = messages[messages.length - 1]
    
    // Always try RAG first for better context-aware responses
    const ragResponse = getRAGResponse(lastMessage?.content || '')
    
    // If no API key, use RAG responses
    if (!env.GEMINI_API_KEY) {
      console.log('Chat: Using RAG mode - no GEMINI_API_KEY provided')
      return res.json({ 
        content: ragResponse, 
        mode: 'rag' 
      })
    }

    // Try Gemini API with fallback to RAG
    try {
      console.log('Chat: Attempting Gemini API with key:', env.GEMINI_API_KEY.substring(0, 10) + '...')
      
      const client = new GoogleGenerativeAI(env.GEMINI_API_KEY)
      
      // Try different model names in order of preference
      const models = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro', 'models/gemini-1.5-pro']
      let model = null
      let lastError = null
      
      for (const modelName of models) {
        try {
          model = client.getGenerativeModel({ model: modelName })
          console.log(`Chat: Trying model ${modelName}`)
          break
        } catch (err) {
          lastError = err
          console.log(`Chat: Model ${modelName} not available, trying next...`)
          continue
        }
      }
      
      if (!model) {
        throw lastError || new Error('No working model found')
      }
      
      // Create a proper conversation context with RAG enhancement
      const conversationHistory = messages.map((m) => 
        m.role === 'user' ? `Human: ${m.content}` : `Assistant: ${m.content}`
      ).join('\n\n')
      
      const prompt = `You are an AI assistant for AI-Solutions, a company that provides intelligent automation and AI solutions for businesses. Be helpful, professional, and informative.

Context about AI-Solutions:
- Company: AI-Solutions
- Services: AI Assistant Implementation, Business Process Automation, Analytics and Insights, Custom AI Solutions
- Main pages: Home (/), Solutions (/solutions), Events (/events), Reviews (/reviews), Schedule Demo (/schedule-demo), Gallery (/gallery)
- Focus: Help users navigate the website, understand services, schedule demos, and find information

${conversationHistory}

Assistant:`
      
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      
      console.log('Chat: Successfully generated Gemini response')
      return res.json({ content: text, mode: 'gemini' })
      
    } catch (geminiError) {
      console.log('Chat: Gemini API failed, falling back to RAG:', geminiError instanceof Error ? geminiError.message : 'Unknown error')
      
      // Fallback to RAG response
      return res.json({ 
        content: ragResponse, 
        mode: 'rag' 
      })
    }
    
  } catch (error) {
    console.error('Chat error:', error)
    
    // Final fallback to basic RAG response
    const fallbackResponse = getRAGResponse('help')
    res.json({ 
      content: fallbackResponse, 
      mode: 'rag' 
    })
  }
}


