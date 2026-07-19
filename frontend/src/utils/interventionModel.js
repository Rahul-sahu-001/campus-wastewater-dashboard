import { predictNextDays } from './predict'

export function simulateIntervention(series, interventionDay = 2, days = 7) {
  const base = predictNextDays(series, days)
  const noAction = [
    { dayOffset: 0, score: base.todayScore },
    ...base.predictions.map(p => ({ dayOffset: p.dayOffset, score: p.predictedScore }))
  ]

  const DECAY_RATE = 0.22
  const SAFE_BASELINE = 15

  const withIntervention = []
  let current = base.todayScore
  for (let d = 0; d <= days; d++) {
    if (d === 0) {
      withIntervention.push({ dayOffset: d, score: current })
      continue
    }
    if (d <= interventionDay) {
      current = noAction[d].score
    } else {
      current = Math.round(current - (current - SAFE_BASELINE) * DECAY_RATE)
      current = Math.max(SAFE_BASELINE, current)
    }
    withIntervention.push({ dayOffset: d, score: current })
  }

  const noActionPeak = Math.max(...noAction.map(p => p.score))
  const interventionPeak = Math.max(...withIntervention.map(p => p.score))
  const finalNoAction = noAction[noAction.length - 1].score
  const finalIntervention = withIntervention[withIntervention.length - 1].score
  const riskReducedByEnd = Math.max(0, finalNoAction - finalIntervention)
  const daysToNormalNoAction = noAction.find(p => p.score < 28)?.dayOffset ?? null
  const daysToNormalIntervention = withIntervention.find(p => p.score < 28)?.dayOffset ?? null

  return { noAction, withIntervention, noActionPeak, interventionPeak, riskReducedByEnd, finalNoAction, finalIntervention, daysToNormalNoAction, daysToNormalIntervention }
}