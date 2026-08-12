import { useState } from 'react'
import './App.css'
import CMOSInverterLab from './components/CMOSInverterLab'
import CourseProgress from './components/CourseProgress'
import DigitalLogicLab from './components/DigitalLogicLab'
import PhysicalDesignFlow from './components/PhysicalDesignFlow'
import RTLVerilogLab from './components/RTLVerilogLab'
import SynthesisLab from './components/SynthesisLab'
import type { SynthesisMetrics } from './components/SynthesisLab'
import VideoLesson from './components/VideoLesson'
import VLSIMathLab from './components/VLSIMathLab'

const slug = (text: string) => text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '')

const navItems = [
  'Home',
  'Learn',
  'Visual Lab',
  'Digital Logic',
  'Physical Design',
  'Math Lab',
  'RTL Verilog',
  'Simulations',
  'Challenges',
  'Projects',
]

const roadmapTopics = [
  'Digital Design',
  'CMOS Fundamentals',
  'Verilog / RTL',
  'Logic Synthesis',
  'Logic Optimization',
  'Formal Verification',
  'Static Timing Analysis',
  'Floorplanning',
  'Placement',
  'Clock Tree Synthesis',
  'Routing',
  'Physical Verification',
  'RTL-to-GDS Flow',
]

const visualizationCards = [
  'CMOS Inverter',
  'Logic Gates',
  'Flip-Flop',
  'FSM',
  'RTL-to-GDS Flow',
  'Placement and Routing',
]

const flowSteps = [
  'Specification',
  'RTL',
  'Synthesis',
  'Floorplanning',
  'Placement',
  'CTS',
  'Routing',
  'Physical Verification',
  'GDSII',
]

const challengeTypes = [
  'Visual challenges',
  'Calculation challenges',
  'Debugging challenges',
  'Design challenges',
]

const courseLevels = [
  {
    id: 'foundations',
    title: 'LEVEL 0 — VLSI & IC FUNDAMENTALS',
    bullets: [
      'What is VLSI? ASIC vs FPGA. Front-end vs back-end.',
      'Die, core, macro, cell, metal, vias, power, clock.',
    ],
  },
  {
    id: 'digital-design',
    title: 'LEVEL 1 — DIGITAL DESIGN FOUNDATION',
    bullets: ['Logic gates, sequential circuits, flip-flops, registers.', 'Connect RTL concepts to placement, clock, and timing.'],
  },
  {
    id: 'cmos-cells',
    title: 'LEVEL 2 — CMOS & STANDARD CELLS',
    bullets: ['Inverters, NAND/NOR, cell height/width, power rails.', 'Build a standard-cell row and measure area, power, delay.'],
  },
  {
    id: 'rtl-to-gds',
    title: 'LEVEL 3 — RTL TO GDSII COMPLETE FLOW',
    bullets: ['RTL → Synthesis → Floorplan → Placement → CTS → Routing.', 'Clicks open the corresponding lab for each stage.'],
  },
  {
    id: 'synthesis',
    title: 'LEVEL 4 — SYNTHESIS',
    bullets: ['RTL synthesis, mapping, area/timing/power tradeoffs.', 'Optimize for area, timing, power using logic choices.'],
  },
  {
    id: 'floorplanning',
    title: 'LEVEL 5 — FLOORPLANNING',
    bullets: ['Die/core size, macro placement, utilization, congestion.', 'Drag macros, make bad floorplans, compare before/after.'],
  },
  {
    id: 'power-planning',
    title: 'LEVEL 6 — POWER PLANNING',
    bullets: ['Power rails, rings, stripes, IR drop, electromigration.',
      'Add/remove rings and see power distribution quality.'],
  },
  {
    id: 'placement',
    title: 'LEVEL 7 — PLACEMENT',
    bullets: ['Standard cell/legal placement, density, congestion.',
      'Drag cells, create overlap, compare good and bad placement.'],
  },
  {
    id: 'cts',
    title: 'LEVEL 8 — CLOCK TREE SYNTHESIS',
    bullets: ['Clock sources, buffers, skew, latency, fanout.', 'Create a bad tree, then balance it visually.'],
  },
  {
    id: 'routing',
    title: 'LEVEL 9 — ROUTING',
    bullets: ['Global/detailed routing, tracks, vias, congestion.', 'Manual and auto-route experiments with obstacles.'],
  },
  {
    id: 'timing',
    title: 'LEVEL 10 — STATIC TIMING ANALYSIS',
    bullets: ['Setup/hold, arrival/required time, slack, critical path.', 'Adjust clock, delay, wire, and see negative slack.'],
  },
  {
    id: 'power',
    title: 'LEVEL 11 — POWER ANALYSIS',
    bullets: ['Dynamic, leakage, total power, activity, voltage, frequency.',
      'Trade off power and performance with live graphs.'],
  },
  {
    id: 'parasitic-extraction',
    title: 'LEVEL 12 — PARASITIC EXTRACTION',
    bullets: ['Resistance, capacitance, RC delay, SPEF concepts.', 'Increase wire length and observe delay and timing impact.'],
  },
  {
    id: 'ir-em',
    title: 'LEVEL 13 — IR DROP & EM',
    bullets: ['IR drop, current density, hotspots, metal width, vias.', 'Heatmap-based visual experiment with fix actions.'],
  },
  {
    id: 'drc',
    title: 'LEVEL 14 — DRC',
    bullets: ['Width, spacing, enclosure, via, and density rules.', 'Create violations, run DRC, and auto-fix layout errors.'],
  },
  {
    id: 'lvs',
    title: 'LEVEL 15 — LVS',
    bullets: ['Layout vs schematic match, missing devices, wrong nets.', 'See matched or mismatched connectivity with examples.'],
  },
  {
    id: 'antenna',
    title: 'LEVEL 16 — ANTENNA EFFECT',
    bullets: ['Long metal antennas, gate charge, diode fixes.', 'Grow metal and see antenna ratio increase until violation.'],
  },
  {
    id: 'signal-integrity',
    title: 'LEVEL 17 — SIGNAL INTEGRITY',
    bullets: ['Crosstalk, aggressor/victim coupling, noise, shielding.', 'Move wires closer or apart and watch noise change.'],
  },
  {
    id: 'mmmc',
    title: 'LEVEL 18 — ADVANCED TIMING',
    bullets: ['MMMC, PVT corners, OCV, useful skew, timing corners.', 'Compare setup/hold across slow and fast libraries.'],
  },
  {
    id: 'eco',
    title: 'LEVEL 19 — ECO',
    bullets: ['Timing ECO, buffer insertion, resizing, metal ECO.',
      'Start with a violation and fix it with targeted changes.'],
  },
  {
    id: 'physical-closure',
    title: 'LEVEL 20 — PHYSICAL DESIGN CLOSURE',
    bullets: ['Area, timing, power, congestion, IR drop, DRC, LVS.', 'Dashboard status with PASS/FAIL and closure metrics.'],
  },
  {
    id: 'industry-mode',
    title: 'LEVEL 21 — REAL INDUSTRY FLOW',
    bullets: ['RTL → synthesis → placement → routing → STA → DRC → GDSII.',
      'See cause-and-effect from design decisions through closure.'],
  },
]

