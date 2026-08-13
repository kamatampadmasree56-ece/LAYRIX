import { useState } from 'react'

type VariableInfo = {
  symbol: string
  name: string
  unit: string
  description: string
}

type EquationItem = {
  id: string
  title: string
  category: string
  formula: string
  description: string
  variables: VariableInfo[]
  physicalMeaning: string
  whyItMatters: string
  calculatorType?: 'utilization' | 'cell-density' | 'dynamic-power' | 'rc-delay' | 'setup-slack' | 'hold-slack' | 'frequency' | 'total-power'
}

const equations: EquationItem[] = [
  {
    id: 'utilization',
    title: '1. Core Utilization',
    category: 'Floorplanning & Placement',
    formula: 'Utilization = (Used Cell Area / Core Area) × 100%',
    description: 'Measures the fraction of the core area occupied by standard cells and placed macros.',
    variables: [
      { symbol: 'Used Area', name: 'Standard Cell & Macro Area', unit: 'μm²', description: 'Total silicon area taken up by placed components' },
      { symbol: 'Core Area', name: 'Total Core Area', unit: 'μm²', description: 'Total available placement area inside the core boundary' },
    ],
    physicalMeaning: 'Higher utilization packs more logic into less silicon (saving cost), but leaves fewer empty routing tracks for metal wires.',
    whyItMatters: 'Over-utilization (>85%) leads to extreme routing congestion, DRC violations, and timing degradation.',
    calculatorType: 'utilization',
  },
  {
    id: 'cell-density',
    title: '2. Cell Density',
    category: 'Placement',
    formula: 'Density = Cell Area / Available Placement Area',
    description: 'Local placement density within a specific grid tile or core region.',
    variables: [
      { symbol: 'Cell Area', name: 'Local Cell Area', unit: 'μm²', description: 'Sum of cell areas in the target bin/tile' },
      { symbol: 'Available Area', name: 'Placement Region Area', unit: 'μm²', description: 'Total area of the target bin/tile' },
    ],
    physicalMeaning: 'Indicates local crowding of standard cells in a specific region of the chip.',
    whyItMatters: 'Local high-density hotspots cause localized routing bottlenecks even if average core utilization is low.',
    calculatorType: 'cell-density',
  },
  {
    id: 'dynamic-power',
    title: '3. Dynamic Power',
    category: 'CMOS Power',
    formula: 'P_dynamic = α × C × V² × f',
    description: 'Power consumed when charging and discharging capacitive loads during signal switching.',
    variables: [
      { symbol: 'α', name: 'Switching Activity', unit: 'unitless (0 to 1)', description: 'Probability of a 0-to-1 transition per clock cycle' },
      { symbol: 'C', name: 'Load Capacitance', unit: 'pF or fF', description: 'Total capacitance of gate inputs and interconnect wires' },
      { symbol: 'V', name: 'Supply Voltage (VDD)', unit: 'Volts (V)', description: 'Operating voltage of the CMOS circuit' },
      { symbol: 'f', name: 'Clock Frequency', unit: 'MHz or GHz', description: 'Switching frequency of the clock domain' },
    ],
    physicalMeaning: 'Charging a capacitor to VDD stores ½CV² energy; discharging to GND dissipates another ½CV² as heat.',
    whyItMatters: 'Voltage has a quadratic (squared) impact on power. Reducing VDD from 1.2V to 0.9V cuts dynamic power by ~44%.',
    calculatorType: 'dynamic-power',
  },
  {
    id: 'rc-delay',
    title: '4. RC Delay (Elmore Model)',
    category: 'Timing & Parasitics',
    formula: 't_delay ≈ 0.69 × R × C',
    description: 'First-order approximation of signal propagation delay through a resistive-capacitive wire or cell.',
    variables: [
      { symbol: 'R', name: 'Equivalent Resistance', unit: 'Ω or kΩ', description: 'Transistor driver resistance + wire resistance' },
      { symbol: 'C', name: 'Total Load Capacitance', unit: 'fF or pF', description: 'Wire parasitic capacitance + receiver gate capacitance' },
    ],
    physicalMeaning: 'Time required for a node voltage to reach 50% of its final value during a step transition.',
    whyItMatters: 'Doubling wire length quadruples RC delay because both R and C increase linearly with length (delay ∝ L²).',
    calculatorType: 'rc-delay',
  },
  {
    id: 'setup-slack',
    title: '5. Setup Slack',
    category: 'Static Timing Analysis',
    formula: 'Setup Slack = Required Arrival Time − Actual Arrival Time',
    description: 'Margin by which data arrives before the setup window closes at the capture flip-flop.',
    variables: [
      { symbol: 'Required Time', name: 'Data Required Time (DRT)', unit: 'ns or ps', description: 'T_clk + t_capture_clock_delay − t_setup' },
      { symbol: 'Arrival Time', name: 'Data Arrival Time (DAT)', unit: 'ns or ps', description: 't_launch_clock_delay + t_CQ + t_logic_wire_delay' },
    ],
    physicalMeaning: 'Positive slack means data arrives safely before the setup deadline. Negative slack means a timing violation.',
    whyItMatters: 'If setup slack < 0, the flip-flop captures incorrect data, causing functional failure at target frequency.',
    calculatorType: 'setup-slack',
  },
  {
    id: 'hold-slack',
    title: '6. Hold Slack',
    category: 'Static Timing Analysis',
    formula: 'Hold Slack = Actual Arrival Time − Required Arrival Time',
    description: 'Margin by which data remains stable after the capture clock edge.',
    variables: [
      { symbol: 'Arrival Time', name: 'Data Arrival Time (DAT)', unit: 'ns or ps', description: 't_launch_clock_delay + t_CQ + t_logic_wire_delay' },
      { symbol: 'Required Time', name: 'Hold Required Time', unit: 'ns or ps', description: 't_capture_clock_delay + t_hold' },
    ],
    physicalMeaning: 'Data must not change too fast after the clock edge, or the new data overwrites the old value prematurely.',
    whyItMatters: 'Hold violations occur regardless of clock period. A hold violation means the chip fails at ALL frequencies.',
    calculatorType: 'hold-slack',
  },
  {
    id: 'frequency',
    title: '7. Clock Frequency & Period',
    category: 'Digital System Timing',
    formula: 'f_max = 1 / T_min',
    description: 'Maximum operating frequency supported by the longest critical path in the design.',
    variables: [
      { symbol: 'f_max', name: 'Maximum Frequency', unit: 'MHz / GHz', description: 'Highest clock frequency without timing violations' },
      { symbol: 'T_min', name: 'Minimum Clock Period', unit: 'ns / ps', description: 't_CQ + t_logic_max + t_wire_max + t_setup' },
    ],
    physicalMeaning: 'The reciprocal relationship between time period and frequency dictates maximum chip performance.',
    whyItMatters: 'Reducing critical path delay directly unlocks higher operating frequency and performance.',
    calculatorType: 'frequency',
  },
  {
    id: 'total-power',
    title: '8. Total Chip Power',
    category: 'Power Analysis',
    formula: 'P_total = P_dynamic + P_static',
    description: 'Sum of active switching power and idle leakage power.',
    variables: [
      { symbol: 'P_dynamic', name: 'Dynamic Power', unit: 'mW / W', description: 'Switching power + short-circuit power' },
      { symbol: 'P_static', name: 'Static (Leakage) Power', unit: 'mW / W', description: 'Subthreshold leakage + gate oxide leakage' },
    ],
    physicalMeaning: 'Total energy consumed per second by the chip, converted into thermal heat.',
    whyItMatters: 'Determines thermal envelope, cooling requirements, and battery life for mobile processors.',
    calculatorType: 'total-power',
  },
]

