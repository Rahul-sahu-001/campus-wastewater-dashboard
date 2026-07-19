import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiActivity, FiPlayCircle } from 'react-icons/fi'
import AmbientBackground from './AmbientBackground'
import { useApp } from '../../context/AppContext'

export default function Hero() {
  const { darkMode } = useApp()
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center px-5 overflow-hidden border-b border-white/5">
      <AmbientBackground />
      <div className="relative z-10 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-signal-green mb-6"
        >
          <FiActivity size={12} /> Live surveillance across 37 real campus sampling points
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className={`font-display text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}
        >
          Campus Wastewater
          <br />
          <span className="bg-gradient-to-r from-signal-green via-signal-cyan to-signal-amber bg-clip-text text-transparent">
            Health Alert Dashboard
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className={`mt-6 text-base sm:text-lg max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
        >
          AI-powered wastewater surveillance system for early outbreak detection — built on your real campus layout, from hostel blocks to mess halls.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/dashboard" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-signal-green text-base-950 font-semibold text-sm shadow-glow hover:brightness-110 transition-all flex items-center justify-center gap-2">
            <FiActivity size={16} /> View Dashboard
          </Link>
          <Link to="/dashboard?simulate=1" className="w-full sm:w-auto px-6 py-3 rounded-xl glass text-slate-200 font-semibold text-sm hover:border-signal-cyan/40 transition-all flex items-center justify-center gap-2">
            <FiPlayCircle size={16} /> Run Simulation
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
