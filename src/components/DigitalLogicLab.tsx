import { useMemo, useState } from 'react'
import { LabHeader, type Mode } from './labs/LabHeader'
import { MetricCard } from './labs/MetricCard'
import { EquationBreakdown } from './labs/EquationBreakdown'
import { ChallengeCard, type Challenge } from './labs/ChallengeCard'

type GateId = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR'

type GateInfo = {
  id: GateId
  title: string
  expression: string
  summary: string
  truthTable: { a: number; b?: number; y: number }[]
  evalFn: (a: number, b: number) => number
}

const gateDefinitions: GateInfo[] = [
  {
    id: 'AND',
    title: 'AND Gate',
    expression: 'Y = A · B',
    summary: 'Output is 1 ONLY when both inputs A and B are 1.',
    truthTable: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 1 },
    ],
    evalFn: (a, b) => a & b,
  },
  {
    id: 'OR',
    title: 'OR Gate',
    expression: 'Y = A + B',
    summary: 'Output is 1 when either input A or B is 1.',
    truthTable: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 1 },
    ],
    evalFn: (a, b) => a | b,
  },
  {
    id: 'NOT',
    title: 'NOT Gate (Inverter)',
    expression: 'Y = Ā',
    summary: 'Output is the inverse of input A.',
    truthTable: [
      { a: 0, y: 1 },
      { a: 1, y: 0 },
    ],
    evalFn: (a) => (a === 0 ? 1 : 0),
  },
  {
    id: 'NAND',
    title: 'NAND Gate (Universal)',
    expression: 'Y = (A · B)̄',
    summary: 'Output is 0 ONLY when both inputs A and B are 1. Universal gate.',
    truthTable: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 0 },
    ],
    evalFn: (a, b) => (a & b ? 0 : 1),
  },
  {
    id: 'NOR',
    title: 'NOR Gate (Universal)',
    expression: 'Y = (A + B)̄',
    summary: 'Output is 1 ONLY when both inputs A and B are 0. Universal gate.',
    truthTable: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 0 },
    ],
    evalFn: (a, b) => (a | b ? 0 : 1),
  },
  {
    id: 'XOR',
    title: 'XOR Gate (Exclusive-OR)',
    expression: 'Y = A ⊕ B',
    summary: 'Output is 1 when inputs A and B are DIFFERENT.',
    truthTable: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 0 },
    ],
    evalFn: (a, b) => a ^ b,
  },
  {
    id: 'XNOR',
    title: 'XNOR Gate (Equivalence)',
    expression: 'Y = (A ⊕ B)̄',
    summary: 'Output is 1 when inputs A and B are EQUAL.',
    truthTable: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 1 },
    ],
    evalFn: (a, b) => (a ^ b ? 0 : 1),
  },
]

const logicChallenges: Challenge[] = [
  {
    id: 'dl-c1',
    title: 'Challenge 1: De Morgan\'s NAND Equivalence',
    question: 'According to De Morgan\'s theorem, the NAND expression Y = (A · B)̄ is logically equivalent to which OR expression?',
    options: ['Y = Ā + B̄', 'Y = Ā · B̄', 'Y = A + B', 'Y = A ⊕ B'],
    correctAnswer: 'Y = Ā + B̄',
    hint: 'De Morgan\'s Law: (A · B)̄ = Ā + B̄.',
    solution: 'Y = Ā + B̄',
    explanation: 'De Morgan\'s theorem states that the complement of a product is equal to the sum of the complements.',
  },
  {
    id: 'dl-c2',
    title: 'Challenge 2: Constructing XOR using NAND Gates',
    question: 'How many 2-input NAND gates are required to construct a 2-input XOR function (Y = A ⊕ B)?',
    options: ['2', '3', '4', '5'],
    correctAnswer: '4',
    hint: 'XOR = NAND( NAND(A, NAND(A,B)), NAND(B, NAND(A,B)) ). Count the total NAND gates.',
    solution: '4 NAND gates',
    explanation: '4 NAND gates are required to implement XOR: 1 central NAND + 2 branch NANDs + 1 output NAND.',
  },
  {
    id: 'dl-c3',
    title: 'Challenge 3: Universal Gate Identity',
    question: 'Why are NAND and NOR gates called "Universal Gates" in VLSI design?',
    options: [
      'Any Boolean logic function can be constructed using exclusively NAND (or exclusively NOR) gates.',
      'They operate at zero voltage.',
      'They have infinite drive strength.',
      'They require no transistors.',
    ],
    correctAnswer: 'Any Boolean logic function can be constructed using exclusively NAND (or exclusively NOR) gates.',
    hint: 'Universal gates can create AND, OR, NOT, XOR functions entirely on their own.',
    solution: 'Can construct any Boolean function',
    explanation: 'NAND and NOR are universal because any logic gate or digital circuit can be built using only NANDs or only NORs.',
  },
]

