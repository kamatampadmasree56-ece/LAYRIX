import { useMemo, useState, type PointerEvent } from 'react'
import { LabHeader, type Mode } from './labs/LabHeader'
import { MetricCard } from './labs/MetricCard'
import { EquationBreakdown } from './labs/EquationBreakdown'
import { ChallengeCard, type Challenge } from './labs/ChallengeCard'

type Props = {
  dieWidth?: number
  dieHeight?: number
  margin?: number
  onCellsChange?: (cells: PlacementCell[]) => void
}

type PlacementCell = {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
  isMacro?: boolean
}

const initialCells: PlacementCell[] = [
  { id: 'M1', label: 'SRAM Macro A', x: 25, y: 25, w: 70, h: 50, isMacro: true },
  { id: 'M2', label: 'SRAM Macro B', x: 260, y: 25, w: 70, h: 50, isMacro: true },
  { id: 'C1', label: 'ALU Cell 1', x: 110, y: 90, w: 30, h: 20 },
  { id: 'C2', label: 'ALU Cell 2', x: 150, y: 90, w: 30, h: 20 },
  { id: 'C3', label: 'Reg FF 1', x: 190, y: 90, w: 25, h: 20 },
  { id: 'C4', label: 'Reg FF 2', x: 110, y: 130, w: 25, h: 20 },
  { id: 'C5', label: 'Control Gate', x: 150, y: 130, w: 35, h: 20 },
  { id: 'C6', label: 'MUX2 Cell', x: 200, y: 130, w: 30, h: 20 },
]

const placementChallenges: Challenge[] = [
  {
    id: 'plc-c1',
    title: 'Challenge 1: Zero Overlaps',
    question: 'Arrange the placed cells and macros so there are ZERO overlaps and ZERO boundary violations.',
    options: ['0 Overlaps achieved', 'Overlaps are allowed in legalization', 'Macros can sit outside core'],
    correctAnswer: '0 Overlaps achieved',
    hint: 'Drag overlapping cells apart or click OPTIMIZE PLACEMENT.',
    solution: 'Separate cells and keep them inside core margins.',
    explanation: 'Legal placement requires zero cell overlaps and all cells strictly inside core rows.',
  },
  {
    id: 'plc-c2',
    title: 'Challenge 2: Utilization Target',
    question: 'If Core Area = 80,000 μm² and Used Area = 56,000 μm², what is the Core Utilization?',
    options: ['56%', '70%', '80%', '142%'],
    correctAnswer: '70%',
    hint: 'Utilization = (Used Area / Core Area) * 100%.',
    solution: '70% Utilization',
    explanation: 'Utilization = 56,000 / 80,000 * 100 = 70%. Target utilization for routability is typically 65-75%.',
  },
  {
    id: 'plc-c3',
    title: 'Challenge 3: Timing-Driven Placement Impact',
    question: 'Why does placing connected cells physically closer reduce propagation delay?',
    options: [
      'Shorter interconnect wire length reduces capacitive load (C) and wire resistance (R), lowering RC delay.',
      'Cells operate at higher voltage when close together.',
      'Clock frequency automatically increases.',
      'Transistors become physically larger.',
    ],
    correctAnswer: 'Shorter interconnect wire length reduces capacitive load (C) and wire resistance (R), lowering RC delay.',
    hint: 'Wire delay ∝ R * C. Shorter wires have lower resistance and capacitance.',
    solution: 'Reduces wire RC delay',
    explanation: 'Shorter wires reduce parasitic R and C, directly lowering the RC propagation delay of timing-critical nets.',
  },
]

