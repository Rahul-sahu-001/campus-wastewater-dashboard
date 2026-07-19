import React from 'react'
import { LEVEL_META } from '../../utils/risk'

export default function StatusBadge({ level, children }) {
  const meta = LEVEL_META[level] || LEVEL_META.green
  return (
    <span className={`relative inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${meta.badge}`}>
      <span className="relative w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color, color: meta.color }}>
        {level === 'red' && <span className="pulse-dot absolute inset-0 rounded-full" />}
      </span>
      {children || meta.label}
    </span>
  )
}
