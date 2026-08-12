import { useEffect, useMemo, useState } from 'react'

type SynthesisMetrics = {
  synthGateCount: number
  synthCellCount: number
  synthArea: number
  synthDelay: number
  synthPower: number
  synthCriticalPath: number
  synthFanout: number
}

type Props = {
  onSynthesisChange?: (metrics: SynthesisMetrics | null) => void
}

type OptimizationMode = 'AREA' | 'TIMING' | 'POWER'

type ExampleId = 'and' | 'mux' | 'counter' | 'alu'

type ExampleDefinition = {
  id: ExampleId
  name: string
  rtl: string
  description: string
  baselineMetrics: SynthesisMetrics
  libraryMap: Array<{ gate: string; cell: string; area: string; delay: string; power: string; drive: string }>
}

const synthesisExamples: ExampleDefinition[] = [
  {
    id: 'and',
    name: 'Simple AND gate',
    description: 'A basic combinational AND implemented in RTL.',
    rtl: `module and_gate(input A, input B, output Y);
  assign Y = A & B;
endmodule`,
    baselineMetrics: {
      synthGateCount: 2,
      synthCellCount: 2,
      synthArea: 420,
      synthDelay: 1.20,
      synthPower: 1.05,
      synthCriticalPath: 1.20,
      synthFanout: 1,
    },
    libraryMap: [
      { gate: 'AND2', cell: 'NAND2_X1 + INV_X1', area: '210 + 110', delay: '0.52 + 0.30', power: '0.34 + 0.18', drive: 'X1' },
      { gate: 'INV', cell: 'INV_X1', area: '110', delay: '0.30', power: '0.18', drive: 'X1' },
    ],
  },
  {
    id: 'mux',
    name: '2:1 MUX',
    description: 'A multiplexer selecting between two signals.',
    rtl: `module mux2(input A, input B, input S, output Y);
  assign Y = S ? B : A;
endmodule`,
    baselineMetrics: {
      synthGateCount: 4,
      synthCellCount: 4,
      synthArea: 860,
      synthDelay: 1.45,
      synthPower: 1.35,
      synthCriticalPath: 1.45,
      synthFanout: 2,
    },
    libraryMap: [
      { gate: 'MUX2', cell: 'MUX2_X1', area: '380', delay: '0.78', power: '0.52', drive: 'X1' },
      { gate: 'INV', cell: 'INV_X1', area: '110', delay: '0.30', power: '0.18', drive: 'X1' },
      { gate: 'NAND2', cell: 'NAND2_X1', area: '210', delay: '0.52', power: '0.34', drive: 'X1' },
    ],
  },
  {
    id: 'counter',
    name: 'Simple Counter',
    description: 'A register-based counter with synchronous update.',
    rtl: `module counter(input clk, input rst, output reg [1:0] q);
  always_ff @(posedge clk) begin
    if (rst) q <= 2'b00;
    else q <= q + 1;
  end
endmodule`,
    baselineMetrics: {
      synthGateCount: 12,
      synthCellCount: 8,
      synthArea: 2100,
      synthDelay: 1.65,
      synthPower: 2.70,
      synthCriticalPath: 1.65,
      synthFanout: 3,
    },
    libraryMap: [
      { gate: 'DFF', cell: 'DFF_X1', area: '360', delay: '0.68', power: '0.48', drive: 'X1' },
      { gate: 'ADDER', cell: 'XOR2_X1 + NAND2_X1', area: '340 + 210', delay: '0.60 + 0.52', power: '0.32 + 0.34', drive: 'X1' },
      { gate: 'BUFFER', cell: 'BUF_X1', area: '130', delay: '0.28', power: '0.20', drive: 'X1' },
    ],
  },
  {
    id: 'alu',
    name: 'ALU Slice',
    description: 'A simple arithmetic-logic slice with multiple operations.',
    rtl: `module alu_slice(input A, input B, input [1:0] sel, output Y);
  always_comb begin
    case (sel)
      2'b00: Y = A & B;
      2'b01: Y = A | B;
      2'b10: Y = A ^ B;
      default: Y = A;
    endcase
  end
endmodule`,
    baselineMetrics: {
      synthGateCount: 16,
      synthCellCount: 12,
      synthArea: 2640,
      synthDelay: 1.90,
      synthPower: 3.40,
      synthCriticalPath: 1.90,
      synthFanout: 4,
    },
    libraryMap: [
      { gate: 'AND2', cell: 'AND2_X1', area: '210', delay: '0.52', power: '0.34', drive: 'X1' },
      { gate: 'OR2', cell: 'NOR2_X1 + INV_X1', area: '210 + 110', delay: '0.52 + 0.30', power: '0.34 + 0.18', drive: 'X1' },
      { gate: 'XOR2', cell: 'XOR2_X1', area: '280', delay: '0.72', power: '0.42', drive: 'X1' },
      { gate: 'MUX2', cell: 'MUX2_X1', area: '380', delay: '0.78', power: '0.52', drive: 'X1' },
    ],
  },
]

