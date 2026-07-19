import React from 'react'
import { FiClock } from 'react-icons/fi'
import Card from '../shared/Card'
import { useApp } from '../../context/AppContext'

export default function HistoricalTimeline() {
  const { dayIndex, setDayIndex, timelineDates } = useApp()

  return (
    <Card title="Historical Timeline" icon={FiClock} className="lg:col-span-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500">{timelineDates[0]}</span>
        <span className="font-display text-sm font-semibold text-signal-cyan">{timelineDates[dayIndex]}</span>
        <span className="text-xs text-slate-500">{timelineDates[timelineDates.length - 1]}</span>
      </div>
      <input
        type="range"
        min={0}
        max={timelineDates.length - 1}
        value={dayIndex}
        onChange={e => setDayIndex(Number(e.target.value))}
        className="w-full accent-signal-green h-2 cursor-pointer"
      />
      <p className="text-xs text-slate-500 mt-2">
        Drag to replay any of the last 30 days — every chart, alert, map color, and prediction on this page recalculates for that date.
      </p>
    </Card>
  )
}
