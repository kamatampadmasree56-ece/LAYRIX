import { useMemo, useState, useRef, useEffect, type PointerEvent } from 'react'

type Pin = { id: string; x: number; y: number } // fractions
type Route = { netId: number; points: { x: number; y: number }[] }

type Props = {
  dieWidth: number
  dieHeight: number
  margin: number
  pins?: Pin[]
  nets?: [number, number][]
  onMetrics?: (m: { totalRouteLength: number; estimateDelay: number; trackUtilization: number; congestedRegions: number }) => void
}

// create some placed pins default
const defaultPins = (): Pin[] => [
  { id: 'P1', x: 0.12, y: 0.2 },
  { id: 'P2', x: 0.75, y: 0.22 },
  { id: 'P3', x: 0.18, y: 0.6 },
  { id: 'P4', x: 0.72, y: 0.62 },
  { id: 'P5', x: 0.42, y: 0.42 },
]

const defaultNets: [number, number][] = [
  [0, 1],
  [2, 3],
  [0, 4],
]

const defaultObstacles = [
  { x: 0.28, y: 0.18, w: 0.18, h: 0.18 },
  { x: 0.58, y: 0.48, w: 0.16, h: 0.22 },
]

export default function RoutingLab({ dieWidth, dieHeight, margin, pins: pinsProp, nets: netsProp, onMetrics }: Props) {
  const pins = pinsProp ?? defaultPins()
  const nets = netsProp ?? defaultNets
  const [routes, setRoutes] = useState<Route[]>([])
  const [selectedSource, setSelectedSource] = useState<number | null>(null)
  const [selectedDest, setSelectedDest] = useState<number | null>(null)
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([])
  const [gridSize] = useState({ cols: 32, rows: 24 })
  const boardRef = useRef<HTMLDivElement | null>(null)

  const cellW = dieWidth / gridSize.cols
  const cellH = dieHeight / gridSize.rows
  const [obstaclesState, setObstaclesState] = useState(defaultObstacles)

  // congestion map: counts per grid cell
  const congestion = useMemo(() => {
    const counts = Array.from({ length: gridSize.cols * gridSize.rows }).fill(0) as number[]
    routes.forEach((r) => {
      r.points.forEach((p) => {
        const cx = Math.floor((p.x * dieWidth) / cellW)
        const cy = Math.floor((p.y * dieHeight) / cellH)
        const idx = Math.max(0, Math.min(gridSize.cols - 1, cx)) + Math.max(0, Math.min(gridSize.rows - 1, cy)) * gridSize.cols
        counts[idx] += 1
      })
    })
    return counts
  }, [routes, dieWidth, dieHeight, gridSize.cols, gridSize.rows, cellW, cellH])

  const totalNets = nets.length
  const routedNets = routes.length
  const unroutedNets = totalNets - routedNets

  const totalRouteLength = useMemo(() => {
    let sum = 0
    routes.forEach((r) => {
      for (let i = 1; i < r.points.length; i++) {
        const a = r.points[i - 1]
        const b = r.points[i]
        sum += Math.abs(a.x - b.x) * dieWidth + Math.abs(a.y - b.y) * dieHeight
      }
    })
    return Math.round(sum)
  }, [routes, dieWidth, dieHeight])

  const bends = useMemo(() => routes.reduce((s, r) => s + Math.max(0, r.points.length - 2), 0), [routes])

  const congestedRegions = useMemo(() => congestion.filter((c) => c >= 3).length, [congestion])

  const trackUtilization = useMemo(() => {
    const used = congestion.reduce((s, v) => s + (v > 0 ? 1 : 0), 0)
    const total = gridSize.cols * gridSize.rows
    return Math.round((used / total) * 100)
  }, [congestion, gridSize.cols, gridSize.rows])

  const routingSuccessPct = Math.round((routedNets / totalNets) * 100)

  const estimateDelay = Math.round(totalRouteLength / 50 + bends * 12)

  useEffect(() => {
    if (typeof onMetrics === 'function') {
      onMetrics({ totalRouteLength, estimateDelay, trackUtilization, congestedRegions })
    }
  }, [totalRouteLength, estimateDelay, trackUtilization, congestedRegions, onMetrics])

  function gridCoordsFromEvent(e: PointerEvent<HTMLDivElement>) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = Math.max(0, Math.min(dieWidth, e.clientX - rect.left))
    const y = Math.max(0, Math.min(dieHeight, e.clientY - rect.top))
    return { x, y }
  }

  function startRouting(netIndex: number) {
    setSelectedSource(nets[netIndex][0])
    setSelectedDest(nets[netIndex][1])
    setCurrentPath([])
  }

  function handleBoardPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (selectedSource == null || selectedDest == null) return
    const { x, y } = gridCoordsFromEvent(e)
    setCurrentPath([{ x: x / dieWidth, y: y / dieHeight }])
  }

  function handleBoardPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (currentPath.length === 0) return
    const { x, y } = gridCoordsFromEvent(e)
    setCurrentPath((p) => [...p.slice(0, -1), { x: x / dieWidth, y: y / dieHeight }])
  }

  function handleBoardPointerUp() {
    if (selectedSource == null || selectedDest == null) return
    // finalize route for selected net
    const netIndex = nets.findIndex((n) => n[0] === selectedSource && n[1] === selectedDest)
    if (netIndex === -1) return
    setRoutes((prev) => [...prev, { netId: netIndex, points: currentPath }])
    setSelectedSource(null)
    setSelectedDest(null)
    setCurrentPath([])
  }

  function resetRouting() {
    setRoutes([])
    setSelectedSource(null)
    setSelectedDest(null)
    setCurrentPath([])
  }

  function randomizeObstacles() {
    // generate random obstacles while avoiding pins
    const newObs = [] as { x: number; y: number; w: number; h: number }[]
    const maxAttempts = 40
    let attempts = 0
    while (newObs.length < 3 && attempts < maxAttempts) {
      attempts++
      const w = 0.08 + Math.random() * 0.12
      const h = 0.08 + Math.random() * 0.14
      const x = margin / dieWidth + Math.random() * (1 - w - (margin * 2) / dieWidth)
      const y = margin / dieHeight + Math.random() * (1 - h - (margin * 2) / dieHeight)
      const coversPin = pins.some((p) => p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h)
      if (!coversPin) newObs.push({ x, y, w, h })
    }
    setObstaclesState(newObs)
    resetRouting()
  }

  // helper checks
  function isRouteBlocked(points: { x: number; y: number }[]) {
    for (const pt of points) {
      for (const ob of obstaclesState) {
        if (pt.x >= ob.x && pt.x <= ob.x + ob.w && pt.y >= ob.y && pt.y <= ob.y + ob.h) return true
      }
    }
    return false
  }

  const boardStyle = { width: dieWidth, height: dieHeight }

  return (
    <div className="routing-scene">
      <div className="routing-controls">
        <div className="routing-buttons">
          <button className="button" type="button" onClick={resetRouting}>Reset Routing</button>
          <button className="button secondary" type="button" onClick={randomizeObstacles}>Randomize Obstacles</button>
        </div>
        <div className="routing-metrics">
          <div className="metric-card"><strong>{totalNets}</strong><span>Total nets</span></div>
          <div className="metric-card"><strong>{routedNets}</strong><span>Routed nets</span></div>
          <div className="metric-card"><strong>{unroutedNets}</strong><span>Unrouted nets</span></div>
          <div className="metric-card"><strong>{totalRouteLength}</strong><span>Route length</span></div>
          <div className="metric-card"><strong>{bends}</strong><span>Bends</span></div>
          <div className="metric-card"><strong>{congestedRegions}</strong><span>Congested regions</span></div>
          <div className="metric-card"><strong>{trackUtilization}%</strong><span>Track utilization</span></div>
          <div className="metric-card"><strong>{routingSuccessPct}%</strong><span>Success</span></div>
          <div className="metric-card"><strong>{estimateDelay}</strong><span>Est. delay</span></div>
        </div>
      </div>

      <div className="routing-board" style={boardStyle} ref={boardRef} onPointerDown={handleBoardPointerDown} onPointerMove={handleBoardPointerMove} onPointerUp={handleBoardPointerUp}>
        <div className="board-label die-label">DIE</div>
        <div className="core-outline" style={{ left: margin, top: margin, width: dieWidth - margin * 2, height: dieHeight - margin * 2 }}>
          <span>CORE</span>
        </div>

        {/* draw grid tracks */}
        <svg className="routing-grid" width={dieWidth} height={dieHeight} aria-hidden>
          {Array.from({ length: gridSize.cols }).map((_, i) => (
            <line key={`v-${i}`} x1={i * cellW} y1={0} x2={i * cellW} y2={dieHeight} stroke="rgba(255,255,255,0.02)" />
          ))}
          {Array.from({ length: gridSize.rows }).map((_, i) => (
            <line key={`h-${i}`} x1={0} y1={i * cellH} x2={dieWidth} y2={i * cellH} stroke="rgba(255,255,255,0.02)" />
          ))}

          {/* obstacles */}
          {obstaclesState.map((ob, idx) => (
            <rect key={`ob-${idx}`} x={ob.x * dieWidth} y={ob.y * dieHeight} width={ob.w * dieWidth} height={ob.h * dieHeight} fill="rgba(255,64,64,0.18)" stroke="rgba(255,64,64,0.4)" />
          ))}

          {/* existing routes */}
          {routes.map((r, idx) => (
            <polyline key={`r-${idx}`} points={r.points.map((p) => `${p.x * dieWidth},${p.y * dieHeight}`).join(' ')} stroke="#5f90ff" strokeWidth={3} fill="none" />
          ))}

          {/* current drawing path */}
          {currentPath.length > 0 && <polyline points={currentPath.map((p) => `${p.x * dieWidth},${p.y * dieHeight}`).join(' ')} stroke="#ffd166" strokeWidth={3} fill="none" strokeDasharray="6 4" />}
        </svg>

        {/* congestion heatmap overlay */}
        <div className="congestion-overlay">
          {congestion.map((c, idx) => {
            const gx = idx % gridSize.cols
            const gy = Math.floor(idx / gridSize.cols)
            const left = gx * cellW
            const top = gy * cellH
            const color = c === 0 ? 'transparent' : c === 1 ? 'rgba(0,255,0,0.06)' : c === 2 ? 'rgba(255,255,0,0.08)' : 'rgba(255,96,0,0.12)'
            return <div key={`heat-${idx}`} className="heatcell" style={{ left, top, width: cellW, height: cellH, background: color }} />
          })}
        </div>

        {/* pins */}
        {pins.map((p, i) => (
          <div key={p.id} className={`pin ${selectedSource === i || selectedDest === i ? 'selected' : ''}`} style={{ left: p.x * dieWidth, top: p.y * dieHeight }}>
            <button type="button" className="pin-btn" onClick={() => {
              // if no source, pick this as source for the first unrouted net that includes it
              if (selectedSource == null) {
                setSelectedSource(i)
                return
              }
              if (selectedSource != null && selectedDest == null && i !== selectedSource) {
                setSelectedDest(i)
              }
            }}>{p.id}</button>
          </div>
        ))}

        {/* net selectors */}
        <div className="net-list">
          {nets.map((n, idx) => (
            <button key={`net-${idx}`} className="button small" type="button" onClick={() => startRouting(idx)}>
              Route {idx + 1}: {pins[n[0]].id}→{pins[n[1]].id}
            </button>
          ))}
        </div>

        <div className="routing-explain">
          {routes.some((r) => isRouteBlocked(r.points)) && <div className="explain warn">🔴 ROUTE BLOCKED — a route passes through an obstacle.</div>}
          {congestedRegions > 0 && <div className="explain warn">🔴 CONGESTION detected in parts of the routing grid.</div>}
          {routingSuccessPct === 100 && <div className="explain good">🟢 All nets routed successfully.</div>}
        </div>
      </div>
    </div>
  )
}
