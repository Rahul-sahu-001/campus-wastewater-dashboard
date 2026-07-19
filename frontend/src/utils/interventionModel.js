import { predictNextDays } from './predict'

/**
 * Given a location's historical sample series, projects two outcomes:
 *  - "No action": the existing trend-based prediction (predictNextDays)
 *  - "Early intervention": follows the same trajectory until
 *    `interventionDay`, after which risk score decays toward a safe
 *    baseline — modeling the effect of isolation, increased chlorination,
 *    and targeted follow-up sampling once an alert is acted on.
 *
 * This is a simplified, explainable illustrative model (not a full
 * epidemiological simulation) whose purpose is to visualize WHY early
 * detection — wastewater surveillance's core value proposition — matters.
 */
export function simulateIntervention(series, interventionDay = 2, days = 7) {
  const base = predictNextDays(series, days)
  const noAction = [
    { dayOffset: 0, score: base.todayScore },
    ...base.predictions.map(p => ({ dayOffset: p.dayOffset, score: p.predictedScore }))
  ]

  const DECAY_RATE = 0.22 // ~22% reduction per day toward baseline once intervention kicks in
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

  return {
    noAction,
    withIntervention,
    noActionPeak,
    interventionPeak,
    riskReducedByEnd,
    finalNoAction,
    finalIntervention,
    daysToNormalNoAction,
    daysToNormalIntervention
  }
}