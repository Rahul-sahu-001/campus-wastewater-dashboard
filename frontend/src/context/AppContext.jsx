import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { LOCATIONS } from '../data/locations'
import { generateFullDataset, SCENARIOS, TIMELINE_DATES, TIMELINE_DAYS } from '../data/generateData'
import { scoreSample } from '../utils/risk'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

const NOTIF_TEMPLATES = [
  { type: 'info', text: loc => `New sample collected at ${loc}` },
  { type: 'warn', text: loc => `Warning detected at ${loc} — parameters trending up` },
  { type: 'good', text: loc => `Risk reduced at ${loc} after remediation` },
  { type: 'info', text: () => `Prediction model updated with latest samples` }
]

export function AppProvider({ children }) {
  const [scenarioId, setScenarioId] = useState('NORMAL')
  const [dayIndex, setDayIndex] = useState(TIMELINE_DAYS - 1) // default = today
  const [dataset, setDataset] = useState(() => generateFullDataset('NORMAL'))
  const [selectedLocationId, setSelectedLocationId] = useState(LOCATIONS[0].id)
  const [notifications, setNotifications] = useState([])
  const [darkMode, setDarkMode] = useState(true)
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')

  // Regenerate dataset whenever scenario changes
  useEffect(() => {
    setDataset(generateFullDataset(scenarioId))
    const loc = LOCATIONS.find(l => l.id === selectedLocationId) || LOCATIONS[0]
    setNotifications(n => [
      { id: Date.now(), type: 'info', text: `Simulation switched to "${SCENARIOS[scenarioId].label}" — all buildings recalculated`, time: new Date().toLocaleTimeString() },
      ...n
    ].slice(0, 30))
  }, [scenarioId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Simulate a slow trickle of live notifications
  useEffect(() => {
    const id = setInterval(() => {
      const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
      const tmpl = NOTIF_TEMPLATES[Math.floor(Math.random() * NOTIF_TEMPLATES.length)]
      setNotifications(n => [
        { id: Date.now() + Math.random(), type: tmpl.type, text: tmpl.text(loc.name), time: new Date().toLocaleTimeString() },
        ...n
      ].slice(0, 30))
    }, 12000)
    return () => clearInterval(id)
  }, [])

  const currentSamples = useMemo(() => {
    const map = {}
    LOCATIONS.forEach(loc => {
      const series = dataset[loc.id] || []
      map[loc.id] = series[dayIndex] || series[series.length - 1]
    })
    return map
  }, [dataset, dayIndex])

  const scoredLocations = useMemo(() => {
    return LOCATIONS.map(loc => {
      const series = dataset[loc.id] || []
      const sample = series[dayIndex]
      const prev = series[dayIndex - 1]
      const scoring = sample ? scoreSample(sample, prev) : { score: 0, level: 'green', reasons: [], confidence: 0 }
      return { ...loc, sample, ...scoring }
    })
  }, [dataset, dayIndex])

  const filteredLocations = useMemo(() => {
    return scoredLocations.filter(l => {
      const matchSearch = search.trim() === '' || l.name.toLowerCase().includes(search.toLowerCase())
      const matchRisk = riskFilter === 'all' || l.level === riskFilter
      return matchSearch && matchRisk
    })
  }, [scoredLocations, search, riskFilter])

  const selectedLocation = useMemo(
    () => scoredLocations.find(l => l.id === selectedLocationId) || scoredLocations[0],
    [scoredLocations, selectedLocationId]
  )

  const campusHealthScore = useMemo(() => {
    if (scoredLocations.length === 0) return 100
    const avgRisk = scoredLocations.reduce((sum, l) => sum + l.score, 0) / scoredLocations.length
    return Math.round(100 - avgRisk)
  }, [scoredLocations])

  const activeAlerts = useMemo(() => scoredLocations.filter(l => l.level !== 'green'), [scoredLocations])
  const redAlerts = useMemo(() => scoredLocations.filter(l => l.level === 'red'), [scoredLocations])

  const worstLocation = useMemo(() => {
    if (scoredLocations.length === 0) return null
    return [...scoredLocations].sort((a, b) => b.score - a.score)[0]
  }, [scoredLocations])

  const resetData = useCallback(() => {
    setDataset(generateFullDataset(scenarioId))
    setDayIndex(TIMELINE_DAYS - 1)
    setNotifications(n => [{ id: Date.now(), type: 'info', text: 'Dataset reset to fresh simulated samples', time: new Date().toLocaleTimeString() }, ...n])
  }, [scenarioId])

  const value = {
    scenarioId, setScenarioId, scenarios: SCENARIOS,
    dayIndex, setDayIndex, timelineDates: TIMELINE_DATES,
    dataset, currentSamples, scoredLocations, filteredLocations,
    selectedLocationId, setSelectedLocationId, selectedLocation,
    notifications, setNotifications,
    darkMode, setDarkMode,
    search, setSearch, riskFilter, setRiskFilter,
    campusHealthScore, activeAlerts, redAlerts, worstLocation,
    resetData
  }

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
