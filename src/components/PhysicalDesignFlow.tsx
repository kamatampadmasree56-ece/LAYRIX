import { useMemo, useState, type PointerEvent } from 'react'
import PlacementLab from './PlacementLab'
import RoutingLab from './RoutingLab'
import ClockTreeLab from './ClockTreeLab'
import TimingLab from './TimingLab'
import PowerLab from './PowerLab'
import PhysicalVerificationLab from './PhysicalVerificationLab'

type StageId =
  | 'RTL'
  | 'Synthesis'
  | 'Netlist'
  | 'Floorplanning'
  | 'Placement'
  | 'Clock Tree Synthesis'
  | 'Routing'
  | 'Physical Verification'
  | 'GDSII'

type StageDefinition = {
  id: StageId
  title: string
  what: string
  why: string
  input: string
  output: string
  realWorld: string
  learning: string
  challengeQuestion: string
  challengeOptions: string[]
  challengeAnswer: string
}

const stages: StageDefinition[] = [
  {
    id: 'RTL',
    title: 'RTL',
    what: 'Write hardware at the register-transfer level using code-like descriptions.',
    why: 'RTL captures the functional behavior of the design before it becomes physical hardware.',
    input: 'Design intent expressed as RTL code and block diagrams.',
    output: 'A structural view of registers, combinational logic, and signal flow.',
    realWorld: 'RTL is the starting point for synthesis and verification in real chip design.',
    learning:
      'RTL expresses hardware behavior in a readable form. It is the blueprint that describes how data moves between registers and logic elements.',
    challengeQuestion: 'Why is RTL written before synthesis?',
    challengeOptions: ['It describes behavior in high-level hardware terms.', 'It is the final layout ready for fabrication.'],
    challengeAnswer: 'It describes behavior in high-level hardware terms.',
  },
  {
    id: 'Synthesis',
    title: 'Synthesis',
    what: 'Translate RTL into a gate-level netlist composed of standard cells.',
    why: 'Synthesis turns behavioral descriptions into actual digital components that can be placed and routed.',
    input: 'RTL code and design constraints.',
    output: 'A netlist of logic gates and cells with timing properties.',
    realWorld: 'Modern synthesis tools map RTL into cells from a real process technology library.',
    learning:
      'Synthesis is the first transformation from an abstract design into a lower-level structure that a physical design tool can use.',
    challengeQuestion: 'What does synthesis produce?',
    challengeOptions: ['A gate-level netlist.', 'A final GDSII layout.'],
    challengeAnswer: 'A gate-level netlist.',
  },
  {
    id: 'Netlist',
    title: 'Netlist',
    what: 'Organize logic cells and their connections into a component-level circuit.',
    why: 'The netlist defines how every cell is connected, which is essential for placement and routing.',
    input: 'Synthesis output with gates and nets.',
    output: 'A connected graph of logic cells and wires.',
    realWorld: 'Netlists are used by place and route tools to understand the circuit topology.',
    learning:
      'A netlist is like a wiring diagram for an electronic design, listing cells and how they connect.',
    challengeQuestion: 'Why is the netlist important before placement?',
    challengeOptions: ['It shows how cells connect to each other.', 'It defines the final silicon mask layers.'],
    challengeAnswer: 'It shows how cells connect to each other.',
  },
  {
    id: 'Floorplanning',
    title: 'Floorplanning',
    what: 'Divide the chip area into regions for standard cells, macros, IO, and power delivery.',
    why: 'Floorplanning sets the physical organization so later placement and routing work efficiently.',
    input: 'Netlist, chip area, and module boundaries.',
    output: 'A chip floorplan with regions assigned for key blocks.',
    realWorld: 'Floating floorplans are used to reserve space for blocks, clocking, and power in a real design.',
    learning:
      'Floorplanning is where designers choose where high-level blocks and resources will sit on the chip.',
    challengeQuestion: 'Why do we reserve space for macros and IO first?',
    challengeOptions: ['It helps place the rest of the design efficiently.', 'It guarantees the chip is manufactured faster.'],
    challengeAnswer: 'It helps place the rest of the design efficiently.',
  },
  {
    id: 'Placement',
    title: 'Placement',
    what: 'Position each standard cell in the chip area while respecting the floorplan.',
    why: 'Good placement keeps wires short and helps meet timing and power goals.',
    input: 'Floorplan and netlist connectivity.',
    output: 'A placed cell layout ready for routing.',
    realWorld: 'Placement arranges millions of cells inside the chip, often using automated tools in industry.',
    learning:
      'Placement decides where cells physically sit, which strongly affects performance and power.',
    challengeQuestion: 'Why can’t we route before placement?',
    challengeOptions: ['Because wires need cell positions to connect.', 'Because timing analysis is not needed yet.'],
    challengeAnswer: 'Because wires need cell positions to connect.',
  },
  {
    id: 'Clock Tree Synthesis',
    title: 'Clock Tree Synthesis',
    what: 'Create a balanced network that distributes the clock signal to sequential cells.',
    why: 'CTS ensures clock edges arrive at all flip-flops at the right time.',
    input: 'Placed cell locations and clock sources.',
    output: 'A clock distribution tree that reaches all timing points.',
    realWorld: 'A robust clock tree is critical for reliable performance in real chips.',
    learning:
      'Clock tree synthesis builds the path that delivers the clock signal to every flip-flop in the design.',
    challengeQuestion: 'What is the goal of CTS?',
    challengeOptions: ['Deliver the clock evenly across the chip.', 'Reduce power by removing clocks.'],
    challengeAnswer: 'Deliver the clock evenly across the chip.',
  },
  {
    id: 'Routing',
    title: 'Routing',
    what: 'Connect placed cells with metal wires while avoiding congestion and design rule violations.',
    why: 'Routing forms the actual electrical connections between cells and IO pins.',
    input: 'Placed cells and timing-driven nets.',
    output: 'A routed metal layer layout with completed connectivity.',
    realWorld: 'Routing finalizes the chip wiring that will be manufactured on silicon.',
    learning:
      'Routing draws the metal wires that connect the placed cells according to the netlist.',
    challengeQuestion: 'Why is routing harder after placement?',
    challengeOptions: ['Because cell locations determine where wires must run.', 'Because power is not yet connected.'],
    challengeAnswer: 'Because cell locations determine where wires must run.',
  },
  {
    id: 'Physical Verification',
    title: 'Physical Verification',
    what: 'Check the design against manufacturing and electrical rules.',
    why: 'Verification catches violations before tapeout to avoid costly re-spins.',
    input: 'Completed routed layout.',
    output: 'A verification report with DRC, LVS, timing, and power results.',
    realWorld: 'Physical verification is mandatory before a chip can be sent to fabrication.',
    learning:
      'Physical verification validates that the layout follows the foundry rules and matches the intended circuit.',
    challengeQuestion: 'What does LVS verify?',
    challengeOptions: ['The layout matches the schematic connectivity.', 'The chip floorplan is correct.'],
    challengeAnswer: 'The layout matches the schematic connectivity.',
  },
  {
    id: 'GDSII',
    title: 'GDSII',
    what: 'Generate the final layout file used by foundries to manufacture the chip.',
    why: 'GDSII is the delivery format for the final silicon mask data.',
    input: 'Verified physical layout and design data.',
    output: 'A GDSII file containing the chip mask representation.',
    realWorld: 'The GDSII file is the final artifact sent to the foundry for fabrication.',
    learning:
      'GDSII represents the completed chip layout in a standard format used by manufacturing.',
    challengeQuestion: 'What is GDSII used for?',
    challengeOptions: ['Sending the layout to manufacturing.', 'Simulating RTL behavior.'],
    challengeAnswer: 'Sending the layout to manufacturing.',
  },
]

