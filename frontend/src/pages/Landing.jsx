import React from 'react'
import Navbar from '../components/shared/Navbar'
import Hero from '../components/landing/Hero'
import FeatureCards from '../components/landing/FeatureCards'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeatureCards />
      <section className="max-w-4xl mx-auto px-5 pb-24 text-center">
        <div className="glass gradient-border rounded-2xl p-8">
          <h3 className="font-display text-xl font-semibold text-slate-100 mb-2">Wastewater-based epidemiology, made actionable</h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto mb-6">
            Instead of testing every student, one sample per building surfaces the same early warning — days before symptoms send anyone to the health center.
          </p>
          <Link to="/dashboard" className="inline-block px-6 py-3 rounded-xl bg-signal-green text-base-950 font-semibold text-sm shadow-glow hover:brightness-110 transition-all">
            Open the Dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}
