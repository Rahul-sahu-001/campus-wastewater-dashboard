import React from 'react'
import { FiServer, FiMapPin } from 'react-icons/fi'
import Card from '../shared/Card'
import { useApp } from '../../context/AppContext'

const PHASES = [
  { name: 'Phase 1 — Pilot', timeline: '4–6 weeks', detail: "3–4 hostel sewage access points, manual grab sampling every 24h, tested via a partner lab or IIT Mandi's own Environmental/Civil Engineering lab. Validates whether readings correlate with any real health center reports before further investment." },
  { name: 'Phase 2 — Expand Coverage', timeline: '2–3 months', detail: 'Extend to all 18 hostel blocks + mess halls (highest-risk categories). Sampling frequency increases to twice-daily only for buildings crossing the "Monitor" threshold, keeping cost manageable elsewhere.' },
  { name: 'Phase 3 — Automate High-Priority Points', timeline: 'Longer-term, budget-dependent', detail: 'Automated composite samplers at highest-traffic clusters; low-cost qPCR pathogen screening explored only once Phase 1–2 prove the signal is actionable.' }
]

const COST_DRIVERS = [
  { label: 'Manual grab sampling', note: 'Technician time only — cheapest way to start' },
  { label: 'Field test kits (pH / turbidity)', note: 'Low one-time cost, reusable' },
  { label: 'Bacterial culture testing', note: 'Recurring per-sample lab cost, moderate' },
  { label: 'PCR pathogen sequencing', note: 'Highest per-sample cost — Phase 3 only, flagged buildings' }
]

export default function DeploymentView() {
  const { scoredLocations, timelineDates, dayIndex } = useApp()
  const statusRows = [
    { label: 'Prototype Last Updated', value: `${timelineDates[dayIndex]}` },
    { label: 'Simulated Coverage', value: `${scoredLocations.length} of 37 real campus locations` },
    { label: 'Prototype Status', value: 'Operational (simulated data)', good: true }
  ]

  return (
    <Card title="Campus Deployment Plan" icon={FiServer}>
      <p className="text-xs text-slate-500 mb-4">
        A proposed real-world rollout — not just this prototype's status. Staffing: one part-time sampling technician for Phase 1, plus a lab-analysis partnership with IIT Mandi's Environmental/Civil Engineering department rather than building new lab capacity from scratch.
      </p>

      <div className="space-y-3 mb-4">
        {PHASES.map(p => (
          <div key={p.name} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-200 flex items-center gap-1.5"><FiMapPin size={12} className="text-signal-green" />{p.name}</span>
              <span className="text-[10px] uppercase tracking-wide text-slate-500">{p.timeline}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{p.detail}</p>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-white/10 mb-4">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Approximate Cost Drivers (illustrative)</p>
        <div className="space-y-1.5">
          {COST_DRIVERS.map(c => (
            <div key={c.label} className="flex items-center justify-between text-xs">
              <span className="text-slate-300">{c.label}</span>
              <span className="text-slate-500">{c.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-white/10">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">This Prototype's Status</p>
        <div className="space-y-2">
          {statusRows.map(r => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{r.label}</span>
              <span className={r.good ? 'text-signal-green font-medium' : 'text-slate-200'}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}