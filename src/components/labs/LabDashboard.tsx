import React from 'react'

type LabInfo = {
  id: string
  icon: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  concepts: string[]
  features: string[]
  targetId: string
}

const labsList: LabInfo[] = [
  {
    id: 'flipflop',
    icon: '⚡',
    title: 'Flip-Flop Lab',
    description: 'Explore how clocked storage elements (D, JK, T flip-flops) sample and remember binary data.',
    difficulty: 'Beginner',
    concepts: ['D, JK, T Flip-Flops', 'Clock & Reset', 'Setup & Hold Time', 'Clock-to-Q Delay', 'Q & Q̄ Outputs'],
    features: ['D/JK/T Mode Switcher', 'Rising Edge Trigger Button', 'Real-time Waveform Generator', 'Interactive Setup/Hold Explainer'],
    targetId: 'flipflop-lab',
  },
  {
    id: 'fsm',
    icon: '🔄',
    title: 'FSM Lab',
    description: 'Step through Moore & Mealy State Machines. Trace state transitions, inputs, next states, and outputs.',
    difficulty: 'Intermediate',
    concepts: ['Moore vs Mealy FSM', 'State Diagrams & Tables', 'One-Hot / Binary Encoding', 'Verilog FSM RTL'],
    features: ['Traffic Light & Sequence Detector Examples', 'Step-by-Step NEXT CLOCK Execution', 'Live SVG Diagram Highlight', 'Generated Verilog RTL Code'],
    targetId: 'fsm-lab',
  },
  {
    id: 'flow',
    icon: '🏭',
    title: 'RTL-to-GDSII Flow Lab',
    description: 'Walk through all 16 stages of physical design from specification to silicon tapeout.',
    difficulty: 'Intermediate',
    concepts: ['RTL Synthesis', 'Floorplanning & Power Grid', 'Placement & CTS', 'Routing & SPEF Extraction', 'DRC/LVS Signoff'],
    features: ['16 Clickable Stage Pipeline', 'Run Stage Simulation (Pass/Fail)', 'Failure Recovery Strategies', 'Tools & Metrics Breakdown'],
    targetId: 'physical-design',
  },
  {
    id: 'placement',
    icon: '📐',
    title: 'Placement Lab',
    description: 'Position standard cells and macros in rows inside the core while optimizing wirelength and congestion.',
    difficulty: 'Intermediate',
    concepts: ['Global & Legal Placement', 'Core Utilization', 'Half-Perimeter Wirelength (HPWL)', 'Congestion Hotspots'],
    features: ['Draggable Cells & Macros', 'Live Utilization & Wirelength', 'Congestion Heatmap Overlay', 'Auto-Place & Optimize Placement'],
    targetId: 'placement-lab-section',
  },
  {
    id: 'routing',
    icon: '🛣️',
    title: 'Routing Lab',
    description: 'Connect placed cell pins with metal tracks across Metal 1, Metal 2, and Metal 3 layers.',
    difficulty: 'Advanced',
    concepts: ['Global vs Detailed Routing', 'Metal Stack & Vias', 'Obstacle Avoidance', 'Routing Violations & Shorts'],
    features: ['Multi-Layer Track Router', 'Interactive Net Selector', 'Obstacle Collision Detection', 'Auto Route & Via Counter'],
    targetId: 'routing-lab-section',
  },
  {
    id: 'cmos',
    icon: '🔌',
    title: 'CMOS Inverter Lab',
    description: 'Analyze transistor switching behavior, Voltage Transfer Curves (VTC), noise margins, and dynamic power.',
    difficulty: 'Beginner',
    concepts: ['NMOS & PMOS Transistors', 'Pull-Up / Pull-Down Networks', 'VTC (VIL, VIH, VOL, VOH)', 'Dynamic Power (αCV²f)'],
    features: ['Vin Voltage Slider (0V to VDD)', 'Live PMOS/NMOS State Indicators', 'Interactive VTC Diagram', 'Live Dynamic Power Calculator'],
    targetId: 'cmos-inverter',
  },
  {
    id: 'digitallogic',
    icon: '🧩',
    title: 'Digital Logic Lab',
    description: 'Build logic circuits using AND, OR, NOT, NAND, NOR, XOR, and XNOR gates.',
    difficulty: 'Beginner',
    concepts: ['Basic & Universal Gates', 'Truth Tables', 'De Morgan\'s Theorem', 'Logic Gate Combinations'],
    features: ['7 Gate Selectors', 'Input Signal Switches (A, B)', 'Live Truth Table Highlight', 'Build-the-Logic Interactive Challenge'],
    targetId: 'digital-logic',
  },
]

type Props = {
  activeLabId?: string
  onSelectLab?: (id: string) => void
}

export const LabDashboard: React.FC<Props> = ({ onSelectLab }) => {
  const difficultyColors = {
    Beginner: '#22C55E',
    Intermediate: '#F59E0B',
    Advanced: '#EF4444',
  }

  const handleStartLab = (targetId: string, labId: string) => {
    if (onSelectLab) onSelectLab(labId)
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="lab-dashboard-container">
      <div className="lab-dashboard-grid">
        {labsList.map((lab) => (
          <div key={lab.id} className="lab-card-dash">
            <div className="lab-card-top">
              <span className="lab-card-icon">{lab.icon}</span>
              <span
                className="lab-card-diff"
                style={{ backgroundColor: difficultyColors[lab.difficulty] }}
              >
                {lab.difficulty}
              </span>
            </div>

            <h4>{lab.title}</h4>
            <p className="lab-card-desc">{lab.description}</p>

            <div className="lab-card-block">
              <strong>Concepts Learned:</strong>
              <div className="lab-tag-list">
                {lab.concepts.map((c) => (
                  <span key={c} className="lab-tag">{c}</span>
                ))}
              </div>
            </div>

            <div className="lab-card-block">
              <strong>Interactive Features:</strong>
              <ul className="lab-feature-ul">
                {lab.features.map((f) => (
                  <li key={f}>⚡ {f}</li>
                ))}
              </ul>
            </div>

            <div className="lab-card-footer">
              <button
                type="button"
                className="button primary small"
                onClick={() => handleStartLab(lab.targetId, lab.id)}
              >
                START LAB →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
