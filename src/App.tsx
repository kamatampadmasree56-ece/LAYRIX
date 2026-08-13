import { useState } from 'react'
import './App.css'
import CMOSInverterLab from './components/CMOSInverterLab'
import DigitalLogicLab from './components/DigitalLogicLab'
import PhysicalDesignFlow from './components/PhysicalDesignFlow'
import PlacementLab from './components/PlacementLab'
import RoutingLab from './components/RoutingLab'
import RTLVerilogLab from './components/RTLVerilogLab'
import SynthesisLab from './components/SynthesisLab'
import type { SynthesisMetrics } from './components/SynthesisLab'
import VLSIMathLab from './components/VLSIMathLab'

// New Components & Labs
import RoadmapSection from './components/RoadmapSection'
import SixPillars from './components/SixPillars'
import VideoLearning from './components/VideoLearning'
import FlipFlopLab from './components/FlipFlopLab'
import FSMLab from './components/FSMLab'
import EquationLab from './components/EquationLab'
import PracticeSection from './components/PracticeSection'
import TapeoutPath from './components/TapeoutPath'
import ProjectsSection from './components/ProjectsSection'
import ProgressTracker from './components/ProgressTracker'
import { LabDashboard } from './components/labs/LabDashboard'
import { loadProgress } from './utils/progressStorage'

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Roadmap', href: '#roadmap' },
  { name: 'Six Pillars', href: '#six-pillars' },
  { name: 'Video Learning', href: '#video-learning' },
  { name: 'Interactive Labs', href: '#interactive-labs' },
  { name: 'Equation Lab', href: '#equation-lab' },
  { name: 'Practice', href: '#practice' },
  { name: 'Tapeout Path', href: '#tapeout-path' },
  { name: 'Projects', href: '#projects-section' },
  { name: 'Progress', href: '#progress' },
]

