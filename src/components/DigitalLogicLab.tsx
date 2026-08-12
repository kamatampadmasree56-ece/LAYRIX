import { useMemo, useState } from 'react'

type GateId = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR'

type GateInfo = {
  id: GateId
  title: string
  expression: string
  summary: string
  importance: string
  usage: string
}

const gateDefinitions: GateInfo[] = [
  {
    id: 'AND',
    title: 'AND',
    expression: 'Y = A · B',
    summary: 'Output is HIGH only when both inputs are HIGH.',
    importance: 'AND gates are used to enforce that multiple signals must be true before a circuit path activates.',
    usage: 'Common in arithmetic logic, control conditions, and enable signals.',
  },
  {
    id: 'OR',
    title: 'OR',
    expression: 'Y = A + B',
    summary: 'Output is HIGH when either input is HIGH.',
    importance: 'OR gates let a circuit respond to any one of several true conditions.',
    usage: 'Used in interrupt logic, decision trees, and combining signals.',
  },
  {
    id: 'NOT',
    title: 'NOT',
    expression: 'Y = ¬A',
    summary: 'Output is the inverse of the input A.',
    importance: 'NOT gates provide signal inversion and are essential for complements in logic design.',
    usage: 'Used in inverters, gated logic, and timing control signals.',
  },
  {
    id: 'NAND',
    title: 'NAND',
    expression: 'Y = ¬(A · B)',
    summary: 'Output is LOW only when both inputs are HIGH.',
    importance: 'NAND gates are universal and can be used to build any logic function.',
    usage: 'Found in memory cells, latch elements, and custom logic modules.',
  },
  {
    id: 'NOR',
    title: 'NOR',
    expression: 'Y = ¬(A + B)',
    summary: 'Output is HIGH only when both inputs are LOW.',
    importance: 'NOR gates are also universal and are used for compact logic implementation.',
    usage: 'Used in control circuits, reset logic, and simple decision blocks.',
  },
  {
    id: 'XOR',
    title: 'XOR',
    expression: 'Y = A ⊕ B',
    summary: 'Output is HIGH when inputs are different.',
    importance: 'XOR gates are essential for arithmetic operations and parity checks.',
    usage: 'Used in adders, comparators, and error detection logic.',
  },
]

const truthRows = (gateId: GateId) => {
  if (gateId === 'NOT') {
    return [
      { a: 0, b: null, y: 1 },
      { a: 1, b: null, y: 0 },
    ]
  }

  return [
    { a: 0, b: 0, y: calculateOutput(gateId, 0, 0) },
    { a: 0, b: 1, y: calculateOutput(gateId, 0, 1) },
    { a: 1, b: 0, y: calculateOutput(gateId, 1, 0) },
    { a: 1, b: 1, y: calculateOutput(gateId, 1, 1) },
  ]
}

const calculateOutput = (gateId: GateId, a: 0 | 1, b: 0 | 1) => {
  switch (gateId) {
    case 'AND':
      return a & b
    case 'OR':
      return a | b
    case 'NOT':
      return a ? 0 : 1
    case 'NAND':
      return (a & b) ? 0 : 1
    case 'NOR':
      return a || b ? 0 : 1
    case 'XOR':
      return a ^ b
    default:
      return 0
  }
}

const calculateStep = (gateId: GateId, a: 0 | 1, b: 0 | 1) => {
  const output = calculateOutput(gateId, a, b)
  if (gateId === 'NOT') {
    return [`A = ${a}`, `¬A = ${output}`, `Therefore: OUTPUT = ${output}`]
  }

  const symbol =
    gateId === 'AND'
      ? '·'
      : gateId === 'OR'
      ? '+'
      : gateId === 'XOR'
      ? '⊕'
      : gateId === 'NAND' || gateId === 'NOR'
      ? gateId === 'NAND'
        ? '·'
        : '+'
      : ''

  const operation = `${a} ${symbol} ${b}`
  if (gateId === 'NAND') {
    const intermediate = a & b
    return [`A · B = ${intermediate}`, `¬(${intermediate}) = ${output}`, `Therefore: OUTPUT = ${output}`]
  }

  if (gateId === 'NOR') {
    const intermediate = a || b ? 1 : 0
    return [`A + B = ${intermediate}`, `¬(${intermediate}) = ${output}`, `Therefore: OUTPUT = ${output}`]
  }

  return [`${operation} = ${output}`, `Therefore: OUTPUT = ${output}`]
}

const gateDescription = (gateId: GateId, a: 0 | 1, b: 0 | 1) => {
  if (gateId === 'NOT') {
    return `The NOT gate inverts the input. When A is ${a}, output becomes ${a ? '0' : '1'}.`
  }

  return `The ${gateId} gate reads A = ${a} and B = ${b}, and the output becomes ${calculateOutput(gateId, a, b)}.`
}

