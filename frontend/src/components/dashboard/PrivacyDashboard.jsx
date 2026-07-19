import React from 'react'
import { FiShield } from 'react-icons/fi'
import Card from '../shared/Card'

const ROWS = [
  { label: 'Individual Tracking', value: 'No', good: true },
  { label: 'Hostel / Building-Level Monitoring', value: 'Yes', good: true },
  { label: 'Personal Data Stored', value: 'No', good: true },
  { label: 'Anonymous Pooled Samples', value: 'Yes', good: true }
]

export default function PrivacyDashboard() {
  return (
    <Card title="Privacy Dashboard" icon={FiShield}>
      <div className="space-y-2 mb-4">
        {ROWS.map(r => (
          <div key={r.label} className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2.5">
            <span className="text-sm text-slate-300">{r.label}</span>
            <span className={`text-sm font-semibold ${r.good ? 'text-signal-green' : 'text-signal-red'}`}>{r.value}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        Wastewater surveillance tests pooled sewage from an entire building, never an individual. No student is identified, followed, or profiled — the system detects building-level trends only, the same principle public health agencies used during COVID-19 wastewater monitoring.
      </p>
    </Card>
  )
}
