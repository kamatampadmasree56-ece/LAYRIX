import { useMemo, useState } from 'react'

type WaveformPoint = { t: number; clk: number; d: number; q: number; qbar: number }

function generateWaveform(dValues: (0 | 1)[], resetAt: number): WaveformPoint[] {
  const pts: WaveformPoint[] = []
  let q: 0 | 1 = 0
  const T = 40 // clock period in px units

  for (let cycle = 0; cycle < dValues.length; cycle++) {
    const t0 = cycle * T
    const d = dValues[cycle]
    const rst = cycle === resetAt ? 1 : 0

    // Before clock edge — current state
    pts.push({ t: t0, clk: 0, d, q, qbar: (q ^ 1) as 0 | 1 })
    pts.push({ t: t0 + T / 2, clk: 0, d, q, qbar: (q ^ 1) as 0 | 1 })
    pts.push({ t: t0 + T / 2, clk: 1, d, q, qbar: (q ^ 1) as 0 | 1 })

    // After clock edge — capture D (or reset)
    const newQ: 0 | 1 = rst ? 0 : d
    q = newQ
    pts.push({ t: t0 + T / 2 + 2, clk: 1, d, q, qbar: (q ^ 1) as 0 | 1 })
    pts.push({ t: t0 + T, clk: 1, d, q, qbar: (q ^ 1) as 0 | 1 })
    pts.push({ t: t0 + T, clk: 0, d, q, qbar: (q ^ 1) as 0 | 1 })
  }
  return pts
}

function WaveformDisplay({ points, width }: { points: WaveformPoint[]; width: number }) {
  const H = 30
  const gap = 18
  const rows = [
    { label: 'CLK', key: 'clk' as keyof WaveformPoint, color: '#94A3B8' },
    { label: 'D', key: 'd' as keyof WaveformPoint, color: '#2563EB' },
    { label: 'Q', key: 'q' as keyof WaveformPoint, color: '#22C55E' },
    { label: 'Q̄', key: 'qbar' as keyof WaveformPoint, color: '#EF4444' },
  ]
  const totalH = rows.length * (H + gap) + 16

  const toPath = (key: keyof WaveformPoint) => {
    return points.map((p, i) => {
      const x = (p.t / 240) * width
      const yVal = (p[key] as number) === 1 ? 4 : H - 4
      return `${i === 0 ? 'M' : 'L'} ${x} ${yVal}`
    }).join(' ')
  }

  return (
    <svg viewBox={`0 0 ${width} ${totalH}`} className="waveform-svg" aria-label="Flip-flop timing waveform">
      {rows.map((row, ri) => {
        const yBase = ri * (H + gap)
        return (
          <g key={row.key} transform={`translate(0,${yBase})`}>
            <text x="2" y={H / 2 + 4} fontSize="10" fill="#94A3B8" fontFamily="JetBrains Mono, monospace">{row.label}</text>
            <path
              d={toPath(row.key)}
              stroke={row.color}
              strokeWidth="2"
              fill="none"
              transform="translate(36,0)"
            />
          </g>
        )
      })}
    </svg>
  )
}

type TimingStep = {
  clock: string
  d: number | string
  q: number | string
  qbar: number | string
  explanation: string
}

