import { useMemo, useState } from 'react'
import { LabHeader, type Mode } from './labs/LabHeader'
import { MetricCard } from './labs/MetricCard'
import { EquationBreakdown } from './labs/EquationBreakdown'
import { ChallengeCard, type Challenge } from './labs/ChallengeCard'

type Net = {
  id: string
  name: string
  color: string
  source: { x: number; y: number }
  target: { x: number; y: number }
  layer: 'M1' | 'M2' | 'M3'
  routed?: boolean
  path?: { x: number; y: number }[]
}

type Obstacle = {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
}

const initialNets: Net[] = [
  { id: 'N1', name: 'Net 1 (ALU_OUT)', color: '#2563EB', source: { x: 30, y: 40 }, target: { x: 280, y: 40 }, layer: 'M1' },
  { id: 'N2', name: 'Net 2 (CLK_TREE)', color: '#06B6D4', source: { x: 50, y: 140 }, target: { x: 290, y: 140 }, layer: 'M2' },
  { id: 'N3', name: 'Net 3 (RESET_N)', color: '#8B5CF6', source: { x: 80, y: 80 }, target: { x: 240, y: 160 }, layer: 'M3' },
]

const obstacles: Obstacle[] = [
  { id: 'O1', x: 120, y: 20, w: 60, h: 50, label: 'SRAM Macro Block' },
  { id: 'O2', x: 180, y: 110, w: 50, h: 50, label: 'Analog IP Block' },
]

const routingChallenges: Challenge[] = [
  {
    id: 'rtc-c1',
    title: 'Challenge 1: Route All Nets',
    question: 'Route all 3 nets successfully across the core without hitting obstacles or creating routing violations.',
    options: ['3 Routed Nets achieved', 'Routing through obstacles is legal', 'Vias not allowed'],
    correctAnswer: '3 Routed Nets achieved',
    hint: 'Click AUTO ROUTE to bypass all obstacle blocks automatically.',
    solution: '3 Nets routed without violations.',
    explanation: 'Successful detailed routing routes 100% of signal nets with zero DRC obstacle violations.',
  },
  {
    id: 'rtc-c2',
    title: 'Challenge 2: Metal Layer Resistance',
    question: 'Why are upper metal layers (e.g. Metal 3/4) preferred for long global connections over lower layers (Metal 1)?',
    options: [
      'Upper metal layers are thicker and wider, resulting in lower wire resistance (R) and lower RC delay.',
      'Metal 1 is not conductive.',
      'Upper layers do not require vias.',
      'Lower layers operate at higher voltage.',
    ],
    correctAnswer: 'Upper metal layers are thicker and wider, resulting in lower wire resistance (R) and lower RC delay.',
    hint: 'R = ρ * L / (W * thickness). Wider/thicker wires have much lower resistance.',
    solution: 'Upper layers have lower wire resistance',
    explanation: 'Upper metal layers are thicker and wider, lowering wire resistance (R = ρL/A) and reducing RC delay for long nets.',
  },
  {
    id: 'rtc-c3',
    title: 'Challenge 3: Via Penalty',
    question: 'What is the physical penalty of introducing too many vias in a routing path?',
    options: [
      'Vias introduce extra parasitic resistance (~10-50Ω per via) and potential electromigration failure points.',
      'Vias reduce power consumption to zero.',
      'Vias increase clock frequency by 2x.',
      'Vias eliminate the need for standard cells.',
    ],
    correctAnswer: 'Vias introduce extra parasitic resistance (~10-50Ω per via) and potential electromigration failure points.',
    hint: 'Each via connects two metal layers and adds parasitic resistance and via enclosure area.',
    solution: 'Adds via resistance and reliability risks',
    explanation: 'Every via adds parasitic resistance to the path and requires via enclosure metal, increasing wire delay and manufacturing cost.',
  },
]