const stages = ['RTL', 'Parse', 'Elaborate', 'Optimize', 'Technology Map', 'Gate Netlist'] as const

type SynthesisStage = (typeof stages)[number]

function formatMetric(value: number, unit: string) {
  return `${value.toFixed(2)} ${unit}`
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function SynthesisLab({ onSynthesisChange }: Props) {
  const [selectedExampleId, setSelectedExampleId] = useState<ExampleId>('and')
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [synthReady, setSynthReady] = useState(false)
  const [baseMetrics, setBaseMetrics] = useState<SynthesisMetrics | null>(null)
  const [currentMetrics, setCurrentMetrics] = useState<SynthesisMetrics | null>(null)
  const [optimizationMode, setOptimizationMode] = useState<OptimizationMode>('AREA')
  const [designState, setDesignState] = useState<'BASELINE' | 'BAD' | 'OPTIMIZED'>('BASELINE')
  const [warningList, setWarningList] = useState<string[]>([])
  const [engineerChoice, setEngineerChoice] = useState<string | null>(null)
  const [engineerResult, setEngineerResult] = useState<string>('Choose an answer to reveal the engineer mindset.')

  const selectedExample = useMemo(
    () => synthesisExamples.find((item) => item.id === selectedExampleId) ?? synthesisExamples[0],
    [selectedExampleId],
  )

  const progressText = isSynthesizing ? `Running ${stages[activeStep]}` : synthReady ? 'Synthesis complete' : 'Ready to synthesize'

  const synthesisWarnings = useMemo(() => {
    if (!currentMetrics) return []
    const warnings: string[] = []
    if (currentMetrics.synthFanout > 3.5) warnings.push('⚠ HIGH FANOUT')
    if (currentMetrics.synthCriticalPath > 1.7) warnings.push('⚠ TIMING CRITICAL')
    if (currentMetrics.synthArea > 2200) warnings.push('⚠ AREA INCREASED')
    if (currentMetrics.synthPower > 3.2) warnings.push('⚠ POWER INCREASED')
    return warnings
  }, [currentMetrics])

  const challengeResult = useMemo(() => {
    if (!currentMetrics) return 'Synthesize a design to evaluate the challenge.'
    const pass = currentMetrics.synthArea <= 1500 && currentMetrics.synthDelay <= 1.2
    return pass ? 'PASS ✓' : 'FAIL ✕'
  }, [currentMetrics])

  const challengeSummary = useMemo(() => {
    if (!currentMetrics) return 'Area limit: 1500 µm², Delay limit: 1.20 ns.'
    return `Area ${currentMetrics.synthArea.toFixed(0)} µm², Delay ${currentMetrics.synthDelay.toFixed(2)} ns.`
  }, [currentMetrics])

  useEffect(() => {
    if (!isSynthesizing || activeStep >= stages.length) return undefined
    const timer = window.setTimeout(() => {
      if (activeStep + 1 < stages.length) {
        setActiveStep((prev) => prev + 1)
      } else {
        setIsSynthesizing(false)
        setSynthReady(true)
        setDesignState('BASELINE')
        setCurrentMetrics(selectedExample.baselineMetrics)
        setBaseMetrics(selectedExample.baselineMetrics)
      }
    }, 700)
    return () => window.clearTimeout(timer)
  }, [activeStep, isSynthesizing, selectedExample])

  useEffect(() => {
    if (typeof onSynthesisChange === 'function') {
      onSynthesisChange(currentMetrics)
    }
  }, [currentMetrics, onSynthesisChange])

  useEffect(() => {
    if (engineerChoice === null) return
    if (engineerChoice === 'C') {
      setEngineerResult('Correct. Timing optimization often increases area and power.')
    } else {
      setEngineerResult('Not quite. Timing optimization usually impacts area, power, or both.')
    }
  }, [engineerChoice])

  const runSynthesis = () => {
    setIsSynthesizing(true)
    setSynthReady(false)
    setActiveStep(0)
    setWarningList([])
    setEngineerChoice(null)
    setEngineerResult('Choose an answer to reveal the engineer mindset.')
    setDesignState('BASELINE')
  }

  const applyOptimization = () => {
    if (!baseMetrics) return
    setDesignState('OPTIMIZED')
    const delta = optimizationMode === 'AREA'
      ? { area: -0.18, delay: 0.08, power: -0.13, count: -0.12, fanout: 0.0, critical: 0.06 }
      : optimizationMode === 'TIMING'
        ? { area: 0.16, delay: -0.18, power: 0.10, count: 0.12, fanout: 0.1, critical: -0.14 }
        : { area: -0.08, delay: 0.10, power: -0.22, count: -0.06, fanout: 0.05, critical: 0.08 }

    setCurrentMetrics({
      synthGateCount: clamp(baseMetrics.synthGateCount * (1 + delta.count), 1, 9999),
      synthCellCount: clamp(baseMetrics.synthCellCount * (1 + delta.count), 1, 9999),
      synthArea: clamp(baseMetrics.synthArea * (1 + delta.area), 100, 9999),
      synthDelay: clamp(baseMetrics.synthDelay * (1 + delta.delay), 0.1, 9.9),
      synthPower: clamp(baseMetrics.synthPower * (1 + delta.power), 0.1, 9999),
      synthCriticalPath: clamp(baseMetrics.synthCriticalPath * (1 + delta.critical), 0.1, 9.9),
      synthFanout: clamp(baseMetrics.synthFanout * (1 + delta.fanout), 1, 9),
    })
  }

  const applyBadDesign = () => {
    if (!baseMetrics) return
    setDesignState('BAD')
    setCurrentMetrics({
      synthGateCount: clamp(baseMetrics.synthGateCount * 1.35, 1, 9999),
      synthCellCount: clamp(baseMetrics.synthCellCount * 1.30, 1, 9999),
      synthArea: clamp(baseMetrics.synthArea * 1.35, 100, 9999),
      synthDelay: clamp(baseMetrics.synthDelay * 1.42, 0.1, 9.9),
      synthPower: clamp(baseMetrics.synthPower * 1.45, 0.1, 9999),
      synthCriticalPath: clamp(baseMetrics.synthCriticalPath * 1.45, 0.1, 9.9),
      synthFanout: clamp(baseMetrics.synthFanout * 1.6, 1, 9),
    })
  }

  const logicDiagram = useMemo(() => {
    if (selectedExample.id === 'and') {
      return (
        <div className="logic-row">
          <div className="logic-node input">A</div>
          <div className="logic-node gate">NAND2</div>
          <div className="logic-node gate small">INV</div>
          <div className="logic-node output">Y</div>
        </div>
      )
    }
    if (selectedExample.id === 'mux') {
      return (
        <div className="logic-mux-visual">
          <div className="logic-row">
            <div className="logic-node input">A</div>
            <div className="logic-node input">B</div>
            <div className="logic-node input">S</div>
          </div>
          <div className="logic-row">
            <div className="logic-node gate wide">MUX2</div>
            <div className="logic-node output">Y</div>
          </div>
        </div>
      )
    }
    if (selectedExample.id === 'counter') {
      return (
        <div className="logic-row">
          <div className="logic-node input">CLK</div>
          <div className="logic-node gate wide">ADDER</div>
          <div className="logic-node sequential">DFF</div>
          <div className="logic-node output">Q</div>
        </div>
      )
    }
    return (
      <div className="logic-grid">
        <div className="logic-node input">A</div>
        <div className="logic-node input">B</div>
        <div className="logic-node gate">AND2</div>
        <div className="logic-node gate">XOR2</div>
        <div className="logic-node gate">MUX2</div>
        <div className="logic-node output">Y</div>
      </div>
    )
  }, [selectedExample.id])

  const beforeMetrics = baseMetrics
  const afterMetrics = currentMetrics

  return (
    <section className="section synthesis-lab-section" id="synthesis-lab">
      <div className="section-heading">
        <p className="section-eyebrow">Synthesis Lab</p>
        <h2>Explore RTL → synthesis → gate-level netlist</h2>
        <p className="section-description">
          Run an educational synthesis simulation and see how RTL turns into library cells with tradeoffs.
        </p>
      </div>

      <div className="synthesis-grid">
        <div className="synthesis-panel">
          <div className="synthesis-panel-header">
            <div>
              <p className="eyebrow">RTL input</p>
              <h3>Select an example</h3>
            </div>
            <div className="synthesis-buttons">
              <button className="button secondary" type="button" onClick={runSynthesis}>SYNTHESIZE</button>
              <button className="button warning" type="button" onClick={applyBadDesign} disabled={!baseMetrics}>MAKE BAD DESIGN</button>
            </div>
          </div>

          <div className="example-list">
            {synthesisExamples.map((example) => (
              <button
                key={example.id}
                type="button"
                className={`button secondary small ${example.id === selectedExampleId ? 'active' : ''}`}
                onClick={() => {
                  setSelectedExampleId(example.id)
                  setSynthReady(false)
                  setBaseMetrics(null)
                  setCurrentMetrics(null)
                  setDesignState('BASELINE')
                }}
              >
                {example.name}
              </button>
            ))}
          </div>

          <div className="code-panel">
            <div className="panel-label">RTL code</div>
            <pre>{selectedExample.rtl}</pre>
          </div>

          <div className="stage-steps">
            {stages.map((step, index) => (
              <div key={step} className={`stage-step ${index <= activeStep && (isSynthesizing || synthReady) ? 'active' : ''}`}>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="stage-status">
            <strong>{progressText}</strong>
            <p>Educational synthesis simulation showing major phases.</p>
          </div>

          <div className="optimization-panel">
            <p className="eyebrow">Optimization mode</p>
            <div className="optimization-buttons">
              {(['AREA', 'TIMING', 'POWER'] as OptimizationMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`button secondary small ${optimizationMode === mode ? 'active' : ''}`}
                  onClick={() => setOptimizationMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button className="button primary" type="button" onClick={applyOptimization} disabled={!baseMetrics}>OPTIMIZE</button>
          </div>

          <div className="analysis-card">
            <h3>What just happened?</h3>
            <p>RTL describes behavior. Synthesis converts that behavior into logic gates and library cells.</p>
          </div>

          <div className="analysis-card">
            <h3>Why does this matter?</h3>
            <p>These cells will later be placed, clocked, routed, timed, and verified.</p>
          </div>
        </div>

        <div className="synthesis-results">
          <div className="metrics-grid">
            {['Gate Count', 'Cell Count', 'Area', 'Delay', 'Power', 'Critical Path', 'Fanout'].map((label) => {
              const value = afterMetrics ? (() => {
                switch (label) {
                  case 'Gate Count': return `${afterMetrics.synthGateCount}`
                  case 'Cell Count': return `${afterMetrics.synthCellCount}`
                  case 'Area': return `${afterMetrics.synthArea.toFixed(0)} µm²`
                  case 'Delay': return `${afterMetrics.synthDelay.toFixed(2)} ns`
                  case 'Power': return `${afterMetrics.synthPower.toFixed(2)} mW`
                  case 'Critical Path': return `${afterMetrics.synthCriticalPath.toFixed(2)} ns`
                  case 'Fanout': return `${afterMetrics.synthFanout.toFixed(1)}`
                  default: return '--'
                }
              })() : '--'
              return (
                <div key={label} className="metric-card">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              )
            })}
          </div>

          <div className="synthesis-diagram">
            <div className="diagram-title">Logic visualization</div>
            {logicDiagram}
          </div>

          <div className="mapping-card">
            <h3>Standard cell mapping</h3>
            <div className="mapping-table">
              <div className="mapping-row header">
                <span>Logic</span>
                <span>Cell</span>
                <span>Area</span>
                <span>Delay</span>
                <span>Power</span>
              </div>
              {selectedExample.libraryMap.map((row) => (
                <div key={`${selectedExample.id}-${row.gate}`} className="mapping-row">
                  <span>{row.gate}</span>
                  <span>{row.cell}</span>
                  <span>{row.area}</span>
                  <span>{row.delay}</span>
                  <span>{row.power}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="warning-list">
            {synthesisWarnings.map((warning) => (
              <div key={warning} className="warning-item">{warning}</div>
            ))}
            {synthesisWarnings.length === 0 && <div className="warning-item success">No warnings detected yet.</div>}
          </div>

          <div className="comparison-panel">
            <h3>Before / After</h3>
            <div className="comparison-bars">
              <div>
                <strong>Before</strong>
                <div>Area <span className="bar before" style={{ width: `${beforeMetrics ? Math.min(100, (beforeMetrics.synthArea / 30)) : 0}%` }} /></div>
                <div>Timing <span className="bar before" style={{ width: `${beforeMetrics ? Math.min(100, (beforeMetrics.synthDelay / 0.03)) : 0}%` }} /></div>
                <div>Power <span className="bar before" style={{ width: `${beforeMetrics ? Math.min(100, (beforeMetrics.synthPower / 0.05)) : 0}%` }} /></div>
              </div>
              <div>
                <strong>After</strong>
                <div>Area <span className="bar after" style={{ width: `${afterMetrics ? Math.min(100, (afterMetrics.synthArea / 30)) : 0}%` }} /></div>
                <div>Timing <span className="bar after" style={{ width: `${afterMetrics ? Math.min(100, (afterMetrics.synthDelay / 0.03)) : 0}%` }} /></div>
                <div>Power <span className="bar after" style={{ width: `${afterMetrics ? Math.min(100, (afterMetrics.synthPower / 0.05)) : 0}%` }} /></div>
              </div>
            </div>
          </div>

          <div className="engineer-box">
            <h3>Engineer thinking</h3>
            <p>If I optimize only timing, what could happen?</p>
            <div className="engineer-buttons">
              {[
                { label: 'A. Area increases', value: 'A' },
                { label: 'B. Power increases', value: 'B' },
                { label: 'C. Both', value: 'C' },
                { label: 'D. Nothing', value: 'D' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`button secondary small ${engineerChoice === option.value ? 'active' : ''}`}
                  onClick={() => setEngineerChoice(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="engineer-feedback">{engineerResult}</p>
          </div>

          <div className="challenge-panel">
            <h3>Challenge</h3>
            <p>Meet timing without exceeding the area limit.</p>
            <p>{challengeSummary}</p>
            <div className={`challenge-status ${challengeResult.includes('PASS') ? 'pass' : 'fail'}`}>
              {challengeResult}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export type { SynthesisMetrics }
export default SynthesisLab
