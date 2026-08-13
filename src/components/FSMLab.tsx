import { useState } from 'react'
import { LabHeader, type Mode } from './labs/LabHeader'
import { MetricCard } from './labs/MetricCard'
import { EquationBreakdown } from './labs/EquationBreakdown'
import { ChallengeCard, type Challenge } from './labs/ChallengeCard'

type FSMType = 'MOORE' | 'MEALY'

type StateDef = {
  id: string
  name: string
  mooreOutput: string
  x: number
  y: number
}

type TransitionDef = {
  from: string
  to: string
  input: string
  mealyOutput?: string
  label: string
}

type FSMExample = {
  id: string
  name: string
  type: FSMType
  description: string
  states: StateDef[]
  transitions: TransitionDef[]
  initialState: string
  inputs: string[]
  verilogCode: string
}

const fsmExamples: FSMExample[] = [
  {
    id: 'traffic-light',
    name: 'Traffic Light Controller (Moore FSM)',
    type: 'MOORE',
    description: 'Moore FSM where output depends ONLY on the current state (RED, GREEN, YELLOW).',
    initialState: 'RED',
    inputs: ['TIMER_EXP=0', 'TIMER_EXP=1'],
    states: [
      { id: 'RED', name: 'RED', mooreOutput: 'RED_LIGHT=1', x: 70, y: 100 },
      { id: 'GREEN', name: 'GREEN', mooreOutput: 'GREEN_LIGHT=1', x: 230, y: 50 },
      { id: 'YELLOW', name: 'YELLOW', mooreOutput: 'YELLOW_LIGHT=1', x: 230, y: 150 },
    ],
    transitions: [
      { from: 'RED', to: 'GREEN', input: '1', label: 'timer=1' },
      { from: 'RED', to: 'RED', input: '0', label: 'timer=0' },
      { from: 'GREEN', to: 'YELLOW', input: '1', label: 'timer=1' },
      { from: 'GREEN', to: 'GREEN', input: '0', label: 'timer=0' },
      { from: 'YELLOW', to: 'RED', input: '1', label: 'timer=1' },
      { from: 'YELLOW', to: 'YELLOW', input: '0', label: 'timer=0' },
    ],
    verilogCode: `// Moore FSM: Output depends ONLY on current state
typedef enum logic [1:0] {RED, GREEN, YELLOW} state_t;
state_t state, next_state;

always_ff @(posedge clk or posedge rst) begin
  if (rst) state <= RED;
  else     state <= next_state;
end

always_comb begin
  next_state = state;
  case (state)
    RED:    if (timer_exp) next_state = GREEN;
    GREEN:  if (timer_exp) next_state = YELLOW;
    YELLOW: if (timer_exp) next_state = RED;
  endcase
end

// Output logic (pure Moore: state-only)
assign red_light    = (state == RED);
assign green_light  = (state == GREEN);
assign yellow_light = (state == YELLOW);`,
  },
  {
    id: 'seq-detector',
    name: 'Sequence Detector "1011" (Mealy FSM)',
    type: 'MEALY',
    description: 'Mealy FSM detecting sequence "1011". Output depends on state AND input.',
    initialState: 'S0',
    inputs: ['IN_BIT=0', 'IN_BIT=1'],
    states: [
      { id: 'S0', name: 'S0 (IDLE)', mooreOutput: 'DETECT=0', x: 50, y: 100 },
      { id: 'S1', name: 'S1 (Got 1)', mooreOutput: 'DETECT=0', x: 140, y: 50 },
      { id: 'S2', name: 'S2 (Got 10)', mooreOutput: 'DETECT=0', x: 230, y: 150 },
      { id: 'S3', name: 'S3 (Got 101)', mooreOutput: 'DETECT=0', x: 320, y: 100 },
    ],
    transitions: [
      { from: 'S0', to: 'S0', input: '0', mealyOutput: '0', label: '0/0' },
      { from: 'S0', to: 'S1', input: '1', mealyOutput: '0', label: '1/0' },
      { from: 'S1', to: 'S2', input: '0', mealyOutput: '0', label: '0/0' },
      { from: 'S1', to: 'S1', input: '1', mealyOutput: '0', label: '1/0' },
      { from: 'S2', to: 'S0', input: '0', mealyOutput: '0', label: '0/0' },
      { from: 'S2', to: 'S3', input: '1', mealyOutput: '0', label: '1/0' },
      { from: 'S3', to: 'S2', input: '0', mealyOutput: '0', label: '0/0' },
      { from: 'S3', to: 'S1', input: '1', mealyOutput: '1', label: '1/1 (FOUND!)' },
    ],
    verilogCode: `// Mealy FSM: Output depends on state AND input
typedef enum logic [1:0] {S0, S1, S2, S3} state_t;
state_t state, next_state;

always_ff @(posedge clk or posedge rst) begin
  if (rst) state <= S0;
  else     state <= next_state;
end

always_comb begin
  next_state = state;
  detect = 0; // Mealy output
  case (state)
    S0: next_state = in_bit ? S1 : S0;
    S1: next_state = in_bit ? S1 : S2;
    S2: next_state = in_bit ? S3 : S0;
    S3: begin
      if (in_bit) begin
        next_state = S1;
        detect = 1; // 1011 detected!
      end else begin
        next_state = S2;
      end
    end
  endcase
end`,
  },
]

