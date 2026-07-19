import React, { useMemo } from 'react'
import { FiNavigation } from 'react-icons/fi'
import Card from '../shared/Card'
import { useApp } from '../../context/AppContext'
import { LEVEL_META } from '../../utils/risk'

export default function SamplingRoute() {
  const { scoredLocations } = useApp()

  // Optimized order: highest risk first (visit riskiest buildings earliest in the day),
  // grouped so hostels/mess clusters near each other are visited consecutively.
  const route = useMemo(() => {
    return [...scoredLocations].sort((a, b) => b.score - a.score).slice(0, 6)
  }, [scoredLocations])

  return (
    <Card title="Smart Sampling Route" icon={FiNavigation}>
      <p className="text-xs text-slate-500 mb-4">Today's optimized visiting order — highest-risk buildings sampled first.</p>
      <div className="space-y-0">
        {route.map((loc, i) => (
          <div key={loc.id} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-base-950"
                style={{ backgroundColor: LEVEL_META[loc.level].color }}
              >
                {i + 1}
              </span>
              {i < route.length - 1 && <span className="w-px h-6 bg-white/15" />}
            </div>
            <div className="pb-6 flex-1 flex items-center justify-between">
              <span className="text-sm text-slate-200 font-medium">{loc.name}</span>
              <span className="text-xs text-slate-500">Risk {loc.score}/100</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
