import { useMemo, useState } from 'react'
import { LabHeader, type Mode } from './labs/LabHeader'
import { MetricCard } from './labs/MetricCard'
import { EquationBreakdown } from './labs/EquationBreakdown'
import { ChallengeCard, type Challenge } from './labs/ChallengeCard'

type StageId =
  | 'Specification'
  | 'Architecture'
  | 'RTL'
  | 'Simulation'
  | 'Synthesis'
  | 'Floorplanning'
  | 'Power Planning'
  | 'Placement'
  | 'CTS'
  | 'Routing'
  | 'Parasitic Extraction'
  | 'STA'
  | 'Physical Verification'
  | 'Signoff'
  | 'GDSII'
  | 'Tapeout'

type RunStatus = 'NOT_STARTED' | 'RUNNING' | 'PASSED' | 'FAILED'

type StageDef = {
  id: StageId
  num: number
  title: string
  input: string
  process: string
  output: string
  keyMetrics: string[]
  commonProblems: string[]
  engineeringObjective: string
  tools: string[]
  nextStage: string
  howToFixFailure: string
}

const flowStages: StageDef[] = [
  { id: 'Specification', num: 1, title: 'Specification', input: 'Market & product requirements', process: 'Define target frequency, power budget, features, and area limits', output: 'System Spec Document', keyMetrics: ['Frequency (GHz)', 'Power (W)', 'Die Area (mm²)'], commonProblems: ['Unrealistic power budget'], engineeringObjective: 'Establish unambiguous product parameters', tools: ['DOORS', 'Python'], nextStage: 'Architecture', howToFixFailure: 'Re-align features with power/area budgets.' },
  { id: 'Architecture', num: 2, title: 'Architecture', input: 'System Spec Document', process: 'Design system block hierarchy, instruction set, cache sizes', output: 'High-level C++/SystemC model', keyMetrics: ['IPC', 'Bus Bandwidth'], commonProblems: ['Bus contention bottlenecks'], engineeringObjective: 'Verify microarchitectural performance', tools: ['SystemC', 'Gem5'], nextStage: 'RTL', howToFixFailure: 'Increase bus width or cache size.' },
  { id: 'RTL', num: 3, title: 'RTL', input: 'Architecture Specification', process: 'Write synthesizable Verilog/SystemVerilog hardware modules', output: 'Synthesizable RTL code (.v)', keyMetrics: ['Code Lines', 'Module Count'], commonProblems: ['Unintentional latches', 'Syntax errors'], engineeringObjective: 'Express hardware behavior in text', tools: ['VS Code', 'SpyGlass Lint'], nextStage: 'Simulation', howToFixFailure: 'Add default assignments in always_comb.' },
  { id: 'Simulation', num: 4, title: 'Simulation', input: 'RTL + Testbench', process: 'Run functional testbenches and verify logic correctness', output: 'Simulation Waveforms & 100% Coverage', keyMetrics: ['Code Coverage %', 'Functional Pass %'], commonProblems: ['Corner-case bugs', 'Deadlocks'], engineeringObjective: 'Achieve 100% verification coverage', tools: ['Synopsys VCS', 'ModelSim'], nextStage: 'Synthesis', howToFixFailure: 'Debug wave in Verdi, fix RTL bug.' },
  { id: 'Synthesis', num: 5, title: 'Synthesis', input: 'Verified RTL + Technology Library (.lib) + SDC', process: 'Translate RTL to gate netlist and optimize logic', output: 'Gate-level netlist (.v)', keyMetrics: ['Gate Count', 'Area (μm²)', 'Pre-route WNS'], commonProblems: ['Unrealistic SDC constraints', 'Negative slack'], engineeringObjective: 'Map behavioral code to real silicon gates', tools: ['Design Compiler', 'Genus'], nextStage: 'Floorplanning', howToFixFailure: 'Pipeline long paths in RTL or relax SDC.' },
  { id: 'Floorplanning', num: 6, title: 'Floorplanning', input: 'Gate-level Netlist + Tech LEF', process: 'Set die size, core margins, and place memory macros/IOs', output: 'Floorplan DEF file', keyMetrics: ['Utilization %', 'Aspect Ratio'], commonProblems: ['Macro overlap', 'Congestion spots'], engineeringObjective: 'Establish physical spatial organization', tools: ['Innovus', 'ICC2'], nextStage: 'Power Planning', howToFixFailure: 'Move macros to edges and reduce core utilization.' },
  { id: 'Power Planning', num: 7, title: 'Power Planning', input: 'Floorplan DEF', process: 'Create VDD/VSS power rings, stripes, and row rails', output: 'Power Mesh Net', keyMetrics: ['IR Drop (mV)', 'Power Mesh Resistance'], commonProblems: ['High IR drop (>5% VDD)'], engineeringObjective: 'Distribute clean power everywhere', tools: ['Innovus', 'RedHawk'], nextStage: 'Placement', howToFixFailure: 'Widen stripes and add more vertical power straps.' },
  { id: 'Placement', num: 8, title: 'Placement', input: 'Floorplan DEF + Netlist', process: 'Global placement → Legalization → Detailed timing-driven placement', output: 'Placed DEF file', keyMetrics: ['HPWL (mm)', 'Local Cell Density %'], commonProblems: ['Routing congestion', 'Cell overlap'], engineeringObjective: 'Position cells to minimize wirelength and delay', tools: ['Innovus', 'ICC2'], nextStage: 'CTS', howToFixFailure: 'Use placement blockages to spread dense regions.' },
  { id: 'CTS', num: 9, title: 'CTS', input: 'Placed DEF + CTS Spec', process: 'Insert clock buffer trees to balance clock arrival times', output: 'CTS DEF + Clock Tree', keyMetrics: ['Clock Skew (ps)', 'Clock Latency (ns)'], commonProblems: ['High hold violations post-CTS'], engineeringObjective: 'Deliver clock evenly to all flip-flops', tools: ['Innovus CTS', 'ICC2 CTS'], nextStage: 'Routing', howToFixFailure: 'Insert delay buffers on short data paths.' },
  { id: 'Routing', num: 10, title: 'Routing', input: 'Placed DEF with CTS', process: 'Global routing → Detailed routing on metal tracks', output: 'Routed DEF file', keyMetrics: ['Routed Nets %', 'Via Count', 'DRC Errors'], commonProblems: ['Metal shorts', 'Spacing DRCs'], engineeringObjective: 'Connect cell pins with physical metal wires', tools: ['Innovus Router', 'ZRoute'], nextStage: 'Parasitic Extraction', howToFixFailure: 'Rip-up and reroute congested regions.' },
  { id: 'Parasitic Extraction', num: 11, title: 'Parasitic Extraction', input: 'Routed DEF + Process Tech File', process: 'Extract 3D wire resistance and capacitance (coupling & ground)', output: 'SPEF File', keyMetrics: ['Wire Resistance (Ω)', 'Wire Capacitance (fF)'], commonProblems: ['High crosstalk coupling cap'], engineeringObjective: 'Measure actual physical wire parasitics', tools: ['StarRC', 'Quantus QRC'], nextStage: 'STA', howToFixFailure: 'Insert shielding wires or space parallel nets.' },
  { id: 'STA', num: 12, title: 'STA', input: 'Routed Netlist + SPEF + SDC', process: 'Static timing analysis across all PVT corners', output: 'Timing Signoff Report', keyMetrics: ['WNS (ns)', 'TNS (ns)', 'Hold Violations'], commonProblems: ['Negative setup slack (FAIL)'], engineeringObjective: 'Guarantee zero timing violations across corners', tools: ['PrimeTime', 'Tempus'], nextStage: 'Physical Verification', howToFixFailure: 'Run timing ECO: size up drivers, insert buffers.' },
  { id: 'Physical Verification', num: 13, title: 'Physical Verification', input: 'GDSII / Routed DEF', process: 'Run Design Rule Check (DRC) and Layout vs Schematic (LVS)', output: 'DRC/LVS Clean Report', keyMetrics: ['DRC Violation Count', 'LVS Mismatch Count'], commonProblems: ['Density DRC error', 'Short circuits'], engineeringObjective: 'Verify manufacturability and connectivity', tools: ['Calibre DRC/LVS', 'IC Validator'], nextStage: 'Signoff', howToFixFailure: 'Insert metal fill for density; fix shorted wires.' },
  { id: 'Signoff', num: 14, title: 'Signoff', input: 'All Verification Reports', process: 'Executive signoff review across STA, DRC, LVS, IR drop', output: 'Signed Tapeout Checklist', keyMetrics: ['0 DRC', '0 LVS', 'WNS >= 0'], commonProblems: ['Unapproved waivers'], engineeringObjective: 'Formal approval for manufacturing', tools: ['Jira Signoff Portal'], nextStage: 'GDSII', howToFixFailure: 'Resolve all unapproved waivers.' },
  { id: 'GDSII', num: 15, title: 'GDSII', input: 'Signed Layout', process: 'Stream out geometric polygon format for mask generation', output: 'GDSII / OASIS file', keyMetrics: ['File Size (GB)'], commonProblems: ['Corrupted GDS stream'], engineeringObjective: 'Produce mask deliverable file', tools: ['Innovus StreamOut', 'Calibre'], nextStage: 'Tapeout', howToFixFailure: 'Re-export GDSII with verified layer mapping.' },
  { id: 'Tapeout', num: 16, title: 'Tapeout', input: 'Verified GDSII / OASIS', process: 'Hand off layout database to foundry for mask fabrication', output: 'Manufactured Wafers & Silicon', keyMetrics: ['Wafer Yield %'], commonProblems: ['Particle defects in fab'], engineeringObjective: 'Fabricate physical silicon chips', tools: ['TSMC / Samsung Fab Line'], nextStage: 'Done', howToFixFailure: 'Prepare B0 mask re-spin for post-silicon bugs.' },
]

