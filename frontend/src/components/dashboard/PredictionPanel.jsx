import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import { FiCpu } from 'react-icons/fi'
import Card from '../shared/Card'
<<<<<<< HEAD
=======
import StatusBadge from '../shared/StatusBadge'
>>>>>>> origin/main
import { useApp } from '../../context/AppContext'
import { predictNextDays } from '../../utils/predict'

export default function PredictionPanel() {
  const { dataset, selectedLocation, dayIndex } = useApp()

  const result = useMemo(() => {
    if (!selectedLocation) return null
    const series = (dataset[selectedLocation.id] || []).slice(0, dayIndex + 1)
    if (series.length < 3) return null
    return predictNextDays(series)
  }, [dataset, selectedLocation, dayIndex])

  const chartData = useMemo(() => {
    if (!result) return []
    const history = [{ label: 'Today', score: result.todayScore, kind: 'actual' }]
    result.predictions.forEach(p => history.push({ label: `+${p.dayOffset}d`, score: p.predictedScore, kind: 'predicted' }))
    return history
  }, [result])

<<<<<<< HEAD
  if (!result) return (
    <Card title="AI Outbreak Prediction" icon={FiCpu}><p className="text-sm text-slate-500">Not enough historical samples yet — move the timeline slider forward.</p></Card>
  )

  return (
    <Card title="AI Outbreak Prediction" icon={FiCpu} className="lg:col-span-2">
=======
  const locationBadge = selectedLocation && (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{selectedLocation.name}</span>
      <StatusBadge level={selectedLocation.level} />
    </div>
  )

  if (!result) return (
    <Card title="AI Outbreak Prediction" icon={FiCpu} action={locationBadge}><p className="text-sm text-slate-500">Not enough historical samples yet — move the timeline slider forward.</p></Card>
  )

  return (
    <Card title="AI Outbreak Prediction" icon={FiCpu} action={locationBadge} className="lg:col-span-2">
>>>>>>> origin/main
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MiniStat label="Today's Risk" value={`${result.todayScore}/100`} color="#38bdf8" />
        <MiniStat label="Expected Peak" value={`${result.expectedPeak.score}/100`} sub={`day +${result.expectedPeak.dayOffset}`} color="#f5b942" />
        <MiniStat label="Prediction Confidence" value={`${result.confidence}%`} color="#2dd4a7" />
        <MiniStat label="7-Day Trend" value={`${result.expectedPeak.trendPct > 0 ? '+' : ''}${result.expectedPeak.trendPct}%`} color={result.expectedPeak.trendPct > 0 ? '#f2545b' : '#2dd4a7'} />
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
            <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3, fill: '#38bdf8' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1.5">Why this forecast</p>
        <ul className="text-sm text-slate-300 space-y-1">
          {result.reasons.map((r, i) => <li key={i}>• {r}</li>)}
        </ul>
      </div>
    </Card>
  )
}

function MiniStat({ label, value, sub, color }) {
  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/10 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="font-display text-lg font-semibold" style={{ color }}>{value}</p>
      {sub && <p className="text-[10px] text-slate-500">{sub}</p>}
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main
