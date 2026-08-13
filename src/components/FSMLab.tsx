import { useState } from 'react'

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
    inputs: ['TIMER_EXP'],
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
    name: 'Sequence Detector "101" (Mealy FSM)',
    type: 'MEALY',
    description: 'Mealy FSM where output depends on current state AND current input bit.',
    initialState: 'S0',
    inputs: ['BIT_0', 'BIT_1'],
    states: [
      { id: 'S0', name: 'S0 (IDLE)', mooreOutput: 'DETECT=0', x: 60, y: 100 },
      { id: 'S1', name: 'S1 (Got 1)', mooreOutput: 'DETECT=0', x: 180, y: 60 },
      { id: 'S2', name: 'S2 (Got 10)', mooreOutput: 'DETECT=0', x: 300, y: 100 },
    ],
    transitions: [
      { from: 'S0', to: 'S0', input: '0', mealyOutput: '0', label: '0 / 0' },
      { from: 'S0', to: 'S1', input: '1', mealyOutput: '0', label: '1 / 0' },
      { from: 'S1', to: 'S2', input: '0', mealyOutput: '0', label: '0 / 0' },
      { from: 'S1', to: 'S1', input: '1', mealyOutput: '0', label: '1 / 0' },
      { from: 'S2', to: 'S0', input: '0', mealyOutput: '0', label: '0 / 0' },
      { from: 'S2', to: 'S1', input: '1', mealyOutput: '1', label: '1 / 1 (DETECT!)' },
    ],
    verilogCode: `// Mealy FSM: Output depends on state AND input
typedef enum logic [1:0] {S0, S1, S2} state_t;
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
    S2: begin
      if (in_bit) begin
        next_state = S1;
        detect = 1; // Output high immediately on input '1'
      end else begin
        next_state = S0;
      end
    end
  endcase
end`,
  },
]

