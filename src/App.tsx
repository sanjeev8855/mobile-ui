import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider, useApp } from './context/AppContext'
import { MobileShell } from './components/layout/MobileShell'
import { HomeView } from './components/views/HomeView'
import { WidgetsView } from './components/views/WidgetsView'
import { AssistantView } from './components/views/AssistantView'
import { AppsView } from './components/views/AppsView'
import { SettingsView } from './components/views/SettingsView'

const MainContent: React.FC = () => {
  const { activeTab } = useApp()

  switch (activeTab) {
    case 'home': return <HomeView />
    case 'widgets': return <WidgetsView />
    case 'assistant': return <AssistantView />
    case 'apps': return <AppsView />
    case 'settings': return <SettingsView />
    default: return <HomeView />
  }
}

export function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MobileShell>
          <MainContent />
        </MobileShell>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
