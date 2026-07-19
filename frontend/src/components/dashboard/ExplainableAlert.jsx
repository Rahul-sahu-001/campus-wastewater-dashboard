import React from 'react'
import { motion } from 'framer-motion'
import { FiAlertOctagon, FiCheckCircle } from 'react-icons/fi'
import Card from '../shared/Card'
import StatusBadge from '../shared/StatusBadge'
import { useApp } from '../../context/AppContext'
import { LEVEL_META } from '../../utils/risk'

export default function ExplainableAlert() {
  const { worstLocation } = useApp()
  if (!worstLocation) return null
  const meta = LEVEL_META[worstLocation.level]

  return (
    <Card
      title="Explainable AI"
      icon={worstLocation.level === 'green' ? FiCheckCircle : FiAlertOctagon}
      className={worstLocation.level === 'red' ? 'shadow-glowRed' : ''}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-slate-500">Highest-priority alert right now</p>
          <h4 className="font-display text-lg font-semibold text-slate-100">{worstLocation.name}</h4>
        </div>
        <StatusBadge level={worstLocation.level}>{meta.label.toUpperCase()} ALERT</StatusBadge>
      </div>

      <p className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">Reasons</p>
      <ul className="space-y-1.5 mb-4">
        {worstLocation.reasons.map((r, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="text-sm text-slate-300 flex items-start gap-2"
          >
            <span style={{ color: meta.color }}>✓</span> {r}
          </motion.li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Confidence</span>
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full" style={{ backgroundColor: meta.color }}
            initial={{ width: 0 }} animate={{ width: `${worstLocation.confidence}%` }} transition={{ duration: 0.8 }}
          />
        </div>
        <span className="text-xs font-semibold" style={{ color: meta.color }}>{worstLocation.confidence}%</span>
      </div>
    </Card>
  )
}