export default function RoutingLab() {
  const [mode, setMode] = useState<Mode>('LEARNING')
  const [nets, setNets] = useState<Net[]>(initialNets)
  const [selectedNetId, setSelectedNetId] = useState<string>('N1')

  // Calculate metrics
  const { routedCount, totalWirelength, viaCount, violationCount } = useMemo(() => {
    let routed = 0
    let wirelen = 0
    let vias = 0
    let viols = 0

    nets.forEach((n) => {
      if (n.routed && n.path && n.path.length > 1) {
        routed++
        vias += n.layer === 'M1' ? 0 : n.layer === 'M2' ? 2 : 4

        // Calculate path distance
        for (let i = 1; i < n.path.length; i++) {
          const dx = Math.abs(n.path[i].x - n.path[i - 1].x)
          const dy = Math.abs(n.path[i].y - n.path[i - 1].y)
          wirelen += dx + dy

          // Obstacle collision check
          const px = n.path[i].x
          const py = n.path[i].y
          obstacles.forEach((obs) => {
            if (px >= obs.x && px <= obs.x + obs.w && py >= obs.y && py <= obs.y + obs.h) {
              viols++
            }
          })
        }
      }
    })

    return {
      routedCount: routed,
      unroutedCount: nets.length - routed,
      totalWirelength: Math.round(wirelen),
      viaCount: vias,
      violationCount: viols,
    }
  }, [nets])

  const handleRouteSelectedNet = () => {
    setNets((prev) =>
      prev.map((n) => {
        if (n.id !== selectedNetId) return n
        // Simple 2-point / L-shaped routing
        const midX = (n.source.x + n.target.x) / 2
        const path = [
          n.source,
          { x: midX, y: n.source.y },
          { x: midX, y: n.target.y },
          n.target,
        ]
        return { ...n, routed: true, path }
      })
    )
  }

  const handleAutoRouteAll = () => {
    setNets((prev) =>
      prev.map((n) => {
        let path: { x: number; y: number }[]
        if (n.id === 'N1') {
          // Detour above SRAM Macro
          path = [n.source, { x: 30, y: 15 }, { x: 280, y: 15 }, n.target]
        } else if (n.id === 'N2') {
          // Detour below Analog IP
          path = [n.source, { x: 50, y: 170 }, { x: 290, y: 170 }, n.target]
        } else {
          // M3 Layer route
          path = [n.source, { x: 160, y: 80 }, { x: 160, y: 160 }, n.target]
        }
        return { ...n, routed: true, path }
      })
    )
  }

  const handleClearRoutes = () => {
    setNets((prev) => prev.map((n) => ({ ...n, routed: false, path: undefined })))
  }

  const handleResetLab = () => {
    setNets(initialNets)
    setSelectedNetId('N1')
  }

  return (
    <section className="section routing-lab-section" id="routing-lab-section">
      <LabHeader
        title="Interactive Multi-Layer Routing Lab"
        subtitle="Route signal nets across Metal 1, Metal 2, and Metal 3 layers. Avoid macro obstacles, vias, and congestion."
        icon="🛣️"
        difficulty="Advanced"
        mode={mode}
        onModeChange={setMode}
        onReset={handleResetLab}
      />

      <div className="routing-control-bar">
        <div className="net-selector-group">
          <span className="ctrl-label">Select Net to Route:</span>
          <div className="btn-group">
            {nets.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`button small ${selectedNetId === n.id ? 'primary' : 'secondary'}`}
                onClick={() => setSelectedNetId(n.id)}
              >
                {n.name} [{n.layer}]
              </button>
            ))}
          </div>
        </div>

        <div className="routing-actions">
          <button type="button" className="button primary small" onClick={handleRouteSelectedNet}>
            ⚡ ROUTE SELECTED NET
          </button>
          <button type="button" className="button success small" onClick={handleAutoRouteAll}>
            🚀 AUTO ROUTE ALL (DRC Clean)
          </button>
          <button type="button" className="button secondary small" onClick={handleClearRoutes}>
            🧹 CLEAR ROUTES
          </button>
        </div>
      </div>

      <div className="routing-main-grid">
        {/* Left Column: Interactive Routing Canvas */}
        <div className="routing-canvas-card">
          <h4>Multi-Layer Routing Canvas (340 × 190)</h4>

          <div className="routing-board" style={{ width: 340, height: 190 }}>
            {/* Metal Layer Routing Tracks Grid */}
            <svg viewBox="0 0 340 190" className="routing-svg">
              {/* Grid Tracks */}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 16 + 10} x2="340" y2={i * 16 + 10} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 17 + 10} y1="0" x2={i * 17 + 10} y2="190" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              ))}

              {/* Obstacle Blocks */}
              {obstacles.map((obs) => (
                <g key={obs.id}>
                  <rect
                    x={obs.x}
                    y={obs.y}
                    width={obs.w}
                    height={obs.h}
                    fill="rgba(239, 68, 68, 0.2)"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    rx="4"
                  />
                  <text x={obs.x + obs.w / 2} y={obs.y + obs.h / 2 + 4} fill="#FCA5A5" fontSize="8" textAnchor="middle" fontWeight="700">
                    {obs.label}
                  </text>
                </g>
              ))}

              {/* Routed Wires & Nets */}
              {nets.map((net) => {
                if (!net.routed || !net.path) return null
                const pathStr = net.path.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
                const isSelected = selectedNetId === net.id
                return (
                  <g key={net.id}>
                    <path
                      d={pathStr}
                      stroke={net.color}
                      strokeWidth={isSelected ? '3.5' : '2'}
                      fill="none"
                      strokeDasharray={net.layer === 'M2' ? '4,2' : undefined}
                    />
                    {/* Draw Vias at corners */}
                    {net.path.slice(1, -1).map((v, vi) => (
                      <circle key={vi} cx={v.x} cy={v.y} r="3" fill="#FBBF24" stroke="#78350F" strokeWidth="1" />
                    ))}
                  </g>
                )
              })}

              {/* Pins (Source & Target) */}
              {nets.map((net) => (
                <g key={`pins-${net.id}`}>
                  {/* Source */}
                  <circle cx={net.source.x} cy={net.source.y} r="6" fill={net.color} stroke="white" strokeWidth="1.5" />
                  <text x={net.source.x} y={net.source.y - 8} fill="#CBD5E1" fontSize="8" textAnchor="middle">SRC</text>

                  {/* Target */}
                  <circle cx={net.target.x} cy={net.target.y} r="6" fill={net.color} stroke="white" strokeWidth="1.5" />
                  <text x={net.target.x} y={net.target.y - 8} fill="#CBD5E1" fontSize="8" textAnchor="middle">DST</text>
                </g>
              ))}
            </svg>
          </div>

          {/* Violation Banner */}
          {violationCount > 0 ? (
            <div className="routing-alert-box fail">
              ⚠ ROUTING VIOLATION DETECTED: {violationCount} wire segments cross obstacle macro boundaries! Click "AUTO ROUTE ALL" to resolve.
            </div>
          ) : routedCount === nets.length ? (
            <div className="routing-alert-box pass">
              ✓ 100% ROUTING SUCCESS: All signal nets successfully routed with ZERO obstacle violations.
            </div>
          ) : (
            <div className="routing-alert-box info">
              ℹ Select a net and click "ROUTE SELECTED NET" or click "AUTO ROUTE ALL".
            </div>
          )}
        </div>

        {/* Right Column: Metrics & Explanations */}
        <div className="routing-side-card">
          <div className="routing-metrics-grid">
            <MetricCard label="Routed Nets" value={`${routedCount} / ${nets.length}`} status={routedCount === nets.length ? 'good' : 'warning'} />
            <MetricCard label="Wirelength" value={`${totalWirelength} px`} status="neutral" />
            <MetricCard label="Via Count" value={viaCount} status="neutral" />
            <MetricCard label="Violations" value={violationCount} status={violationCount > 0 ? 'danger' : 'good'} />
          </div>

          <div className="routing-explainer-box">
            <h4>Global vs Detailed Routing</h4>
            <p><strong>Global Routing:</strong> Plans approximate routing paths by assigning nets to coarse grid tiles. Identifies congestion hotspots.</p>
            <p><strong>Detailed Routing:</strong> Assigns exact metal tracks, metal layers (M1-M3), and vias while obeying foundry DRC spacing rules.</p>
          </div>

          {mode === 'ENGINEERING' ? (
            <EquationBreakdown
              title="Wire Resistance & Parasitic Delay"
              formula="R = \rho \cdot \frac{L}{W \cdot t} \quad \text{and} \quad t_{\text{delay}} \approx 0.69 \cdot R \cdot C"
              variables={[
                { symbol: 'L', name: 'Wire Length', value: totalWirelength, unit: 'px' },
                { symbol: 'Via Count', name: 'Via Count', value: viaCount, unit: 'vias' },
              ]}
              substitution={`Total Wirelength = ${totalWirelength}px across ${routedCount} routed nets`}
              calculation={`Wire Delay ∝ ${totalWirelength}px + (${viaCount} vias * 15Ω)`}
              result={`${totalWirelength} px Wirelength | ${viaCount} Vias`}
              physicalMeaning="Long wires increase capacitive load and delay. Upper metal layers have lower sheet resistance. Vias add ~10-50Ω parasitic resistance."
            />
          ) : (
            <div className="learning-panel-box">
              <h4>🎓 Learning Mode Tip</h4>
              <p>
                Routing creates actual physical metal connections. Avoid routing through red obstacle blocks or your chip will suffer short circuits!
              </p>
            </div>
          )}
        </div>
      </div>

      <ChallengeCard labId="routing" challenges={routingChallenges} />
    </section>
  )
}
