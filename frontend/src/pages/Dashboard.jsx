import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid, FiMap, FiCpu, FiBarChart2, FiMessageCircle,
  FiPlayCircle, FiShield, FiSettings
} from 'react-icons/fi'
import Navbar from '../components/shared/Navbar'
import TabNav from '../components/shared/TabNav'

import OverviewCards from '../components/dashboard/OverviewCards'
import LeadTimeStat from '../components/dashboard/LeadTimeStat'
import CampusMap from '../components/dashboard/CampusMap'
import ExplainableAlert from '../components/dashboard/ExplainableAlert'
import PredictionPanel from '../components/dashboard/PredictionPanel'
import InterventionSimulator from '../components/dashboard/InterventionSimulator'
import DiseasePanel from '../components/dashboard/DiseasePanel'
import HealthIndexGauge from '../components/dashboard/HealthIndexGauge'
import HistoricalTimeline from '../components/dashboard/HistoricalTimeline'
import WeatherCorrelation from '../components/dashboard/WeatherCorrelation'
import SamplingRoute from '../components/dashboard/SamplingRoute'
import AIAssistant from '../components/dashboard/AIAssistant'
import ResponseGenerator from '../components/dashboard/ResponseGenerator'
import NotificationCenter from '../components/dashboard/NotificationCenter'
import SimulationControls from '../components/dashboard/SimulationControls'
import PrivacyDashboard from '../components/dashboard/PrivacyDashboard'
import Analytics from '../components/dashboard/Analytics'
import AdminPanel from '../components/dashboard/AdminPanel'
import DeploymentView from '../components/dashboard/DeploymentView'

const TABS = [
  { id: 'overview', label: 'Overview', icon: FiGrid },
  { id: 'map', label: 'Campus Map', icon: FiMap },
  { id: 'predictions', label: 'Predictions', icon: FiCpu },
  { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  { id: 'assistant', label: 'AI Assistant', icon: FiMessageCircle },
  { id: 'simulation', label: 'Simulation', icon: FiPlayCircle },
  { id: 'privacy', label: 'Privacy & Deployment', icon: FiShield },
  { id: 'admin', label: 'Admin', icon: FiSettings }
]

function fadeProps() {
  return { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.25 } }
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="max-w-7xl mx-auto px-5 pt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" {...fadeProps()} className="space-y-6">
              <OverviewCards />
              <LeadTimeStat />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <ExplainableAlert />
                <HealthIndexGauge />
                <NotificationCenter />
              </div>
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div key="map" {...fadeProps()} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <CampusMap />
              <SamplingRoute />
            </motion.div>
          )}

          {activeTab === 'predictions' && (
            <motion.div key="predictions" {...fadeProps()} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <PredictionPanel />
              <div className="flex flex-col gap-5">
                <DiseasePanel />
                <WeatherCorrelation />
              </div>
              <InterventionSimulator />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" {...fadeProps()} className="space-y-5">
              <HistoricalTimeline />
              <Analytics />
            </motion.div>
          )}

          {activeTab === 'assistant' && (
            <motion.div key="assistant" {...fadeProps()} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <AIAssistant />
              <ResponseGenerator />
            </motion.div>
          )}

          {activeTab === 'simulation' && (
            <motion.div key="simulation" {...fadeProps()} className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <SimulationControls />
                <div className="lg:col-span-2">
                  <OverviewCards />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div key="privacy" {...fadeProps()} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <PrivacyDashboard />
              <DeploymentView />
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div key="admin" {...fadeProps()}>
              <AdminPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}