const fsmChallenges: Challenge[] = [
  {
    id: 'fsm-c1',
    title: 'Challenge 1: Traffic Light State Transition',
    question: 'In the Traffic Light Moore FSM, if current state is GREEN and timer_exp = 1, what will be the next state on the next clock edge?',
    options: ['RED', 'YELLOW', 'GREEN', 'EMERGENCY'],
    correctAnswer: 'YELLOW',
    hint: 'GREEN transitions to YELLOW when timer_exp = 1.',
    solution: 'Next State = YELLOW',
    explanation: 'When in state GREEN with timer_exp=1, the next state is YELLOW.',
  },
  {
    id: 'fsm-c2',
    title: 'Challenge 2: Moore vs Mealy Output Timing',
    question: 'Why do Moore FSM outputs have fewer glitches than Mealy FSM outputs?',
    options: [
      'Moore outputs depend ONLY on the registered state, whereas Mealy outputs depend directly on inputs.',
      'Mealy FSMs use more flip-flops than Moore FSMs.',
      'Moore FSMs do not require clock signals.',
      'Mealy FSMs are synchronous while Moore FSMs are asynchronous.',
    ],
    correctAnswer: 'Moore outputs depend ONLY on the registered state, whereas Mealy outputs depend directly on inputs.',
    hint: 'Mealy output equation includes combinational input signals which can glitch.',
    solution: 'Moore outputs depend ONLY on state',
    explanation: 'Because Moore outputs depend only on the state register, they switch cleanly at clock edges without combinational glitches.',
  },
  {
    id: 'fsm-c3',
    title: 'Challenge 3: Binary vs One-Hot Encoding',
    question: 'How many flip-flops are needed to encode a 4-state FSM using One-Hot encoding?',
    options: ['2', '4', '8', '16'],
    correctAnswer: '4',
    hint: 'One-Hot encoding uses 1 flip-flop per state.',
    solution: '4 flip-flops',
    explanation: 'One-hot encoding uses N flip-flops for N states (so 4 states = 4 flip-flops). Binary encoding would use ⌈log₂(4)⌉ = 2 flip-flops.',
  },
]

