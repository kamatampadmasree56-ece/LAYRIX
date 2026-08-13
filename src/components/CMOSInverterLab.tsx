import { useMemo, useState } from 'react'
import { LabHeader, type Mode } from './labs/LabHeader'
import { MetricCard } from './labs/MetricCard'
import { EquationBreakdown } from './labs/EquationBreakdown'
import { ChallengeCard, type Challenge } from './labs/ChallengeCard'

const cmosChallenges: Challenge[] = [
  {
    id: 'cmos-c1',
    title: 'Challenge 1: Predict CMOS Inverter Output',
    question: 'When VIN = 1.2V (HIGH) in a 1.2V CMOS Inverter, what are the states of the PMOS and NMOS transistors, and what is VOUT?',
    options: [
      'PMOS OFF, NMOS ON → VOUT = 0V (LOW)',
      'PMOS ON, NMOS OFF → VOUT = 1.2V (HIGH)',
      'PMOS ON, NMOS ON → Short Circuit',
      'PMOS OFF, NMOS OFF → Floating',
    ],
    correctAnswer: 'PMOS OFF, NMOS ON → VOUT = 0V (LOW)',
    hint: 'HIGH input turns NMOS ON (pull-down) and turns PMOS OFF.',
    solution: 'PMOS OFF, NMOS ON → VOUT = 0V',
    explanation: 'When Vin=HIGH, NMOS Vgs > Vth (NMOS conducts to GND) and PMOS Vgs = 0 (PMOS off). Output pulls down to 0V.',
  },
  {
    id: 'cmos-c2',
    title: 'Challenge 2: Voltage Scaling Impact on Power',
    question: 'If supply voltage VDD is reduced from 1.2V to 0.9V, by what percentage does dynamic power drop (assuming C, f, α remain constant)?',
    options: ['25.0%', '43.75%', '50.0%', '75.0%'],
    correctAnswer: '43.75%',
    hint: 'P_dynamic ∝ V². Ratio = (0.9 / 1.2)² = (0.75)² = 0.5625.',
    solution: '43.75% Power Reduction',
    explanation: 'P_new / P_old = (0.9/1.2)² = 0.5625. Power drops by 1 - 0.5625 = 43.75%.',
  },
  {
    id: 'cmos-c3',
    title: 'Challenge 3: High Noise Margin Calculation',
    question: 'If VOH = 1.2V and VIH = 0.8V, what is the High Noise Margin (NM_H)?',
    options: ['0.4 V', '0.8 V', '1.2 V', '2.0 V'],
    correctAnswer: '0.4 V',
    hint: 'NM_H = VOH − VIH.',
    solution: 'NM_H = 0.4 V',
    explanation: 'High Noise Margin NM_H = VOH − VIH = 1.2V − 0.8V = 0.4V.',
  },
]