export default function EquationLab() {
  const [selectedEqId, setSelectedEqId] = useState<string>('utilization')

  // Calculator States
  const [usedArea, setUsedArea] = useState<number>(7000)
  const [coreArea, setCoreArea] = useState<number>(10000)

  const [cellAreaLocal, setCellAreaLocal] = useState<number>(450)
  const [regionAreaLocal, setRegionAreaLocal] = useState<number>(500)

  const [alpha, setAlpha] = useState<number>(0.1)
  const [capacitance, setCapacitance] = useState<number>(15) // pF
  const [voltage, setVoltage] = useState<number>(1.1) // V
  const [freq, setFreq] = useState<number>(1000) // MHz

  const [resistance, setResistance] = useState<number>(1.5) // kΩ
  const [capRC, setCapRC] = useState<number>(20) // fF

  const [drt, setDrt] = useState<number>(1.8) // ns
  const [dat, setDat] = useState<number>(1.5) // ns

  const [datHold, setDatHold] = useState<number>(0.35) // ns
  const [drtHold, setDrtHold] = useState<number>(0.20) // ns

  const [criticalDelay, setCriticalDelay] = useState<number>(1.25) // ns

  const [pDyn, setPDyn] = useState<number>(120) // mW
  const [pStat, setPStat] = useState<number>(35) // mW

  const currentEq = equations.find((e) => e.id === selectedEqId) || equations[0]

  return (
    <section className="section equation-lab-section" id="equation-lab">
      <div className="section-heading">
        <p className="section-eyebrow">Interactive Mathematics</p>
        <h2>Break the Equation Down — VLSI Formula Lab</h2>
        <p className="section-description">
          Examine fundamental VLSI physical design equations line-by-line: variable definitions, physical meaning, step-by-step calculations, and live interactive calculators.
        </p>
      </div>

      <div className="eq-lab-grid">
        <div className="eq-sidebar">
          <span className="eyebrow">Select Equation</span>
          <div className="eq-menu-list">
            {equations.map((eq) => (
              <button
                key={eq.id}
                type="button"
                className={`eq-menu-item ${selectedEqId === eq.id ? 'active' : ''}`}
                onClick={() => setSelectedEqId(eq.id)}
              >
                <div className="eq-menu-title">{eq.title}</div>
                <div className="eq-menu-cat">{eq.category}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="eq-main-content">
          <div className="eq-header-card">
            <div className="eq-meta-row">
              <span className="eq-cat-badge">{currentEq.category}</span>
            </div>
            <h3>{currentEq.title}</h3>
            <div className="eq-formula-box">{currentEq.formula}</div>
            <p className="eq-desc">{currentEq.description}</p>
          </div>

          <div className="eq-breakdown-card">
            <h4>Meaning of Symbols & Variables</h4>
            <div className="eq-var-table">
              {currentEq.variables.map((v) => (
                <div key={v.symbol} className="eq-var-row">
                  <div className="eq-var-symbol">{v.symbol}</div>
                  <div className="eq-var-details">
                    <strong>{v.name} ({v.unit})</strong>
                    <p>{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="eq-calculator-card">
            <h4>Interactive Live Calculator</h4>
            {currentEq.calculatorType === 'utilization' && (
              <div className="calc-container">
                <div className="calc-inputs">
                  <label>
                    Used Cell Area (μm²):
                    <input type="number" value={usedArea} onChange={(e) => setUsedArea(Number(e.target.value))} />
                  </label>
                  <label>
                    Total Core Area (μm²):
                    <input type="number" value={coreArea} onChange={(e) => setCoreArea(Number(e.target.value))} />
                  </label>
                </div>
                <div className="calc-result">
                  <span>Calculated Utilization:</span>
                  <strong>{coreArea > 0 ? ((usedArea / coreArea) * 100).toFixed(2) : 0}%</strong>
                </div>
                <div className="calc-interpretation">
                  {(usedArea / coreArea) > 0.85 ? (
                    <p className="text-warning">⚠ High Utilization (&gt;85%): Severe risk of routing congestion and timing failure!</p>
                  ) : (usedArea / coreArea) < 0.5 ? (
                    <p className="text-muted">ℹ Low Utilization (&lt;50%): Wasted silicon area. Consider shrinking core size.</p>
                  ) : (
                    <p className="text-success">✓ Optimal Utilization (50% – 85%): Balanced area efficiency and routability.</p>
                  )}
                </div>
              </div>
            )}

            {currentEq.calculatorType === 'cell-density' && (
              <div className="calc-container">
                <div className="calc-inputs">
                  <label>
                    Local Cell Area (μm²):
                    <input type="number" value={cellAreaLocal} onChange={(e) => setCellAreaLocal(Number(e.target.value))} />
                  </label>
                  <label>
                    Region Tile Area (μm²):
                    <input type="number" value={regionAreaLocal} onChange={(e) => setRegionAreaLocal(Number(e.target.value))} />
                  </label>
                </div>
                <div className="calc-result">
                  <span>Local Cell Density:</span>
                  <strong>{regionAreaLocal > 0 ? (cellAreaLocal / regionAreaLocal).toFixed(3) : 0}</strong>
                </div>
              </div>
            )}

            {currentEq.calculatorType === 'dynamic-power' && (
              <div className="calc-container">
                <div className="calc-inputs">
                  <label>
                    Switching Activity (α):
                    <input type="number" step="0.05" min="0" max="1" value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
                  </label>
                  <label>
                    Load Capacitance (C in pF):
                    <input type="number" value={capacitance} onChange={(e) => setCapacitance(Number(e.target.value))} />
                  </label>
                  <label>
                    Supply Voltage (V in Volts):
                    <input type="number" step="0.1" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} />
                  </label>
                  <label>
                    Frequency (f in MHz):
                    <input type="number" step="100" value={freq} onChange={(e) => setFreq(Number(e.target.value))} />
                  </label>
                </div>
                <div className="calc-result">
                  <span>Dynamic Power P_dyn:</span>
                  <strong>{(alpha * capacitance * 1e-12 * (voltage ** 2) * (freq * 1e6) * 1e3).toFixed(3)} mW</strong>
                </div>
              </div>
            )}

            {currentEq.calculatorType === 'rc-delay' && (
              <div className="calc-container">
                <div className="calc-inputs">
                  <label>
                    Resistance R (kΩ):
                    <input type="number" step="0.1" value={resistance} onChange={(e) => setResistance(Number(e.target.value))} />
                  </label>
                  <label>
                    Capacitance C (fF):
                    <input type="number" value={capRC} onChange={(e) => setCapRC(Number(e.target.value))} />
                  </label>
                </div>
                <div className="calc-result">
                  <span>Estimated RC Delay:</span>
                  <strong>{(0.69 * (resistance * 1e3) * (capRC * 1e-15) * 1e12).toFixed(3)} ps</strong>
                </div>
              </div>
            )}

            {currentEq.calculatorType === 'setup-slack' && (
              <div className="calc-container">
                <div className="calc-inputs">
                  <label>
                    Data Required Time (DRT in ns):
                    <input type="number" step="0.05" value={drt} onChange={(e) => setDrt(Number(e.target.value))} />
                  </label>
                  <label>
                    Data Arrival Time (DAT in ns):
                    <input type="number" step="0.05" value={dat} onChange={(e) => setDat(Number(e.target.value))} />
                  </label>
                </div>
                <div className="calc-result">
                  <span>Setup Slack (DRT − DAT):</span>
                  <strong className={(drt - dat) >= 0 ? 'text-success' : 'text-danger'}>
                    {(drt - dat).toFixed(3)} ns ({(drt - dat) >= 0 ? 'PASS ✓' : 'VIOLATION ✕'})
                  </strong>
                </div>
              </div>
            )}

            {currentEq.calculatorType === 'hold-slack' && (
              <div className="calc-container">
                <div className="calc-inputs">
                  <label>
                    Data Arrival Time (DAT in ns):
                    <input type="number" step="0.05" value={datHold} onChange={(e) => setDatHold(Number(e.target.value))} />
                  </label>
                  <label>
                    Hold Required Time (in ns):
                    <input type="number" step="0.05" value={drtHold} onChange={(e) => setDrtHold(Number(e.target.value))} />
                  </label>
                </div>
                <div className="calc-result">
                  <span>Hold Slack (DAT − Required):</span>
                  <strong className={(datHold - drtHold) >= 0 ? 'text-success' : 'text-danger'}>
                    {(datHold - drtHold).toFixed(3)} ns ({(datHold - drtHold) >= 0 ? 'PASS ✓' : 'HOLD VIOLATION ✕'})
                  </strong>
                </div>
              </div>
            )}

            {currentEq.calculatorType === 'frequency' && (
              <div className="calc-container">
                <div className="calc-inputs">
                  <label>
                    Critical Path Delay T_min (ns):
                    <input type="number" step="0.05" value={criticalDelay} onChange={(e) => setCriticalDelay(Number(e.target.value))} />
                  </label>
                </div>
                <div className="calc-result">
                  <span>Max Operating Frequency (f_max):</span>
                  <strong>{criticalDelay > 0 ? (1000 / criticalDelay).toFixed(2) : 0} MHz ({(criticalDelay > 0 ? 1 / criticalDelay : 0).toFixed(3)} GHz)</strong>
                </div>
              </div>
            )}

            {currentEq.calculatorType === 'total-power' && (
              <div className="calc-container">
                <div className="calc-inputs">
                  <label>
                    Dynamic Power (mW):
                    <input type="number" value={pDyn} onChange={(e) => setPDyn(Number(e.target.value))} />
                  </label>
                  <label>
                    Static Leakage Power (mW):
                    <input type="number" value={pStat} onChange={(e) => setPStat(Number(e.target.value))} />
                  </label>
                </div>
                <div className="calc-result">
                  <span>Total Chip Power:</span>
                  <strong>{(pDyn + pStat).toFixed(2)} mW ({( (pStat / (pDyn + pStat || 1)) * 100 ).toFixed(1)}% leakage share)</strong>
                </div>
              </div>
            )}
          </div>

          <div className="eq-takeaway-card">
            <h4>Physical Meaning & Engineering Takeaway</h4>
            <p><strong>Physical Meaning:</strong> {currentEq.physicalMeaning}</p>
            <p style={{ marginTop: '8px' }}><strong>Why It Matters:</strong> {currentEq.whyItMatters}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
