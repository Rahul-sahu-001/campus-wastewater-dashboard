import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiBell, FiInfo, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import Card from '../shared/Card'
import { useApp } from '../../context/AppContext'

const ICONS = { info: FiInfo, warn: FiAlertTriangle, good: FiCheckCircle }
const COLORS = { info: 'text-signal-cyan', warn: 'text-signal-amber', good: 'text-signal-green' }

export default function NotificationCenter() {
  const { notifications } = useApp()

  return (
    <Card title="Notification Center" icon={FiBell}>
      <div className="h-72 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence initial={false}>
          {notifications.length === 0 && <p className="text-sm text-slate-500">No notifications yet.</p>}
          {notifications.map(n => {
            const Icon = ICONS[n.type] || FiInfo
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="flex items-start gap-2.5 rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2.5"
              >
                <Icon className={`${COLORS[n.type]} mt-0.5 shrink-0`} size={14} />
                <div className="flex-1">
                  <p className="text-xs text-slate-300">{n.text}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{n.time}</p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </Card>
  )
}
