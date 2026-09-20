import type { AIMessage, CalendarEvent, Habit, ExpenseItem, NoteItem, WeatherData } from '../types'

export const getNvidiaApiKey = (): string => {
  return (
    import.meta.env.VITE_NVIDIA_API_KEY ||
    localStorage.getItem('mobile_ui_nvidia_key') ||
    ''
  )
}

export interface UserContextData {
  userName: string
  weather?: WeatherData
  events?: CalendarEvent[]
  habits?: Habit[]
  expenses?: ExpenseItem[]
  notes?: NoteItem[]
}

export async function askNemotronCopilot(
  userPrompt: string,
  history: AIMessage[],
  context: UserContextData,
  customApiKey?: string
): Promise<string> {
  const key = customApiKey?.trim() || getNvidiaApiKey()

  if (!key) {
    throw new Error('NVIDIA API Key not configured')
  }

  const now = new Date()
  const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const systemPrompt = `You are Galaxy AI, the flagship on-device copilot on Jay's Samsung Galaxy S24 Ultra (running One UI 7).
You are powered by NVIDIA Nemotron 3 Ultra (550B parameters). You are intelligent, witty, concise, and helpful. Always format responses cleanly with Markdown, bullet points, and appropriate emojis for a mobile screen.

LIVE DEVICE & PERSONAL TELEMETRY FOR ${context.userName.toUpperCase()}:
- Device: Samsung Galaxy S24 Ultra (Titanium Frame, One UI 7)
- AI Engine: NVIDIA Nemotron 3 Ultra (550B)
- Current Date & Time: ${dateStr} at ${timeStr}
- Local Weather: ${context.weather ? `${context.weather.city} • ${context.weather.temp}°C, ${context.weather.condition} (H: ${context.weather.high}° L: ${context.weather.low}°)` : '24°C Partly Sunny'}
- Calendar & Schedule:
${context.events?.map(e => `  • ${e.time}: ${e.title} (${e.tag}${e.location ? ` - ${e.location}` : ''})`).join('\n') || '  • No upcoming events'}
- Daily Habits & Streaks:
${context.habits?.map(h => `  • ${h.title}: ${h.completedToday ? '✅ Done' : '⏳ Pending'} (🔥 ${h.streak} day streak)`).join('\n') || '  • No habits logged'}
- Expenses:
${context.expenses?.map(x => `  • $${x.amount.toFixed(2)} for ${x.title} (${x.category})`).join('\n') || '  • No expenses logged'}
- Notes:
${context.notes?.slice(0, 3).map(n => `  • [${n.tag}] ${n.title}: ${n.content}`).join('\n') || '  • No notes'}

GUIDELINES:
1. Always address Jay warmly.
2. If Jay asks about his schedule, habits, or budget, use the real telemetry above.
3. Keep responses punchy, stylish, and mobile-optimized.`

  // Prepare last 6 conversation messages
  const conversationMessages = history
    .slice(-6)
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      role: m.role,
      content: m.content,
    }))

  const messagesPayload = [
    { role: 'system', content: systemPrompt },
    ...conversationMessages,
    { role: 'user', content: userPrompt },
  ]

  const modelsToTry = [
    'nvidia/nemotron-3-ultra-550b-a55b',
    'nvidia/nemotron-3.5-lightning-30b-a3b',
    'nvidia/nemotron-nano-3-30b-a3b',
  ]

  for (const modelName of modelsToTry) {
    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          messages: messagesPayload,
          temperature: 0.7,
          max_tokens: 800,
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        console.warn(`Nemotron model ${modelName} returned status ${response.status}:`, errText)
        continue
      }

      const data = await response.json()
      const answer = data.choices?.[0]?.message?.content?.trim()
      if (answer) {
        return answer
      }
    } catch (err) {
      console.warn(`Error calling Nemotron model ${modelName}:`, err)
    }
  }

  throw new Error('All Nemotron models failed or returned empty response')
}
