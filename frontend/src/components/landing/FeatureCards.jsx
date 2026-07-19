import React from 'react'
import { motion } from 'framer-motion'
import { FiCpu, FiRadio, FiMap, FiShield, FiBell, FiServer } from 'react-icons/fi'

const FEATURES = [
  { icon: FiCpu, title: 'AI Prediction', desc: '7-day outbreak risk forecasts with plain-English reasons and a confidence score for every projection.' },
  { icon: FiRadio, title: 'Live Monitoring', desc: 'Simulated real-time sampling across every hostel, mess hall, and academic block on campus.' },
  { icon: FiMap, title: 'Campus Heatmap', desc: 'Your real campus map, wired with clickable, color-coded building hotspots.' },
  { icon: FiShield, title: 'Privacy First', desc: 'Building-level monitoring only — no individual tracking, no personal data, ever.' },
  { icon: FiBell, title: 'Smart Alerts', desc: 'Every red or yellow alert explains exactly which readings triggered it and what to do next.' },
  { icon: FiServer, title: 'Deployment Ready', desc: 'Clean Express API, structured data layer, and a production-shaped React frontend.' }
]

export default function FeatureCards() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-20">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-[0.2em] text-signal-cyan">What it does</span>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-100 mt-3">Built for real campus decision-making</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="glass gradient-border rounded-2xl p-6 hover:shadow-glow transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-signal-green/10 text-signal-green flex items-center justify-center mb-4">
              <f.icon size={18} />
            </div>
            <h3 className="font-display text-base font-semibold text-slate-100 mb-1.5">{f.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