const videoLessons = [
  {
    title: 'RTL-to-GDS Flow',
    description: 'Watch the full physical-design pipeline from RTL through GDSII in a visual storyboard.',
    placeholderText: 'RTL-to-GDS video placeholder',
  },
  {
    title: 'Floorplanning and Placement',
    description: 'See die planning, macro placement, and how a good floorplan reduces congestion.',
    placeholderText: 'Floorplanning video placeholder',
  },
  {
    title: 'CTS and Timing',
    description: 'Understand clock distribution, skew, and the timing path in an interactive lab.',
    placeholderText: 'CTS and timing video placeholder',
  },
  {
    title: 'DRC & Physical Verification',
    description: 'Learn real verification rules and what layout errors look like in practice.',
    placeholderText: 'Physical verification video placeholder',
  },
]

function App() {
  const [, setSynthMetrics] = useState<SynthesisMetrics | null>(null)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" />
          <div>
            <p className="brand-label">VLSI Visual Learning Lab</p>
            <p className="brand-tag">Learn. Visualize. Experiment. Design.</p>
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${slug(item)}`}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Interactive VLSI education</p>
            <h1>Learn VLSI by Seeing It.</h1>
            <p className="hero-text">
              Transform complex VLSI theory into visual, interactive, and practical learning.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#learn">Start Learning</a>
              <a className="button secondary" href="#course-roadmap">Explore Roadmap</a>
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-card">
              <p className="panel-label">Featured workflow</p>
              <h2>From logic to layout in clear steps</h2>
              <p>Follow the core VLSI flow with animation-ready modules and practical examples.</p>
            </div>
          </div>
        </section>

        <CourseProgress completedStages={6} totalStages={22} currentStage="Floorplanning" />

        <section className="section" id="course-roadmap">
          <div className="section-heading">
            <p className="section-eyebrow">Course roadmap</p>
            <h2>Complete physical design course structure</h2>
            <p className="section-description">
              A hierarchy of levels from beginner fundamentals through industry-style closure and tools.
            </p>
          </div>

          <div className="course-roadmap-grid">
            {courseLevels.map((level) => (
              <article key={level.id} id={level.id} className="course-card">
                <h3>{level.title}</h3>
                <ul>
                  {level.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <p className="course-note">Coming in next practical lab.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section video-lessons" id="video-lessons">
          <div className="section-heading">
            <p className="section-eyebrow">Video learning</p>
            <h2>Short visual explanations for core topics</h2>
            <p className="section-description">
              Watch visual summaries next to the interactive labs and challenge exercises.
            </p>
          </div>

          <div className="video-grid">
            {videoLessons.map((lesson) => (
              <VideoLesson key={lesson.title} {...lesson} />
            ))}
          </div>
        </section>

        <section className="section" id="learn">
          <div className="section-heading">
            <p className="section-eyebrow">VLSI Learning Roadmap</p>
            <h2>Structured topics for visual mastery</h2>
            <p className="section-description">
              Each topic is organized to move students from theory to animation, calculation, and real-world application.
            </p>
          </div>

          <div className="roadmap-grid">
            {roadmapTopics.map((topic) => (
              <article key={topic} className="roadmap-card">
                <span>{topic}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section visual-learning" id="visual-lab">
          <div className="section-heading">
            <p className="section-eyebrow">Visual Learning</p>
            <h2>Built around six learning pillars</h2>
            <p className="section-description">
              Every topic contains theory, diagrams, animation, calculations, interactive controls, examples, and practice challenges.
            </p>
          </div>

          <div className="pillars-grid">
            {[
              'Theory',
              'Visual Diagram',
              'Step-by-step Animation',
              'Mathematical Calculation',
              'Interactive Controls',
              'Real-world Example',
              'Practice Challenge',
            ].map((pillar) => (
              <div key={pillar} className="pillar-card">
                <h3>{pillar}</h3>
                <p>Explore how this layer makes VLSI concepts more tangible and intuitive.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section featured" id="simulations">
          <div className="section-heading">
            <p className="section-eyebrow">Featured Visualizations</p>
            <h2>Interactive modules in development</h2>
            <p className="section-description">
              Placeholder cards are ready to evolve into living simulations and guided experiments.
            </p>
          </div>

          <div className="feature-grid">
            {visualizationCards.map((name) => (
              <article key={name} className="feature-card">
                <div className="feature-label">Module</div>
                <h3>{name}</h3>
                <p>Interactive visualization placeholder with future animation controls.</p>
                {name === 'CMOS Inverter' || name === 'Logic Gates' ? (
                  <a
                    className="button primary small"
                    href={name === 'CMOS Inverter' ? '#cmos-inverter' : '#digital-logic'}
                  >
                    Open module
                  </a>
                ) : (
                  <button className="button secondary small" type="button" disabled>Coming soon</button>
                )}
              </article>
            ))}
          </div>
        </section>

        <CMOSInverterLab />
        <DigitalLogicLab />
        <PhysicalDesignFlow />
        <VLSIMathLab />
        <RTLVerilogLab />
        <SynthesisLab onSynthesisChange={setSynthMetrics} />

        <section className="section flow-section" id="projects">
          <div className="section-heading">
            <p className="section-eyebrow">Physical Design Flow</p>
            <h2>Understand the core path to tapeout</h2>
            <p className="section-description">
              Students see each stage and how they connect from specification to GDSII.
            </p>
          </div>

          <div className="flow-timeline" aria-label="Physical design flow">
            {flowSteps.map((step, index) => (
              <div key={step} className="flow-step">
                <div className="step-dot" aria-hidden="true" />
                <span>{step}</span>
                {index < flowSteps.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </section>

        <section className="section math-section">
          <div className="section-heading">
            <p className="section-eyebrow">Understand the Mathematics</p>
            <h2>Break equations down line by line</h2>
            <p className="section-description">
              Difficult formulas are paired with variable meaning, step-by-step calculation, visuals, and concrete examples.
            </p>
          </div>

          <div className="math-grid">
            <div className="math-card">
              <h3>Formula</h3>
              <p>Display equations clearly with a digital design or timing expression.</p>
            </div>
            <div className="math-card">
              <h3>Variable meaning</h3>
              <p>Explain each symbol, unit, and behavior in the context of semiconductor design.</p>
            </div>
            <div className="math-card">
              <h3>Step-by-step calculation</h3>
              <p>Show the numerical flow from inputs to expected design outcomes.</p>
            </div>
          </div>
        </section>

        <section className="section real-world-section">
          <div className="section-heading">
            <p className="section-eyebrow">From Theory to Real Chips</p>
            <h2>See how concepts map to actual semiconductor design</h2>
            <p className="section-description">
              The platform connects classroom ideas with chip design, verification, timing closure, and tapeout workflows.
            </p>
          </div>

          <div className="real-world-copy">
            <div>
              <h3>Real-world context</h3>
              <p>
                Students learn how logic functions, timing budgets, placement decisions, and physical rules shape modern integrated circuits.
              </p>
            </div>
            <div>
              <h3>Engineering-grade clarity</h3>
              <p>
                Each lesson will include practical design examples that reflect real semiconductor engineering choices.
              </p>
            </div>
          </div>
        </section>

        <section className="section challenges-section" id="challenges">
          <div className="section-heading">
            <p className="section-eyebrow">Challenges</p>
            <h2>Practice with applied exercises</h2>
            <p className="section-description">
              Hands-on challenges help students test understanding in visualization, calculation, debugging, and design.
            </p>
          </div>

          <div className="challenge-grid">
            {challengeTypes.map((challenge) => (
              <article key={challenge} className="challenge-card">
                <h3>{challenge}</h3>
                <p>Start with structured tasks that sharpen VLSI reasoning and technical intuition.</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <p className="footer-title">VLSI Visual Learning Lab</p>
          <p className="footer-copy">Learn. Visualize. Experiment. Design.</p>
        </div>
        <p className="footer-note">A professional foundation for interactive circuit design education.</p>
      </footer>
    </div>
  )
}

export default App