const flowChallenges: Challenge[] = [
  {
    id: 'flow-c1',
    title: 'Challenge 1: Identify Post-Synthesis Output',
    question: 'What is the primary output artifact produced by the Logic Synthesis stage?',
    options: ['GDSII Polygon File', 'Gate-Level Netlist (.v)', 'RTL Source Code', 'Floorplan DEF'],
    correctAnswer: 'Gate-Level Netlist (.v)',
    hint: 'Synthesis translates RTL code into a netlist of logic gates.',
    solution: 'Gate-Level Netlist (.v)',
    explanation: 'Synthesis reads RTL and outputs a gate-level netlist mapped to standard cells from the technology library.',
  },
  {
    id: 'flow-c2',
    title: 'Challenge 2: Fixing STA Setup Violations',
    question: 'If the STA stage fails with a Negative Setup Slack (WNS = -0.15ns) after routing, what is the best ECO fix?',
    options: [
      'Size up driver cells on the critical path or insert buffers to split long wires.',
      'Delete the clock tree buffers.',
      'Increase the supply voltage by 50%.',
      'Ignore the violation since routing is finished.',
    ],
    correctAnswer: 'Size up driver cells on the critical path or insert buffers to split long wires.',
    hint: 'Timing ECO uses cell resizing and buffer insertion to reduce path delay.',
    solution: 'Size up driver cells or insert buffers',
    explanation: 'Sizing up drivers reduces gate delay, and buffer insertion splits capacitive wire delay.',
  },
  {
    id: 'flow-c3',
    title: 'Challenge 3: Purpose of LVS',
    question: 'What does Layout vs Schematic (LVS) verify in physical verification?',
    options: [
      'That physical layout connections match the schematic netlist exactly.',
      'That the chip runs at 1 GHz.',
      'That metal density is 100%.',
      'That the silicon wafer is 300mm wide.',
    ],
    correctAnswer: 'That physical layout connections match the schematic netlist exactly.',
    hint: 'LVS compares extracted layout devices and nets against the reference synthesis netlist.',
    solution: 'Matches layout to schematic netlist',
    explanation: 'LVS checks device types, sizes, and electrical connections between layout and schematic.',
  },
]

