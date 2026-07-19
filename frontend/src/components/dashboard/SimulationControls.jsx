import React from 'react'
import { FiCloudRain, FiSun, FiUsers, FiThermometer, FiAlertTriangle, FiActivity } from 'react-icons/fi'
import Card from '../shared/Card'
import { useApp } from '../../context/AppContext'

const ICONS = {
  NORMAL: FiActivity, FESTIVAL: FiUsers, HEAVY_RAIN: FiCloudRain,
  WINTER: FiThermometer, SUMMER: FiSun, HOSTEL_OUTBREAK: FiAlertTriangle
}

export default function SimulationControls() {
  const { scenarioId, setScenarioId, scenarios } = useApp()

  return (
    <Card title="Live Simulation" icon={FiActivity}>
      <p className="text-xs text-slate-500 mb-4">Instantly recomputes every chart, alert, map color, and prediction on the dashboard.</p>
      <div className="grid grid-cols-2 gap-2.5">
        {Object.values(scenarios).map(s => {
          const Icon = ICONS[s.id]
          const active = scenarioId === s.id
          return (
            <button
              key={s.id}
              onClick={() => setScenarioId(s.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs transition-all ${
                active ? 'border-signal-green/50 bg-signal-green/10 text-signal-green shadow-glow' : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/25'
              }`}
            >
              <Icon size={16} />
              {s.label}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
