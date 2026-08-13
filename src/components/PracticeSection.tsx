import { useState } from 'react'

type ExerciseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

type Exercise = {
  id: string
  title: string
  level: ExerciseLevel
  category: string
  problem: string
  given: string[]
  whatToCalculate: string
  hint: string
  solution: string
  explanation: string
  takeaway: string
}

const exercises: Exercise[] = [
  {
    id: 'ex-1',
    title: 'Boolean Simplification',
    level: 'BEGINNER',
    category: 'Digital Logic',
    problem: "Simplify the Boolean function Y = A·B + A·B' + A'·B using Boolean algebra laws.",
    given: ["Function: Y = A·B + A·B' + A'·B"],
    whatToCalculate: 'Simplified expression with minimum number of literals',
    hint: "Group terms: A·B + A·B' = A(B + B'). Remember that B + B' = 1.",
    solution: 'Y = A + B',
    explanation: `Step 1: Y = (A·B + A·B') + A'·B
Step 2: Factor out A from first two terms → Y = A(B + B') + A'·B
Step 3: Apply complement law (B + B' = 1) → Y = A(1) + A'·B = A + A'·B
Step 4: Apply absorption theorem (A + A'B = A + B) → Y = A + B`,
    takeaway: 'Simplifying Boolean expressions reduces gate count and standard cell area during synthesis.',
  },
  {
    id: 'ex-2',
    title: 'Setup Slack & Fmax Calculation',
    level: 'BEGINNER',
    category: 'Static Timing Analysis',
    problem: 'Calculate the setup slack and maximum clock frequency (Fmax) for a timing path.',
    given: [
      'Clock period T_clk = 2.0 ns (500 MHz)',
      'Launch FF clock-to-Q t_CQ = 0.20 ns',
      'Combinational logic delay t_logic = 1.25 ns',
      'Interconnect wire delay t_wire = 0.15 ns',
      'Capture FF setup time t_su = 0.10 ns',
      'Clock skew = 0.00 ns',
    ],
    whatToCalculate: '1. Setup Slack (ns) | 2. Maximum Operating Frequency Fmax (MHz)',
    hint: 'Data Arrival = t_CQ + t_logic + t_wire. Data Required = T_clk − t_su. Setup Slack = Required − Arrival.',
    solution: 'Setup Slack = +0.30 ns | Fmax = 588.24 MHz',
    explanation: `Step 1: Data Arrival Time (DAT) = t_CQ + t_logic + t_wire = 0.20 + 1.25 + 0.15 = 1.60 ns
Step 2: Data Required Time (DRT) = T_clk − t_su = 2.00 − 0.10 = 1.90 ns
Step 3: Setup Slack = DRT − DAT = 1.90 − 1.60 = +0.30 ns (PASS ✓)
Step 4: Minimum Clock Period T_min = DAT + t_su = 1.60 + 0.10 = 1.70 ns
Step 5: Fmax = 1 / T_min = 1 / 1.70 ns = 588.24 MHz`,
    takeaway: 'Positive slack of 0.30ns allows the system to be overclocked up to 588.24 MHz before failing setup.',
  },
  {
    id: 'ex-3',
    title: 'Floorplan Core Utilization & Die Sizing',
    level: 'INTERMEDIATE',
    category: 'Floorplanning',
    problem: 'Determine the required core area and die dimensions for a block.',
    given: [
      'Total standard cell area from synthesis = 420,000 μm²',
      '2 SRAM macros, each 40,000 μm²',
      'Target core utilization = 70%',
      'Aspect ratio = 1.0 (square core)',
      'Core margin = 20 μm on all 4 sides',
    ],
    whatToCalculate: '1. Total Used Area | 2. Core Area | 3. Core Dimensions (Width × Height) | 4. Die Dimensions',
    hint: 'Total Used Area includes cells + macros. Core Area = Used Area / Utilization.',
    solution: 'Used Area = 500,000 μm² | Core Area = 714,286 μm² | Core = 845.15 × 845.15 μm | Die = 885.15 × 885.15 μm',
    explanation: `Step 1: Total Used Area = 420,000 + 2 × (40,000) = 500,000 μm²
Step 2: Core Area = Total Used Area / Utilization = 500,000 / 0.70 = 714,286 μm²
Step 3: Core Width = Core Height = √714,286 ≈ 845.15 μm
Step 4: Die Width = Core Width + 2 × Margin = 845.15 + 40 = 885.15 μm
Step 5: Die Height = Core Height + 2 × Margin = 845.15 + 40 = 885.15 μm`,
    takeaway: 'Reserving 30% unassigned core area (70% utilization) leaves room for placement optimization, buffer insertion, and routing tracks.',
  },
  {
    id: 'ex-4',
    title: 'Hold Violation Fixing via Buffer Insertion',
    level: 'INTERMEDIATE',
    category: 'CTS & Physical Closure',
    problem: 'Identify a hold violation and determine how many delay buffers are needed to fix it.',
    given: [
      'Launch FF clock delay = 0.50 ns',
      'Capture FF clock delay = 0.75 ns (Clock Skew = +0.25 ns)',
      't_CQ = 0.12 ns',
      'Short combinational path delay t_logic = 0.08 ns',
      'Capture FF hold time t_hold = 0.10 ns',
      'Delay buffer insertion cell delay = 0.05 ns per buffer',
    ],
    whatToCalculate: '1. Hold Slack (ns) | 2. Number of delay buffers required to achieve +0.05 ns positive hold margin',
    hint: 'Data Arrival = t_clk_launch + t_CQ + t_logic. Hold Required = t_clk_capture + t_hold. Positive skew hurts hold!',
    solution: 'Hold Slack = −0.15 ns (VIOLATION) | Required Buffers = 4 buffers',
    explanation: `Step 1: Data Arrival Time = 0.50 + 0.12 + 0.08 = 0.70 ns
Step 2: Hold Required Time = 0.75 + 0.10 = 0.85 ns
Step 3: Hold Slack = DAT − Required = 0.70 − 0.85 = −0.15 ns (VIOLATION ✕)
Step 4: Deficit to reach +0.05 ns positive margin = 0.15 + 0.05 = 0.20 ns delay needed
Step 5: Number of buffers = 0.20 ns / 0.05 ns per buffer = 4 buffers`,
    takeaway: 'Positive clock skew (capture clock arriving later than launch) worsens hold slack. Delay buffers added to short data paths restore hold margin.',
  },
  {
    id: 'ex-5',
    title: 'Dynamic Power & Voltage Scaling Tradeoff',
    level: 'ADVANCED',
    category: 'CMOS Power Optimization',
    problem: 'Calculate power reduction when reducing supply voltage VDD and frequency.',
    given: [
      'Original VDD = 1.2 V, Frequency f = 1.2 GHz',
      'Original Dynamic Power = 250 mW',
      'Scaled VDD = 0.9 V, Scaled Frequency f = 900 MHz',
    ],
    whatToCalculate: '1. Scaled Dynamic Power (mW) | 2. Percentage Power Reduction (%)',
    hint: 'P ∝ V² × f. Ratio P_new / P_old = (V_new / V_old)² × (f_new / f_old).',
    solution: 'New Power = 105.47 mW | Power Reduction = 57.81%',
    explanation: `Step 1: Voltage ratio squared = (0.9 / 1.2)² = (0.75)² = 0.5625
Step 2: Frequency ratio = 900 / 1200 = 0.75
Step 3: Overall power multiplier = 0.5625 × 0.75 = 0.421875
Step 4: New Power = 250 mW × 0.421875 = 105.47 mW
Step 5: Reduction = (250 − 105.47) / 250 × 100% = 57.81%`,
    takeaway: 'Voltage scaling provides a quadratic power drop. Reducing VDD by 25% and frequency by 25% cuts power consumption by nearly 58%.',
  },
  {
    id: 'ex-6',
    title: 'Antenna Ratio Violation Diagnosis',
    level: 'EXPERT',
    category: 'Physical Verification (DRC)',
    problem: 'Check if a metal 3 wire causes an antenna violation at a sensitive gate input.',
    given: [
      'Metal 3 routing wire length = 180 μm, width = 0.10 μm',
      'Connected gate oxide width = 0.12 μm, length = 0.05 μm',
      'Foundry maximum allowed Antenna Ratio = 400 : 1',
    ],
    whatToCalculate: '1. Metal 3 Conductor Area | 2. Transistor Gate Oxide Area | 3. Antenna Ratio | 4. Pass/Fail Result',
    hint: 'Antenna Ratio = (Metal Area) / (Gate Area).',
    solution: 'Metal Area = 18.0 μm² | Gate Area = 0.006 μm² | Antenna Ratio = 3000 : 1 (VIOLATION ✕)',
    explanation: `Step 1: Metal 3 Area = 180 μm × 0.10 μm = 18.0 μm²
Step 2: Gate Area = 0.12 μm × 0.05 μm = 0.006 μm²
Step 3: Antenna Ratio = 18.0 / 0.006 = 3000 : 1
Step 4: Compare with limit (400:1) → 3000 > 400 → VIOLATION ✕
Fix Options:
1. Insert an antenna diode connected to GND near the gate to bleed off charge during plasma etching.
2. Jump to Metal 4 closer to the driver cell using a via, reducing Metal 3 antenna wire length to < 24 μm.`,
    takeaway: 'Antenna violations cause permanent gate oxide breakdown during manufacturing plasma etching. They are fixed by adding reverse-biased diodes or routing layer jumps.',
  },
]

