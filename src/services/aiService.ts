import type { AIMessage, CalendarEvent, Habit, ExpenseItem, NoteItem, WeatherData } from '../types'
import { askNemotronCopilot, getNvidiaApiKey } from './nvidiaService'
import { askGroqCopilot, getGroqApiKey } from './groqService'

export interface CopilotContext {
  userName: string
  weather?: WeatherData
  events?: CalendarEvent[]
  habits?: Habit[]
  expenses?: ExpenseItem[]
  notes?: NoteItem[]
  preferredEngine?: 'nemotron' | 'groq'
  nvidiaApiKey?: string
  groqApiKey?: string
}

export function isImageGenerationRequest(text: string): boolean {
  const lower = text.trim().toLowerCase()
  return (
    lower.startsWith('/image') ||
    lower.startsWith('/draw') ||
    lower.startsWith('generate image') ||
    lower.startsWith('create image') ||
    lower.startsWith('draw an image') ||
    lower.startsWith('draw a ') ||
    lower.includes('generate an image of') ||
    lower.includes('create an image of')
  )
}

export function extractImagePrompt(text: string): string {
  let prompt = text.trim()
  const prefixes = [
    '/image',
    '/draw',
    'generate image:',
    'generate image of',
    'generate image',
    'create an image of',
    'create image of',
    'create image',
    'draw an image of',
    'draw a ',
    'draw ',
  ]

  for (const p of prefixes) {
    if (prompt.toLowerCase().startsWith(p)) {
      prompt = prompt.slice(p.length).trim()
      break
    }
  }

  // Remove leading colons or quotes
  prompt = prompt.replace(/^[:"'`\s]+|[:"'`\s]+$/g, '')
  return prompt || 'futuristic Samsung Galaxy S24 Ultra holographic display, cyberpunk cinematic lighting'
}

export async function processAICopilotMessage(
  userText: string,
  history: AIMessage[],
  context: CopilotContext
): Promise<{ text: string; imageUrl?: string }> {
  // 1. Check for Image Generation Request
  if (isImageGenerationRequest(userText)) {
    const cleanPrompt = extractImagePrompt(userText)
    const seed = Math.floor(Math.random() * 1000000)
    // High-definition FLUX.1 generative diffusion engine
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`

    return {
      text: `🎨 **Galaxy AI Image Generation**:\n*"${cleanPrompt}"*\n\n![${cleanPrompt}](${imageUrl})\n\n*(Rendered via FLUX.1 Neural Diffusion • 1024×1024 HD)*`,
      imageUrl,
    }
  }

  // 2. Text Inference: Try preferred engine first
  const engine = context.preferredEngine || 'nemotron'

  if (engine === 'nemotron') {
    try {
      const reply = await askNemotronCopilot(userText, history, context, context.nvidiaApiKey)
      return { text: reply }
    } catch (nemotronErr) {
      console.warn('Nemotron call failed, falling back to Groq:', nemotronErr)
      try {
        const groqReply = await askGroqCopilot(userText, history, context, context.groqApiKey)
        return { text: groqReply }
      } catch (groqErr) {
        console.error('All AI engines failed:', groqErr)
      }
    }
  } else {
    // Groq preferred
    try {
      const reply = await askGroqCopilot(userText, history, context, context.groqApiKey)
      return { text: reply }
    } catch (groqErr) {
      console.warn('Groq call failed, falling back to Nemotron:', groqErr)
      try {
        const nemotronReply = await askNemotronCopilot(userText, history, context, context.nvidiaApiKey)
        return { text: nemotronReply }
      } catch (nemotronErr) {
        console.error('All AI engines failed:', nemotronErr)
      }
    }
  }

  // 3. Fallback response
  return {
    text: `✨ **Galaxy AI Copilot**:\nHello ${context.userName}! I've recorded your message. Check your internet connection or API settings if live cloud responses are delayed.\n- **Next Agenda**: ${context.events?.[0]?.title || 'Open Schedule'} (${context.events?.[0]?.time || 'Now'})\n- **Daily Habits**: ${context.habits?.filter(h => h.completedToday).length || 0} completed.`,
  }
}