export default function CMOSInverterLab() {
  const [mode, setMode] = useState<Mode>('LEARNING')

  // Inverter Simulation State
  const [vin, setVin] = useState<number>(0.0) // 0 to 1.2V
  const vdd = 1.2

  // Dynamic Power Calculator Sliders
  const [voltage, setVoltage] = useState<number>(1.2) // V
  const [capacitance, setCapacitance] = useState<number>(20) // fF
  const [frequency, setFrequency] = useState<number>(1000) // MHz
  const [activity, setActivity] = useState<number>(0.1) // 0 to 1

  // Compute PMOS & NMOS States
  const pmosOn = vin < 0.6
  const nmosOn = vin > 0.6

  const vout = useMemo(() => {
    if (vin < 0.4) return vdd
    if (vin > 0.8) return 0.0
    // Linear transition region around 0.6V
    return parseFloat((vdd - (vin - 0.4) * (vdd / 0.4)).toFixed(2))
  }, [vin, vdd])

  // Compute Live Dynamic Power: P = alpha * C * V^2 * f
  const dynamicPowerMW = useMemo(() => {
    const p = activity * (capacitance * 1e-15) * (voltage ** 2) * (frequency * 1e6) * 1e3
    return parseFloat(p.toFixed(3))
  }, [activity, capacitance, voltage, frequency])

  // Noise Margins
  const vil = 0.4
  const vih = 0.8
  const vol = 0.0
  const voh = vdd
  const nmH = parseFloat((voh - vih).toFixed(2))
  const nmL = parseFloat((vil - vol).toFixed(2))

  const handleResetLab = () => {
    setVin(0.0)
    setVoltage(1.2)
    setCapacitance(20)
    setFrequency(1000)
    setActivity(0.1)
  }

  return (
    <section className="section cmos-inverter-section" id="cmos-inverter">
      <LabHeader
        title="Interactive CMOS Inverter & Power Lab"
        subtitle="Simulate NMOS/PMOS switching, Voltage Transfer Curves (VTC), noise margins, and live dynamic power calculation."
        icon="🔌"
        difficulty="Beginner"
        mode={mode}
        onModeChange={setMode}
        onReset={handleResetLab}
      />

      <div className="cmos-lab-grid">
        {/* Left Column: Circuit & Slider */}
        <div className="cmos-left-col">
          <div className="cmos-circuit-card">
            <h4>CMOS Inverter Transistor Schematic</h4>

            <div className="cmos-svg-wrap">
              <svg viewBox="0 0 280 200" className="cmos-svg">
                {/* VDD Power Rail */}
                <line x1="80" y1="20" x2="200" y2="20" stroke="#EF4444" strokeWidth="3" />
                <text x="140" y="15" fill="#EF4444" fontSize="10" fontWeight="800" textAnchor="middle">VDD ({vdd}V)</text>

                {/* PMOS Transistor (Top) */}
                <rect x="115" y="35" width="50" height="40" rx="4" fill={pmosOn ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'} stroke={pmosOn ? '#22C55E' : '#475569'} strokeWidth="2" />
                <text x="140" y="58" fill={pmosOn ? '#4ADE80' : '#94A3B8'} fontSize="11" fontWeight="700" textAnchor="middle">
                  PMOS ({pmosOn ? 'ON ✓' : 'OFF ✕'})
                </text>

                {/* NMOS Transistor (Bottom) */}
                <rect x="115" y="115" width="50" height="40" rx="4" fill={nmosOn ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'} stroke={nmosOn ? '#22C55E' : '#475569'} strokeWidth="2" />
                <text x="140" y="138" fill={nmosOn ? '#4ADE80' : '#94A3B8'} fontSize="11" fontWeight="700" textAnchor="middle">
                  NMOS ({nmosOn ? 'ON ✓' : 'OFF ✕'})
                </text>

                {/* GND Ground Rail */}
                <line x1="80" y1="180" x2="200" y2="180" stroke="#94A3B8" strokeWidth="3" />
                <text x="140" y="195" fill="#94A3B8" fontSize="10" fontWeight="800" textAnchor="middle">GND (0V)</text>

                {/* Input VIN Wire */}
                <line x1="20" y1="95" x2="115" y2="95" stroke="#38BDF8" strokeWidth="2" />
                <circle cx="20" cy="95" r="8" fill="#38BDF8" />
                <text x="20" y="82" fill="#38BDF8" fontSize="10" fontWeight="700" textAnchor="middle">VIN</text>

                {/* Output VOUT Wire */}
                <line x1="140" y1="75" x2="140" y2="115" stroke={vout > 0.6 ? '#22C55E' : '#475569'} strokeWidth="2" />
                <line x1="140" y1="95" x2="260" y2="95" stroke={vout > 0.6 ? '#22C55E' : '#475569'} strokeWidth="2" />
                <circle cx="260" cy="95" r="8" fill={vout > 0.6 ? '#22C55E' : '#334155'} />
                <text x="260" y="82" fill="#F8FAFC" fontSize="10" fontWeight="700" textAnchor="middle">VOUT</text>
              </svg>
            </div>

            <div className="cmos-vin-slider-group">
              <div className="slider-header">
                <span className="ctrl-label">Adjust Input Voltage (VIN):</span>
                <strong className="slider-val">{vin.toFixed(2)} V</strong>
              </div>
              <input
                type="range"
                min="0.0"
                max={vdd}
                step="0.05"
                value={vin}
                onChange={(e) => setVin(parseFloat(e.target.value))}
                className="vin-range-slider"
              />
              <div className="slider-ticks">
                <span>0V (LOW)</span>
                <span>0.6V (Switch)</span>
                <span>1.2V (HIGH)</span>
              </div>
            </div>
          </div>

          <div className="cmos-vtc-card">
            <h4>Voltage Transfer Characteristic (VTC) Curve</h4>
            <div className="vtc-svg-wrap">
              <svg viewBox="0 0 240 140" className="vtc-svg">
                {/* Axes */}
                <line x1="30" y1="120" x2="220" y2="120" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="30" y1="10" x2="30" y2="120" stroke="#94A3B8" strokeWidth="1.5" />
                <text x="225" y="124" fill="#94A3B8" fontSize="8">VIN</text>
                <text x="25" y="8" fill="#94A3B8" fontSize="8">VOUT</text>

                {/* VTC Line */}
                <path d="M 30 15 L 80 15 L 170 120 L 220 120" stroke="#06B6D4" strokeWidth="2.5" fill="none" />

                {/* Live Operating Point Circle */}
                <circle
                  cx={30 + (vin / vdd) * 190}
                  cy={120 - (vout / vdd) * 105}
                  r="5"
                  fill="#FBBF24"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className="noise-margin-row">
              <span>NM_H = {nmH}V</span>
              <span>NM_L = {nmL}V</span>
            </div>
          </div>
        </div>

        {/* Right Column: Metrics & Dynamic Power Calculator */}
        <div className="cmos-right-col">
          <div className="cmos-metrics-grid">
            <MetricCard label="Input VIN" value={`${vin.toFixed(2)} V`} status={vin > 0.6 ? 'good' : 'neutral'} />
            <MetricCard label="Output VOUT" value={`${vout.toFixed(2)} V`} status={vout > 0.6 ? 'good' : 'neutral'} />
            <MetricCard label="PMOS State" value={pmosOn ? 'ON' : 'OFF'} status={pmosOn ? 'good' : 'neutral'} />
            <MetricCard label="NMOS State" value={nmosOn ? 'ON' : 'OFF'} status={nmosOn ? 'good' : 'neutral'} />
          </div>

          <div className="cmos-power-calc-card">
            <h4>Live Dynamic Power Calculator ($P = \alpha C V^2 f$)</h4>

            <div className="calc-sliders-grid">
              <label>
                Supply Voltage (V): <strong>{voltage} V</strong>
                <input type="range" min="0.6" max="1.5" step="0.05" value={voltage} onChange={(e) => setVoltage(parseFloat(e.target.value))} />
              </label>

              <label>
                Capacitance (C): <strong>{capacitance} fF</strong>
                <input type="range" min="5" max="100" step="5" value={capacitance} onChange={(e) => setCapacitance(parseFloat(e.target.value))} />
              </label>

              <label>
                Frequency (f): <strong>{frequency} MHz</strong>
                <input type="range" min="100" max="3000" step="100" value={frequency} onChange={(e) => setFrequency(parseFloat(e.target.value))} />
              </label>

              <label>
                Switching Activity (α): <strong>{activity}</strong>
                <input type="range" min="0.01" max="1.0" step="0.05" value={activity} onChange={(e) => setActivity(parseFloat(e.target.value))} />
              </label>
            </div>

            <div className="calc-power-result">
              <span>Calculated Dynamic Power:</span>
              <strong>{dynamicPowerMW} mW</strong>
            </div>
          </div>

          {mode === 'ENGINEERING' ? (
            <EquationBreakdown
              title="CMOS Dynamic Power Equation"
              formula="P_{\text{dynamic}} = \alpha \cdot C \cdot V^2 \cdot f"
              variables={[
                { symbol: 'α', name: 'Activity Factor', value: activity, unit: '' },
                { symbol: 'C', name: 'Capacitance', value: capacitance, unit: 'fF' },
                { symbol: 'V', name: 'Supply Voltage', value: voltage, unit: 'V' },
                { symbol: 'f', name: 'Clock Frequency', value: frequency, unit: 'MHz' },
              ]}
              substitution={`P = ${activity} * (${capacitance}fF) * (${voltage}V)^2 * (${frequency}MHz)`}
              calculation={`P = ${activity} * 1e-14 * ${(voltage ** 2).toFixed(2)} * ${frequency * 1e6}`}
              result={`${dynamicPowerMW} mW Dynamic Power`}
              physicalMeaning="Voltage scaling (VDD) has a quadratic impact on dynamic power. Halving voltage cuts dynamic power by 4x."
            />
          ) : (
            <div className="learning-panel-box">
              <h4>🎓 Learning Mode Takeaway</h4>
              <p>
                In steady state (VIN=0 or VIN=VDD), either PMOS or NMOS is completely OFF. This means static DC power is nearly ZERO in ideal CMOS! Power is consumed mainly when switching.
              </p>
            </div>
          )}
        </div>
      </div>

      <ChallengeCard labId="cmos" challenges={cmosChallenges} />
    </section>
  )
}