export default function PhysicalDesignFlow() {
  const [mode, setMode] = useState<Mode>('LEARNING')
  const [activeStageId, setActiveStageId] = useState<StageId>('Synthesis')
  const [stageStatuses, setStageStatuses] = useState<Record<string, RunStatus>>({})

  const activeStage = useMemo(
    () => flowStages.find((s) => s.id === activeStageId) || flowStages[4],
    [activeStageId]
  )

  const handleRunStage = (stageId: string) => {
    setStageStatuses((prev) => ({ ...prev, [stageId]: 'RUNNING' }))
    setTimeout(() => {
      // Intentionally simulate STA failing 50% of the time for educational learning
      const isSTAFailure = stageId === 'STA' && Math.random() > 0.5
      setStageStatuses((prev) => ({
        ...prev,
        [stageId]: isSTAFailure ? 'FAILED' : 'PASSED',
      }))
    }, 1200)
  }

  const handleResetFlow = () => {
    setActiveStageId('Synthesis')
    setStageStatuses({})
  }

  const currentStatus = stageStatuses[activeStage.id] || 'NOT_STARTED'

  return (
    <section className="section physical-design-section" id="physical-design">
      <LabHeader
        title="RTL-to-GDSII Flow Visualizer & Pipeline Lab"
        subtitle="Explore all 16 stages of physical design from specification to tapeout. Run stages, inspect failure modes, and apply fixes."
        icon="🏭"
        difficulty="Intermediate"
        mode={mode}
        onModeChange={setMode}
        onReset={handleResetFlow}
      />

      {/* Pipeline Navigation Bar */}
      <div className="flow-pipeline-scroll-wrap">
        <div className="flow-pipeline-track">
          {flowStages.map((stage) => {
            const isActive = stage.id === activeStageId
            const status = stageStatuses[stage.id] || 'NOT_STARTED'
            return (
              <button
                key={stage.id}
                type="button"
                className={`pipeline-node-btn ${isActive ? 'active' : ''} ${status.toLowerCase()}`}
                onClick={() => setActiveStageId(stage.id)}
              >
                <span className="p-num">{stage.num}</span>
                <span className="p-title">{stage.title}</span>
                {status === 'PASSED' && <span className="p-status-icon">✓</span>}
                {status === 'FAILED' && <span className="p-status-icon">✕</span>}
                {status === 'RUNNING' && <span className="p-status-icon">⏳</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flow-lab-main-grid">
        {/* Left Column: Stage Details */}
        <div className="flow-stage-detail-card">
          <div className="stage-detail-header">
            <div className="stage-num-badge">Stage {activeStage.num} of 16</div>
            <h3>{activeStage.title}</h3>
            <span className={`run-status-badge ${currentStatus.toLowerCase()}`}>
              Status: {currentStatus.replace('_', ' ')}
            </span>
          </div>

          <div className="stage-action-bar">
            <button
              type="button"
              className="button primary"
              disabled={currentStatus === 'RUNNING'}
              onClick={() => handleRunStage(activeStage.id)}
            >
              {currentStatus === 'RUNNING' ? '⏳ Simulating Stage...' : `▶ Run Stage: ${activeStage.title}`}
            </button>
          </div>

          {currentStatus === 'FAILED' && (
            <div className="stage-failure-alert">
              <h4>⚠ Stage Execution Failed!</h4>
              <p><strong>Common Issue:</strong> {activeStage.commonProblems[0]}</p>
              <p><strong>How to Fix It:</strong> {activeStage.howToFixFailure}</p>
            </div>
          )}

          <div className="stage-grid-info">
            <div className="info-box">
              <strong>📥 INPUT</strong>
              <p>{activeStage.input}</p>
            </div>
            <div className="info-box">
              <strong>⚙️ PROCESS</strong>
              <p>{activeStage.process}</p>
            </div>
            <div className="info-box">
              <strong>📤 OUTPUT</strong>
              <p className="highlight-text">{activeStage.output}</p>
            </div>
            <div className="info-box">
              <strong>🎯 ENGINEERING OBJECTIVE</strong>
              <p>{activeStage.engineeringObjective}</p>
            </div>
          </div>

          <div className="stage-tools-section">
            <strong>Industry Tools Used:</strong>
            <div className="tool-tags">
              {activeStage.tools.map((t) => <span key={t} className="tool-tag">{t}</span>)}
            </div>
          </div>
        </div>

        {/* Right Column: Metrics & Mode View */}
        <div className="flow-stage-side-card">
          <div className="flow-metrics-box">
            <h4>Key Stage Metrics</h4>
            <div className="metrics-pill-list">
              {activeStage.keyMetrics.map((m) => (
                <MetricCard key={m} label={m} value="Monitored" status="good" />
              ))}
            </div>
          </div>

          <div className="flow-problems-box">
            <h4>Common Failure Modes</h4>
            <ul>
              {activeStage.commonProblems.map((p) => <li key={p}>⚠ {p}</li>)}
            </ul>
          </div>

          {mode === 'ENGINEERING' ? (
            <EquationBreakdown
              title="Physical Design Metric Relationship"
              formula="Utilization = \frac{\text{Cell Area}}{\text{Core Area}} \times 100\% \quad \text{and} \quad \text{Slack} = DRT - DAT"
              variables={[
                { symbol: 'Core Area', name: 'Core Area', value: 10000, unit: 'μm²' },
                { symbol: 'Cell Area', name: 'Used Area', value: 7000, unit: 'μm²' },
              ]}
              substitution="Utilization = (7000 / 10000) * 100%"
              calculation="Utilization = 70%"
              result="70% Core Utilization (Balanced Routability)"
              physicalMeaning="Every physical design stage balances area utilization, routing track capacity, power grid resistance, and clock skew."
            />
          ) : (
            <div className="learning-panel-box">
              <h4>🎓 Learning Takeaway</h4>
              <p>
                Next Stage: <strong>{activeStage.nextStage}</strong>. The output of <strong>{activeStage.title}</strong> directly becomes the input for <strong>{activeStage.nextStage}</strong>.
              </p>
            </div>
          )}
        </div>
      </div>

      <ChallengeCard labId="flow" challenges={flowChallenges} />
    </section>
  )
}
