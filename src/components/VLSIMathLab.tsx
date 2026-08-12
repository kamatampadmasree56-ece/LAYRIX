import { useMemo, useState } from 'react'

function formatFloat(value: number, digits = 3) {
  return Number(value.toPrecision(digits)).toString()
}

function VLSIMathLab() {
  const [resistance, setResistance] = useState(2000)
  const [capacitance, setCapacitance] = useState(5)
  const [voltage, setVoltage] = useState(1.2)
  const [current, setCurrent] = useState(0.5)
  const [delayAnswer, setDelayAnswer] = useState('')

  const rOhms = useMemo(() => resistance * 1000, [resistance])
  const cFarads = useMemo(() => capacitance * 1e-12, [capacitance])
  const delaySeconds = useMemo(() => rOhms * cFarads, [rOhms, cFarads])
  const delayNanoseconds = useMemo(() => delaySeconds * 1e9, [delaySeconds])
  const delayDisplay = useMemo(() => formatFloat(delayNanoseconds, 3), [delayNanoseconds])
  const power = useMemo(() => voltage * current, [voltage, current])
  const powerDisplay = useMemo(() => formatFloat(power, 3), [power])

  const delaySteps = useMemo(
    () => [
      `Step 1: Identify R = ${resistance} kΩ`,
      `Step 2: Identify C = ${capacitance} pF`,
      `Step 3: Convert units: R = ${rOhms.toLocaleString()} Ω, C = ${cFarads.toExponential(2)} F`,
      `Step 4: Substitute values: t = ${rOhms.toLocaleString()} × ${cFarads.toExponential(2)}`,
      `Step 5: Calculate: t = ${delaySeconds.toExponential(2)} s`,
      `Step 6: Final delay: t = ${delayDisplay} ns`,
    ],
    [resistance, capacitance, rOhms, cFarads, delaySeconds, delayDisplay],
  )

  const powerSteps = useMemo(
    () => [
      `Step 1: Identify V = ${voltage} V`,
      `Step 2: Identify I = ${current} A`,
      `Step 3: Substitute values: P = ${voltage} × ${current}`,
      `Step 4: Calculate: P = ${powerDisplay} W`,
      `Step 5: Final power: P = ${powerDisplay} watts`,
    ],
    [voltage, current, powerDisplay],
  )

  const delayFeedback = useMemo(() => {
    if (!delayAnswer) return 'Choose the correct effect on delay.'
    return delayAnswer === 'Increases'
      ? 'Correct. Delay increases when resistance rises at constant capacitance.'
      : 'Not quite. With constant capacitance, larger resistance makes the RC delay longer.'
  }, [delayAnswer])

  const signalSpeed = useMemo(() => Math.min(3.2, Math.max(0.6, 4 - delayNanoseconds / 6)), [delayNanoseconds])

  return (
    <section className="section vlsi-math-section" id="math-lab">
      <div className="section-heading">
        <p className="section-eyebrow">VLSI Mathematics Visual Lab</p>
        <h2>Understand every calculation step with circuits and math</h2>
        <p className="section-description">
          Learn how delay and power relate to circuit behavior using interactive values, formula walkthroughs, and visual meaning.
        </p>
      </div>

      <div className="vlsi-math-grid">
        <div className="vlsi-math-panel">
          <div className="math-topic-card">
            <div className="topic-header">
              <p className="eyebrow">RC Delay</p>
              <h3>t = R × C</h3>
            </div>
            <div className="math-controls">
              <div className="control-card">
                <label htmlFor="resistance-input">Resistance (R)</label>
                <div className="control-row">
                  <input
                    id="resistance-input"
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={resistance}
                    onChange={(event) => setResistance(Number(event.target.value))}
                  />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="0.5"
                    value={resistance}
                    onChange={(event) => setResistance(Number(event.target.value))}
                  />
                </div>
                <p className="control-note">{resistance} kΩ</p>
              </div>

              <div className="control-card">
                <label htmlFor="capacitance-input">Capacitance (C)</label>
                <div className="control-row">
                  <input
                    id="capacitance-input"
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={capacitance}
                    onChange={(event) => setCapacitance(Number(event.target.value))}
                  />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="0.5"
                    value={capacitance}
                    onChange={(event) => setCapacitance(Number(event.target.value))}
                  />
                </div>
                <p className="control-note">{capacitance} pF</p>
              </div>
            </div>

            <div className="calculation-panel">
              <div className="calculation-header">
                <span className="eyebrow">Calculation panel</span>
                <strong>Formula: t = R × C</strong>
              </div>
              <div className="calculation-steps">
                {delaySteps.map((step) => (
                  <div key={step} className="calculation-step">
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <div className="result-card">
                <span>Final delay</span>
                <strong>{delayDisplay} ns</strong>
              </div>
            </div>

            <div className="variable-card">
              <h4>Variable explanation</h4>
              <ul>
                <li><strong>R</strong> = Resistance, slows how quickly charge flows.</li>
                <li><strong>C</strong> = Capacitance, stores electrical charge on the node.</li>
                <li><strong>t</strong> = Propagation/RC delay, the time the signal takes to rise.</li>
              </ul>
            </div>

            <div className="visualization-card math-visual-card">
              <div className="visual-label">RC circuit visualization</div>
              <div className="rc-circuit">
                <div className="rc-line">INPUT</div>
                <div className="rc-component resistor">R</div>
                <div className="rc-component capacitor">C</div>
                <div className="rc-ground">GND</div>
                <div className="signal-pulse" style={{ animationDuration: `${signalSpeed}s` }} />
              </div>
              <p className="visual-note">Higher R or C increases the transition delay along the circuit.</p>
            </div>

            <div className="learning-card">
              <h4>Why does this matter in VLSI?</h4>
              <p>
                RC delay affects signal timing, clock frequency, performance, and how fast logic can switch. Designers use this math to keep circuits fast and reliable.
              </p>
            </div>

            <div className="challenge-card">
              <h4>Learning challenge</h4>
              <p>If resistance increases while capacitance remains constant, what happens to delay?</p>
              <div className="challenge-buttons">
                {['Decreases', 'Increases', 'Remains the same'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`button secondary ${delayAnswer === option ? 'active' : ''}`}
                    onClick={() => setDelayAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p className={`challenge-feedback ${delayAnswer === 'Increases' ? 'correct' : delayAnswer ? 'incorrect' : ''}`}>
                {delayFeedback}
              </p>
            </div>
          </div>

          <div className="math-topic-card power-topic-card">
            <div className="topic-header">
              <p className="eyebrow">Power</p>
              <h3>P = V × I</h3>
            </div>
            <div className="math-controls">
              <div className="control-card">
                <label htmlFor="voltage-input">Voltage (V)</label>
                <input
                  id="voltage-input"
                  type="number"
                  min="0"
                  step="0.1"
                  value={voltage}
                  onChange={(event) => setVoltage(Number(event.target.value))}
                />
              </div>
              <div className="control-card">
                <label htmlFor="current-input">Current (I)</label>
                <input
                  id="current-input"
                  type="number"
                  min="0"
                  step="0.1"
                  value={current}
                  onChange={(event) => setCurrent(Number(event.target.value))}
                />
              </div>
            </div>

            <div className="calculation-panel">
              <div className="calculation-header">
                <span className="eyebrow">Calculation panel</span>
                <strong>Formula: P = V × I</strong>
              </div>
              <div className="calculation-steps">
                {powerSteps.map((step) => (
                  <div key={step} className="calculation-step">
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <div className="result-card">
                <span>Final power</span>
                <strong>{powerDisplay} W</strong>
              </div>
            </div>

            <div className="variable-card">
              <h4>Variable explanation</h4>
              <ul>
                <li><strong>V</strong> = Voltage, the electrical potential difference.</li>
                <li><strong>I</strong> = Current, the flow of charge through a path.</li>
                <li><strong>P</strong> = Power, the rate energy is consumed or delivered.</li>
              </ul>
            </div>

            <div className="learning-card">
              <h4>Real-world connection</h4>
              <p>
                Power matters in VLSI because it determines energy efficiency, heat, and battery life for chips. Designers balance voltage and current to keep systems stable.
              </p>
            </div>
          </div>
        </div>

        <div className="vlsi-math-sidebar">
          <div className="analysis-card">
            <h3>Interactive mathematics</h3>
            <p>
              Every value updates the equation instantly, so students see how resistance, capacitance, voltage, and current shape delay and power.
            </p>
          </div>

          <div className="analysis-card">
            <h3>Visual meaning</h3>
            <p>
              The RC circuit shows why a larger resistor or capacitor slows signal transitions. The power calculator shows how voltage and current determine energy use.
            </p>
          </div>

          <div className="analysis-card">
            <h3>Why it is educational</h3>
            <p>
              This module connects formulas to physical circuit behavior so formulas feel intuitive rather than abstract.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VLSIMathLab
