import type { ChangeEvent } from 'react'
import { useMemo, useState, useEffect } from 'react'

type ClockNode = {
  id: string
  type: 'source' | 'buffer' | 'ff'
  level: number
  parent?: string | null
  children: string[]
  delay: number // relative delay (ns)
}

type ClockMetrics = {
  insertionDelay: number
  maxDelay: number
  minDelay: number
  skew: number
  fanout: number
}

type ClockBaseline = {
  tree: Record<string, ClockNode>
  metrics: ClockMetrics
}

type Props = {
  onClockChange?: (metrics: ClockMetrics) => void
}

function buildTree(ffCount: number, fanout: number, bufStrength: number, bad = false): Record<string, ClockNode> {
  const nodes: Record<string, ClockNode> = {}
  let idCounter = 0
  function nextId(prefix = 'N') { idCounter += 1; return `${prefix}${idCounter}` }

  const sourceId = nextId('S')
  nodes[sourceId] = { id: sourceId, type: 'source', level: 0, children: [], delay: 0 }

  // create a simple breadth-first buffering to reach FFs
  const queue: string[] = [sourceId]
  let createdFFs = 0
  while (createdFFs < ffCount) {
    const parent = queue.shift()!
    // determine how many children this parent will have
    let childrenCount = fanout
    if (bad && Math.random() > 0.7) childrenCount = Math.max(1, fanout + 2) // create uneven fanout
    for (let i = 0; i < childrenCount && createdFFs < ffCount; i++) {
      const useBuffer = Math.random() > 0.2 // sometimes insert a buffer node
      if (useBuffer) {
        const bufId = nextId('B')
        const lvl = (nodes[parent].level || 0) + 1
        nodes[bufId] = { id: bufId, type: 'buffer', level: lvl, parent, children: [], delay: 0.2 * bufStrength }
        nodes[parent].children.push(bufId)
        // attach one or more FFs under this buffer
        const attachCount = bad && Math.random() > 0.6 ? Math.min(ffCount - createdFFs, childrenCount + 1) : 1
        for (let j = 0; j < attachCount && createdFFs < ffCount; j++) {
          const ffId = nextId('F')
          nodes[ffId] = { id: ffId, type: 'ff', level: nodes[bufId].level + 1, parent: bufId, children: [], delay: 0 }
          nodes[bufId].children.push(ffId)
          createdFFs += 1
        }
        // keep buffer as candidate parent to grow tree
        queue.push(bufId)
      } else {
        const ffId = nextId('F')
        nodes[ffId] = { id: ffId, type: 'ff', level: nodes[parent].level + 1, parent, children: [], delay: 0 }
        nodes[parent].children.push(ffId)
        createdFFs += 1
      }
    }
  }

  return nodes
}

