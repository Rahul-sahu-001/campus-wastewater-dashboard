import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiDroplet, FiSun, FiMoon, FiMaximize, FiMinimize } from 'react-icons/fi'
import { useApp } from '../../context/AppContext'

export default function Navbar() {
  const { darkMode, setDarkMode } = useApp()
  const location = useLocation()
  const [fullscreen, setFullscreen] = React.useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
      setFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setFullscreen(false)
    }
  }

  return (
    <div className="no-print sticky top-0 z-40 backdrop-blur-md bg-base-950/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-signal-green to-signal-cyan flex items-center justify-center text-base-950">
            <FiDroplet size={16} />
          </span>
          <span className="font-display font-semibold text-sm sm:text-base tracking-tight text-slate-100">
            Campus Wastewater <span className="text-signal-green">Health Alert</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {location.pathname !== '/' && (
            <Link to="/" className="hidden sm:inline text-xs text-slate-400 hover:text-slate-200 mr-2 transition-colors">← Home</Link>
          )}
          <button onClick={() => setDarkMode(d => !d)} className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-300 hover:text-signal-amber transition-colors" title="Toggle theme">
            {darkMode ? <FiSun size={15} /> : <FiMoon size={15} />}
          </button>
          <button onClick={toggleFullscreen} className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-300 hover:text-signal-cyan transition-colors" title="Fullscreen dashboard">
            {fullscreen ? <FiMinimize size={15} /> : <FiMaximize size={15} />}
          </button>
        </div>
      </div>
    </div>
  )
}