const stageCount = stages.length

// Macro coordinates and sizes are normalized fractions (0..1) relative to die dimensions
type Macro = {
  id: string
  label: string
  x: number // fraction of die width
  y: number // fraction of die height
  width: number // fraction of die width
  height: number // fraction of die height
}

// default positions converted to fractions relative to initial dieWidth=400 and dieHeight=320
const defaultMacros: Macro[] = [
  { id: 'M1', label: 'Macro A', x: 8 / 400, y: 12 / 320, width: 24 / 400, height: 18 / 320 },
  { id: 'M2', label: 'Macro B', x: 48 / 400, y: 14 / 320, width: 22 / 400, height: 16 / 320 },
  { id: 'M3', label: 'Macro C', x: 20 / 400, y: 50 / 320, width: 20 / 400, height: 20 / 320 },
]

function PhysicalDesignFlow() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [answer, setAnswer] = useState<string>('')
  const [dieWidth, setDieWidth] = useState(400)
  const [dieHeight, setDieHeight] = useState(320)
  const [utilization, setUtilization] = useState(60)
  const [margin, setMargin] = useState(18)
  const [macros, setMacros] = useState<Macro[]>(defaultMacros)
  const [draggingMacro, setDraggingMacro] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [selectedMacro, setSelectedMacro] = useState<string | null>(null)

  const stage = useMemo(() => stages[activeIndex], [activeIndex])

  const progressLabel = `${activeIndex + 1} / ${stageCount}`

  const challengeFeedback = useMemo(() => {
    if (!answer) return 'Choose the best answer to check your understanding.'
    return answer === stage.challengeAnswer
      ? 'Correct! That is the best explanation for this stage.'
      : 'Not quite — review the stage summary and try again.'
  }, [answer, stage.challengeAnswer])

  const handleNavigation = (delta: number) => {
    setActiveIndex((prev) => {
      const next = prev + delta
      if (next < 0) return 0
      if (next >= stageCount) return stageCount - 1
      return next
    })
    setAnswer('')
  }

  const handleReset = () => {
    setActiveIndex(0)
    setAnswer('')
    setDieWidth(400)
    setDieHeight(320)
    setUtilization(60)
    setMargin(18)
    setMacros(defaultMacros)
    setSelectedMacro(null)
    setAnswer('')
  }

  const dieArea = dieWidth * dieHeight
  const usedArea = dieArea * (utilization / 100)
  const coreWidth = dieWidth - margin * 2
  const coreHeight = dieHeight - margin * 2
  const coreArea = coreWidth * coreHeight
  const congestion = Math.min(100, Math.max(10, utilization + (macros.length - 2) * 6))
  const wireEstimate = Math.round((dieWidth + dieHeight) * (utilization / 35))
  const overlapWarnings = useMemo(() => {
    const warnings: string[] = []
    const macroPixels = macros.map((m) => ({
      id: m.id,
      label: m.label,
      x: m.x * dieWidth,
      y: m.y * dieHeight,
      w: m.width * dieWidth,
      h: m.height * dieHeight,
    }))

    for (let i = 0; i < macroPixels.length; i += 1) {
      const a = macroPixels[i]
      for (let j = i + 1; j < macroPixels.length; j += 1) {
        const b = macroPixels[j]
        const intersects = a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
        if (intersects) warnings.push(`${a.label} overlaps ${b.label}.`)
      }
      if (a.x < margin || a.y < margin || a.x + a.w > dieWidth - margin || a.y + a.h > dieHeight - margin) {
        warnings.push(`${a.label} is outside the core boundary.`)
      }
    }

    return warnings
  }, [macros, dieWidth, dieHeight, margin])

  // placement check used only in render when needed

  const handleMacroPointerDown = (event: PointerEvent<HTMLDivElement>, id: string) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    setDraggingMacro(id)
    setDragOffset({ x: event.clientX - rect.left, y: event.clientY - rect.top })
    setSelectedMacro(id)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingMacro) return
    const areaRect = event.currentTarget.getBoundingClientRect()
    const xPx = event.clientX - areaRect.left - dragOffset.x
    const yPx = event.clientY - areaRect.top - dragOffset.y

    setMacros((prev) =>
      prev.map((macro) => {
        if (macro.id !== draggingMacro) return macro
        const macroPxW = macro.width * dieWidth
        const macroPxH = macro.height * dieHeight
        const minX = margin
        const minY = margin
        const maxX = dieWidth - margin - macroPxW
        const maxY = dieHeight - margin - macroPxH
        const clampedX = Math.max(minX, Math.min(xPx, maxX))
        const clampedY = Math.max(minY, Math.min(yPx, maxY))
        return {
          ...macro,
          x: clampedX / dieWidth,
          y: clampedY / dieHeight,
        }
      }),
    )
  }

  const handlePointerUp = () => {
    setDraggingMacro(null)
  }

  // placement -> routing coupling: receive cell updates from PlacementLab
  type PlacementCell = { id: string; x: number; y: number; w: number; h: number }
  const [placementCells, setPlacementCells] = useState<PlacementCell[] | null>(null)

  const pinsFromPlacement = useMemo(() => {
    if (!placementCells || placementCells.length === 0) return undefined
    return placementCells.map((c, idx) => ({ id: c.id ?? `P${idx + 1}`, x: c.x + c.w / 2, y: c.y + c.h / 2 }))
  }, [placementCells])

  const netsFromPlacement = useMemo(() => {
    if (!placementCells || placementCells.length < 2) return undefined
    const nets: [number, number][] = []
    for (let i = 0; i + 1 < placementCells.length; i += 2) nets.push([i, i + 1])
    return nets
  }, [placementCells])

  type ClockMetrics = { insertionDelay: number; maxDelay: number; minDelay: number; skew: number; fanout: number }
  type RoutingMetrics = { totalRouteLength: number; estimateDelay: number; trackUtilization: number; congestedRegions: number }

  const [clockMetrics, setClockMetrics] = useState<ClockMetrics | null>(null)
  const [routingMetrics, setRoutingMetrics] = useState<RoutingMetrics | null>(null)

  return (
    <section className="section physical-design-section" id="physical-design">
      <div className="section-heading">
        <p className="section-eyebrow">RTL-to-GDS Visualizer</p>
        <h2>Interactive physical design flow from RTL to chip layout</h2>
        <p className="section-description">
          Explore each major stage in the physical design flow with guided visuals, beginner explanations, and challenge questions.
        </p>
      </div>

      <div className="physical-design-grid">
        <div className="physical-design-sidebar">
          <div className="stage-summary-card">
            <div className="stage-progress">
              <span>Stage {progressLabel}</span>
              <strong>{stage.title}</strong>
            </div>
            <div className="stage-summary-text">
              <p>{stage.what}</p>
            </div>
            <div className="button-row">
              <button className="button secondary" type="button" onClick={() => handleNavigation(-1)} disabled={activeIndex === 0}>
                Previous Stage
              </button>
              <button className="button secondary" type="button" onClick={() => handleNavigation(1)} disabled={activeIndex === stageCount - 1}>
                Next Stage
              </button>
            </div>
            <button className="button secondary" type="button" onClick={handleReset}>
              Reset
            </button>
          </div>

          <div className="stage-bar" role="navigation" aria-label="Physical design stages">
            {stages.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`stage-pill ${index === activeIndex ? 'active' : ''}`}
                onClick={() => {
                  setActiveIndex(index)
                  setAnswer('')
                }}
              >
                {item.title}
              </button>
            ))}
          </div>

          <div className="analysis-card physical-details-card">
            <h3>What happens</h3>
            <p>{stage.what}</p>
            <h3>Why it is needed</h3>
            <p>{stage.why}</p>
            <h3>Input</h3>
            <p>{stage.input}</p>
            <h3>Output</h3>
            <p>{stage.output}</p>
            <h3>Real-world meaning</h3>
            <p>{stage.realWorld}</p>
          </div>

          <div className="analysis-card">
            <h3>Why does this matter?</h3>
            <p>{stage.learning}</p>
          </div>

          <div className="analysis-card challenge-card">
            <h3>Think About It</h3>
            <p>{stage.challengeQuestion}</p>
            <div className="challenge-buttons">
              {stage.challengeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`button secondary ${answer === option ? 'active' : ''}`}
                  onClick={() => setAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className={`challenge-feedback ${answer === stage.challengeAnswer ? 'correct' : answer ? 'incorrect' : ''}`}>
              {challengeFeedback}
            </p>
          </div>
        </div>

        <div className="physical-design-main">
          <div className="physical-design-panel">
            <div className="panel-label small">Educational visualization — simplified representation</div>
            <div className="visualization-card">
              <div className="visualization-header">
                <div>
                  <p className="eyebrow">Stage visualization</p>
                  <h3>{stage.title}</h3>
                </div>
                <div className="visual-note">Interactive representation only</div>
              </div>

              <div className={`flow-visualization stage-${stage.id.toLowerCase().replace(/\s+/g, '-')}`}>
                {stage.id === 'RTL' && (
                  <div className="rtl-visual">
                    <div className="rtl-code">
                      <pre>{`module alu(input A, input B, output Y);
  assign Y = A & B;
endmodule`}</pre>
                    </div>
                    <div className="rtl-blocks">
                      <div className="rtl-block">Register</div>
                      <div className="rtl-block">Logic</div>
                      <div className="rtl-block">Output</div>
                    </div>
                  </div>
                )}

                {stage.id === 'Synthesis' && (
                  <div className="synthesis-visual">
                    <div className="synthesis-column">
                      <div className="synthesis-stage">RTL</div>
                      <div className="synthesis-stage">Code</div>
                    </div>
                    <div className="synthesis-arrow">⟶</div>
                    <div className="synthesis-column cells">
                      <div className="cell-chip">AND</div>
                      <div className="cell-chip">OR</div>
                      <div className="cell-chip">NOT</div>
                    </div>
                  </div>
                )}

                {stage.id === 'Netlist' && (
                  <div className="netlist-visual">
                    <div className="netlist-node">A</div>
                    <div className="netlist-node center">AND</div>
                    <div className="netlist-node">B</div>
                    <div className="netlist-node bottom">Y</div>
                    <svg className="netlist-lines" viewBox="0 0 220 140" aria-hidden="true">
                      <path d="M40 30 L90 50" stroke="#5f90ff" strokeWidth="3" fill="none" />
                      <path d="M40 110 L90 80" stroke="#5f90ff" strokeWidth="3" fill="none" />
                      <path d="M170 70 L120 70" stroke="#5f90ff" strokeWidth="3" fill="none" />
                      <path d="M120 70 L120 110" stroke="#5f90ff" strokeWidth="3" fill="none" />
                    </svg>
                  </div>
                )}

                {stage.id === 'Floorplanning' && (
                  <div className="floorplanning-scene">
                    <div className="floorplan-controls">
                      <div className="control-panel">
                        <h4>Chip geometry</h4>
                        <label>
                          Die width
                          <input
                            type="range"
                            min="300"
                            max="520"
                            step="20"
                            value={dieWidth}
                            onChange={(event) => setDieWidth(Number(event.target.value))}
                          />
                          <span>{dieWidth} px</span>
                        </label>
                        <label>
                          Die height
                          <input
                            type="range"
                            min="240"
                            max="420"
                            step="20"
                            value={dieHeight}
                            onChange={(event) => setDieHeight(Number(event.target.value))}
                          />
                          <span>{dieHeight} px</span>
                        </label>
                        <label>
                          Utilization
                          <input
                            type="range"
                            min="40"
                            max="90"
                            step="5"
                            value={utilization}
                            onChange={(event) => setUtilization(Number(event.target.value))}
                          />
                          <span>{utilization} %</span>
                        </label>
                        <label>
                          Core margin
                          <input
                            type="range"
                            min="10"
                            max="32"
                            step="2"
                            value={margin}
                            onChange={(event) => setMargin(Number(event.target.value))}
                          />
                          <span>{margin} px</span>
                        </label>
                      </div>

                      <div className="metric-panel">
                        <div className="metric-card">
                          <strong>{dieArea.toLocaleString()}</strong>
                          <span>Die area</span>
                        </div>
                        <div className="metric-card">
                          <strong>{coreArea.toLocaleString()}</strong>
                          <span>Core area</span>
                        </div>
                        <div className="metric-card">
                          <strong>{Math.round(usedArea).toLocaleString()}</strong>
                          <span>Used area</span>
                        </div>
                        <div className="metric-card">
                          <strong>{congestion}%</strong>
                          <span>Estimated congestion</span>
                        </div>
                        <div className="metric-card">
                          <strong>{wireEstimate}</strong>
                          <span>Wirelength score</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="floorplan-board"
                      style={{ width: dieWidth, height: dieHeight }}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerLeave={handlePointerUp}
                    >
                      <div className="board-label die-label">DIE AREA</div>
                      <div
                        className="core-outline"
                        style={{
                          left: margin,
                          top: margin,
                          width: coreWidth,
                          height: coreHeight,
                        }}
                      >
                        <span>CORE AREA</span>
                      </div>
                      {macros.map((macro) => {
                        const leftPx = macro.x * dieWidth
                        const topPx = macro.y * dieHeight
                        const widthPx = macro.width * dieWidth
                        const heightPx = macro.height * dieHeight
                        return (
                          <div
                            key={macro.id}
                            className={`macro-item ${selectedMacro === macro.id ? 'selected' : ''}`}
                            style={{
                              left: leftPx,
                              top: topPx,
                              width: widthPx,
                              height: heightPx,
                            }}
                            onPointerDown={(event) => handleMacroPointerDown(event, macro.id)}
                          >
                            <span>{macro.label}</span>
                          </div>
                        )
                      })}
                    </div>

                    <div className="floorplan-status">
                      <div className="status-line">
                        <strong>{overlapWarnings.length > 0 ? 'Warning' : 'Healthy design'}</strong>
                        <span>
                          {overlapWarnings.length > 0
                            ? 'Resolve overlaps or core boundary violations by dragging macros inside the core.'
                            : 'Macro placement is within the core and the scene is stable.'}
                        </span>
                      </div>
                      <div className="warning-list">
                        {overlapWarnings.length > 0 ? (
                          overlapWarnings.map((warning) => (
                            <div key={warning} className="warning-item">
                              {warning}
                            </div>
                          ))
                        ) : (
                          <div className="warning-item positive">No overlaps detected.</div>
                        )}
                      </div>
                      <p className="scene-note">
                        Drag a macro to adjust placement. The visual scene shows die/core geometry, utilization, wiring, and placement quality together.
                      </p>
                    </div>
                  </div>
                )}

                {stage.id === 'Placement' && (
                  <PlacementLab dieWidth={dieWidth} dieHeight={dieHeight} margin={margin} onCellsChange={setPlacementCells} />
                )}

                {stage.id === 'Clock Tree Synthesis' && (
                  <div className="cts-visual">
                    <ClockTreeLab onClockChange={setClockMetrics} />
                    <div style={{ marginTop: 12 }}>
                      <TimingLab skew={clockMetrics?.skew ?? 0} clockPeriod={1.5} />
                    </div>
                  </div>
                )}

                {stage.id === 'Routing' && (
                  <div>
                    <RoutingLab dieWidth={dieWidth} dieHeight={dieHeight} margin={margin} pins={pinsFromPlacement} nets={netsFromPlacement} onMetrics={setRoutingMetrics} />
                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                      <TimingLab skew={clockMetrics?.skew ?? 0} combDelay={1.0 + (routingMetrics?.estimateDelay ?? 0) / 200} wireDelay={(routingMetrics?.totalRouteLength ?? 0) / 2000} />
                      <PowerLab />
                    </div>
                  </div>
                )}

                {stage.id === 'Physical Verification' && (
                  <PhysicalVerificationLab />
                )}

                {stage.id === 'GDSII' && (
                  <div className="gdsii-visual">
                    <div className="gdsii-chip">
                      <div className="gdsii-row">
                        <div />
                        <div />
                        <div />
                      </div>
                      <div className="gdsii-row">
                        <div />
                        <div className="gdsii-block" />
                        <div />
                      </div>
                      <div className="gdsii-row">
                        <div />
                        <div />
                        <div />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhysicalDesignFlow
