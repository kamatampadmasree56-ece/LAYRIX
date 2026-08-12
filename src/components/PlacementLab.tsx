import { useMemo, useState, useRef, useEffect, type PointerEvent } from 'react'

type Cell = {
  id: string
  label: string
  x: number // fraction
  y: number // fraction
  w: number // fraction of die width
  h: number // fraction of die height
  fixed?: boolean
}

type Props = {
  dieWidth: number
  dieHeight: number
  margin: number
  onCellsChange?: (cells: Cell[]) => void
}

const initialCells = (): Cell[] => {
  return Array.from({ length: 14 }).map((_, i) => ({
    id: `C${i + 1}`,
    label: `Cell ${i + 1}`,
    x: (20 + (i * 28) % 360) / 400,
    y: (30 + (i % 5) * 40) / 320,
    w: 18 / 400,
    h: 14 / 320,
  }))
}

// simple netlist pairs (by index)
const nets: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [2, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [12, 13],
]

export default function PlacementLab({ dieWidth, dieHeight, margin, onCellsChange }: Props) {
  const [cells, setCells] = useState<Cell[]>(initialCells)
  const [dragId, setDragId] = useState<string | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const boardRef = useRef<HTMLDivElement | null>(null)
  const [compareMode, setCompareMode] = useState(false)

  

  const coreLeft = margin
  const coreTop = margin
  const coreW = dieWidth - margin * 2
  const coreH = dieHeight - margin * 2

  const initialGood = (() => {
    const init = initialCells()
    const cols = 5
    const rows = Math.ceil(init.length / cols)
    const cellW = (coreW / cols) / dieWidth
    const cellH = (coreH / rows) / dieHeight
    return init.map((c, i) => ({
      ...c,
      x: (coreLeft + (i % cols) * (coreW / cols) + 8) / dieWidth,
      y: (coreTop + Math.floor(i / cols) * (coreH / rows) + 6) / dieHeight,
      w: cellW,
      h: cellH,
    }))
  })()

  const [baselineGoodState] = useState<Cell[] | null>(initialGood)

  useEffect(() => {
    if (typeof onCellsChange === 'function') onCellsChange(cells)
  }, [cells, onCellsChange])

  // goodPlacement removed (unused) — baseline uses initialGood

  // baselineGoodState initialized above; keep as reference layout

  const getPixel = useMemo(
    () => (c: Cell) => ({ x: c.x * dieWidth, y: c.y * dieHeight, w: c.w * dieWidth, h: c.h * dieHeight }),
    [dieWidth, dieHeight],
  )

  const overlapsCount = useMemo(() => {
    let count = 0
    for (let i = 0; i < cells.length; i++) {
      const a = getPixel(cells[i])
      for (let j = i + 1; j < cells.length; j++) {
        const b = getPixel(cells[j])
        if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) count++
      }
    }
    return count
  }, [cells, dieWidth, dieHeight, getPixel])

  const outsideCount = useMemo(() => {
    return cells.filter((c) => {
      const p = getPixel(c)
      return p.x < coreLeft || p.y < coreTop || p.x + p.w > coreLeft + coreW || p.y + p.h > coreTop + coreH
    }).length
  }, [cells, coreLeft, coreTop, coreW, coreH, getPixel])

  const totalWirelength = useMemo(() => {
    let sum = 0
    for (const [a, b] of nets) {
      const pa = getPixel(cells[a])
      const pb = getPixel(cells[b])
      const dx = Math.abs(pa.x + pa.w / 2 - (pb.x + pb.w / 2))
      const dy = Math.abs(pa.y + pa.h / 2 - (pb.y + pb.h / 2))
      sum += dx + dy // manhattan
    }
    return Math.round(sum)
  }, [cells, getPixel])

  const avgDensity = useMemo(() => {
    // grid-based density: count cells per cell in a coarse grid
    const gx = 8
    const gy = 6
    const counts = new Array(gx * gy).fill(0) as number[]
    cells.forEach((c) => {
      const p = getPixel(c)
      const cx = Math.floor(((p.x + p.w / 2) / dieWidth) * gx)
      const cy = Math.floor(((p.y + p.h / 2) / dieHeight) * gy)
      const idx = Math.min(gx - 1, Math.max(0, cx)) + Math.min(gy - 1, Math.max(0, cy)) * gx
      counts[idx]++
    })
    const avg = counts.reduce((s, v) => s + v, 0) / counts.length
    return Number(avg.toFixed(2))
  }, [cells, dieWidth, dieHeight, getPixel])

  const timingEstimate = useMemo(() => Math.round(1000 + totalWirelength / 6 - (cells.length - overlapsCount) * 2), [totalWirelength, cells.length, overlapsCount])

  function handlePointerDown(event: PointerEvent<HTMLDivElement>, id: string) {
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const cell = cells.find((c) => c.id === id)
    if (!cell) return
    const px = cell.x * dieWidth
    const py = cell.y * dieHeight
    dragOffset.current = { x: event.clientX - rect.left - px, y: event.clientY - rect.top - py }
    setDragId(id)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragId) return
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const xPx = event.clientX - rect.left - dragOffset.current.x
    const yPx = event.clientY - rect.top - dragOffset.current.y
    // clamp to core
    const minX = coreLeft
    const minY = coreTop
    const cell = cells.find((c) => c.id === dragId)
    if (!cell) return
    const wPx = cell.w * dieWidth
    const hPx = cell.h * dieHeight
    const maxX = coreLeft + coreW - wPx
    const maxY = coreTop + coreH - hPx
    const clampedX = Math.max(minX, Math.min(xPx, maxX))
    const clampedY = Math.max(minY, Math.min(yPx, maxY))
    setCells((prev) => prev.map((c) => (c.id === dragId ? { ...c, x: clampedX / dieWidth, y: clampedY / dieHeight } : c)))
  }

  function handlePointerUp() {
    setDragId(null)
  }

  function resetPlacement() {
    setCells(initialCells)
  }

  function randomizePlacement() {
    setCells((prev) => prev.map((c) => ({ ...c, x: (Math.random() * (coreW - 20) + coreLeft) / dieWidth, y: (Math.random() * (coreH - 20) + coreTop) / dieHeight })))
  }

  function makeBadPlacement() {
    // cluster many cells into one corner to create high density and overlaps
    setCells((prev) => prev.map((c, i) => ({ ...c, x: (coreLeft + (i % 3) * 6) / dieWidth, y: (coreTop + Math.floor(i / 3) * 6) / dieHeight })))
  }

  return (
    <div className="placement-scene">
      <div className="placement-controls">
        <button className="button" type="button" onClick={resetPlacement}>Reset Placement</button>
        <button className="button secondary" type="button" onClick={randomizePlacement}>Randomize Placement</button>
        <button className="button warning" type="button" onClick={makeBadPlacement}>Make Bad Placement</button>
        <label style={{ marginLeft: 12 }}>
          <input type="checkbox" checked={compareMode} onChange={(e) => setCompareMode(e.target.checked)} /> Compare Good vs Bad
        </label>
      </div>

      <div className="placement-metrics">
        <div className="metric-card"><strong>{cells.length}</strong><span>Cells</span></div>
        <div className="metric-card"><strong>{overlapsCount}</strong><span>Overlaps</span></div>
        <div className="metric-card"><strong>{outsideCount}</strong><span>Outside legal</span></div>
        <div className="metric-card"><strong>{Math.round(totalWirelength)}</strong><span>Est. wirelength</span></div>
        <div className="metric-card"><strong>{avgDensity}</strong><span>Density</span></div>
        <div className="metric-card"><strong>{timingEstimate}</strong><span>Timing score</span></div>
      </div>

      <div
        className="placement-board"
        ref={boardRef}
        style={{ width: dieWidth, height: dieHeight }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="board-label die-label">DIE</div>
        <div className="core-outline" style={{ left: coreLeft, top: coreTop, width: coreW, height: coreH }}>
          <span>CORE</span>
        </div>

        {/* connections - SVG overlay */}
        <svg className="connections" width={dieWidth} height={dieHeight} aria-hidden>
          {nets.map(([a, b], i) => {
            const pa = getPixel(cells[a])
            const pb = getPixel(cells[b])
            const x1 = pa.x + pa.w / 2
            const y1 = pa.y + pa.h / 2
            const x2 = pb.x + pb.w / 2
            const y2 = pb.y + pb.h / 2
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5f90ff" strokeWidth={2} opacity={0.7} />
          })}
        </svg>

        {/* heatmap */}
        <div className="heatmap-grid" style={{ width: dieWidth, height: dieHeight }}>
          {Array.from({ length: 8 * 6 }).map((_, idx) => {
            const gx = 8
            const gy = 6
            const x = idx % gx
            const y = Math.floor(idx / gx)
            const cellW = dieWidth / gx
            const cellH = dieHeight / gy
            // compute density per cell
            const count = cells.filter((c) => {
              const p = getPixel(c)
              const cx = Math.floor((p.x + p.w / 2) / cellW)
              const cy = Math.floor((p.y + p.h / 2) / cellH)
              return cx === x && cy === y
            }).length
            const opacity = Math.min(0.9, count / 3)
            return <div key={idx} className="heatcell" style={{ left: x * cellW, top: y * cellH, width: cellW, height: cellH, background: `rgba(255,64,64,${opacity})` }} />
          })}
        </div>

        {/* cells */}
        {cells.map((c) => {
          const p = getPixel(c)
          return (
            <div
              key={c.id}
              className={`cell-item ${dragId === c.id ? 'dragging' : ''} ${overlapsCount > 0 ? 'bad' : ''}`}
              style={{ left: p.x, top: p.y, width: p.w, height: p.h }}
              onPointerDown={(e) => handlePointerDown(e, c.id)}
            >
              <div className="cell-label">{c.id}</div>
            </div>
          )
        })}

        {/* compare good placement overlay */}
        {compareMode && baselineGoodState && (
          <div className="compare-overlay">
            {baselineGoodState.map((c) => {
              const p = { x: c.x * dieWidth, y: c.y * dieHeight, w: c.w * dieWidth, h: c.h * dieHeight }
              return <div key={`g-${c.id}`} className="cell-ghost" style={{ left: p.x, top: p.y, width: p.w, height: p.h }} />
            })}
          </div>
        )}
      </div>

      <div className="placement-explanations">
        {overlapsCount > 0 && <div className="explain warn">🔴 Placement has overlaps. Reduce density or move cells apart.</div>}
        {outsideCount > 0 && <div className="explain warn">🔴 Some cells are outside the legal core region. Drag them inside.</div>}
        {overlapsCount === 0 && outsideCount === 0 && totalWirelength < 1200 && <div className="explain good">🟢 Placement looks legal and compact. Wirelength and timing are healthy.</div>}
      </div>
    </div>
  )
}
