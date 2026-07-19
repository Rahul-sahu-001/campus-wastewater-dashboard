import React, { useMemo } from 'react'
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts'
import { FiBarChart2 } from 'react-icons/fi'
import Card from '../shared/Card'
import { useApp } from '../../context/AppContext'
import { LEVEL_META } from '../../utils/risk'
import { CATEGORY, LOCATIONS } from '../../data/locations'

export default function Analytics() {
  const { dataset, selectedLocation, dayIndex, scoredLocations } = useApp()

  const trendData = useMemo(() => {
    if (!selectedLocation) return []
    const series = (dataset[selectedLocation.id] || []).slice(Math.max(0, dayIndex - 13), dayIndex + 1)
    return series.map(s => ({ date: s.date.slice(5), viralLoad: s.viralLoad, bacterialLoad: Math.round(s.bacterialLoad / 5), turbidity: s.turbidity }))
  }, [dataset, selectedLocation, dayIndex])

  const pieData = useMemo(() => {
    const counts = { green: 0, yellow: 0, red: 0 }
    scoredLocations.forEach(l => counts[l.level]++)
    return [
      { name: 'Normal', value: counts.green, color: LEVEL_META.green.color },
      { name: 'Monitor', value: counts.yellow, color: LEVEL_META.yellow.color },
      { name: 'Critical', value: counts.red, color: LEVEL_META.red.color }
    ]
  }, [scoredLocations])

  const barData = useMemo(() => {
    const byCategory = {}
    Object.values(CATEGORY).forEach(c => { byCategory[c] = { category: c, total: 0, count: 0 } })
    scoredLocations.forEach(l => { byCategory[l.category].total += l.score; byCategory[l.category].count++ })
    return Object.values(byCategory).map(c => ({ category: c.category.replace(' Building', ''), avgRisk: c.count ? Math.round(c.total / c.count) : 0 }))
  }, [scoredLocations])

  const radarData = useMemo(() => {
    const s = selectedLocation?.sample
    if (!s) return []
    return [
      { metric: 'Viral', value: Math.min(100, Math.round((s.viralLoad / 90) * 100)) },
      { metric: 'Bacterial', value: Math.min(100, Math.round((s.bacterialLoad / 900) * 100)) },
      { metric: 'Turbidity', value: Math.min(100, Math.round((s.turbidity / 55) * 100)) },
      { metric: 'pH Dev.', value: Math.min(100, Math.round((Math.abs(s.ph - 7.2) / 2.5) * 100)) },
      { metric: 'Antibiotic', value: Math.min(100, Math.round((s.antibioticResidue / 2) * 100)) }
    ]
  }, [selectedLocation])

  const heatmapRows = useMemo(() => {
    return LOCATIONS.slice(0, 20).map(loc => {
      const series = (dataset[loc.id] || []).slice(Math.max(0, dayIndex - 6), dayIndex + 1)
      return { name: loc.name, cells: series.map(s => Math.min(100, Math.round((s.viralLoad / 90) * 100))) }
    })
  }, [dataset, dayIndex])

  const tooltipStyle = { background: '#0f1c1b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }

  return (
    <Card title="Analytics" icon={FiBarChart2} className="lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-slate-500 mb-2">Viral / Bacterial / Turbidity trend — {selectedLocation?.name}</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--chart-tick)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--chart-tick)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="viralLoad" stroke="#38bdf8" fill="#38bdf822" strokeWidth={2} />
                <Area type="monotone" dataKey="turbidity" stroke="#f5b942" fill="#f5b94222" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-2">Campus-wide alert distribution</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={72} paddingAngle={3}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-2">Average risk by building category</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="category" tick={{ fill: 'var(--chart-tick)', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--chart-tick)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="avgRisk" radius={[6, 6, 0, 0]}>
                  {barData.map((d, i) => <Cell key={i} fill={d.avgRisk >= 55 ? '#f2545b' : d.avgRisk >= 28 ? '#f5b942' : '#2dd4a7'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-2">Parameter radar — {selectedLocation?.name}</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--chart-tick)', fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fill: 'var(--chart-tick)', fontSize: 8 }} axisLine={false} />
                <Radar dataKey="value" stroke="#2dd4a7" fill="#2dd4a7" fillOpacity={0.3} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs text-slate-500 mb-2">7-day viral-load heatmap across buildings</p>
        <div className="overflow-x-auto">
          <div className="min-w-[560px] space-y-1">
            {heatmapRows.map(row => (
              <div key={row.name} className="flex items-center gap-2">
                <span className="w-16 text-[10px] text-slate-500 shrink-0">{row.name}</span>
                <div className="flex gap-1 flex-1">
                  {row.cells.map((v, i) => (
                    <div
                      key={i}
                      className="h-4 flex-1 rounded-sm"
                      style={{ backgroundColor: `rgba(${v > 55 ? '242,84,91' : v > 28 ? '245,185,66' : '45,212,167'}, ${0.25 + (v / 100) * 0.65})` }}
                      title={`${v}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
