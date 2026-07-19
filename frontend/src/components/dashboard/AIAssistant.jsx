import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSend, FiCpu, FiUser } from 'react-icons/fi'
import Card from '../shared/Card'
import { useApp } from '../../context/AppContext'
import { LOCATIONS } from '../../data/locations'
import { recommendationFor } from '../../utils/risk'

const SUGGESTIONS = [
  'Why is the riskiest building red?',
  'Which building is safest?',
  'What action should administration take?',
  'How many alerts are active?'
]

function findLocationMention(text, scoredLocations) {
  const lower = text.toLowerCase()
  return scoredLocations.find(l => lower.includes(l.name.toLowerCase()) || lower.includes(l.id.toLowerCase()))
}

function answer(question, ctx) {
  const { scoredLocations, worstLocation, activeAlerts, campusHealthScore, scenarioId, scenarios } = ctx
  const q = question.toLowerCase()
  const mentioned = findLocationMention(question, scoredLocations)

  if (mentioned) {
    const meta = { green: 'normal', yellow: 'monitor status', red: 'a critical (red) alert' }[mentioned.level]
    const reasonText = mentioned.reasons.length
      ? mentioned.reasons.join('; ')
      : 'all readings are within safe thresholds'
    return `${mentioned.name} is currently at ${meta} (risk score ${mentioned.score}/100, ${mentioned.confidence}% confidence). Reasons: ${reasonText}.`
  }

  if (q.includes('safest') || q.includes('best')) {
    const safest = [...scoredLocations].sort((a, b) => a.score - b.score)[0]
    return `${safest.name} is currently the safest location on campus, with a risk score of only ${safest.score}/100.`
  }

  if (q.includes('riskiest') || q.includes('worst') || (q.includes('red') && q.includes('why'))) {
    if (!worstLocation) return "I don't have enough data yet to identify the highest-risk building."
    return `${worstLocation.name} currently has the highest risk score on campus (${worstLocation.score}/100). Reasons: ${worstLocation.reasons.join('; ')}.`
  }

  if (q.includes('how many alert') || q.includes('active alert')) {
    return `There ${activeAlerts.length === 1 ? 'is' : 'are'} currently ${activeAlerts.length} active alert${activeAlerts.length === 1 ? '' : 's'} campus-wide (yellow or red). ${activeAlerts.length ? 'Highest priority: ' + activeAlerts[0].name + '.' : ''}`
  }

  if (q.includes('action') || q.includes('should') || q.includes('recommend')) {
    if (!worstLocation) return 'No action is currently required — campus readings are within safe ranges.'
    const recs = recommendationFor(worstLocation.level, worstLocation.reasons)
    return `For ${worstLocation.name} (${worstLocation.level} status), administration should: ${recs.join('; ')}.`
  }

  if (q.includes('health score') || q.includes('overall') || q.includes('campus health')) {
    return `The overall Campus Health Score is currently ${campusHealthScore}/100, aggregated across all 37 real sampling locations.`
  }

  if (q.includes('scenario') || q.includes('simulation')) {
    return `The dashboard is currently running the "${scenarios[scenarioId].label}" simulation scenario.`
  }

  if (q.includes('privacy') || q.includes('individual') || q.includes('personal data')) {
    return 'Monitoring happens only at the building level — no individual student is tracked, and no personal data is ever collected. Samples are anonymous pooled wastewater.'
  }

  return `I can answer questions about any building (try naming one, e.g. "${LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)].name}"), the safest/riskiest location, active alerts, recommended actions, or the overall campus health score.`
}

export default function AIAssistant() {
  const ctx = useApp()
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi, I'm the Campus Health Assistant. Ask me why any building is flagged, which is safest, or what administration should do next." }
  ])
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = (text) => {
    const q = (text ?? input).trim()
    if (!q) return
    setMessages(m => [...m, { role: 'user', text: q }])
    setInput('')
    setTimeout(() => {
      setMessages(m => [...m, { role: 'assistant', text: answer(q, ctx) }])
    }, 350)
  }

  return (
    <Card title="AI Health Assistant" icon={FiCpu} className="lg:col-span-2">
      <div className="h-64 overflow-y-auto flex flex-col gap-3 pr-1 mb-3">
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-signal-cyan/20 text-signal-cyan' : 'bg-signal-green/20 text-signal-green'}`}>
              {m.role === 'user' ? <FiUser size={13} /> : <FiCpu size={13} />}
            </span>
            <span className={`text-sm rounded-xl px-3 py-2 max-w-[80%] ${m.role === 'user' ? 'bg-signal-cyan/10 text-slate-100' : 'bg-white/[0.05] text-slate-300'}`}>{m.text}</span>
          </motion.div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)} className="text-xs px-2.5 py-1 rounded-full glass text-slate-400 hover:text-signal-green hover:border-signal-green/30 transition-colors">
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={e => { e.preventDefault(); send() }} className="flex items-center gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about a building, risk level, or what to do next…"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-signal-green/40"
        />
        <button type="submit" className="w-10 h-10 rounded-lg bg-signal-green text-base-950 flex items-center justify-center hover:brightness-110 transition-all">
          <FiSend size={15} />
        </button>
      </form>
    </Card>
  )
}