function App() {
  const [, setSynthMetrics] = useState<SynthesisMetrics | null>(null)
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(() => {
    const p = loadProgress()
    return new Set(p.completedLevels)
  })

  const handleLevelComplete = (levelId: number) => {
    setCompletedLevels((prev) => {
      const next = new Set(prev)
      if (next.has(levelId)) next.delete(levelId)
      else next.add(levelId)

      // Save to localStorage progress
      const p = loadProgress()
      p.completedLevels = Array.from(next)
      localStorage.setItem('LAYRIX_PROGRESS_V1', JSON.stringify(p))

      return next
    })
  }

  return (
    <div className="app-shell">
      {/* Top Header Navigation */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark-svg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42" fill="none" width="42" height="42">
              <rect x="2" y="2" width="38" height="38" rx="8" fill="#0B172A" stroke="#2563EB" strokeWidth="2" />
              <rect x="11" y="11" width="20" height="20" rx="3" fill="#1E3A8A" />
              <line x1="17" y1="11" x2="17" y2="31" stroke="#2563EB" strokeWidth="0.8" opacity="0.6" />
              <line x1="25" y1="11" x2="25" y2="31" stroke="#2563EB" strokeWidth="0.8" opacity="0.6" />
              <line x1="11" y1="17" x2="31" y2="17" stroke="#2563EB" strokeWidth="0.8" opacity="0.6" />
              <line x1="11" y1="25" x2="31" y2="25" stroke="#2563EB" strokeWidth="0.8" opacity="0.6" />
              <circle cx="21" cy="21" r="3.5" fill="#06B6D4" />
              {/* External Pins */}
              <line x1="15" y1="0" x2="15" y2="4" stroke="#2563EB" strokeWidth="2" />
              <line x1="21" y1="0" x2="21" y2="4" stroke="#2563EB" strokeWidth="2" />
              <line x1="27" y1="0" x2="27" y2="4" stroke="#2563EB" strokeWidth="2" />
              <line x1="15" y1="38" x2="15" y2="42" stroke="#2563EB" strokeWidth="2" />
              <line x1="21" y1="38" x2="21" y2="42" stroke="#2563EB" strokeWidth="2" />
              <line x1="27" y1="38" x2="27" y2="42" stroke="#2563EB" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <p className="brand-label">LAYRIX</p>
            <p className="brand-tag">VLSI Physical Design Learning Lab</p>
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.name} href={item.href}>
              {item.name}
            </a>
          ))}
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Interactive VLSI Education Platform</p>
            <h1>Learn VLSI by Seeing It.</h1>
            <p className="hero-subtagline">From Digital Logic to RTL-to-GDSII and Tapeout</p>
            <p className="hero-text">
              Transform complex VLSI theory into interactive visual simulations, mathematical breakdowns, practical exercises, and physical design projects.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#roadmap">
                Explore Roadmap (Levels 0–21)
              </a>
              <a className="button secondary" href="#interactive-labs">
                Open Interactive Labs
              </a>
              <a className="button secondary" href="#projects-section">
                View TinyCore Capstone
              </a>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-card">
              <p className="panel-label">LAYRIX Core Progression</p>
              <h2>LEARN → SEE → SIMULATE → PRACTICE → BUILD → VERIFY → SIGNOFF</h2>
              <p>
                Follow the complete chip design pipeline with live interactive modules, equations, and portfolio projects.
              </p>

              <div className="hero-chip-stat-grid">
                <div className="stat-item">
                  <strong>22</strong>
                  <span>Roadmap Levels</span>
                </div>
                <div className="stat-item">
                  <strong>6</strong>
                  <span>Learning Pillars</span>
                </div>
                <div className="stat-item">
                  <strong>7+</strong>
                  <span>Visual Labs</span>
                </div>
                <div className="stat-item">
                  <strong>6</strong>
                  <span>Hands-on Projects</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Explore Roadmap (Level 0 to 21) */}
        <RoadmapSection completedLevels={completedLevels} onLevelComplete={handleLevelComplete} />

        {/* 2. Six Core Learning Pillars */}
        <SixPillars />

        {/* 3. Video Learning Page */}
        <VideoLearning />

        {/* 4. Interactive Labs Group */}
        <div id="interactive-labs" className="section-divider">
          <div className="section-heading">
            <p className="section-eyebrow">Interactive Simulation Suite</p>
            <h2>Educational Visual Laboratories</h2>
            <p className="section-description">
              Hands-on interactive simulators for Flip-Flops, FSMs, RTL-to-GDSII Flow, Placement, Routing, CMOS Inverters, and Digital Logic.
            </p>
          </div>

          {/* Interactive Lab Dashboard Landing */}
          <LabDashboard />

          {/* 1. Interactive Flip-Flop Lab */}
          <FlipFlopLab />

          {/* 2. Interactive FSM Lab */}
          <FSMLab />

          {/* 3. RTL-to-GDSII Flow Lab */}
          <PhysicalDesignFlow />

          {/* 4. Interactive Placement Lab */}
          <PlacementLab />

          {/* 5. Interactive Routing Lab */}
          <RoutingLab />

          {/* 6. CMOS Inverter Lab */}
          <CMOSInverterLab />

          {/* 7. Digital Logic Gates Lab */}
          <DigitalLogicLab />

          {/* Supporting Synthesis Lab */}
          <SynthesisLab onSynthesisChange={setSynthMetrics} />

          {/* Supporting RTL Verilog Lab */}
          <RTLVerilogLab />

          {/* Supporting Basic Math Lab */}
          <VLSIMathLab />
        </div>

        {/* 5. Equation Lab */}
        <EquationLab />

        {/* 6. Applied Practice Exercises */}
        <PracticeSection />

        {/* 7. Core Path to Tapeout */}
        <TapeoutPath />

        {/* 8. Portfolio Projects */}
        <ProjectsSection />

        {/* 9. Progress Tracking System */}
        <ProgressTracker />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <div className="brand" style={{ marginBottom: 12 }}>
            <div className="brand-mark-svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42" fill="none" width="32" height="32">
                <rect x="2" y="2" width="38" height="38" rx="8" fill="#0B172A" stroke="#2563EB" strokeWidth="2" />
                <rect x="11" y="11" width="20" height="20" rx="3" fill="#1E3A8A" />
                <circle cx="21" cy="21" r="3.5" fill="#06B6D4" />
              </svg>
            </div>
            <div>
              <p className="brand-label" style={{ fontSize: '1.1rem' }}>LAYRIX</p>
              <p className="brand-tag">VLSI Physical Design Learning Lab</p>
            </div>
          </div>
          <p className="footer-tagline">"Learn VLSI by Seeing It." — From Digital Logic to RTL-to-GDSII and Tapeout</p>
        </div>

        <div className="footer-nav">
          <div>
            <h4>Platform</h4>
            <a href="#roadmap">Roadmap (0-21)</a>
            <a href="#six-pillars">Six Pillars</a>
            <a href="#video-learning">Video Learning</a>
            <a href="#interactive-labs">Interactive Labs</a>
          </div>
          <div>
            <h4>Practice & Projects</h4>
            <a href="#equation-lab">Equation Lab</a>
            <a href="#practice">Practice Exercises</a>
            <a href="#tapeout-path">Tapeout Path</a>
            <a href="#projects-section">Projects & Capstone</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LAYRIX. A professional foundation for interactive semiconductor education.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
