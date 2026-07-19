import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function GaugeCircle({ value = 0, size = 120, stroke = 10, color = '#2dd4a7', label, sub, trackColor = 'var(--gauge-track)' }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 900
    const from = display
    function tick(now) {
      const t = Math.min(1, (now - start) / duration)
      setDisplay(Math.round(from + (value - from) * (1 - Math.pow(1 - t, 3))))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 absolute inset-0">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={stroke} fill="none" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={color} strokeWidth={stroke} fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-semibold" style={{ color }}>{display}</span>
          {sub && <span className="text-[10px] text-slate-400 uppercase tracking-wide">{sub}</span>}
        </div>
      </div>
      {label && <span className="mt-2 text-xs text-slate-400 text-center">{label}</span>}
    </div>
  )

}
