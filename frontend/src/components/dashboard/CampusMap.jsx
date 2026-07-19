import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSearch, FiDownload } from 'react-icons/fi'
import Card from '../shared/Card'
import StatusBadge from '../shared/StatusBadge'
import { useApp } from '../../context/AppContext'
import { LEVEL_META, recommendationFor } from '../../utils/risk'
import { getSpreadPattern } from '../../utils/correlation'

export default function CampusMap() {
  const { scoredLocations, filteredLocations, search, setSearch, riskFilter, setRiskFilter, selectedLocationId, setSelectedLocationId } = useApp()
  const [hovered, setHovered] = useState(null)
  const visibleIds = new Set(filteredLocations.map(l => l.id))
  const selected = scoredLocations.find(l => l.id === selectedLocationId)
  const spreadRisk = selected ? getSpreadPattern(selected, scoredLocations) : []

  const downloadBuildingReport = () => {
    if (!selected || !selected.sample) return
    const lines = [
      `CAMPUS WASTEWATER HEALTH REPORT`,
      `Building: ${selected.name} (${selected.category})`,
      `Date: ${selected.sample.date}`,
      `Status: ${LEVEL_META[selected.level].label} (risk score ${selected.score}/100, confidence ${selected.confidence}%)`,
      '',
      'READINGS',
      `  pH: ${selected.sample.ph}`,
      `  Viral Load: ${selected.sample.viralLoad}`,
      `  Bacterial Load: ${selected.sample.bacterialLoad} CFU/100mL`,
      `  Turbidity: ${selected.sample.turbidity} NTU`,
      `  Antibiotic Residue: ${selected.sample.antibioticResidue} mg/L`,
      '',
      'REASONS',
      ...selected.reasons.map(r => `  - ${r}`),
      '',
      'RECOMMENDED ACTION',
      ...recommendationFor(selected.level, selected.reasons).map(r => `  - ${r}`)
    ]
    if (spreadRisk.length > 0) {
      lines.push('', 'NEARBY LOCATIONS AT RISK (possible shared drainage / foot-traffic pathway)')
      spreadRisk.forEach(l => lines.push(`  - ${l.name}: risk ${l.score}/100, proximity ${(100 - (l.distance / 14) * 100).toFixed(0)}%`))
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${selected.id}-report-${selected.sample.date}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card title="Interactive Campus Heatmap" className="lg:col-span-2">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex-1">
          <FiSearch className="text-slate-500" size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search buildings (e.g. B14, Oak Mess)…"
            className="bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500 w-full"
          />
        </div>
        <select
          value={riskFilter}
          onChange={e => setRiskFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 outline-none"
        >
          <option value="all">All risk levels</option>
          <option value="green">Green only</option>
          <option value="yellow">Yellow only</option>
          <option value="red">Red only</option>
        </select>
      </div>

      <div className="relative w-full rounded-xl overflow-hidden border border-white/10">
        <img src="/campus-map.jpg" alt="Real campus map" className="w-full block select-none" draggable={false} />

        {selected && spreadRisk.length > 0 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {spreadRisk.map(loc => (
              <motion.line
                key={loc.id}
                x1={selected.x} y1={selected.y}
                x2={loc.x} y2={loc.y}
                stroke={LEVEL_META[loc.level].color}
                strokeWidth={0.35}
                strokeDasharray="1.5 1.2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.6 }}
              />
            ))}
          </svg>
        )}

        {scoredLocations.map(loc => {
          const meta = LEVEL_META[loc.level]
          const dimmed = !visibleIds.has(loc.id)
          return (
            <motion.button
              key={loc.id}
              onClick={() => setSelectedLocationId(loc.id)}
              onMouseEnter={() => setHovered(loc.id)}
              onMouseLeave={() => setHovered(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center focus:outline-none"
              style={{
                left: `${loc.x}%`, top: `${loc.y}%`,
                width: loc.id === selectedLocationId ? 18 : 13,
                height: loc.id === selectedLocationId ? 18 : 13,
                backgroundColor: meta.color,
                opacity: dimmed ? 0.25 : 1,
                boxShadow: loc.level === 'red' ? `0 0 0 4px ${meta.color}33` : 'none',
                zIndex: hovered === loc.id || loc.id === selectedLocationId ? 20 : 10
              }}
              animate={loc.level === 'red' ? { scale: [1, 1.25, 1] } : {}}
              transition={loc.level === 'red' ? { duration: 1.4, repeat: Infinity } : {}}
              title={loc.name}
            >
              {loc.id === selectedLocationId && <span className="w-1.5 h-1.5 rounded-full bg-base-950" />}
              <AnimatePresence>
                {hovered === loc.id && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute bottom-full mb-1.5 px-2 py-0.5 rounded bg-base-950 border border-white/10 text-[10px] text-slate-200 whitespace-nowrap"
                  >
                    {loc.name} · {meta.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: LEVEL_META.green.color }} /> Normal</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: LEVEL_META.yellow.color }} /> Monitor</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: LEVEL_META.red.color }} /> Critical</span>
      </div>

      <AnimatePresence>
        {selected && selected.sample && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-display font-semibold text-slate-100">{selected.name}</h4>
                <span className="text-xs text-slate-500">{selected.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge level={selected.level} />
                <button onClick={downloadBuildingReport} title="Download report" className="text-slate-500 hover:text-signal-green transition-colors"><FiDownload size={16} /></button>
                <button onClick={() => setSelectedLocationId(null)} className="text-slate-500 hover:text-slate-300"><FiX size={16} /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <Stat label="pH" value={selected.sample.ph} />
              <Stat label="Viral Load" value={selected.sample.viralLoad} />
              <Stat label="Bacterial Load" value={selected.sample.bacterialLoad} />
              <Stat label="Turbidity" value={selected.sample.turbidity} />
              <Stat label="Last Sample" value={selected.sample.date} />
              <Stat label="Risk Score" value={`${selected.score}/100`} />
              <Stat label="Antibiotic Residue" value={selected.sample.antibioticResidue} />
              <Stat label="Confidence" value={`${selected.confidence}%`} />
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">Recommendation</p>
              <ul className="text-sm text-slate-300 space-y-1">
                {recommendationFor(selected.level, selected.reasons).slice(0, 3).map((r, i) => <li key={i}>• {r}</li>)}
              </ul>
            </div>

            {spreadRisk.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">
                  Nearby Locations at Risk <span className="normal-case text-slate-600">(possible shared drainage / foot-traffic pathway)</span>
                </p>
                <ul className="text-sm text-slate-300 space-y-1.5">
                  {spreadRisk.map(loc => (
                    <li key={loc.id} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: LEVEL_META[loc.level].color }} />
                        {loc.name}
                      </span>
                      <span className="text-xs text-slate-500 shrink-0">
                        risk {loc.score}/100 · proximity {(100 - (loc.distance / 14) * 100).toFixed(0)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-slate-200 font-medium">{value}</p>
    </div>
  )
}