export default function ClockTreeLab({ onClockChange }: Props) {
  const [ffCount, setFfCount] = useState(4)
  const [bufStrength, setBufStrength] = useState(1)
  const [frequency, setFrequency] = useState(1) // GHz
  const [fanout, setFanout] = useState(2)
  const [badMode, setBadMode] = useState(false)
  const [baseline, setBaseline] = useState<ClockBaseline | null>(null)

  const tree = useMemo(() => buildTree(ffCount, fanout, bufStrength, badMode), [ffCount, fanout, bufStrength, badMode])

  // compute arrival times simple model: source 0, each buffer adds delay (its delay), wire adds small per level
  const arrivalTimes = useMemo(() => {
    const times: Record<string, number> = {}
    function dfs(id: string, t = 0) {
      const node = tree[id]
      const myDelay = node?.delay ?? 0
      const newT = t + myDelay + 0.02 * node.level
      times[id] = newT
      for (const c of node.children) dfs(c, newT)
    }
    const root = Object.values(tree).find((n) => n.type === 'source')
    if (root) dfs(root.id, 0)
    return times
  }, [tree])

  const ffIds = useMemo(() => Object.values(tree).filter((n) => n.type === 'ff').map((n) => n.id), [tree])

  const insertionDelay = useMemo(() => Math.max(...Object.values(arrivalTimes)), [arrivalTimes])
  const maxDelay = useMemo(() => Math.max(...ffIds.map((id) => arrivalTimes[id] ?? 0)), [ffIds, arrivalTimes])
  const minDelay = useMemo(() => Math.min(...ffIds.map((id) => arrivalTimes[id] ?? 0)), [ffIds, arrivalTimes])
  const skew = useMemo(() => maxDelay - minDelay, [maxDelay, minDelay])
  const currentFanout = useMemo(
    () => ffIds.length > 0 ? (ffCount / (Object.values(tree).filter((n) => n.type === 'buffer').length || 1)) : 0,
    [ffCount, tree, ffIds],
  )

  useEffect(() => {
    if (typeof onClockChange === 'function') {
      onClockChange({ insertionDelay, maxDelay, minDelay, skew, fanout: Math.round(currentFanout) })
    }
  }, [insertionDelay, maxDelay, minDelay, skew, currentFanout, onClockChange])

  function reset() {
    setFfCount(4); setBufStrength(1); setFrequency(1); setFanout(2); setBadMode(false); setBaseline(null)
  }

  function createBad() {
    setBadMode(true)
    setBaseline({
      tree: JSON.parse(JSON.stringify(tree)),
      metrics: { insertionDelay, maxDelay, minDelay, skew, fanout: Math.round(currentFanout) },
    })
  }

  function optimize() {
    // naive optimizer: increase buffer strength and balance fanout
    setBufStrength((s) => Math.max(1, s - 0.5))
    setFanout((f) => Math.max(1, Math.floor(f)))
    setBadMode(false)
  }

  return (
    <div className="cts-scene">
      <div className="cts-controls">
        <label>Flip-flops: <input type="range" min={2} max={16} value={ffCount} onChange={(e: ChangeEvent<HTMLInputElement>) => setFfCount(Number(e.target.value))} /> {ffCount}</label>
        <label>Buffer strength: <input type="range" min={0.5} max={3} step={0.5} value={bufStrength} onChange={(e: ChangeEvent<HTMLInputElement>) => setBufStrength(Number(e.target.value))} /> {bufStrength}</label>
        <label>Frequency (GHz): <input type="range" min={0.5} max={3} step={0.1} value={frequency} onChange={(e: ChangeEvent<HTMLInputElement>) => setFrequency(Number(e.target.value))} /> {frequency} GHz</label>
        <label>Branch fanout: <input type="range" min={1} max={4} value={fanout} onChange={(e: ChangeEvent<HTMLInputElement>) => setFanout(Number(e.target.value))} /> {fanout}</label>

        <div className="cts-buttons">
          <button className="button" onClick={reset}>Reset</button>
          <button className="button warning" onClick={createBad}>Create Bad Clock Tree</button>
          <button className="button secondary" onClick={optimize}>Optimize Clock Tree</button>
          <label style={{ marginLeft: 8 }}><input type="checkbox" checked={baseline !== null} onChange={(e) => setBaseline(e.target.checked ? (baseline ?? {
            tree: JSON.parse(JSON.stringify(tree)),
            metrics: { insertionDelay, maxDelay, minDelay, skew, fanout: Math.round(currentFanout) },
          }) : null)} /> Compare Before/After</label>
        </div>
      </div>

      <div className="cts-visual">
        <svg width={640} height={240} viewBox="0 0 640 240">
          {/* simple layout: place source left, then buffers, then FFs */}
          {Object.values(tree).map((n) => {
            const x = 40 + n.level * 140
            // spread by index among siblings
            const siblingIndex = n.parent ? tree[n.parent].children.indexOf(n.id) : 0
            const siblingCount = n.parent ? tree[n.parent].children.length : 1
            const y = 40 + (siblingIndex + (n.level * 0.2)) * (180 / Math.max(1, siblingCount))
            return (
              <g key={n.id}>
                {n.type === 'source' && <circle cx={x} cy={y} r={18} fill="#ffd166" stroke="#b07b00" />}
                {n.type === 'buffer' && <rect x={x - 18} y={y - 12} width={36} height={24} rx={4} fill="#5f90ff" />}
                {n.type === 'ff' && <rect x={x - 12} y={y - 10} width={24} height={20} rx={3} fill="#06d6a0" />}
                <text x={x} y={y + 36} fontSize={10} textAnchor="middle">{n.id}</text>
              </g>
            )
          })}

          {/* links */}
          {Object.values(tree).flatMap((n) => n.children.map((c) => ({ from: n.id, to: c }))).map((link, i) => {
            const a = tree[link.from]
            const b = tree[link.to]
            const ax = 40 + a.level * 140
            const ay = 40 + (a.parent ? tree[a.parent].children.indexOf(a.id) : 0) * 40
            const bx = 40 + b.level * 140
            const by = 40 + (b.parent ? tree[b.parent].children.indexOf(b.id) : 0) * 40
            return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke="#333" strokeWidth={2} />
          })}
        </svg>

        <div className="cts-metrics">
          <div className="metric-card"><strong>{insertionDelay.toFixed(2)} ns</strong><span>Clock insertion delay</span></div>
          <div className="metric-card"><strong>{maxDelay.toFixed(2)} ns</strong><span>Max delay</span></div>
          <div className="metric-card"><strong>{minDelay.toFixed(2)} ns</strong><span>Min delay</span></div>
          <div className="metric-card"><strong>{skew.toFixed(3)} ns</strong><span>Skew</span></div>
          <div className="metric-card"><strong>{Math.round(currentFanout)}</strong><span>Fanout</span></div>
        </div>

        <div className="cts-explain">
          <div>What changed? {(badMode) ? 'Uneven buffering and fanout created larger skew and some branches are longer.' : 'Tree balanced or default.'}</div>
          <div>Why did skew increase? {skew > 0.2 ? 'Buffers and unequal branch lengths caused arrival differences.' : 'Branches are similar length.'}</div>
          <div>How did optimization improve it? {''}</div>
        </div>
      </div>
    </div>
  )
}