export default function DigitalLogicLab() {
  const [mode, setMode] = useState<Mode>('LEARNING')
  const [selectedGateId, setSelectedGateId] = useState<GateId>('AND')
  const [inputA, setInputA] = useState<number>(1)
  const [inputB, setInputB] = useState<number>(0)

  // Custom Build Logic Challenge State
  const [buildNandCount, setBuildNandCount] = useState<number>(0)
  const [buildFeedback, setBuildFeedback] = useState<string | null>(null)

  const activeGate = useMemo(
    () => gateDefinitions.find((g) => g.id === selectedGateId) || gateDefinitions[0],
    [selectedGateId]
  )

  const outputY = activeGate.evalFn(inputA, inputB)

  const handleResetLab = () => {
    setSelectedGateId('AND')
    setInputA(1)
    setInputB(0)
    setBuildNandCount(0)
    setBuildFeedback(null)
  }

  const handleCheckBuildXor = () => {
    if (buildNandCount === 4) {
      setBuildFeedback('✓ Correct! 4 NAND gates successfully form a 2-input XOR function.')
    } else {
      setBuildFeedback(`✕ Incorrect count (${buildNandCount}). 4 NAND gates are needed for XOR.`)
    }
  }

  return (
    <section className="section digital-logic-section" id="digital-logic">
      <LabHeader
        title="Interactive Digital Logic Gate Laboratory"
        subtitle="Simulate AND, OR, NOT, NAND, NOR, XOR, and XNOR gates with live truth tables and logic construction challenges."
        icon="🧩"
        difficulty="Beginner"
        mode={mode}
        onModeChange={setMode}
        onReset={handleResetLab}
      />

      <div className="logic-gate-selector-bar">
        <span className="eyebrow">Select Gate Topology:</span>
        <div className="btn-group">
          {gateDefinitions.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`button small ${selectedGateId === g.id ? 'primary' : 'secondary'}`}
              onClick={() => setSelectedGateId(g.id)}
            >
              {g.id}
            </button>
          ))}
        </div>
      </div>

      <div className="digital-logic-grid">
        {/* Left Column: Gate Symbol & Input Controls */}
        <div className="dl-left-col">
          <div className="dl-gate-symbol-card">
            <h4>{activeGate.title} — Symbol & Logic Diagram</h4>

            <div className="dl-svg-wrap">
              <svg viewBox="0 0 300 160" className="dl-svg">
                {/* Inputs */}
                <line x1="20" y1="50" x2="100" y2="50" stroke={inputA ? '#2563EB' : '#475569'} strokeWidth="2.5" />
                <circle cx="20" cy="50" r="8" fill={inputA ? '#2563EB' : '#334155'} />
                <text x="20" y="35" fill="#F8FAFC" fontSize="10" fontWeight="700" textAnchor="middle">A = {inputA}</text>

                {activeGate.id !== 'NOT' && (
                  <>
                    <line x1="20" y1="110" x2="100" y2="110" stroke={inputB ? '#2563EB' : '#475569'} strokeWidth="2.5" />
                    <circle cx="20" cy="110" r="8" fill={inputB ? '#2563EB' : '#334155'} />
                    <text x="20" y="128" fill="#F8FAFC" fontSize="10" fontWeight="700" textAnchor="middle">B = {inputB}</text>
                  </>
                )}

                {/* Gate Shape */}
                <rect x="100" y="35" width="100" height="90" rx="8" fill="#0B172A" stroke="#06B6D4" strokeWidth="2" />
                <text x="150" y="85" fill="#F8FAFC" fontSize="16" fontWeight="800" textAnchor="middle">{activeGate.id}</text>

                {/* Output Wire */}
                <line x1="200" y1="80" x2="280" y2="80" stroke={outputY ? '#22C55E' : '#475569'} strokeWidth="2.5" />
                <circle cx="280" cy="80" r="9" fill={outputY ? '#22C55E' : '#334155'} />
                <text x="280" y="65" fill="#F8FAFC" fontSize="10" fontWeight="700" textAnchor="middle">Y = {outputY}</text>
              </svg>
            </div>

            <div className="dl-inputs-control-box">
              <div className="ctrl-group">
                <span className="ctrl-label">Input A:</span>
                <button type="button" className={`button small ${inputA ? 'primary' : 'secondary'}`} onClick={() => setInputA(inputA ? 0 : 1)}>
                  Toggle A ({inputA})
                </button>
              </div>

              {activeGate.id !== 'NOT' && (
                <div className="ctrl-group">
                  <span className="ctrl-label">Input B:</span>
                  <button type="button" className={`button small ${inputB ? 'primary' : 'secondary'}`} onClick={() => setInputB(inputB ? 0 : 1)}>
                    Toggle B ({inputB})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Build the Logic Challenge Box */}
          <div className="dl-build-challenge-card">
            <h4>🔨 "Build the Logic" Challenge: XOR using NANDs</h4>
            <p className="build-desc">Add 2-input NAND gates to construct a 2-input XOR function.</p>
            <div className="build-action-row">
              <button type="button" className="button secondary small" onClick={() => setBuildNandCount(buildNandCount + 1)}>
                + Add NAND Gate ({buildNandCount})
              </button>
              <button type="button" className="button primary small" onClick={handleCheckBuildXor}>
                Check Circuit
              </button>
              <button type="button" className="button secondary small" onClick={() => { setBuildNandCount(0); setBuildFeedback(null); }}>
                Reset
              </button>
            </div>
            {buildFeedback && <div className="build-feedback-box">{buildFeedback}</div>}
          </div>
        </div>

        {/* Right Column: Truth Table & Explanations */}
        <div className="dl-right-col">
          <div className="dl-metrics-grid">
            <MetricCard label="Selected Gate" value={activeGate.id} status="good" />
            <MetricCard label="Expression" value={activeGate.expression} status="warning" />
            <MetricCard label="Output Y" value={outputY} status={outputY ? 'good' : 'neutral'} />
          </div>

          {/* Truth Table */}
          <div className="dl-truth-table-card">
            <h4>Live Truth Table</h4>
            <table className="truth-table">
              <thead>
                <tr>
                  <th>Input A</th>
                  {activeGate.id !== 'NOT' && <th>Input B</th>}
                  <th>Output Y</th>
                </tr>
              </thead>
              <tbody>
                {activeGate.truthTable.map((row, idx) => {
                  const isActive =
                    row.a === inputA && (activeGate.id === 'NOT' || row.b === inputB)
                  return (
                    <tr key={idx} className={isActive ? 'active-row' : ''}>
                      <td>{row.a}</td>
                      {activeGate.id !== 'NOT' && <td>{row.b}</td>}
                      <td className="highlight">{row.y}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {mode === 'ENGINEERING' ? (
            <EquationBreakdown
              title="De Morgan's Laws & Boolean Equivalence"
              formula="\overline{A \cdot B} = \bar{A} + \bar{B} \quad \text{and} \quad \overline{A + B} = \bar{A} \cdot \bar{B}"
              variables={[
                { symbol: 'A', name: 'Input Signal A', value: inputA, unit: 'binary' },
                { symbol: 'B', name: 'Input Signal B', value: inputB, unit: 'binary' },
              ]}
              substitution={`NAND(${inputA}, ${inputB}) = NOT(${inputA}) OR NOT(${inputB})`}
              calculation={`Y = ${outputY}`}
              result={`Output Y = ${outputY}`}
              physicalMeaning="De Morgan's laws allow synthesis tools to convert AND/OR networks into pure NAND/NOR CMOS implementations for optimal cell area."
            />
          ) : (
            <div className="learning-panel-box">
              <h4>🎓 Learning Summary</h4>
              <p>{activeGate.summary}</p>
            </div>
          )}
        </div>
      </div>

      <ChallengeCard labId="digitallogic" challenges={logicChallenges} />
    </section>
  )
}
