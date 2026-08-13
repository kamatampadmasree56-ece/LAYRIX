import { useState, useMemo } from 'react'
import { LabHeader, type Mode } from './labs/LabHeader'
import { MetricCard } from './labs/MetricCard'
import { EquationBreakdown } from './labs/EquationBreakdown'
import { ChallengeCard, type Challenge } from './labs/ChallengeCard'

type FFType = 'D' | 'JK' | 'T'

type WaveformPoint = { t: number; clk: number; input1: number; input2: number; q: number; qbar: number }

function generateWaveform(history: { clk: number; input1: number; input2: number; q: number }[]): WaveformPoint[] {
  const pts: WaveformPoint[] = []
  const T = 40
  let q: 0 | 1 = 0

  history.forEach((item, cycle) => {
    const t0 = cycle * T
    const input1 = item.input1
    const input2 = item.input2

    pts.push({ t: t0, clk: 0, input1, input2, q, qbar: (q ^ 1) as 0 | 1 })
    pts.push({ t: t0 + T / 2, clk: 0, input1, input2, q, qbar: (q ^ 1) as 0 | 1 })
    pts.push({ t: t0 + T / 2, clk: 1, input1, input2, q, qbar: (q ^ 1) as 0 | 1 })

    q = item.q as 0 | 1
    pts.push({ t: t0 + T / 2 + 2, clk: 1, input1, input2, q, qbar: (q ^ 1) as 0 | 1 })
    pts.push({ t: t0 + T, clk: 1, input1, input2, q, qbar: (q ^ 1) as 0 | 1 })
    pts.push({ t: t0 + T, clk: 0, input1, input2, q, qbar: (q ^ 1) as 0 | 1 })
  })

  return pts
}

const ffChallenges: Challenge[] = [
  {
    id: 'ff-c1',
    title: 'Challenge 1: Predict D Flip-Flop Output',
    question: 'In a D Flip-Flop, if current Q = 0, Reset = 0, and D = 1, what will Q become after the next active clock edge?',
    options: ['0', '1', 'Metastable', 'Toggles to 0'],
    correctAnswer: '1',
    hint: 'D flip-flops directly capture D at the rising clock edge.',
    solution: 'Q becomes 1',
    explanation: 'On the rising clock edge, Q captures the value of D (which is 1).',
  },
  {
    id: 'ff-c2',
    title: 'Challenge 2: JK Flip-Flop Toggle Mode',
    question: 'For a JK Flip-Flop with current Q = 1, if J = 1 and K = 1 when the clock edge occurs, what is the new Q?',
    options: ['0', '1', 'Latch Hold (1)', 'Undefined'],
    correctAnswer: '0',
    hint: 'When J=1 and K=1, the JK Flip-Flop operates in TOGGLE mode.',
    solution: 'Q becomes 0',
    explanation: 'When J=1 and K=1, the output toggles. Since current Q was 1, it toggles to 0.',
  },
  {
    id: 'ff-c3',
    title: 'Challenge 3: T Flip-Flop Hold Mode',
    question: 'In a T Flip-Flop, if T = 0 when the clock rises, what happens to Q?',
    options: ['Q holds its current state', 'Q toggles to 0', 'Q sets to 1', 'Q resets to 0'],
    correctAnswer: 'Q holds its current state',
    hint: 'T=0 means NO toggle (Hold mode).',
    solution: 'Q holds current state',
    explanation: 'When T=0, the T flip-flop maintains its previous state (Hold).',
  },
]