export default function FlipFlopLab() {
  const [dInput, setDInput] = useState<0 | 1>(0)
  const [resetPressed, setResetPressed] = useState(false)
  const [dHistory, setDHistory] = useState<(0 | 1)[]>([0, 0, 0, 0, 0])
  const [qHistory, setQHistory] = useState<(0 | 1)[]>([0])
  const [stepCount, setStepCount] = useState(0)
  const [resetAtCycle, setResetAtCycle] = useState<number>(-1)
  const [showSetupHold, setShowSetupHold] = useState(false)

  const currentQ: 0 | 1 = qHistory[qHistory.length - 1] ?? 0
  const currentQbar: 0 | 1 = (currentQ ^ 1) as 0 | 1

  const applyClockEdge = () => {
    const newQ: 0 | 1 = resetPressed ? 0 : dInput
    setQHistory((prev) => [...prev, newQ])
    setDHistory((prev) => [...prev.slice(-4), dInput])
    setStepCount((s) => s + 1)
    setResetAtCycle(-1)
  }

  const applyReset = () => {
    setResetPressed(true)
    setResetAtCycle(dHistory.length)
    setQHistory((prev) => [...prev, 0])
    setDHistory((prev) => [...prev.slice(-4), dInput])
    setTimeout(() => setResetPressed(false), 500)
  }

  const handleReset = () => {
    setDInput(0)
    setResetPressed(false)
    setDHistory([0, 0, 0, 0, 0])
    setQHistory([0])
    setStepCount(0)
    setResetAtCycle(-1)
  }

  const waveformData = useMemo(() =>
    generateWaveform(dHistory.slice(-6), resetAtCycle === -1 ? 99 : Math.max(0, dHistory.length - resetAtCycle - 1)),
    [dHistory, resetAtCycle],
  )

  const timingSteps: TimingStep[] = [
    { clock: '↑ edge 1', d: dHistory[0] ?? 0, q: qHistory[1] ?? 0, qbar: (qHistory[1] ?? 0) ^ 1, explanation: `Q captured D=${dHistory[0] ?? 0} on rising clock edge.` },
    { clock: '↑ edge 2', d: dHistory[1] ?? 0, q: qHistory[2] ?? 0, qbar: (qHistory[2] ?? 0) ^ 1, explanation: `Q captured D=${dHistory[1] ?? 0} on rising clock edge.` },
    { clock: '↑ edge 3', d: dHistory[2] ?? 0, q: qHistory[3] ?? 0, qbar: (qHistory[3] ?? 0) ^ 1, explanation: `Q captured D=${dHistory[2] ?? 0} on rising clock edge.` },
  ]

  return (
    <section className="section flipflop-lab-section" id="flipflop-lab">
      <div className="section-heading">
        <p className="section-eyebrow">Interactive Lab</p>
        <h2>D Flip-Flop Lab — Timing & Behavior</h2>
        <p className="section-description">
          Simulate a D flip-flop. Set D input, trigger clock edges, observe Q and Q̄. Watch the timing waveform update in real time.
        </p>
      </div>

      <div className="ff-lab-grid">
        <div className="ff-controls-panel">
          <div className="ff-circuit-display">
            <div className="ff-circuit-svg-wrap">
              <svg viewBox="0 0 280 160" className="ff-circuit-svg" aria-label="D flip-flop circuit">
                {/* FF body */}
                <rect x="90" y="40" width="100" height="80" rx="8" fill="#0B172A" stroke="#2563EB" strokeWidth="2"/>
                <text x="140" y="85" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="700">D-FF</text>
                {/* Labels inside */}
                <text x="100" y="65" fill="#94A3B8" fontSize="10">D</text>
                <text x="100" y="105" fill="#94A3B8" fontSize="10">CLK</text>
                <text x="175" y="65" textAnchor="end" fill="#94A3B8" fontSize="10">Q</text>
                <text x="175" y="105" textAnchor="end" fill="#94A3B8" fontSize="10">Q̄</text>
                {/* D input wire */}
                <line x1="20" y1="60" x2="90" y2="60" stroke={dInput ? '#2563EB' : '#1E3A8A'} strokeWidth="2"/>
                <text x="12" y="64" fill="#F8FAFC" fontSize="11" fontWeight="600">D</text>
                <circle cx="20" cy="60" r="10" fill={dInput ? '#2563EB' : '#1E3A8A'} />
                <text x="20" y="64" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{dInput}</text>
                {/* CLK wire */}
                <line x1="20" y1="100" x2="90" y2="100" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4,2"/>
                <text x="8" y="104" fill="#94A3B8" fontSize="9">CLK</text>
                {/* Q output wire */}
                <line x1="190" y1="60" x2="260" y2="60" stroke={currentQ ? '#22C55E' : '#1E3A8A'} strokeWidth="2"/>
                <circle cx="260" cy="60" r="10" fill={currentQ ? '#22C55E' : '#1E3A8A'} />
                <text x="260" y="64" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{currentQ}</text>
                <text x="270" y="64" fill="#F8FAFC" fontSize="11" fontWeight="600">Q</text>
                {/* Qbar output wire */}
                <line x1="190" y1="100" x2="260" y2="100" stroke={currentQbar ? '#EF4444' : '#1E3A8A'} strokeWidth="2"/>
                <circle cx="260" cy="100" r="10" fill={currentQbar ? '#EF4444' : '#1E3A8A'} />
                <text x="260" y="104" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{currentQbar}</text>
                <text x="272" y="104" fill="#F8FAFC" fontSize="11" fontWeight="600">Q̄</text>
              </svg>
            </div>

            <div className="ff-state-display">
              <div className="ff-state-item">
                <span className="ff-state-label">Current Q</span>
                <div className={`ff-state-value ${currentQ ? 'high' : 'low'}`}>{currentQ}</div>
              </div>
              <div className="ff-state-item">
                <span className="ff-state-label">Q̄</span>
                <div className={`ff-state-value ${currentQbar ? 'high' : 'low'}`}>{currentQbar}</div>
              </div>
              <div className="ff-state-item">
                <span className="ff-state-label">D Input</span>
                <div className={`ff-state-value ${dInput ? 'high' : 'low'}`}>{dInput}</div>
              </div>
              <div className="ff-state-item">
                <span className="ff-state-label">Cycles</span>
                <div className="ff-state-value neutral">{stepCount}</div>
              </div>
            </div>
          </div>

          <div className="ff-buttons-panel">
            <div className="ff-input-group">
              <span className="ff-label">Set D Input</span>
              <div className="ff-toggle-row">
                <button type="button" className={`ff-toggle ${dInput === 0 ? 'active-low' : ''}`} onClick={() => setDInput(0)}>D = 0</button>
                <button type="button" className={`ff-toggle ${dInput === 1 ? 'active-high' : ''}`} onClick={() => setDInput(1)}>D = 1</button>
              </div>
            </div>

            <div className="ff-input-group">
              <span className="ff-label">Clock Control</span>
              <div className="ff-clock-buttons">
                <button type="button" className="button primary" onClick={applyClockEdge} id="ff-clock-btn">
                  ↑ Rising Edge
                </button>
                <button type="button" className="button warning" onClick={applyReset} id="ff-reset-btn">
                  RST
                </button>
                <button type="button" className="button secondary" onClick={handleReset} id="ff-clear-btn">
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="ff-explanation">
            <h4>What Just Happened?</h4>
            <p>
              The D flip-flop samples input D at the <strong>rising clock edge</strong>. At that instant, Q takes the value of D.
              Between clock edges, Q holds its value — D changes have no effect until the next rising edge.
            </p>
            <p>
              Q̄ is always the complement of Q. When Q=1, Q̄=0 and vice versa.
            </p>
            {resetPressed && (
              <p className="reset-note">⚡ RESET applied — Q forced to 0 regardless of D.</p>
            )}
          </div>
        </div>

        <div className="ff-waveform-panel">
          <h4>Timing Waveform</h4>
          <div className="waveform-container">
            <WaveformDisplay points={waveformData} width={360} />
          </div>

          <div className="ff-timing-table">
            <h4>Clock Edge History</h4>
            <table className="truth-table">
              <thead>
                <tr><th>Clock Edge</th><th>D</th><th>Q (before)</th><th>Q (after)</th><th>Explanation</th></tr>
              </thead>
              <tbody>
                {timingSteps.map((step, i) => (
                  <tr key={i}>
                    <td>{step.clock}</td>
                    <td className={step.d ? 'high-cell' : 'low-cell'}>{step.d}</td>
                    <td>{i > 0 ? timingSteps[i - 1].q : 0}</td>
                    <td className={step.q ? 'high-cell' : 'low-cell'}>{step.q}</td>
                    <td>{step.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            className="notes-toggle-btn"
            onClick={() => setShowSetupHold(!showSetupHold)}
          >
            {showSetupHold ? '▲ Hide' : '▼ Show'} Setup & Hold Time Explanation
          </button>

          {showSetupHold && (
            <div className="setup-hold-explainer">
              <h4>Setup Time & Hold Time</h4>
              <div className="timing-diagram-text">
                <div className="timing-row">
                  <span className="timing-label">CLK:</span>
                  <span className="timing-bar clk-bar">___|‾‾‾|___</span>
                </div>
                <div className="timing-row">
                  <span className="timing-label">D:</span>
                  <span className="timing-bar d-bar">must be stable: [←tsu→↑←th→]</span>
                </div>
              </div>
              <div className="setup-hold-table">
                <div className="sh-row">
                  <div className="sh-name">Setup Time (tsu)</div>
                  <div className="sh-desc">D must be stable BEFORE the clock edge by at least tsu. Typical: 30–100ps in 28nm.</div>
                  <div className="sh-violation">Violation: D changes too close to clock → Q may capture wrong value.</div>
                </div>
                <div className="sh-row">
                  <div className="sh-name">Hold Time (th)</div>
                  <div className="sh-desc">D must remain stable AFTER the clock edge by at least th. Typical: 10–50ps.</div>
                  <div className="sh-violation">Violation: D changes too soon after clock → metastability or wrong capture.</div>
                </div>
                <div className="sh-row">
                  <div className="sh-name">Clock-to-Q (tCQ)</div>
                  <div className="sh-desc">Time from clock edge to Q becoming valid. Typical: 100–200ps. Contributes to path delay.</div>
                  <div className="sh-violation">This delay is the starting point for all STA data arrival time calculations.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
