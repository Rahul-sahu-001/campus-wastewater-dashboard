// Thresholds are documented so the alert can always explain itself (Explainable AI requirement).
export const THRESHOLDS = {
  viralLoad: { warn: 45, danger: 70 },
  bacterialLoad: { warn: 450, danger: 700 },
  turbidity: { warn: 28, danger: 42 },
  ph: { lowWarn: 6.5, lowDanger: 6.0, highWarn: 8.2, highDanger: 8.6 },
  antibioticResidue: { warn: 0.8, danger: 1.3 }
}

/**
 * Compute a 0-100 risk score plus the exact reasons behind it, from one sample.
 */
export function scoreSample(sample, prevSample) {
  const reasons = []
  let score = 0

  if (sample.viralLoad >= THRESHOLDS.viralLoad.danger) { score += 34; reasons.push(`Viral load at ${sample.viralLoad} is well above the safe threshold (${THRESHOLDS.viralLoad.danger})`) }
  else if (sample.viralLoad >= THRESHOLDS.viralLoad.warn) { score += 18; reasons.push(`Viral load at ${sample.viralLoad} has crossed the watch threshold (${THRESHOLDS.viralLoad.warn})`) }

  if (sample.bacterialLoad >= THRESHOLDS.bacterialLoad.danger) { score += 28; reasons.push(`Bacterial load at ${sample.bacterialLoad} CFU/100mL exceeds the danger limit`) }
  else if (sample.bacterialLoad >= THRESHOLDS.bacterialLoad.warn) { score += 14; reasons.push(`Bacterial load at ${sample.bacterialLoad} CFU/100mL is trending high`) }

  if (sample.turbidity >= THRESHOLDS.turbidity.danger) { score += 18; reasons.push(`Turbidity at ${sample.turbidity} NTU crossed the safe threshold`) }
  else if (sample.turbidity >= THRESHOLDS.turbidity.warn) { score += 9; reasons.push(`Turbidity at ${sample.turbidity} NTU is elevated`) }

  if (sample.ph <= THRESHOLDS.ph.lowDanger || sample.ph >= THRESHOLDS.ph.highDanger) { score += 12; reasons.push(`pH of ${sample.ph} is outside the safe operating band`) }
  else if (sample.ph <= THRESHOLDS.ph.lowWarn || sample.ph >= THRESHOLDS.ph.highWarn) { score += 6; reasons.push(`pH of ${sample.ph} dropped below the comfortable safe range`) }

  if (sample.antibioticResidue >= THRESHOLDS.antibioticResidue.danger) { score += 8; reasons.push(`Antibiotic residue at ${sample.antibioticResidue} mg/L is unusually high`) }

  if (prevSample) {
    const viralChangePct = prevSample.viralLoad > 0 ? ((sample.viralLoad - prevSample.viralLoad) / prevSample.viralLoad) * 100 : 0
    if (viralChangePct >= 20) reasons.push(`Viral load increased ${viralChangePct.toFixed(0)}% versus the previous sample`)
  }

  if (sample.weather?.isRainy && sample.weather.rainfallMm >= 25) {
    score += 6
    reasons.push(`Heavy rainfall (${sample.weather.rainfallMm}mm) likely driving stormwater overflow into the line`)
  }

  score = Math.min(100, Math.round(score))

  let level = 'green'
  if (score >= 55) level = 'red'
  else if (score >= 28) level = 'yellow'

  if (reasons.length === 0) reasons.push('All monitored parameters are within safe operating thresholds')

  const confidence = Math.min(97, 62 + Math.round(reasons.length * 6) + Math.round(score / 10))

  return { score, level, reasons, confidence }
}

export function recommendationFor(level, reasons) {
  if (level === 'red') {
    return [
      'Increase sampling frequency to every 6 hours',
      'Inspect drainage and sewage lines for blockages or overflow',
      'Increase chlorination at the nearest treatment point',
      'Notify the campus health center immediately',
      'Collect additional confirmatory samples within 24 hours'
    ]
  }
  if (level === 'yellow') {
    return [
      'Monitor this location closely over the next 48 hours',
      'Repeat sampling after 24 hours to confirm the trend',
      'Flag building for a routine drainage inspection'
    ]
  }
  return ['No action required — continue routine weekly sampling']
}

export const LEVEL_META = {
  green: { label: 'Normal', color: '#2dd4a7', badge: 'bg-signal-green/15 text-signal-green border-signal-green/40' },
  yellow: { label: 'Monitor', color: '#f5b942', badge: 'bg-signal-amber/15 text-signal-amber border-signal-amber/40' },
  red: { label: 'Critical', color: '#f2545b', badge: 'bg-signal-red/15 text-signal-red border-signal-red/40' }
}
