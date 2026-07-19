import React, { useMemo } from 'react'
import { FiThermometer } from 'react-icons/fi'
import Card from '../shared/Card'
import GaugeCircle from '../shared/GaugeCircle'
<<<<<<< HEAD
=======
import StatusBadge from '../shared/StatusBadge'
>>>>>>> origin/main
import { useApp } from '../../context/AppContext'
import { diseaseProbabilities } from '../../utils/disease'

export default function DiseasePanel() {
  const { selectedLocation } = useApp()
  const diseases = useMemo(() => selectedLocation?.sample ? diseaseProbabilities(selectedLocation.sample) : [], [selectedLocation])

<<<<<<< HEAD
  return (
    <Card title="Disease Probability Panel" icon={FiThermometer}>
=======
  const locationBadge = selectedLocation && (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{selectedLocation.name}</span>
      <StatusBadge level={selectedLocation.level} />
    </div>
  )

  return (
    <Card title="Disease Probability Panel" icon={FiThermometer} action={locationBadge}>
>>>>>>> origin/main
      <p className="text-xs text-slate-500 mb-4">
        Indicative probabilities for {selectedLocation?.name || '—'}, derived from viral/bacterial load, turbidity and pH — not a clinical diagnosis.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {diseases.map(d => (
          <div key={d.name} className="flex flex-col items-center">
            <GaugeCircle value={d.value} size={82} stroke={7} color={d.color} sub="%" />
            <span className="text-xs text-slate-400 mt-1 text-center">{d.name}</span>
          </div>
        ))}
      </div>
    </Card>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main
