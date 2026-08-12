import { useMemo, useState } from 'react'

type Challenge = {
  question: string
  options: string[]
  answer: string
  explanation: string
}

const defaultVerilog = `module mux2to1(input wire A, B, Sel, output wire Y);
  assign Y = Sel ? B : A;
endmodule`

const questionList: Challenge[] = [
  {
    question: 'If Sel = 0, which input drives Y?',
    options: ['A', 'B', 'Neither'],
    answer: 'A',
    explanation: 'When Sel is 0, the mux selects A and passes it to Y.',
  },
  {
    question: 'If Sel = 1 and B = 0, what is Y?',
    options: ['0', '1', 'Undefined'],
    answer: '0',
    explanation: 'Sel = 1 selects B, so Y follows B. If B is 0, Y is 0.',
  },
  {
    question: 'Which keyword starts the Verilog module definition?',
    options: ['module', 'assign', 'endmodule'],
    answer: 'module',
    explanation: '`module` begins the design block in Verilog.',
  },
  {
    question: 'What does `assign` do in this code?',
    options: ['Defines combinational logic', 'Resets the circuit', 'Declares a register'],
    answer: 'Defines combinational logic',
    explanation: '`assign` creates a continuous assignment for combinational hardware.',
  },
  {
    question: 'What is the output when A = 1, B = 0, Sel = 1?',
    options: ['1', '0', 'A'],
    answer: '0',
    explanation: 'Sel = 1 selects B, and B is 0, so Y is 0.',
  },
]

const parseVerilogLines = (code: string) => {
  return code.split('\n').map((line) => line.trim())
}

const explainLine = (line: string) => {
  if (line.startsWith('module')) {
    return 'Defines the multiplexer module and its interface with inputs and outputs.'
  }
  if (line.startsWith('input')) {
    return 'Declares input signals to the module.'
  }
  if (line.startsWith('output')) {
    return 'Declares output signals that the module drives.'
  }
  if (line.startsWith('assign')) {
    return 'Creates combinational logic connecting the output to an expression.'
  }
  if (line.startsWith('endmodule')) {
    return 'Ends the module definition.'
  }
  if (line.includes('Sel ? B : A')) {
    return 'This is a 2-to-1 multiplexer: when Sel is 1 choose B, otherwise choose A.'
  }
  return 'This line is part of the module definition or logic statement.'
}