export default function FSMLab() {
  const [selectedExampleId, setSelectedExampleId] = useState<string>('traffic-light')
  const [currentStateId, setCurrentStateId] = useState<string>('RED')
  const [lastInput, setLastInput] = useState<string>('0')
  const [lastOutput, setLastOutput] = useState<string>('RED_LIGHT=1')
  const [history, setHistory] = useState<Array<{ state: string; input: string; nextState: string; output: string }>>([])

  const currentExample = fsmExamples.find((ex) => ex.id === selectedExampleId) || fsmExamples[0]

  const handleSelectExample = (id: string) => {
    const ex = fsmExamples.find((e) => e.id === id) || fsmExamples[0]
    setSelectedExampleId(id)
    setCurrentStateId(ex.initialState)
    setLastInput('0')
    setLastOutput(ex.type === 'MOORE' ? ex.states.find((s) => s.id === ex.initialState)?.mooreOutput || '' : '0')
    setHistory([])
  }

  const handleStep = (inputValue: string) => {
    const activeState = currentExample.states.find((s) => s.id === currentStateId)
    if (!activeState) return

    const transition = currentExample.transitions.find(
      (t) => t.from === currentStateId && t.input === inputValue
    )

    if (transition) {
      const nextState = currentExample.states.find((s) => s.id === transition.to)
      const outputVal = currentExample.type === 'MOORE'
        ? nextState?.mooreOutput || ''
        : transition.mealyOutput || '0'

      setHistory((prev) => [
        ...prev.slice(-4),
        {
          state: currentStateId,
          input: inputValue,
          nextState: transition.to,
          output: outputVal,
        },
      ])
      setCurrentStateId(transition.to)
      setLastInput(inputValue)
      setLastOutput(outputVal)
    }
  }

  const handleResetFSM = () => {
    setCurrentStateId(currentExample.initialState)
    setLastInput('0')
    setLastOutput(
      currentExample.type === 'MOORE'
        ? currentExample.states.find((s) => s.id === currentExample.initialState)?.mooreOutput || ''
        : '0'
    )
    setHistory([])
  }

  const currentState = currentExample.states.find((s) => s.id === currentStateId)

  return (
    <section className="section fsm-lab-section" id="fsm-lab">
      <div className="section-heading">
        <p className="section-eyebrow">Interactive Simulation</p>
        <h2>FSM Design & Step Simulator</h2>
        <p className="section-description">
          Step through Moore and Mealy Finite State Machines. Observe state transitions, inputs, next states, and outputs in real time.
        </p>
      </div>

      <div className="fsm-lab-grid">
        <div className="fsm-left-panel">
          <div className="fsm-selector">
            <span className="eyebrow">Select FSM Architecture</span>
            <div className="fsm-example-buttons">
              {fsmExamples.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  className={`button secondary small ${selectedExampleId === ex.id ? 'active' : ''}`}
                  onClick={() => handleSelectExample(ex.id)}
                >
                  {ex.name}
                </button>
              ))}
            </div>
            <p className="fsm-example-desc">{currentExample.description}</p>
          </div>

          <div className="fsm-diagram-card">
            <h4>State Diagram Visualization</h4>
            <div className="fsm-svg-container">
              <svg viewBox="0 0 380 200" className="fsm-svg">
                {/* Draw Transitions */}
                {currentExample.transitions.map((t, idx) => {
                  const fromS = currentExample.states.find((s) => s.id === t.from)
                  const toS = currentExample.states.find((s) => s.id === t.to)
                  if (!fromS || !toS) return null

                  const isSelf = t.from === t.to
                  const isActive = currentStateId === t.from && lastInput === t.input

                  if (isSelf) {
                    return (
                      <g key={`${t.from}-${t.to}-${idx}`}>
                        <path
                          d={`M ${fromS.x - 15} ${fromS.y - 20} C ${fromS.x - 30} ${fromS.y - 60}, ${fromS.x + 30} ${fromS.y - 60}, ${fromS.x + 15} ${fromS.y - 20}`}
                          fill="none"
                          stroke={isActive ? '#06B6D4' : 'rgba(255,255,255,0.2)'}
                          strokeWidth={isActive ? '3' : '1.5'}
                        />
                        <text
                          x={fromS.x}
                          y={fromS.y - 50}
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

                {/* Draw States */}
                {currentExample.states.map((s) => {
                  const isCurrent = currentStateId === s.id
                  return (
                    <g key={s.id}>
                      <circle
                        cx={s.x}
                        cy={s.y}
                        r="28"
                        fill={isCurrent ? '#2563EB' : '#0B172A'}
                        stroke={isCurrent ? '#06B6D4' : '#334155'}
                        strokeWidth={isCurrent ? '3' : '2'}
                      />
                      <text
                        x={s.x}
                        y={s.y - 2}
                        fill="#F8FAFC"
                        fontSize="11"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {s.id}
                      </text>
                      {currentExample.type === 'MOORE' && (
                        <text
                          x={s.x}
                          y={s.y + 12}
                          fill="#94A3B8"
                          fontSize="8"
                          textAnchor="middle"
                        >
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
            <h4>FSM Step Execution</h4>
            <div className="fsm-control-bar">
              <span className="fsm-label">Apply Input:</span>
              <div className="fsm-input-buttons">
                {currentExample.inputs.map((inp, idx) => (
                  <button
                    key={inp}
                    type="button"
                    className="button primary small"
                    onClick={() => handleStep(idx.toString())}
                  >
                    Input: {idx} ({inp})
                  </button>
                ))}
              </div>
              <button type="button" className="button secondary small" onClick={handleResetFSM}>
                Reset FSM
              </button>
            </div>

            <div className="fsm-status-row">
              <div className="fsm-status-card">
                <span>Current State</span>
                <strong>{currentState?.name}</strong>
              </div>
              <div className="fsm-status-card">
                <span>Last Input</span>
                <strong>{lastInput}</strong>
              </div>
              <div className="fsm-status-card">
                <span>Current Output</span>
                <strong className="highlight">{lastOutput}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="fsm-right-panel">
          <div className="fsm-history-card">
            <h4>Execution Trace</h4>
            {history.length === 0 ? (
              <p className="fsm-empty-text">Click an Input button to step through the FSM.</p>
            ) : (
              <table className="truth-table">
                <thead>
                  <tr>
                    <th>State</th>
                    <th>Input</th>
                    <th>Next State</th>
                    <th>Output</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((step, idx) => (
                    <tr key={idx} className={idx === history.length - 1 ? 'active-row' : ''}>
                      <td>{step.state}</td>
                      <td>{step.input}</td>
                      <td>{step.nextState}</td>
                      <td className="highlight">{step.output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="fsm-code-card">
            <h4>Synthesizable Verilog RTL</h4>
            <pre className="code-editor" style={{ fontSize: '0.85rem' }}>{currentExample.verilogCode}</pre>
          </div>
        </div>
      </div>
    </section>
  )
}
