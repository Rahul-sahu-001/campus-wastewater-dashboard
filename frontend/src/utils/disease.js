// Maps sensor readings to indicative disease probabilities. These are
// simplified, explainable heuristics for demo purposes, not clinical
// diagnostics — each disease responds to different signal combinations.
function clamp(v, lo = 1, hi = 97) { return Math.min(hi, Math.max(lo, Math.round(v))) }

export function diseaseProbabilities(sample) {
  const { viralLoad, bacterialLoad, turbidity, ph, antibioticResidue } = sample

  const covid = clamp(viralLoad * 0.9 + (turbidity > 30 ? 6 : 0))
  const norovirus = clamp(viralLoad * 0.55 + bacterialLoad * 0.02)
  const typhoid = clamp(bacterialLoad * 0.045 + (ph < 6.5 ? 8 : 0))
  const cholera = clamp(bacterialLoad * 0.03 + (turbidity > 35 ? 10 : 0) + (sample.weather?.isRainy ? 6 : 0))
  const influenza = clamp(viralLoad * 0.65 + antibioticResidue * 6)

  return [
    { name: 'COVID-19', value: covid, color: '#38bdf8' },
    { name: 'Influenza', value: influenza, color: '#2dd4a7' },
    { name: 'Norovirus', value: norovirus, color: '#f5b942' },
    { name: 'Typhoid', value: typhoid, color: '#c084fc' },
    { name: 'Cholera', value: cholera, color: '#f2545b' }
  ]
}
