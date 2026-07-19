import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function AmbientBackground() {
  const particles = useMemo(() => Array.from({ length: 26 }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 4,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 14 + Math.random() * 12,
    color: i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#2dd4a7' : '#f5b942'
  })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-grid-fade" />
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-signal-green/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-signal-cyan/10 rounded-full blur-[100px]" />

      {particles.map(p => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.left}%`, width: p.size, height: p.size, backgroundColor: p.color, bottom: -20, opacity: 0.5 }}
          animate={{ y: ['0%', '-120vh'], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <motion.path
          fill="url(#waveGrad)"
          animate={{ d: [
            'M0,100 C240,150 480,50 720,100 C960,150 1200,50 1440,100 L1440,200 L0,200 Z',
            'M0,120 C240,70 480,150 720,110 C960,60 1200,140 1440,90 L1440,200 L0,200 Z',
            'M0,100 C240,150 480,50 720,100 C960,150 1200,50 1440,100 L1440,200 L0,200 Z'
          ] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2dd4a7" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
