import { LOCATIONS } from './locations'

// Set to true only if you're running the Express backend (see /backend) and
// want the dataset fetched over HTTP instead of generated in the browser.
export const USE_BACKEND = false
export const BACKEND_URL = 'http://localhost:4000'

// ---- deterministic pseudo-random helpers (so the same scenario+day+building
// always produces the same reading, instead of re-randomizing every render) ----
function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h
}
function seededRandom(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return function next() {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export const SCENARIOS = {
  NORMAL: { id: 'NORMAL', label: 'Normal Week', viralMult: 1, bacterialMult: 1, turbidityMult: 1, rainChance: 0.15, tempBase: 24 },
  FESTIVAL: { id: 'FESTIVAL', label: 'Festival Week', viralMult: 1.3, bacterialMult: 1.6, turbidityMult: 1.4, rainChance: 0.1, tempBase: 26 },
  HEAVY_RAIN: { id: 'HEAVY_RAIN', label: 'Heavy Rain', viralMult: 1.5, bacterialMult: 1.7, turbidityMult: 2.1, rainChance: 0.85, tempBase: 22 },
  WINTER: { id: 'WINTER', label: 'Winter', viralMult: 1.4, bacterialMult: 0.9, turbidityMult: 0.9, rainChance: 0.2, tempBase: 11 },
  SUMMER: { id: 'SUMMER', label: 'Summer', viralMult: 0.8, bacterialMult: 1.1, turbidityMult: 0.8, rainChance: 0.05, tempBase: 34 },
  HOSTEL_OUTBREAK: { id: 'HOSTEL_OUTBREAK', label: 'Hostel Outbreak', viralMult: 2.4, bacterialMult: 2.0, turbidityMult: 1.6, rainChance: 0.2, tempBase: 25 }
}

export const TIMELINE_DAYS = 30 // last 30 days ending today, used by the historical slider

function dayLabel(offsetFromToday) {
  const d = new Date()
  d.setDate(d.getDate() - (TIMELINE_DAYS - 1 - offsetFromToday))
  return d.toISOString().slice(0, 10)
}
export const TIMELINE_DATES = Array.from({ length: TIMELINE_DAYS }, (_, i) => dayLabel(i))

// A handful of buildings run "hotter" baselines to keep the campus realistic
// (denser hostels & mess halls trend higher than academic/community blocks).
function baselineFor(loc) {
  switch (loc.category) {
    case 'Mess': return { viral: 46, bacterial: 520, turbidity: 32, ph: 7.0, antibiotic: 0.9 }
    case 'Hostel': return { viral: 38, bacterial: 430, turbidity: 26, ph: 7.1, antibiotic: 0.6 }
    case 'Academic Block': return { viral: 18, bacterial: 210, turbidity: 14, ph: 7.3, antibiotic: 0.3 }
    default: return { viral: 22, bacterial: 260, turbidity: 16, ph: 7.2, antibiotic: 0.35 }
  }
}

/**
 * Generate one sample for a given location, day index, and scenario.
 * dayIndex: 0..TIMELINE_DAYS-1 (0 = oldest of the 30 days, last = today)
 */
export function generateSample(loc, dayIndex, scenarioId = 'NORMAL') {
  const scenario = SCENARIOS[scenarioId] || SCENARIOS.NORMAL
  const rand = seededRandom(hashString(`${loc.id}-${dayIndex}-${scenarioId}`))
  const base = baselineFor(loc)

  // mild upward drift as we approach "today" to give predictions something to grip onto,
  // amplified heavily for hostel-outbreak scenario on hostel buildings specifically
  const drift = (dayIndex / TIMELINE_DAYS) * (scenarioId === 'HOSTEL_OUTBREAK' && loc.category === 'Hostel' ? 38 : 6)

  const noise = () => (rand() - 0.5) * 2

  const viralLoad = Math.max(2, base.viral * scenario.viralMult + drift * 1.4 + noise() * 6)
  const bacterialLoad = Math.max(20, base.bacterial * scenario.bacterialMult + drift * 12 + noise() * 40)
  const turbidity = Math.max(1, base.turbidity * scenario.turbidityMult + drift * 0.9 + noise() * 4)
  const ph = Math.min(9, Math.max(4.5, base.ph - (turbidity > 30 ? 0.6 : 0) + noise() * 0.3))
  const antibioticResidue = Math.max(0, base.antibiotic * (1 + (scenario.bacterialMult - 1) * 0.5) + noise() * 0.08)
  const temperature = scenario.tempBase + noise() * 2
  const isRainy = rand() < scenario.rainChance
  const rainfallMm = isRainy ? Math.round(4 + rand() * 46) : 0
  const humidity = Math.round(45 + (isRainy ? 25 : 0) + noise() * 8)

  return {
    locationId: loc.id,
    date: TIMELINE_DATES[dayIndex] || dayLabel(dayIndex),
    ph: Number(ph.toFixed(2)),
    viralLoad: Math.round(viralLoad),        // copies / mL (relative units)
    bacterialLoad: Math.round(bacterialLoad), // CFU / 100mL (relative units)
    turbidity: Number(turbidity.toFixed(1)),  // NTU
    temperature: Number(temperature.toFixed(1)),
    antibioticResidue: Number(antibioticResidue.toFixed(2)),
    weather: { isRainy, rainfallMm, humidity: Math.min(98, humidity) }
  }
}

export function generateSeries(loc, scenarioId = 'NORMAL') {
  return Array.from({ length: TIMELINE_DAYS }, (_, i) => generateSample(loc, i, scenarioId))
}

export function generateFullDataset(scenarioId = 'NORMAL') {
  const dataset = {}
  LOCATIONS.forEach(loc => {
    dataset[loc.id] = generateSeries(loc, scenarioId)
  })
  return dataset
}
