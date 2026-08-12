import { useState } from 'react'

type Obj = { id: string; x: number; y: number; w: number; h: number; layer: number; violation?: string }

export default function PhysicalVerificationLab() {
  const [objects, setObjects] = useState<Obj[]>(() => [
    { id: 'cell1', x: 40, y: 40, w: 50, h: 24, layer: 1 },
    { id: 'via1', x: 160, y: 90, w: 8, h: 8, layer: 2 },
    { id: 'metal1', x: 240, y: 50, w: 120, h: 8, layer: 1 },
  ])
  const [errors, setErrors] = useState<{ id: string; type: string }[]>([])

  function reset() { setObjects([{ id: 'cell1', x: 40, y: 40, w: 50, h: 24, layer: 1 }, { id: 'via1', x: 160, y: 90, w: 8, h: 8, layer: 2 }, { id: 'metal1', x: 240, y: 50, w: 120, h: 8, layer: 1 }]); setErrors([]) }

  function createDrcErrors() {
    // introduce a spacing violation by adding an overlapping metal
    setObjects((prev) => [...prev, { id: `metal_bad_${prev.length}`, x: 250, y: 52, w: 60, h: 8, layer: 1, violation: 'spacing' }])
  }

  function runDrc() {
    const found: { id: string; type: string }[] = []
    // simple checks
    for (const o of objects) {
      if (o.violation) found.push({ id: o.id, type: o.violation })
      if (o.w < 6) found.push({ id: o.id, type: 'width' })
    }
    setErrors(found)
  }

  function autoFix() {
    setObjects((prev) => prev.map((o) => ({ ...o, violation: undefined, w: Math.max(o.w, 8) })))
    setErrors([])
  }

  const drcCount = errors.length
  const warnings = objects.filter((o) => !o.violation && o.w < 10).length
  const passed = objects.length - drcCount

  return (
    <div className="pv-scene">
      <div className="pv-controls">
        <div className="pv-buttons">
          <button className="button" onClick={reset}>Reset</button>
          <button className="button warning" onClick={createDrcErrors}>Create DRC Errors</button>
          <button className="button secondary" onClick={runDrc}>Run DRC</button>
          <button className="button" onClick={autoFix}>Auto Fix Simple Errors</button>
        </div>

        <div className="pv-metrics">
          <div className="metric-card"><strong>{drcCount}</strong><span>DRC Errors</span></div>
          <div className="metric-card"><strong>{warnings}</strong><span>Warnings</span></div>
          <div className="metric-card"><strong>{passed}</strong><span>Passed</span></div>
        </div>
      </div>

      <div className="pv-board" style={{ width: 640, height: 320, position: 'relative', background: '#0b0b0b', border: '1px solid #222' }}>
        {objects.map((o) => (
          <div key={o.id} style={{ position: 'absolute', left: o.x, top: o.y, width: o.w, height: o.h, background: o.violation ? 'rgba(255,96,96,0.6)' : '#444', border: '1px solid #666' }}>
            {o.layer === 2 && <div style={{ position: 'absolute', right: 2, top: 2, fontSize: 10, color: '#fff' }}>VIA</div>}
          </div>
        ))}

        {/* highlight errors */}
        {errors.map((e, index) => (
          <div key={`err-${e.id}`} style={{ position: 'absolute', left: 480, top: 20 + index * 40, color: '#ff6b6b' }}>{e.id}: {e.type}</div>
        ))}
      </div>

      <div className="pv-explain">
        <div>When a DRC error is created, it is highlighted on the layout. Auto-fix will correct simple spacing/width issues.</div>
      </div>
    </div>
  )
}