export default function FSMLab() {
  const [mode, setMode] = useState<Mode>('LEARNING')
  const [selectedExampleId, setSelectedExampleId] = useState<string>('traffic-light')
  const [currentStateId, setCurrentStateId] = useState<string>('RED')
  const [selectedInputVal, setSelectedInputVal] = useState<string>('0')
  const [lastOutput, setLastOutput] = useState<string>('RED_LIGHT=1')
  const [history, setHistory] = useState<Array<{ state: string; input: string; nextState: string; output: string }>>([])

  const currentExample = fsmExamples.find((ex) => ex.id === selectedExampleId) || fsmExamples[0]
  const currentState = currentExample.states.find((s) => s.id === currentStateId)

  const handleSelectExample = (id: string) => {
    const ex = fsmExamples.find((e) => e.id === id) || fsmExamples[0]
    setSelectedExampleId(id)
    setCurrentStateId(ex.initialState)
    setSelectedInputVal('0')
    setLastOutput(ex.type === 'MOORE' ? ex.states.find((s) => s.id === ex.initialState)?.mooreOutput || '' : '0')
    setHistory([])
  }

  const handleNextClock = () => {
    const transition = currentExample.transitions.find(
      (t) => t.from === currentStateId && t.input === selectedInputVal
    )

    if (transition) {
      const nextState = currentExample.states.find((s) => s.id === transition.to)
      const outputVal = currentExample.type === 'MOORE'
        ? nextState?.mooreOutput || ''
        : transition.mealyOutput || '0'

      setHistory((prev) => [
        ...prev.slice(-5),
        {
          state: currentStateId,
          input: selectedInputVal,
          nextState: transition.to,
          output: outputVal,
        },
      ])

      setCurrentStateId(transition.to)
      setLastOutput(outputVal)
    }
  }

  const handleResetFSM = () => {
    setCurrentStateId(currentExample.initialState)
    setSelectedInputVal('0')
    setLastOutput(
      currentExample.type === 'MOORE'
        ? currentExample.states.find((s) => s.id === currentExample.initialState)?.mooreOutput || ''
        : '0'
    )
    setHistory([])
  }

  return (
    <section className="section fsm-lab-section" id="fsm-lab">
      <LabHeader
        title="Interactive FSM Design & Simulation Lab"
        subtitle="Step through Moore & Mealy FSMs. Observe state transitions, inputs, next states, and outputs."
        icon="🔄"
        difficulty="Intermediate"
        mode={mode}
        onModeChange={setMode}
        onReset={handleResetFSM}
      />

      <div className="fsm-example-bar">
        <span className="eyebrow">Select FSM Example:</span>
        <div className="fsm-ex-buttons">
          {fsmExamples.map((ex) => (
            <button
              key={ex.id}
              type="button"
              className={`button secondary ${selectedExampleId === ex.id ? 'active' : ''}`}
              onClick={() => handleSelectExample(ex.id)}
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      <div className="fsm-lab-grid">
        {/* Left Column: State Diagram & Control */}
        <div className="fsm-left-col">
          <div className="fsm-diagram-card">
            <h4>State Diagram Visualization</h4>
            <div className="fsm-svg-wrap">
              <svg viewBox="0 0 380 200" className="fsm-svg">
                {/* Transitions */}
                {currentExample.transitions.map((t, idx) => {
                  const fromS = currentExample.states.find((s) => s.id === t.from)
                  const toS = currentExample.states.find((s) => s.id === t.to)
                  if (!fromS || !toS) return null

                  const isSelf = t.from === t.to
                  const isActive = currentStateId === t.from && selectedInputVal === t.input

                  if (isSelf) {
                    return (
                      <g key={`${t.from}-${t.to}-${idx}`}>
                        <path
                          d={`M ${fromS.x - 15} ${fromS.y - 20} C ${fromS.x - 30} ${fromS.y - 60}, ${fromS.x + 30} ${fromS.y - 60}, ${fromS.x + 15} ${fromS.y - 20}`}
                          fill="none"
                          stroke={isActive ? '#06B6D4' : 'rgba(255,255,255,0.25)'}
                          strokeWidth={isActive ? '3' : '1.5'}
                        />
                        <text
                          x={fromS.x}
                          y={fromS.y - 48}
                          fill={isActive ? '#06B6D4' : '#94A3B8'}
                          fontSize="10"
                          textAnchor="middle"
                        >
                          {t.label}
                        </text>
                      </g>
                    )
                  }

                  return (
                    <g key={`${t.from}-${t.to}-${idx}`}>
                      <line
                        x1={fromS.x}
                        y1={fromS.y}
                        x2={toS.x}
                        y2={toS.y}
                        stroke={isActive ? '#06B6D4' : 'rgba(255,255,255,0.25)'}
                        strokeWidth={isActive ? '3' : '1.5'}
                      />
                      <text
                        x={(fromS.x + toS.x) / 2}
                        y={(fromS.y + toS.y) / 2 - 8}
                        fill={isActive ? '#06B6D4' : '#94A3B8'}
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {t.label}
                      </text>
                    </g>
                  )
                })}

                {/* States */}
                {currentExample.states.map((s) => {
                  const isCurrent = currentStateId === s.id
                  return (
                    <g key={s.id}>
                      <circle
                        cx={s.x}
                        cy={s.y}
                        r="26"
                        fill={isCurrent ? '#2563EB' : '#0B172A'}
                        stroke={isCurrent ? '#06B6D4' : '#334155'}
                        strokeWidth={isCurrent ? '3.5' : '2'}
                      />
                      <text
                        x={s.x}
                        y={s.y - 2}
                        fill="#F8FAFC"
                        fontSize="11"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {s.id}
                      </text>
                      {currentExample.type === 'MOORE' && (
                        <text x={s.x} y={s.y + 12} fill="#94A3B8" fontSize="8" textAnchor="middle">
                          {s.mooreOutput.split('=')[1] || ''}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          <div className="fsm-step-controls">
            <h4>FSM Clock & Input Execution</h4>
            <div className="fsm-input-row">
              <span className="ctrl-label">Select Input:</span>
              <div className="btn-group">
                {currentExample.inputs.map((inp, idx) => (
                  <button
                    key={inp}
                    type="button"
                    className={`button small ${selectedInputVal === idx.toString() ? 'primary' : 'secondary'}`}
                    onClick={() => setSelectedInputVal(idx.toString())}
                  >
                    {inp}
                  </button>
                ))}
              </div>
            </div>

            <div className="fsm-next-clock-bar">
              <button type="button" className="button primary large-btn" onClick={handleNextClock}>
                ⚡ NEXT CLOCK (Current State → Input → Next State)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Metrics & Code */}
        <div className="fsm-right-col">
          <div className="fsm-metrics-grid">
            <MetricCard label="Current State" value={currentState?.name || ''} status="good" />
            <MetricCard label="Selected Input" value={selectedInputVal} status="neutral" />
            <MetricCard label="FSM Type" value={currentExample.type} status="good" />
            <MetricCard label="Output" value={lastOutput} status="warning" />
          </div>

          {/* Trace History Table */}
          <div className="fsm-trace-card">
            <h4>Execution Trace & Transition History</h4>
            <table className="truth-table">
              <thead>
                <tr>
                  <th>Current State</th>
                  <th>Input</th>
                  <th>Next State</th>
                  <th>Output</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94A3B8' }}>Click NEXT CLOCK to step through transitions.</td></tr>
                ) : (
                  history.map((h, i) => (
                    <tr key={i} className={i === history.length - 1 ? 'active-row' : ''}>
                      <td>{h.state}</td>
                      <td>{h.input}</td>
                      <td>{h.nextState}</td>
                      <td className="highlight">{h.output}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {mode === 'ENGINEERING' ? (
            <div className="fsm-verilog-box">
              <h4>Generated Verilog RTL Code</h4>
              <pre className="code-editor" style={{ fontSize: '0.8rem' }}>{currentExample.verilogCode}</pre>
            </div>
          ) : (
            <EquationBreakdown
              title="FSM State Flip-Flop Requirements"
              formula="N_{\text{flipflops}} = \lceil \log_2(S) \rceil \quad (\text{Binary}) \quad \text{or} \quad N = S \quad (\text{One-Hot})"
              variables={[
                { symbol: 'S', name: 'Number of States', value: currentExample.states.length, unit: 'states' },
              ]}
              substitution={`N = ceil(log2(${currentExample.states.length}))`}
              calculation={`Binary: ${Math.ceil(Math.log2(currentExample.states.length))} FFs | One-Hot: ${currentExample.states.length} FFs`}
              result={`${Math.ceil(Math.log2(currentExample.states.length))} Binary FFs vs ${currentExample.states.length} One-Hot FFs`}
              physicalMeaning="Binary encoding minimizes flip-flop count (area). One-Hot encoding uses more flip-flops but simplifies decode logic, leading to faster clock speeds."
            />
          )}
        </div>
      </div>

      <ChallengeCard labId="fsm" challenges={fsmChallenges} />
    </section>
  )
}