export default function FlipFlopLab() {
  const [mode, setMode] = useState<Mode>('LEARNING')
  const [ffType, setFfType] = useState<FFType>('D')

  // Inputs
  const [inputVal1, setInputVal1] = useState<0 | 1>(1) // D or J or T
  const [inputVal2, setInputVal2] = useState<0 | 1>(0) // K for JK
  const [reset, setReset] = useState<boolean>(false)
  const [enable, setEnable] = useState<boolean>(true)

  // Outputs & History
  const [qState, setQState] = useState<0 | 1>(0)
  const [prevQState, setPrevQState] = useState<0 | 1>(0)
  const [history, setHistory] = useState<Array<{ clk: number; input1: number; input2: number; q: number }>>([
    { clk: 0, input1: 1, input2: 0, q: 0 },
  ])
  const [lastActionExplanation, setLastActionExplanation] = useState<string>(
    'Initial state: Q=0. Set inputs and click "Apply Clock Edge".'
  )

  const qBarState: 0 | 1 = (qState ^ 1) as 0 | 1

  const handleApplyClock = () => {
    setPrevQState(qState)
    let nextQ: 0 | 1 = qState
    let explanation = ''

    if (reset) {
      nextQ = 0
      explanation = 'RESET active → Q forced to 0 immediately.'
    } else if (!enable) {
      nextQ = qState
      explanation = 'ENABLE inactive → Clock edge ignored, Q holds previous state.'
    } else {
      if (ffType === 'D') {
        nextQ = inputVal1
        explanation = `D = ${inputVal1}: Q captures D on active clock edge → Q becomes ${nextQ}.`
      } else if (ffType === 'JK') {
        if (inputVal1 === 0 && inputVal2 === 0) {
          nextQ = qState
          explanation = 'J=0, K=0 → HOLD mode: Q maintains current state.'
        } else if (inputVal1 === 0 && inputVal2 === 1) {
          nextQ = 0
          explanation = 'J=0, K=1 → RESET mode: Q becomes 0.'
        } else if (inputVal1 === 1 && inputVal2 === 0) {
          nextQ = 1
          explanation = 'J=1, K=0 → SET mode: Q becomes 1.'
        } else {
          nextQ = (qState ^ 1) as 0 | 1
          explanation = `J=1, K=1 → TOGGLE mode: Q toggles from ${qState} to ${nextQ}.`
        }
      } else if (ffType === 'T') {
        if (inputVal1 === 0) {
          nextQ = qState
          explanation = 'T=0 → HOLD mode: Q maintains current state.'
        } else {
          nextQ = (qState ^ 1) as 0 | 1
          explanation = `T=1 → TOGGLE mode: Q toggles from ${qState} to ${nextQ}.`
        }
      }
    }

    setQState(nextQ)
    setLastActionExplanation(explanation)
    setHistory((prev) => [
      ...prev.slice(-5),
      { clk: 1, input1: inputVal1, input2: inputVal2, q: nextQ },
    ])
  }

  const handleResetLab = () => {
    setQState(0)
    setPrevQState(0)
    setInputVal1(1)
    setInputVal2(0)
    setReset(false)
    setEnable(true)
    setHistory([{ clk: 0, input1: 1, input2: 0, q: 0 }])
    setLastActionExplanation('Lab reset. Initial state: Q=0.')
  }

  const waveformPoints = useMemo(() => generateWaveform(history), [history])

  return (
    <section className="section flipflop-lab-section" id="flipflop-lab">
      <LabHeader
        title="Flip-Flop Learning & Simulation Lab"
        subtitle="Explore D, JK, and T Flip-Flops, clock edge sampling, waveforms, and setup/hold timing."
        icon="⚡"
        difficulty="Beginner"
        mode={mode}
        onModeChange={setMode}
        onReset={handleResetLab}
      />

      {/* FF Selector */}
      <div className="ff-type-selector-bar">
        <span className="eyebrow">Select Flip-Flop Topology:</span>
        <div className="ff-type-buttons">
          <button
            type="button"
            className={`button secondary ${ffType === 'D' ? 'active' : ''}`}
            onClick={() => { setFfType('D'); handleResetLab(); }}
          >
            [D] D Flip-Flop (Data)
          </button>
          <button
            type="button"
            className={`button secondary ${ffType === 'JK' ? 'active' : ''}`}
            onClick={() => { setFfType('JK'); handleResetLab(); }}
          >
            [JK] JK Flip-Flop (Set/Reset/Toggle)
          </button>
          <button
            type="button"
            className={`button secondary ${ffType === 'T' ? 'active' : ''}`}
            onClick={() => { setFfType('T'); handleResetLab(); }}
          >
            [T] T Flip-Flop (Toggle)
          </button>
        </div>
      </div>

      <div className="ff-lab-main-grid">
        {/* Left Column: Circuit & Controls */}
        <div className="ff-left-col">
          <div className="ff-circuit-card">
            <h4>Circuit Diagram & Live Pin States</h4>
            <div className="ff-svg-wrap">
              <svg viewBox="0 0 320 180" className="ff-svg">
                <rect x="100" y="40" width="120" height="100" rx="8" fill="#0B172A" stroke="#2563EB" strokeWidth="2" />
                <text x="160" y="95" textAnchor="middle" fill="#F8FAFC" fontSize="16" fontWeight="800">
                  {ffType}-FF
                </text>

                {/* Input 1 */}
                <line x1="20" y1="60" x2="100" y2="60" stroke={inputVal1 ? '#2563EB' : '#475569'} strokeWidth="2" />
                <circle cx="20" cy="60" r="10" fill={inputVal1 ? '#2563EB' : '#334155'} />
                <text x="20" y="64" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{inputVal1}</text>
                <text x="10" y="46" fill="#F8FAFC" fontSize="11" fontWeight="700">{ffType === 'JK' ? 'J' : ffType === 'T' ? 'T' : 'D'}</text>

                {/* Input 2 (JK only) */}
                {ffType === 'JK' && (
                  <>
                    <line x1="20" y1="120" x2="100" y2="120" stroke={inputVal2 ? '#2563EB' : '#475569'} strokeWidth="2" />
                    <circle cx="20" cy="120" r="10" fill={inputVal2 ? '#2563EB' : '#334155'} />
                    <text x="20" y="124" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{inputVal2}</text>
                    <text x="10" y="138" fill="#F8FAFC" fontSize="11" fontWeight="700">K</text>
                  </>
                )}

                {/* CLK */}
                <path d="M 100 85 L 112 90 L 100 95" fill="none" stroke="#94A3B8" strokeWidth="2" />
                <line x1="20" y1="90" x2="100" y2="90" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3,2" />
                <text x="10" y="94" fill="#94A3B8" fontSize="9" fontWeight="700">CLK</text>

                {/* Output Q */}
                <line x1="220" y1="60" x2="300" y2="60" stroke={qState ? '#22C55E' : '#475569'} strokeWidth="2" />
                <circle cx="300" cy="60" r="10" fill={qState ? '#22C55E' : '#334155'} />
                <text x="300" y="64" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{qState}</text>
                <text x="310" y="64" fill="#F8FAFC" fontSize="11" fontWeight="700">Q</text>

                {/* Output Qbar */}
                <line x1="220" y1="120" x2="300" y2="120" stroke={qBarState ? '#EF4444' : '#475569'} strokeWidth="2" />
                <circle cx="300" cy="120" r="10" fill={qBarState ? '#EF4444' : '#334155'} />
                <text x="300" y="124" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{qBarState}</text>
                <text x="310" y="124" fill="#F8FAFC" fontSize="11" fontWeight="700">Q̄</text>
              </svg>
            </div>
          </div>

          <div className="ff-controls-card">
            <h4>Signal Controls</h4>
            <div className="ff-inputs-row">
              {/* Primary Input */}
              <div className="ff-ctrl-group">
                <span className="ctrl-label">{ffType === 'JK' ? 'J Input' : ffType === 'T' ? 'T Input' : 'D Input'}</span>
                <div className="btn-group">
                  <button type="button" className={`button small ${inputVal1 === 0 ? 'secondary active' : 'secondary'}`} onClick={() => setInputVal1(0)}>0</button>
                  <button type="button" className={`button small ${inputVal1 === 1 ? 'primary' : 'secondary'}`} onClick={() => setInputVal1(1)}>1</button>
                </div>
              </div>

              {/* Secondary Input for JK */}
              {ffType === 'JK' && (
                <div className="ff-ctrl-group">
                  <span className="ctrl-label">K Input</span>
                  <div className="btn-group">
                    <button type="button" className={`button small ${inputVal2 === 0 ? 'secondary active' : 'secondary'}`} onClick={() => setInputVal2(0)}>0</button>
                    <button type="button" className={`button small ${inputVal2 === 1 ? 'primary' : 'secondary'}`} onClick={() => setInputVal2(1)}>1</button>
                  </div>
                </div>
              )}

              {/* Enable Toggle */}
              <div className="ff-ctrl-group">
                <span className="ctrl-label">Enable</span>
                <button type="button" className={`button small ${enable ? 'success' : 'secondary'}`} onClick={() => setEnable(!enable)}>
                  {enable ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* Reset Toggle */}
              <div className="ff-ctrl-group">
                <span className="ctrl-label">Reset (Async)</span>
                <button type="button" className={`button small ${reset ? 'danger' : 'secondary'}`} onClick={() => setReset(!reset)}>
                  {reset ? 'RESET HIGH' : 'RESET LOW'}
                </button>
              </div>
            </div>

            <div className="ff-action-bar">
              <button type="button" className="button primary large-btn" onClick={handleApplyClock}>
                ⚡ Apply Clock Rising Edge
              </button>
            </div>

            <div className="ff-action-explanation">
              <strong>Step Explanation:</strong> {lastActionExplanation}
            </div>
          </div>
        </div>

        {/* Right Column: Metrics & Waveform */}
        <div className="ff-right-col">
          <div className="ff-metrics-grid">
            <MetricCard label="Current State Q" value={qState} status={qState ? 'good' : 'neutral'} />
            <MetricCard label="Complement Q̄" value={qBarState} status={qBarState ? 'danger' : 'neutral'} />
            <MetricCard label="Previous Q" value={prevQState} status="neutral" />
            <MetricCard label="Active Topology" value={`${ffType}-FF`} status="good" />
          </div>

          <div className="ff-waveform-card">
            <h4>Live Waveform Generator</h4>
            <div className="waveform-box">
              <svg viewBox="0 0 320 120" className="waveform-svg">
                {/* Draw CLK, Input1, Q */}
                <text x="5" y="25" fill="#94A3B8" fontSize="10">CLK</text>
                <text x="5" y="65" fill="#38BDF8" fontSize="10">{ffType === 'JK' ? 'J' : ffType === 'T' ? 'T' : 'D'}</text>
                <text x="5" y="105" fill="#4ADE80" fontSize="10">Q</text>
                {waveformPoints.map((p, i) => {
                  const x = (p.t / 240) * 300 + 35
                  return (
                    <g key={i}>
                      {i > 0 && (
                        <>
                          {/* CLK */}
                          <line
                            x1={(waveformPoints[i - 1].t / 240) * 300 + 35}
                            y1={waveformPoints[i - 1].clk ? 15 : 30}
                            x2={x}
                            y2={p.clk ? 15 : 30}
                            stroke="#94A3B8" strokeWidth="1.5"
                          />
                          {/* Input */}
                          <line
                            x1={(waveformPoints[i - 1].t / 240) * 300 + 35}
                            y1={waveformPoints[i - 1].input1 ? 55 : 70}
                            x2={x}
                            y2={p.input1 ? 55 : 70}
                            stroke="#38BDF8" strokeWidth="1.5"
                          />
                          {/* Q */}
                          <line
                            x1={(waveformPoints[i - 1].t / 240) * 300 + 35}
                            y1={waveformPoints[i - 1].q ? 95 : 110}
                            x2={x}
                            y2={p.q ? 95 : 110}
                            stroke="#4ADE80" strokeWidth="2"
                          />
                        </>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Mode-specific explanations */}
          {mode === 'ENGINEERING' ? (
            <EquationBreakdown
              title="Setup & Hold Timing Checks"
              formula="t_CQ + t_logic + t_wire ≤ T_clk − t_su"
              variables={[
                { symbol: 't_su', name: 'Setup Time', value: 0.05, unit: 'ns' },
                { symbol: 't_h', name: 'Hold Time', value: 0.02, unit: 'ns' },
                { symbol: 't_CQ', name: 'Clock-to-Q Delay', value: 0.15, unit: 'ns' },
                { symbol: 'T_clk', name: 'Clock Period', value: 2.0, unit: 'ns' },
              ]}
              substitution="DAT = 0.15 + 1.25 + 0.10 = 1.50ns, DRT = 2.00 − 0.05 = 1.95ns"
              calculation="Setup Slack = DRT − DAT = 1.95ns − 1.50ns"
              result="+0.45 ns (Timing PASS ✓)"
              physicalMeaning="Setup time requires data to settle BEFORE the clock edge. Hold time requires data to remain stable AFTER the clock edge. Violations cause metastability."
            />
          ) : (
            <div className="learning-panel-box">
              <h4>🎓 What Did I Learn?</h4>
              <ul>
                <li><strong>Edge Triggering:</strong> Flip-flops update output ONLY on the rising/falling clock edge.</li>
                <li><strong>D Flip-Flop:</strong> Q takes D value directly on clock edge.</li>
                <li><strong>JK Flip-Flop:</strong> J=0,K=0 (Hold), J=0,K=1 (Reset), J=1,K=0 (Set), J=1,K=1 (Toggle).</li>
                <li><strong>T Flip-Flop:</strong> T=0 (Hold), T=1 (Toggle).</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Lab Challenges */}
      <ChallengeCard labId="flipflop" challenges={ffChallenges} />
    </section>
  )
}
