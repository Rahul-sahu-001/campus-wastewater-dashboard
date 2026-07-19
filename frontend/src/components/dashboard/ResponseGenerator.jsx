import React from 'react'
import { FiFileText, FiDownload } from 'react-icons/fi'
import Card from '../shared/Card'
import { useApp } from '../../context/AppContext'
import { recommendationFor } from '../../utils/risk'

export default function ResponseGenerator() {
  const { redAlerts, timelineDates, dayIndex } = useApp()

  const downloadPlan = () => {
    const date = timelineDates[dayIndex]
    let text = `EMERGENCY RESPONSE PLAN\nGenerated: ${new Date().toLocaleString()}\nSample date: ${date}\n\n`
    if (redAlerts.length === 0) {
      text += 'No red alerts are currently active. No emergency response plan is required.\n'
    } else {
      redAlerts.forEach(loc => {
        text += `LOCATION: ${loc.name} (${loc.category})\nRisk score: ${loc.score}/100  |  Confidence: ${loc.confidence}%\nReasons:\n${loc.reasons.map(r => `  - ${r}`).join('\n')}\nResponse actions:\n${recommendationFor('red', loc.reasons).map(r => `  - ${r}`).join('\n')}\n\n`
      })
    }
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `emergency-response-plan-${date}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card title="Automated Response Generator" icon={FiFileText}>
      {redAlerts.length === 0 ? (
        <p className="text-sm text-slate-400">No red alerts are active — no emergency response plan is currently required.</p>
      ) : (
        <div className="space-y-3 mb-4">
          {redAlerts.map(loc => (
            <div key={loc.id} className="rounded-lg border border-signal-red/25 bg-signal-red/5 p-3">
              <p className="text-sm font-semibold text-slate-100 mb-1.5">{loc.name} — Emergency Response Plan</p>
              <ul className="text-xs text-slate-300 space-y-1">
                {recommendationFor('red', loc.reasons).map((r, i) => <li key={i}>• {r}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
      <button onClick={downloadPlan} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-signal-amber/15 border border-signal-amber/30 text-signal-amber hover:bg-signal-amber/25 transition-colors">
        <FiDownload size={14} /> Download Report
      </button>
    </Card>
  )
}
