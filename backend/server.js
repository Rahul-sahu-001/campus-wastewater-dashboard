import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const locations = JSON.parse(readFileSync(path.join(__dirname, 'data/locations.json'), 'utf-8'))

const app = express()
app.use(cors())
app.use(express.json())

const SCENARIOS = {
  NORMAL: { viralMult: 1, bacterialMult: 1, turbidityMult: 1 },
  FESTIVAL: { viralMult: 1.3, bacterialMult: 1.6, turbidityMult: 1.4 },
  HEAVY_RAIN: { viralMult: 1.5, bacterialMult: 1.7, turbidityMult: 2.1 },
  WINTER: { viralMult: 1.4, bacterialMult: 0.9, turbidityMult: 0.9 },
  SUMMER: { viralMult: 0.8, bacterialMult: 1.1, turbidityMult: 0.8 },
  HOSTEL_OUTBREAK: { viralMult: 2.4, bacterialMult: 2.0, turbidityMult: 1.6 }
}

function baselineFor(category) {
  switch (category) {
    case 'Mess': return { viral: 46, bacterial: 520, turbidity: 32, ph: 7.0 }
    case 'Hostel': return { viral: 38, bacterial: 430, turbidity: 26, ph: 7.1 }
    case 'Academic Block': return { viral: 18, bacterial: 210, turbidity: 14, ph: 7.3 }
    default: return { viral: 22, bacterial: 260, turbidity: 16, ph: 7.2 }
  }
}

function generateSample(loc, dayIndex, scenarioId = 'NORMAL') {
  const scenario = SCENARIOS[scenarioId] || SCENARIOS.NORMAL
  const base = baselineFor(loc.category)
  const noise = () => (Math.random() - 0.5) * 2
  const drift = (dayIndex / 30) * 6
  const date = new Date()
  date.setDate(date.getDate() - (30 - 1 - dayIndex))

  return {
    locationId: loc.id,
    date: date.toISOString().slice(0, 10),
    ph: Number((base.ph + noise() * 0.3).toFixed(2)),
    viralLoad: Math.round(Math.max(2, base.viral * scenario.viralMult + drift + noise() * 6)),
    bacterialLoad: Math.round(Math.max(20, base.bacterial * scenario.bacterialMult + drift * 10 + noise() * 40)),
    turbidity: Number(Math.max(1, base.turbidity * scenario.turbidityMult + noise() * 4).toFixed(1)),
    antibioticResidue: Number(Math.max(0, 0.5 + noise() * 0.1).toFixed(2))
  }
}

app.get('/api/locations', (req, res) => res.json(locations))

app.get('/api/samples', (req, res) => {
  const scenario = req.query.scenario || 'NORMAL'
  const dataset = {}
  locations.forEach(loc => {
    dataset[loc.id] = Array.from({ length: 30 }, (_, i) => generateSample(loc, i, scenario))
  })
  res.json(dataset)
})

app.get('/api/samples/:locationId', (req, res) => {
  const loc = locations.find(l => l.id === req.params.locationId)
  if (!loc) return res.status(404).json({ error: 'Location not found' })
  const scenario = req.query.scenario || 'NORMAL'
  res.json(Array.from({ length: 30 }, (_, i) => generateSample(loc, i, scenario)))
})

app.get('/api/health', (req, res) => res.json({ status: 'ok', locations: locations.length }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Campus Wastewater API running on http://localhost:${PORT}`))
