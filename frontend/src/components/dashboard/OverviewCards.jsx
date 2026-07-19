import React from 'react'
import { FiActivity, FiAlertTriangle, FiDroplet, FiTrendingUp } from 'react-icons/fi'
import Card from '../shared/Card'
import GaugeCircle from '../shared/GaugeCircle'
import { useApp } from '../../context/AppContext'
import { LEVEL_META } from '../../utils/risk'

export default function OverviewCards() {
  const { campusHealthScore, activeAlerts, scoredLocations, worstLocation, dataset, dayIndex } = useApp()

  const samplesCollected = scoredLocations.length * (dayIndex + 1)

  // weekly score trend: average of last 7 vs previous 7 available days
  const weeklyTrend = React.useMemo(() => {
    const ids = scoredLocations.map(l => l.id)
    let curr = 0, prev = 0, count = 0
    ids.forEach(id => {
      const series = dataset[id] || []
      const currWindow = series.slice(Math.max(0, dayIndex - 6), dayIndex + 1)
      const prevWindow = series.slice(Math.max(0, dayIndex - 13), Math.max(0, dayIndex - 6))
      if (currWindow.length) { curr += currWindow.reduce((s, x) => s + x.viralLoad, 0) / currWindow.length; count++ }
      if (prevWindow.length) { prev += prevWindow.reduce((s, x) => s + x.viralLoad, 0) / prevWindow.length }
    })
    if (count === 0 || prev === 0) return 0
    return Math.round(((curr - prev) / prev) * 100)
  }, [dataset, scoredLocations, dayIndex])

  const overallLevel = campusHealthScore >= 72 ? 'green' : campusHealthScore >= 50 ? 'yellow' : 'red'
  const meta = LEVEL_META[overallLevel]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <Card title="Campus Health Score" icon={FiActivity}>
        <div className="flex items-center justify-center py-2">
          <GaugeCircle value={campusHealthScore} color={meta.color} sub="/ 100" />
        </div>
        <p className="text-xs text-slate-400 text-center mt-1">Aggregate of all 37 sampling points</p>
      </Card>

      <Card title="Current Risk Level" icon={FiDroplet}>
        <div className="flex flex-col items-center justify-center py-4 gap-2">
          <span className="text-3xl font-display font-semibold" style={{ color: meta.color }}>{meta.label}</span>
          <span className="text-xs text-slate-400">Campus-wide status right now</span>
        </div>
      </Card>

      <Card title="Active Alerts" icon={FiAlertTriangle}>
        <div className="flex flex-col items-center justify-center py-4 gap-1">
          <span className="text-3xl font-display font-semibold text-signal-amber">{activeAlerts.length}</span>
          <span className="text-xs text-slate-400 text-center">
            {worstLocation ? `Most severe: ${worstLocation.name}` : 'No active alerts'}
          </span>
        </div>
      </Card>

      <Card title="Samples Collected" icon={FiTrendingUp}>
        <div className="flex flex-col items-center justify-center py-4 gap-1">
          <span className="text-3xl font-display font-semibold text-signal-cyan">{samplesCollected}</span>
          <span className={`text-xs ${weeklyTrend > 0 ? 'text-signal-red' : 'text-signal-green'}`}>
            {weeklyTrend > 0 ? '▲' : '▼'} {Math.abs(weeklyTrend)}% weekly viral load trend
          </span>
        </div>
      </Card>
    </div>
  )
}
