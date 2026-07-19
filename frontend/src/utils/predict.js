import { scoreSample } from './risk'

/**
 * Simple, explainable trend-projection model (linear regression over the last
 * 10 days of risk score + weighted recent slope) producing a 7-day forecast.
 * This is intentionally transparent rather than a black box, so the "reason"
 * shown to the user is always traceable to the underlying numbers.
 */
export function predictNextDays(series, days = 7) {
  const recent = series.slice(-10)
  const scored = recent.map((s, i) => ({ ...scoreSample(s, recent[i - 1]), date: s.date, sample: s }))
  const n = scored.length
  const xs = scored.map((_, i) => i)
  const ys = scored.map(s => s.score)
  const xMean = xs.reduce((a, b) => a + b, 0) / n
  const yMean = ys.reduce((a, b) => a + b, 0) / n
  let num = 0, den = 0
  for (let i = 0; i < n; i++) { num += (xs[i] - xMean) * (ys[i] - yMean); den += (xs[i] - xMean) ** 2 }
  const slope = den === 0 ? 0 : num / den
  const intercept = yMean - slope * xMean

  const todayScore = ys[ys.length - 1]
  const predictions = []
  for (let d = 1; d <= days; d++) {
    const raw = intercept + slope * (n - 1 + d)
    const dampened = todayScore + (raw - todayScore) * (1 - d * 0.04) // dampen runaway extrapolation
    const value = Math.min(100, Math.max(0, Math.round(dampened)))
    predictions.push({ dayOffset: d, predictedScore: value })
  }

  const peak = predictions.reduce((max, p) => (p.predictedScore > max.predictedScore ? p : max), predictions[0])
  const trendPct = todayScore > 0 ? Math.round(((peak.predictedScore - todayScore) / Math.max(1, todayScore)) * 100) : 0

  const reasons = []
  if (slope > 0.5) reasons.push('Sustained upward trend in risk score over the last 10 samples')
  const lastSample = recent[recent.length - 1]
  const prevSample = recent[recent.length - 2]
  if (lastSample && prevSample && lastSample.viralLoad > prevSample.viralLoad) {
    const pct = Math.round(((lastSample.viralLoad - prevSample.viralLoad) / prevSample.viralLoad) * 100)
    if (pct > 5) reasons.push(`Predicted viral RNA increase (+${pct}% day-over-day)`)
  }
  if (lastSample?.weather?.isRainy) reasons.push('Heavy rainfall detected — elevated overflow risk')
  if (lastSample && prevSample && lastSample.bacterialLoad > prevSample.bacterialLoad) reasons.push('Increasing bacterial load trend across recent samples')
  if (reasons.length === 0) reasons.push('Readings are stable with no significant upward trend')

  const confidence = Math.min(96, Math.max(58, 70 + Math.round(Math.abs(slope) * 6) - Math.round(days * 1.2)))

  return {
    todayScore,
    predictions,
    expectedPeak: { dayOffset: peak.dayOffset, score: peak.predictedScore, trendPct },
    confidence,
    reasons
  }
}
