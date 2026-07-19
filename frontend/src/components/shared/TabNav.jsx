import React from 'react'
import { motion } from 'framer-motion'

export default function TabNav({ tabs, active, onChange }) {
  return (
    <div className="no-print sticky top-16 z-30 -mx-5 px-5 py-2.5 backdrop-blur-md bg-base-950/70 border-b border-white/5 overflow-x-auto">
      <div className="flex items-center gap-1.5 max-w-7xl mx-auto min-w-max">
        {tabs.map(tab => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-signal-green' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {isActive && (
                <motion.span
                  layoutId="tab-highlight"
                  className="absolute inset-0 -z-10 rounded-lg bg-signal-green/10 border border-signal-green/25"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