function DigitalLogicLab() {
  const [gateId, setGateId] = useState<GateId>('AND')
  const [inputA, setInputA] = useState<0 | 1>(0)
  const [inputB, setInputB] = useState<0 | 1>(0)
  const [prediction, setPrediction] = useState<'0' | '1' | ''>('')

  const gateInfo = useMemo(
    () => gateDefinitions.find((gate) => gate.id === gateId) as GateInfo,
    [gateId],
  )

  const output = useMemo(() => calculateOutput(gateId, inputA, inputB), [gateId, inputA, inputB])
  const truthTable = useMemo(() => truthRows(gateId), [gateId])
  const explanationLines = useMemo(() => calculateStep(gateId, inputA, inputB), [gateId, inputA, inputB])
  const challengeMessage = useMemo(() => {
    if (!prediction) {
      return 'Predict the output before changing the inputs.'
    }
    const correct = prediction === `${output}`
    return correct
      ? `Correct! ${gateId} output is ${output}.` 
      : `Not quite — ${gateId} output is ${output}.`
  }, [gateId, output, prediction])

  const handleGateSelect = (selected: GateId) => {
    setGateId(selected)
    setPrediction('')
    setInputA(0)
    setInputB(0)
  }

  return (
    <section className="section digital-logic-section" id="digital-logic">
      <div className="section-heading">
        <p className="section-eyebrow">Digital Logic Visual Lab</p>
        <h2>Explore gates with live input, output, and signal visualization</h2>
        <p className="section-description">
          Learn how each logic gate transforms inputs into output with clear diagrams, truth tables, and step-by-step reasoning.
        </p>
      </div>

      <div className="digital-logic-grid">
        <div className="digital-logic-panel">
          <div className="digital-logic-panel-header">
            <div>
              <p className="eyebrow">Gate selection</p>
              <h3>{gateInfo.title} Gate</h3>
            </div>
            <div className="gate-selector" role="tablist" aria-label="Select logic gate">
              {gateDefinitions.map((gate) => (
                <button
                  key={gate.id}
                  type="button"
                  className={`gate-tab ${gate.id === gateId ? 'active' : ''}`}
                  onClick={() => handleGateSelect(gate.id)}
                >
                  {gate.id}
                </button>
              ))}
            </div>
          </div>

          <div className="logic-inputs">
            <div className="input-block">
              <span>A</span>
              <div className="logic-buttons">
                {[0, 1].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`button secondary ${inputA === value ? 'active' : ''}`}
                    onClick={() => setInputA(value as 0 | 1)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            {gateId !== 'NOT' && (
              <div className="input-block">
                <span>B</span>
                <div className="logic-buttons">
                  {[0, 1].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`button secondary ${inputB === value ? 'active' : ''}`}
                      onClick={() => setInputB(value as 0 | 1)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="diagram-card">
            <div className="diagram-heading">
              <p className="eyebrow">Live gate diagram</p>
              <p className="diagram-expression">{gateInfo.expression}</p>
            </div>

            <div className="logic-diagram">
              <div className="signal-row">
                <span className="signal-label">INPUT A</span>
                <div className={`signal-path ${inputA === 1 ? 'active' : 'inactive'}`}>
                  <span className={`signal-node ${inputA === 1 ? 'high' : 'low'}`}>{inputA}</span>
                </div>
              </div>

              {gateId !== 'NOT' && (
                <div className="signal-row second-input">
                  <span className="signal-label">INPUT B</span>
                  <div className={`signal-path ${inputB === 1 ? 'active' : 'inactive'}`}>
                    <span className={`signal-node ${inputB === 1 ? 'high' : 'low'}`}>{inputB}</span>
                  </div>
                </div>
              )}

              <div className={`gate-node ${output === 1 ? 'active' : ''}`}>
                {gateInfo.title}
              </div>

              <div className="output-display">
                <div>
                  <span className="eyebrow">OUTPUT</span>
                  <div className={`logic-badge ${output === 1 ? 'high' : 'low'}`}>{output}</div>
                </div>
                <div className="output-label">Signal flows through the gate to produce the result.</div>
              </div>
            </div>
          </div>

          <div className="analysis-card">
            <h3>Step-by-step explanation</h3>
            <ol className="explanation-list">
              {explanationLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          </div>

          <div className="analysis-card challenge-panel">
            <h3>Challenge mode</h3>
            <p>Predict the output before changing the input, then check your answer.</p>
            <div className="challenge-buttons">
              {['0', '1'].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`button secondary ${prediction === value ? 'active' : ''}`}
                  onClick={() => setPrediction(value as '0' | '1')}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className={`challenge-feedback ${prediction === `${output}` ? 'correct' : prediction ? 'incorrect' : ''}`}>
              {challengeMessage}
            </p>
          </div>
        </div>

        <div className="digital-logic-sidebar">
          <div className="analysis-card">
            <h3>Truth table</h3>
            <table className="truth-table">
              <thead>
                <tr>
                  <th>A</th>
                  {gateId !== 'NOT' && <th>B</th>}
                  <th>Y</th>
                </tr>
              </thead>
              <tbody>
                {truthTable.map((row) => (
                  <tr key={`${row.a}-${row.b ?? 'x'}`} className={row.a === inputA && row.b === (gateId !== 'NOT' ? inputB : null) ? 'active-row' : ''}>
                    <td>{row.a}</td>
                    {gateId !== 'NOT' && <td>{row.b}</td>}
                    <td>{row.y}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="analysis-card">
            <h3>Boolean expression</h3>
            <p>{gateInfo.expression}</p>
          </div>

          <div className="analysis-card">
            <h3>Learning mode</h3>
            <p>{gateInfo.summary}</p>
            <p><strong>Why it matters:</strong> {gateInfo.importance}</p>
            <p><strong>Real use:</strong> {gateInfo.usage}</p>
          </div>

          <div className="analysis-card">
            <h3>Current logic</h3>
            <p>{gateDescription(gateId, inputA, inputB)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DigitalLogicLab
