import React from 'react'
import { FiServer } from 'react-icons/fi'
import Card from '../shared/Card'
import { useApp } from '../../context/AppContext'

export default function DeploymentView() {
  const { scoredLocations, timelineDates, dayIndex } = useApp()
  const rows = [
    { label: 'Last Updated', value: `${timelineDates[dayIndex]}, ${new Date().toLocaleTimeString()}` },
    { label: 'Sampling Frequency', value: 'Every 24 hours (6h during red alerts)' },
    { label: 'Coverage', value: `${scoredLocations.length} of 37 real campus locations` },
    { label: 'Data Accuracy', value: '96.4% (simulated benchmark)' },
    { label: 'Prediction Accuracy', value: '89.1% (7-day backtest, simulated)' },
    { label: 'System Status', value: 'Operational', good: true }
  ]
  return (
    <Card title="Deployment View" icon={FiServer}>
      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <span className="text-slate-500">{r.label}</span>
            <span className={r.good ? 'text-signal-green font-medium' : 'text-slate-200'}>{r.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
