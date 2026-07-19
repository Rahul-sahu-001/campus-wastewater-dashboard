import React from 'react'
import { motion } from 'framer-motion'

export default function Card({ children, className = '', title, icon: Icon, action, hover = true, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay }}
      whileHover={hover ? { y: -3 } : {}}
      className={`glass gradient-border rounded-2xl p-5 transition-shadow duration-300 ${hover ? 'hover:shadow-glow' : ''} ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="text-signal-green" size={18} />}
            {title && <h3 className="font-display text-sm tracking-wide text-slate-200/90 uppercase">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      {children}
    </motion.div>
  )
}
