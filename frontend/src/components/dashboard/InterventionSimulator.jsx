import React, { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend } from 'recharts'
import { FiTrendingDown } from 'react-icons/fi'
import Card from '../shared/Card'
import StatusBadge from '../shared/StatusBadge'
import { useApp } from '../../context/AppContext'
import { simulateIntervention } from '../../utils/interventionModel'

export default function InterventionSimulator() {
  const { dataset, selectedLocation, dayIndex } = useApp()
  const [interventionDay, setInterventionDay] = useState(2)

  const result = useMemo(() => {
    if (!selectedLocation) return null
    const series = (dataset[selectedLocation.id] || []).slice(0, dayIndex + 1)
    if (series.length < 3) return null
    return simulateIntervention(series, interventionDay)
  }, [dataset, selectedLocation, dayIndex, interventionDay])

  const locationBadge = selectedLocation && (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{selectedLocation.name}</span>
      <StatusBadge level={selectedLocation.level} />
    </div>
  )

  if (!result) return (
    <Card title="Early Intervention Impact" icon={FiTrendingDown} action={locationBadge} className="lg:col-span-2">
      <p className="text-sm text-slate-500">Not enough historical samples yet — move the timeline slider forward.</p>
    </Card>
  )

  const chartData = result.noAction.map((p, i) => ({
    label: p.dayOffset === 0 ? 'Today' : `+${p.dayOffset}d`,
    noAction: p.score,
    intervention: result.withIntervention[i]?.score
  }))

  return (
    <Card title="Early Intervention Impact" icon={FiTrendingDown} action={locationBadge} className="lg:col-span-2">
      <p className="text-xs text-slate-500 mb-4">
        Compares the projected trajectory if no action is taken versus if isolation, increased chlorination, and targeted sampling begin on the selected day — illustrating why early wastewater detection matters.
      </p>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-slate-400 whitespace-nowrap">Start intervention on day</span>
        <input type="range" min={0} max={5} step={1} value={interventionDay} onChange={e => setInterventionDay(Number(e.target.value))} className="flex-1 accent-signal-green" />
        <span className="text-xs font-semibold text-signal-green w-14 text-right">+{interventionDay}d</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Risk Reduced by Day +7</p>
          <p className="font-display text-lg font-semibold text-signal-green">{result.riskReducedByEnd} pts</p>
        </div>
        <div className="rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Days to Normal (int. vs none)</p>
          <p className="font-display text-lg font-semibold text-signal-cyan">
            {result.daysToNormalIntervention ?? '7+'} vs {result.daysToNormalNoAction ?? '7+'}
          </p>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="label" tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0f1c1b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
            <ReferenceLine y={55} stroke="#f2545b" strokeDasharray="4 4" strokeOpacity={0.5} />
            <ReferenceLine y={28} stroke="#f5b942" strokeDasharray="4 4" strokeOpacity={0.5} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="noAction" name="No Action" stroke="#f2545b" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="intervention" name="Early Intervention" stroke="#2dd4a7" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}