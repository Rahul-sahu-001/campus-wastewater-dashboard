import React from 'react'

import Card from '../shared/Card'

const ROWS = [
  { label: 'Individual Tracking', value: 'No', good: true },
  { label: 'Hostel / Building-Level Monitoring', value: 'Yes', good: true },
  { label: 'Personal Data Stored', value: 'No', good: true },
  { label: 'Anonymous Pooled Samples', value: 'Yes', good: true }
]

const ETHICS_POINTS = [
  {
    title: 'Data Retention',
    body: 'Raw samples should be kept only for a defined window (e.g. 90 days), after which only aggregated risk scores remain — this limits how much inferable history exists about any one building.'
  },
  {
    title: 'Access Control',
    body: "Raw per-building data should be visible only to designated Health Center and Infrastructure staff. A public-facing version should show campus-wide aggregates only, not named per-hostel alerts, to avoid unintended stigmatization."
  },
  {
    title: 'Stigma Risk',
    body: 'Publicly flagging a specific hostel as "Critical" risks residents feeling surveilled, even though no individual is identified. A real deployment should notify wardens/health staff privately first, and communicate clearly to residents why and how this monitoring works.'
  },
  {
    title: 'Consent & Buy-in',
    body: "This monitors shared sewage infrastructure, not individuals, so individual opt-out isn't meaningful the way it would be for a personal health app — but informing hostel residents that this monitoring exists, and why, is still an ethical requirement before real deployment."
  },
  {
    title: 'Institutional Oversight',
    body: "Any real deployment collecting health-adjacent data on campus should go through IIT Mandi's institutional ethics review before rollout, the same way human-subjects-adjacent research would."
  }
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
      <p className="text-xs text-slate-500 leading-relaxed mb-4">
        Wastewater surveillance tests pooled sewage from an entire building, never an individual. No student is identified, followed, or profiled — the system detects building-level trends only, the same principle public health agencies used during COVID-19 wastewater monitoring.
      </p>

      <div className="pt-3 border-t border-white/10">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1.5"><FiAlertCircle size={12} /> Ethical Considerations for Real Deployment</p>
        <div className="space-y-2.5">
          {ETHICS_POINTS.map(p => (
            <div key={p.title}>
              <p className="text-sm font-medium text-slate-200">{p.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}