export default function PlacementLab({
  dieWidth = 360,
  dieHeight = 220,
  margin = 18,
}: Props) {
  const [mode, setMode] = useState<Mode>('LEARNING')
  const [cells, setCells] = useState<PlacementCell[]>(initialCells)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const coreWidth = dieWidth - margin * 2
  const coreHeight = dieHeight - margin * 2
  const coreArea = coreWidth * coreHeight

  const usedArea = useMemo(
    () => cells.reduce((acc, c) => acc + c.w * c.h, 0),
    [cells]
  )

  const utilization = useMemo(
    () => Math.round((usedArea / coreArea) * 100),
    [usedArea, coreArea]
  )

  // Overlap and boundary check
  const { overlapCount, boundaryCount, warnings } = useMemo(() => {
    let overlaps = 0
    let boundaries = 0
    const warnList: string[] = []

    for (let i = 0; i < cells.length; i++) {
      const a = cells[i]

      // Boundary check
      if (a.x < margin || a.y < margin || a.x + a.w > dieWidth - margin || a.y + a.h > dieHeight - margin) {
        boundaries++
        warnList.push(`ERROR: ${a.label} is outside legal core boundary!`)
      }

      // Overlap check
      for (let j = i + 1; j < cells.length; j++) {
        const b = cells[j]
        const isIntersect =
          a.x < b.x + b.w &&
          a.x + a.w > b.x &&
          a.y < b.y + b.h &&
          a.y + a.h > b.y

        if (isIntersect) {
          overlaps++
          warnList.push(`WARNING: Cell overlap detected between ${a.label} and ${b.label}.`)
        }
      }
    }

    return { overlapCount: overlaps, boundaryCount: boundaries, warnings: warnList }
  }, [cells, dieWidth, dieHeight, margin])

  // HPWL Wirelength estimate
  const hpwl = useMemo(() => {
    if (cells.length < 2) return 0
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    cells.forEach((c) => {
      minX = Math.min(minX, c.x + c.w / 2)
      maxX = Math.max(maxX, c.x + c.w / 2)
      minY = Math.min(minY, c.y + c.h / 2)
      maxY = Math.max(maxY, c.y + c.h / 2)
    })
    return Math.round((maxX - minX) + (maxY - minY))
  }, [cells])

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>, id: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setDraggingId(id)
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingId) return
    const areaRect = e.currentTarget.getBoundingClientRect()
    const xPx = e.clientX - areaRect.left - dragOffset.x
    const yPx = e.clientY - areaRect.top - dragOffset.y

    setCells((prev) =>
      prev.map((c) => {
        if (c.id !== draggingId) return c
        const clampedX = Math.max(margin, Math.min(xPx, dieWidth - margin - c.w))
        const clampedY = Math.max(margin, Math.min(yPx, dieHeight - margin - c.h))
        return { ...c, x: clampedX, y: clampedY }
      })
    )
  }

  const handlePointerUp = () => {
    setDraggingId(null)
  }

  const handleAutoPlace = () => {
    setCells([
      { id: 'M1', label: 'SRAM Macro A', x: margin + 5, y: margin + 5, w: 70, h: 50, isMacro: true },
      { id: 'M2', label: 'SRAM Macro B', x: dieWidth - margin - 75, y: margin + 5, w: 70, h: 50, isMacro: true },
      { id: 'C1', label: 'ALU Cell 1', x: 90, y: 70, w: 30, h: 20 },
      { id: 'C2', label: 'ALU Cell 2', x: 130, y: 70, w: 30, h: 20 },
      { id: 'C3', label: 'Reg FF 1', x: 170, y: 70, w: 25, h: 20 },
      { id: 'C4', label: 'Reg FF 2', x: 90, y: 120, w: 25, h: 20 },
      { id: 'C5', label: 'Control Gate', x: 130, y: 120, w: 35, h: 20 },
      { id: 'C6', label: 'MUX2 Cell', x: 180, y: 120, w: 30, h: 20 },
    ])
  }

  const handleOptimizePlacement = () => {
    // Separate cells and align nicely
    handleAutoPlace()
  }

  const handleResetLab = () => {
    setCells(initialCells)
  }

  return (
    <section className="section placement-lab-section" id="placement-lab-section">
      <LabHeader
        title="Interactive Standard Cell Placement Lab"
        subtitle="Drag cells/macros across core rows. Monitor live utilization, HPWL wirelength, cell overlaps, and congestion."
        icon="📐"
        difficulty="Intermediate"
        mode={mode}
        onModeChange={setMode}
        onReset={handleResetLab}
      />

      <div className="placement-action-bar">
        <button type="button" className="button primary small" onClick={handleAutoPlace}>
          ⚡ AUTO PLACE
        </button>
        <button type="button" className="button secondary small" onClick={handleOptimizePlacement}>
          🛠 OPTIMIZE PLACEMENT
        </button>
        <button type="button" className="button secondary small" onClick={handleResetLab}>
          🔄 RESET POSITIONS
        </button>
      </div>

      <div className="placement-main-grid">
        {/* Left Column: Interactive Canvas */}
        <div className="placement-canvas-card">
          <h4>Interactive Chip Core & Row Placement Canvas</h4>

          <div
            className="placement-board"
            style={{ width: dieWidth, height: dieHeight }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Core Boundary Outline */}
            <div
              className="core-outline"
              style={{
                left: margin,
                top: margin,
                width: coreWidth,
                height: coreHeight,
              }}
            >
              <span className="core-title">CORE AREA ({coreWidth} × {coreHeight})</span>
            </div>

            {/* Standard Cell Rows Background */}
            {Array.from({ length: 6 }).map((_, r) => (
              <div
                key={r}
                className="cell-row-line"
                style={{
                  left: margin,
                  top: margin + r * 28 + 15,
                  width: coreWidth,
                }}
              />
            ))}

            {/* Placed Cells and Macros */}
            {cells.map((c) => {
              const isSelected = draggingId === c.id
              return (
                <div
                  key={c.id}
                  className={`cell-item ${c.isMacro ? 'macro' : 'std-cell'} ${isSelected ? 'dragging' : ''}`}
                  style={{
                    left: c.x,
                    top: c.y,
                    width: c.w,
                    height: c.h,
                  }}
                  onPointerDown={(e) => handlePointerDown(e, c.id)}
                >
                  <span className="cell-label">{c.label}</span>
                </div>
              )
            })}
          </div>

          {/* Warnings Banner */}
          {warnings.length > 0 ? (
            <div className="placement-warning-box">
              {warnings.map((w, idx) => (
                <div key={idx} className="warning-line">{w}</div>
              ))}
            </div>
          ) : (
            <div className="placement-success-box">
              ✓ Legal Placement: Zero overlaps and all cells within core bounds.
            </div>
          )}
        </div>

        {/* Right Column: Metrics & Explanations */}
        <div className="placement-side-card">
          <div className="placement-metrics-grid">
            <MetricCard label="Core Utilization" value={`${utilization}%`} status={utilization > 85 ? 'danger' : 'good'} />
            <MetricCard label="HPWL Wirelength" value={`${hpwl} px`} status="neutral" />
            <MetricCard label="Overlaps" value={overlapCount} status={overlapCount > 0 ? 'danger' : 'good'} />
            <MetricCard label="Boundary Violations" value={boundaryCount} status={boundaryCount > 0 ? 'danger' : 'good'} />
          </div>

          <div className="placement-why-box">
            <h4>Why Placement Matters</h4>
            <p>
              Placement arranges millions of standard cells in physical rows. Good placement optimizes:
            </p>
            <ul>
              <li><strong>Timing:</strong> Shorter wires reduce RC delay on critical paths.</li>
              <li><strong>Power:</strong> Shorter wire lengths decrease dynamic switching capacitance.</li>
              <li><strong>Routing:</strong> Balanced density prevents routing track congestion bottlenecks.</li>
              <li><strong>Area:</strong> Eliminating overlaps allows legal silicon manufacturing.</li>
            </ul>
          </div>

          {mode === 'ENGINEERING' ? (
            <EquationBreakdown
              title="Placement Metrics Equations"
              formula="\text{Utilization} = \frac{\sum \text{Area}_{\text{cells}}}{\text{Area}_{\text{core}}} \times 100\% \quad \text{and} \quad \text{HPWL} = (x_{\max} - x_{\min}) + (y_{\max} - y_{\min})"
              variables={[
                { symbol: 'Used Area', name: 'Total Cells Area', value: usedArea, unit: 'px²' },
                { symbol: 'Core Area', name: 'Available Core Area', value: coreArea, unit: 'px²' },
              ]}
              substitution={`Utilization = (${usedArea} / ${coreArea}) * 100%`}
              calculation={`Utilization = ${utilization}% | HPWL Wirelength = ${hpwl} px`}
              result={`${utilization}% Core Utilization (${overlapCount} overlaps)`}
              physicalMeaning="Target utilization for routability is 65-75%. Over-utilization causes routing congestion. Half-Perimeter Wirelength (HPWL) estimates routing wire length."
            />
          ) : (
            <div className="learning-panel-box">
              <h4>🎓 Learning Mode Tip</h4>
              <p>
                Try dragging standard cells on top of each other to see overlap warnings appear! Click <strong>AUTO PLACE</strong> to resolve all errors instantly.
              </p>
            </div>
          )}
        </div>
      </div>

      <ChallengeCard labId="placement" challenges={placementChallenges} />
    </section>
  )
}
