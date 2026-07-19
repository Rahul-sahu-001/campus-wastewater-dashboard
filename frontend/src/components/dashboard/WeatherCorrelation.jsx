import React from 'react'
import { FiCloudRain, FiSun, FiDroplet, FiThermometer, FiArrowDown } from 'react-icons/fi'
import Card from '../shared/Card'
import { useApp } from '../../context/AppContext'

export default function WeatherCorrelation() {
  const { selectedLocation } = useApp()
  const w = selectedLocation?.sample?.weather

  const locationBadge = selectedLocation && (
    <span className="text-xs text-slate-400">{selectedLocation.name}</span>
  )

  return (
    <Card title="Weather Correlation" icon={FiCloudRain} action={locationBadge}>
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="rounded-lg bg-white/[0.03] border border-white/10 py-3">
          <FiThermometer className="mx-auto mb-1 text-signal-amber" size={16} />
          <p className="text-sm font-semibold text-slate-200">{selectedLocation?.sample?.temperature}°C</p>
          <p className="text-[10px] text-slate-500">Temperature</p>
        </div>
        <div className="rounded-lg bg-white/[0.03] border border-white/10 py-3">
          <FiDroplet className="mx-auto mb-1 text-signal-cyan" size={16} />
          <p className="text-sm font-semibold text-slate-200">{w?.humidity}%</p>
          <p className="text-[10px] text-slate-500">Humidity</p>
        </div>
        <div className="rounded-lg bg-white/[0.03] border border-white/10 py-3">
          <FiCloudRain className="mx-auto mb-1 text-signal-cyan" size={16} />
          <p className="text-sm font-semibold text-slate-200">{w?.rainfallMm ?? 0}mm</p>
          <p className="text-[10px] text-slate-500">Rainfall</p>
        </div>
      </div>

      {w?.isRainy ? (
        <div className="text-sm text-slate-300 space-y-1.5">
          <p>Heavy Rain</p>
          <FiArrowDown className="text-slate-600" />
          <p>Stormwater Overflow</p>
          <FiArrowDown className="text-slate-600" />
          <p>High Contamination</p>
          <FiArrowDown className="text-slate-600" />
          <p className="text-signal-red font-medium">Higher Disease Risk</p>
        </div>
      ) : (
        <p className="text-sm text-slate-400">No significant rainfall for this sample — weather is not currently a contributing risk factor at {selectedLocation?.name}.</p>
      )}
    </Card>
  )
}