function RTLVerilogLab() {
  const [code, setCode] = useState(defaultVerilog)
  const [inputA, setInputA] = useState<0 | 1>(0)
  const [inputB, setInputB] = useState<0 | 1>(0)
  const [select, setSelect] = useState<0 | 1>(0)
  const [answers, setAnswers] = useState<string[]>(Array(questionList.length).fill(''))

  const lines = useMemo(() => parseVerilogLines(code), [code])
  const output = useMemo(() => (select === 1 ? inputB : inputA), [inputA, inputB, select])
  const truthRows = useMemo(
    () => [
      { a: 0, b: 0, sel: 0, y: 0 },
      { a: 0, b: 0, sel: 1, y: 0 },
      { a: 0, b: 1, sel: 0, y: 0 },
      { a: 0, b: 1, sel: 1, y: 1 },
      { a: 1, b: 0, sel: 0, y: 1 },
      { a: 1, b: 0, sel: 1, y: 0 },
      { a: 1, b: 1, sel: 0, y: 1 },
      { a: 1, b: 1, sel: 1, y: 1 },
    ],
    [],
  )

  const flowSteps = [
    {
      title: 'Verilog RTL',
      description: 'The code describes the behavior of the multiplexer using hardware-friendly syntax.',
    },
    {
      title: 'Logic interpretation',
      description: 'The assign statement means Y follows B when Sel is 1 and A when Sel is 0.',
    },
    {
      title: 'Gate-level representation',
      description: 'The multiplexer can be represented by a selector block with two data inputs and one output.',
    },
    {
      title: 'Simulated output',
      description: 'The selected input drives Y immediately with the current values.',
    },
  ]

  const score = useMemo(
    () => answers.reduce((count, answer, index) => (answer === questionList[index].answer ? count + 1 : count), 0),
    [answers],
  )

  const handleReset = () => {
    setCode(defaultVerilog)
    setInputA(0)
    setInputB(0)
    setSelect(0)
    setAnswers(Array(questionList.length).fill(''))
  }

  const handleExample = () => {
    setCode(defaultVerilog)
  }

  return (
    <section className="section rtl-verilog-section" id="rtl-verilog">
      <div className="section-heading">
        <p className="section-eyebrow">RTL Verilog Lab</p>
        <h2>See how Verilog RTL becomes hardware for a 2-to-1 mux</h2>
        <p className="section-description">
          Edit Verilog, interpret RTL, and visualize how the code maps to logic and outputs.
        </p>
      </div>

      <div className="rtl-grid">
        <div className="rtl-panel">
          <div className="rtl-editor-card">
            <div className="rtl-editor-header">
              <div>
                <p className="eyebrow">Verilog Editor</p>
                <h3>2-to-1 multiplexer example</h3>
              </div>
              <div className="rtl-editor-actions">
                <button className="button secondary" type="button" onClick={handleReset}>
                  Reset
                </button>
                <button className="button secondary" type="button" onClick={handleExample}>
                  Example
                </button>
              </div>
            </div>
            <textarea
              className="code-editor"
              value={code}
              rows={8}
              onChange={(event) => {
                setCode(event.target.value)
              }}
            />
          </div>

          <div className="analysis-card rtl-explanation-card">
            <h3>RTL Explanation</h3>
            <div className="rtl-line-grid">
              {lines.map((line, index) => (
                <div key={`${line}-${index}`} className="rtl-line-item">
                  <div className="rtl-line-number">{index + 1}</div>
                  <div>
                    <div className="rtl-line-code">{line || ' '}</div>
                    <p className="rtl-line-explanation">{explainLine(line)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rtl-sidebar">
          <div className="analysis-card rtl-simulation-card">
            <h3>Interactive simulation</h3>
            <div className="signal-controls">
              {[
                { label: 'A', value: inputA, setter: setInputA },
                { label: 'B', value: inputB, setter: setInputB },
                { label: 'Sel', value: select, setter: setSelect },
              ].map(({ label, value, setter }) => (
                <div key={label} className="signal-control">
                  <span>{label}</span>
                  <button
                    type="button"
                    className={`button secondary ${value === 1 ? 'active' : ''}`}
                    onClick={() => setter(value === 1 ? 0 : 1)}
                  >
                    {value}
                  </button>
                </div>
              ))}
            </div>
            <div className="signal-output">
              <span>Output Y</span>
              <strong>{output}</strong>
            </div>
          </div>

          <div className="analysis-card rtl-hardware-card">
            <h3>Hardware visualization</h3>
            <div className="hardware-visualization">
              <div className="signal-display">
                <div className={`signal-dot ${inputA === 1 ? 'high' : 'low'}`}>A</div>
                <div className={`signal-dot ${inputB === 1 ? 'high' : 'low'}`}>B</div>
                <div className={`signal-dot ${select === 1 ? 'high' : 'low'}`}>Sel</div>
              </div>
              <div className="mux-block">MUX</div>
              <div className="signal-output-block">
                <span>Y</span>
                <strong>{output}</strong>
              </div>
            </div>
            <p className="rtl-visual-note">The selected input flows through the mux block to produce Y.</p>
          </div>

          <div className="analysis-card rtl-truth-card">
            <h3>Truth table</h3>
            <table className="truth-table">
              <thead>
                <tr>
                  <th>A</th>
                  <th>B</th>
                  <th>Sel</th>
                  <th>Y</th>
                </tr>
              </thead>
              <tbody>
                {truthRows.map((row) => (
                  <tr
                    key={`${row.a}-${row.b}-${row.sel}`}
                    className={row.a === inputA && row.b === inputB && row.sel === select ? 'active-row' : ''}
                  >
                    <td>{row.a}</td>
                    <td>{row.b}</td>
                    <td>{row.sel}</td>
                    <td>{row.y}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rtl-flow-section">
        <div className="section-subheading">
          <p className="section-eyebrow">RTL → Logic → Hardware</p>
          <h3>How the Verilog translates into working logic</h3>
        </div>
        <div className="flow-card-grid">
          {flowSteps.map((step) => (
            <div key={step.title} className="flow-card">
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rtl-learning-grid">
        <div className="analysis-card">
          <h3>What is RTL?</h3>
          <p>RTL stands for register-transfer level and describes data flow and logic in a way that hardware tools can understand.</p>
        </div>
        <div className="analysis-card">
          <h3>Why use Verilog?</h3>
          <p>Verilog is a hardware description language that lets designers describe circuits in text rather than drawing every gate.</p>
        </div>
        <div className="analysis-card">
          <h3>What is synthesis?</h3>
          <p>Synthesis converts RTL code into gate-level logic that can be physically implemented on silicon.</p>
        </div>
        <div className="analysis-card">
          <h3>RTL vs physical hardware</h3>
          <p>RTL is an abstract behavior description, while physical hardware is the actual gates, wires, and cells placed on a chip.</p>
        </div>
      </div>

      <div className="analysis-card rtl-challenge-panel">
        <div className="challenge-header">
          <p className="eyebrow">Mini Challenge</p>
          <h3>Test your mux understanding</h3>
          <p>Select the answer and track your score.</p>
        </div>
        <div className="challenge-score">
          Score: <strong>{score} / {questionList.length}</strong>
        </div>
        <div className="challenge-questions">
          {questionList.map((question, index) => (
            <div key={question.question} className="challenge-question-card">
              <p className="challenge-question">{index + 1}. {question.question}</p>
              <div className="challenge-buttons">
                {question.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`button secondary ${answers[index] === option ? 'active' : ''}`}
                    onClick={() => {
                      const next = [...answers]
                      next[index] = option
                      setAnswers(next)
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {answers[index] && (
                <p className={`challenge-feedback ${answers[index] === question.answer ? 'correct' : 'incorrect'}`}>
                  {answers[index] === question.answer ? 'Correct!' : 'Not quite.'} {question.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RTLVerilogLab
