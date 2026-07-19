import React from 'react'
import { FiZap } from 'react-icons/fi'
import Card from '../shared/Card'

export default function LeadTimeStat() {
  return (
    <Card title="Why Early Detection Matters" icon={FiZap}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-signal-green/30 bg-signal-green/5 px-4 py-3.5">
          <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Wastewater Detection</p>
<<<<<<< HEAD
          <p className="font-display text-2xl font-semibold text-signal-green">~2–11 days earlier</p>
          <p className="text-xs text-slate-400 mt-1">before symptomatic cases typically get reported — infected individuals shed viral RNA in stool before or during early symptom onset.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
          <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Traditional Detection</p>
          <p className="font-display text-2xl font-semibold text-slate-300">Symptom-based</p>
=======
          <p className="font-display text-2xl font-semibold text-signal-green">2–3 days</p>
          <p className="text-xs text-slate-400 mt-1">before symptomatic cases typically appear — infected individuals shed viral RNA in stool before showing symptoms.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
          <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Traditional Detection</p>
          <p className="font-display text-2xl font-semibold text-slate-300">5–7 days</p>
>>>>>>> origin/main
          <p className="text-xs text-slate-400 mt-1">relying on symptom onset, self-reporting to the health center, and diagnostic confirmation.</p>
        </div>
      </div>
      <p className="text-[11px] text-slate-600 mt-3">
<<<<<<< HEAD
        Based on published COVID-19 wastewater-based epidemiology studies: lead times of 0–11 days (avg. ~6 days) in community surveillance, and 2–8 days without active clinical case-finding. See README §10 for full references.
=======
        Based on published COVID-19 and enteric-pathogen wastewater surveillance research showing viral shedding precedes clinical symptom onset by several days.
>>>>>>> origin/main
      </p>
    </Card>
  )
}