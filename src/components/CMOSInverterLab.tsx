import { useMemo, useState } from 'react'

const stepDescriptions = {
  0: [
    'Step 1: Input is LOW.',
    'Step 2: PMOS turns ON.',
    'Step 3: NMOS turns OFF.',
    'Step 4: Output is connected to VDD.',
    'Step 5: Output becomes HIGH.',
  ],
  1: [
    'Step 1: Input is HIGH.',
    'Step 2: PMOS turns OFF.',
    'Step 3: NMOS turns ON.',
    'Step 4: Output is connected to GND.',
    'Step 5: Output becomes LOW.',
  ],
}

const quizOptions = ['PMOS', 'NMOS']

function CMOSInverterLab() {
  const [input, setInput] = useState<0 | 1>(0)
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)

  const pmosOn = input === 0
  const nmosOn = input === 1
  const outputHigh = input === 0
  const outputLabel = outputHigh ? 'HIGH (1)' : 'LOW (0)'
  const currentPath = outputHigh
    ? 'VDD → PMOS → OUT'
    : 'OUT → NMOS → GND'

  const quizFeedback = useMemo(() => {
    if (quizAnswer === null) {
      return 'Select the transistor that is ON when INPUT is HIGH.'
    }
    return quizAnswer === 'NMOS'
      ? 'Correct. NMOS conducts when INPUT is HIGH.'
      : 'Not quite — PMOS is OFF when INPUT is HIGH.'
  }, [quizAnswer])

  const handleToggle = () => {
    setInput((prev) => (prev === 0 ? 1 : 0))
    setQuizAnswer(null)
  }

  const handleReset = () => {
    setInput(0)
    setQuizAnswer(null)
  }

  return (
    <section className="section cmos-lab-section" id="cmos-inverter">
      <div className="section-heading">
        <p className="section-eyebrow">CMOS Inverter Visual Lab</p>
        <h2>Explore the inverter behavior with circuit animation and interaction</h2>
        <p className="section-description">
          Control the input state and see how PMOS and NMOS switch to drive the output.
        </p>
      </div>

      <div className="cmos-lab-grid">
        <div className="cmos-panel">
          <div className="cmos-panel-header">
            <div>
              <p className="eyebrow">Circuit Interaction</p>
              <h3>CMOS inverter state</h3>
            </div>
            <div className="cmos-controls">
              <button className="button secondary" type="button" onClick={handleToggle}>
                Toggle INPUT
              </button>
              <button className="button secondary" type="button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>

          <div className="cmos-diagram">
            <div className="cmos-circuit">
              <div className="circuit-node source">VDD</div>
              <div className={`trace-line ${outputHigh ? 'active' : ''}`} />
              <div className={`transistor-block pmos ${pmosOn ? 'on' : 'off'}`}>
                <div className="transistor-label">PMOS</div>
                <div className="state-chip">{pmosOn ? 'ON' : 'OFF'}</div>
              </div>
              <div className={`trace-line mid ${outputHigh ? 'active' : ''}`} />
              <div className="output-card">
                <span>OUT</span>
                <strong>{outputLabel}</strong>
              </div>
              <div className={`trace-line ${nmosOn ? 'active' : ''}`} />
              <div className={`transistor-block nmos ${nmosOn ? 'on' : 'off'}`}>
                <div className="transistor-label">NMOS</div>
                <div className="state-chip">{nmosOn ? 'ON' : 'OFF'}</div>
              </div>
              <div className={`trace-line ${nmosOn ? 'active' : ''}`} />
              <div className="circuit-node sink">GND</div>
            </div>

            <div className="cmos-input-panel">
              <div className="input-status">
                <span className="input-label">INPUT</span>
                <div className={`input-badge ${input === 1 ? 'high' : 'low'}`}>
                  {input === 1 ? '1 / HIGH' : '0 / LOW'}
                </div>
              </div>

              <div className="gate-connection">
                <div className={`gate-line ${pmosOn ? 'active' : ''}`}></div>
                <div className="gate-path-label">GATE → PMOS</div>
              </div>
              <div className="gate-connection">
                <div className={`gate-line ${nmosOn ? 'active' : ''}`}></div>
                <div className="gate-path-label">GATE → NMOS</div>
              </div>
            </div>
          </div>

          <div className="cmos-summary-cards">
            <div className="summary-card">
              <p className="summary-label">Current path</p>
              <strong>{currentPath}</strong>
            </div>
            <div className="summary-card">
              <p className="summary-label">State</p>
              <strong>{outputHigh ? 'Output drives HIGH' : 'Output drives LOW'}</strong>
            </div>
          </div>
        </div>

        <div className="cmos-info-column">
          <div className="analysis-card">
            <h3>Truth table</h3>
            <table className="cmos-table">
              <thead>
                <tr>
                  <th>INPUT</th>
                  <th>PMOS</th>
                  <th>NMOS</th>
                  <th>OUTPUT</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1].map((value) => (
                  <tr key={value} className={input === value ? 'active-row' : ''}>
                    <td>{value}</td>
                    <td>{value === 0 ? 'ON' : 'OFF'}</td>
                    <td>{value === 1 ? 'ON' : 'OFF'}</td>
                    <td>{value === 0 ? '1' : '0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="analysis-card">
            <h3>How it works</h3>
            <ol>
              {stepDescriptions[input].map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="analysis-card">
            <h3>Understand the Logic</h3>
            <p>
              When INPUT is LOW, VOUT ≈ VDD. When INPUT is HIGH, VOUT ≈ 0.
            </p>
            <ul>
              <li><strong>VDD</strong> is the positive power supply for the inverter.</li>
              <li><strong>VIN</strong> is the input signal that controls both transistors.</li>
              <li><strong>VOUT</strong> is the inverter output voltage, produced by the transistor network.</li>
            </ul>
          </div>

          <div className="analysis-card quiz-card">
            <h3>Quick question</h3>
            <p>If INPUT is HIGH, which transistor is ON?</p>
            <div className="quiz-buttons">
              {quizOptions.map((option) => (
                <button
                  key={option}
                  className={`button secondary ${quizAnswer === option ? 'selected' : ''}`}
                  type="button"
                  onClick={() => setQuizAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className={`quiz-feedback ${quizAnswer === 'NMOS' ? 'correct' : quizAnswer ? 'incorrect' : ''}`}>
              {quizFeedback}
            </p>
          </div>

          <div className="analysis-card">
            <h3>Where is this used?</h3>
            <p>
              The CMOS inverter is the basic building block for logic gates, digital circuits, processors, memory, and control circuits.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CMOSInverterLab
