import React from 'react'
import { FiFileText, FiDownload, FiPlayCircle, FiRefreshCw, FiPrinter } from 'react-icons/fi'
import Card from '../shared/Card'
import { useApp } from '../../context/AppContext'

export default function AdminPanel() {
  const { scoredLocations, timelineDates, dayIndex, resetData, scenarios, setScenarioId } = useApp()

  const exportCSV = () => {
    const header = ['Location', 'Category', 'Date', 'pH', 'ViralLoad', 'BacterialLoad', 'Turbidity', 'AntibioticResidue', 'RiskScore', 'RiskLevel', 'Confidence']
    const rows = scoredLocations.map(l => [
      l.name, l.category, l.sample?.date, l.sample?.ph, l.sample?.viralLoad, l.sample?.bacterialLoad,
      l.sample?.turbidity, l.sample?.antibioticResidue, l.score, l.level, l.confidence
    ])
    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `wastewater-samples-${timelineDates[dayIndex]}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = () => window.print()

  const generateReport = () => {
    const lines = [`CAMPUS WASTEWATER HEALTH REPORT — ${timelineDates[dayIndex]}`, '']
    scoredLocations.forEach(l => {
      lines.push(`${l.name} (${l.category}): ${l.level.toUpperCase()} — score ${l.score}/100, confidence ${l.confidence}%`)
      l.reasons.forEach(r => lines.push(`   - ${r}`))
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `campus-health-report-${timelineDates[dayIndex]}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  const runRandomSimulation = () => {
    const ids = Object.keys(scenarios).filter(id => id !== 'NORMAL')
    setScenarioId(ids[Math.floor(Math.random() * ids.length)])
  }

  const buttons = [
    { label: 'Generate Report', icon: FiFileText, action: generateReport },
    { label: 'Export CSV', icon: FiDownload, action: exportCSV },
    { label: 'Export PDF', icon: FiPrinter, action: exportPDF },
    { label: 'Run Simulation', icon: FiPlayCircle, action: runRandomSimulation },
    { label: 'Reset Data', icon: FiRefreshCw, action: resetData }
  ]

  return (
    <Card title="Admin Panel">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {buttons.map(b => (
          <button
            key={b.label}
            onClick={b.action}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 text-xs text-slate-300 hover:border-signal-green/40 hover:text-signal-green transition-all"
          >
            <b.icon size={16} />
            {b.label}
          </button>
        ))}
      </div>
    </Card>
  )
}
