import type { AIMessage, CalendarEvent, Habit, ExpenseItem, NoteItem, WeatherData } from '../types'

export const getGroqApiKey = (): string => {
  return (
    import.meta.env.VITE_GROQ_API_KEY ||
    localStorage.getItem('mobile_ui_groq_key') ||
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

export async function askGroqCopilot(
  userPrompt: string,
  history: AIMessage[],
  context: UserContextData,
  customApiKey?: string
): Promise<string> {
  const key = customApiKey?.trim() || getGroqApiKey()

  const now = new Date()
  const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const systemPrompt = `You are Galaxy AI, the flagship on-device personal copilot embedded into Jay's Samsung Galaxy S24 Ultra (running One UI 7).
You are intelligent, witty, supportive, proactive, and concise. Always format responses cleanly with Markdown, bullet points, and appropriate emojis for a mobile screen.

LIVE DEVICE & PERSONAL TELEMETRY FOR ${context.userName.toUpperCase()}:
- Current Device: Samsung Galaxy S24 Ultra (Titanium Frame, One UI 7)
- Current Date & Time: ${dateStr} at ${timeStr}
- Weather: ${context.weather ? `${context.weather.city} • ${context.weather.temp}°C, ${context.weather.condition} (H: ${context.weather.high}° L: ${context.weather.low}°)` : '24°C Partly Sunny'}
- Calendar & Schedule:
${context.events?.map(e => `  • ${e.time}: ${e.title} (${e.tag}${e.location ? ` - ${e.location}` : ''})`).join('\n') || '  • No upcoming events'}
- Daily Habits & Streaks:
${context.habits?.map(h => `  • ${h.title}: ${h.completedToday ? '✅ Done' : '⏳ Pending'} (🔥 ${h.streak} day streak)`).join('\n') || '  • No habits logged'}
- Recent Expenses:
${context.expenses?.map(x => `  • $${x.amount.toFixed(2)} for ${x.title} (${x.category})`).join('\n') || '  • No expenses logged'}
- Scratchpad / Notes:
${context.notes?.slice(0, 3).map(n => `  • [${n.tag}] ${n.title}: ${n.content}`).join('\n') || '  • No notes'}

INSTRUCTIONS:
1. Always address Jay warmly.
2. When asked about his day, schedule, habits, priorities, or budget, provide precise, personalized answers based on the real telemetry above.
3. For general queries, answer with deep knowledge, clarity, and crisp formatting.
4. Keep answers readable and avoid overly verbose walls of text.`

  // Prepare last 8 messages for context window
  const conversationMessages = history
    .slice(-8)
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

  const modelsToTry = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'groq/compound-mini']

  for (const modelName of modelsToTry) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
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
        console.warn(`Groq model ${modelName} returned status ${response.status}:`, errText)
        continue
      }

      const data = await response.json()
      const answer = data.choices?.[0]?.message?.content?.trim()
      if (answer) {
        return answer
      }
    } catch (err) {
      console.warn(`Error calling Groq model ${modelName}:`, err)
    }
  }

  // Fallback if offline or all models fail
  return `✨ **Galaxy AI Copilot**:\nI've analyzed your schedule, Jay!\n- **Next Up**: ${context.events?.[0]?.title || 'No meetings'} (${context.events?.[0]?.time || 'Free time'}).\n- **Habits**: ${context.habits?.filter(h => h.completedToday).length || 0} of ${context.habits?.length || 0} completed.\n*(Offline fallback mode — check your internet connection)*`
}