export default function PracticeSection() {
  const [activeLevel, setActiveLevel] = useState<string>('ALL')
  const [shownHints, setShownHints] = useState<Set<string>>(new Set())
  const [shownSolutions, setShownSolutions] = useState<Set<string>>(new Set())
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())

  const toggleHint = (id: string) => {
    setShownHints((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSolution = (id: string) => {
    setShownSolutions((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleComplete = (id: string) => {
    setCompletedExercises((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = activeLevel === 'ALL'
    ? exercises
    : exercises.filter((ex) => ex.level === activeLevel)

  return (
    <section className="section practice-section" id="practice">
      <div className="section-heading">
        <p className="section-eyebrow">Hands-on Exercises</p>
        <h2>Applied VLSI Engineering Practice</h2>
        <p className="section-description">
          Test your design, calculation, and physical reasoning skills with real engineering problems. Work through problem statements, hints, and step-by-step solutions.
        </p>
      </div>

      <div className="practice-filter-bar">
        <div className="filter-buttons">
          {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              className={`button secondary small ${activeLevel === lvl ? 'active' : ''}`}
              onClick={() => setActiveLevel(lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>
        <div className="practice-progress-pill">
          Completed: <strong>{completedExercises.size} / {exercises.length}</strong>
        </div>
      </div>

      <div className="practice-grid">
        {filtered.map((ex) => {
          const isDone = completedExercises.has(ex.id)
          const isHintVisible = shownHints.has(ex.id)
          const isSolVisible = shownSolutions.has(ex.id)

          return (
            <div key={ex.id} className={`exercise-card ${isDone ? 'completed' : ''}`}>
              <div className="exercise-card-header">
                <div>
                  <span className={`level-tag ${ex.level.toLowerCase()}`}>{ex.level}</span>
                  <span className="ex-cat-tag">{ex.category}</span>
                </div>
                {isDone && <span className="ex-done-check">✓ Done</span>}
              </div>

              <h3>{ex.title}</h3>

              <div className="ex-block">
                <strong>Problem:</strong>
                <p>{ex.problem}</p>
              </div>

              <div className="ex-block">
                <strong>Given Information:</strong>
                <ul>
                  {ex.given.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>

              <div className="ex-block">
                <strong>Goal / What to Calculate:</strong>
                <p className="highlight">{ex.whatToCalculate}</p>
              </div>

              <div className="ex-actions">
                <button
                  type="button"
                  className="button secondary small"
                  onClick={() => toggleHint(ex.id)}
                >
                  {isHintVisible ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button
                  type="button"
                  className="button primary small"
                  onClick={() => toggleSolution(ex.id)}
                >
                  {isSolVisible ? 'Hide Solution' : 'Show Solution'}
                </button>
                <button
                  type="button"
                  className={`button ${isDone ? 'secondary' : 'success'} small`}
                  onClick={() => toggleComplete(ex.id)}
                >
                  {isDone ? 'Unmark Done' : 'Mark Completed ✓'}
                </button>
              </div>

              {isHintVisible && (
                <div className="ex-hint-box">
                  <strong>💡 Hint:</strong> {ex.hint}
                </div>
              )}

              {isSolVisible && (
                <div className="ex-solution-box">
                  <h4>Final Answer</h4>
                  <div className="ex-final-ans">{ex.solution}</div>

                  <h4>Step-by-Step Explanation</h4>
                  <pre className="ex-exp-text">{ex.explanation}</pre>

                  <div className="ex-takeaway">
                    <strong>Engineering Takeaway:</strong> {ex.takeaway}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
