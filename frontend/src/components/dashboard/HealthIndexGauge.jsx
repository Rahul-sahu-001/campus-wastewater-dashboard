import React, { useMemo } from 'react'
import { FiHeart } from 'react-icons/fi'
import Card from '../shared/Card'
import GaugeCircle from '../shared/GaugeCircle'
import { useApp } from '../../context/AppContext'

export default function HealthIndexGauge() {
  const { selectedLocation } = useApp()
  const s = selectedLocation?.sample

  const factors = useMemo(() => {
    if (!s) return []
    return [
      { label: 'Viral Load', pct: Math.min(100, Math.round((s.viralLoad / 90) * 100)) },
      { label: 'pH Balance', pct: Math.min(100, Math.round((Math.abs(s.ph - 7.2) / 2.5) * 100)) },
      { label: 'Turbidity', pct: Math.min(100, Math.round((s.turbidity / 55) * 100)) },
      { label: 'Bacterial Count', pct: Math.min(100, Math.round((s.bacterialLoad / 900) * 100)) }
    ]
  }, [s])

  const index = selectedLocation ? Math.max(0, 100 - selectedLocation.score) : 100
  const color = index >= 72 ? '#2dd4a7' : index >= 50 ? '#f5b942' : '#f2545b'

  return (
    <Card title="Environmental Health Index" icon={FiHeart}>
      <div className="flex items-center justify-center py-2">
        <GaugeCircle value={index} size={130} color={color} sub="/ 100" />
      </div>
      <div className="space-y-2 mt-2">
        {factors.map(f => (
          <div key={f.label}>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{f.label}</span><span>{f.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-signal-green to-signal-cyan" style={{ width: `${f.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
