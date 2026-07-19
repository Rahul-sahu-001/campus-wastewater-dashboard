import React, { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'

function ThemeWrapper({ children }) {
  const { darkMode } = useApp()
  useEffect(() => {
    document.body.classList.toggle('light-mode', !darkMode)
  }, [darkMode])
  return children
}

export default function App() {
  return (
    <AppProvider>
      <ThemeWrapper>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </HashRouter>
      </ThemeWrapper>
    </AppProvider>
  )
}
