import React, { useMemo, useState } from 'react'

type Props = {
  onPowerChange?: (metrics: { dynamic: number; leakage: number; total: number }) => void
}

export default function PowerLab({ onPowerChange }: Props) {
  const [voltage, setVoltage] = useState(1.0)
  const [frequency, setFrequency] = useState(1.0) // GHz
  const [capacitance, setCapacitance] = useState(1.0) // relative units
  const [activity, setActivity] = useState(0.5)
  const [leakage, setLeakage] = useState(0.01) // A

  const dynamic = useMemo(() => activity * capacitance * voltage * voltage * frequency, [activity, capacitance, voltage, frequency])
  const leakageP = useMemo(() => voltage * leakage, [voltage, leakage])
  const total = useMemo(() => dynamic + leakageP, [dynamic, leakageP])

  React.useEffect(() => { if (onPowerChange) onPowerChange({ dynamic, leakage: leakageP, total }) }, [dynamic, leakageP, total, onPowerChange])

  function reset() { setVoltage(1.0); setFrequency(1.0); setCapacitance(1.0); setActivity(0.5); setLeakage(0.01) }
  function highPower() { setVoltage((v) => Math.min(1.3, v + 0.3)); setFrequency((f) => Math.min(2, f + 0.5)); setActivity((a) => Math.min(1, a + 0.2)) }
  function lowPower() { setVoltage((v) => Math.max(0.7, v - 0.2)); setFrequency((f) => Math.max(0.5, f - 0.3)); setActivity((a) => Math.max(0.1, a - 0.2)); setLeakage((l) => Math.max(0.001, l - 0.005)) }

  return (
    <div className="power-scene">
      <div className="power-controls">
        <label>Voltage (V): <input type="range" min={0.7} max={1.3} step={0.05} value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} /> {voltage.toFixed(2)} V</label>
        <label>Frequency (GHz): <input type="range" min={0.2} max={2} step={0.1} value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} /> {frequency.toFixed(2)} GHz</label>
        <label>Capacitance (rel): <input type="range" min={0.1} max={2} step={0.05} value={capacitance} onChange={(e) => setCapacitance(Number(e.target.value))} /> {capacitance.toFixed(2)}</label>
        <label>Activity: <input type="range" min={0} max={1} step={0.05} value={activity} onChange={(e) => setActivity(Number(e.target.value))} /> {activity.toFixed(2)}</label>
        <label>Leakage current (A): <input type="range" min={0.001} max={0.05} step={0.001} value={leakage} onChange={(e) => setLeakage(Number(e.target.value))} /> {leakage.toFixed(3)} A</label>

        <div className="power-buttons">
          <button className="button" onClick={reset}>Reset</button>
          <button className="button warning" onClick={highPower}>High Power Mode</button>
          <button className="button secondary" onClick={lowPower}>Low Power Optimization</button>
        </div>
      </div>

      <div className="power-visual">
        <div className="power-metrics">
          <div className="metric-card"><strong>{dynamic.toFixed(3)}</strong><span>Dynamic power (arb)</span></div>
          <div className="metric-card"><strong>{leakageP.toFixed(3)}</strong><span>Leakage power (arb)</span></div>
          <div className="metric-card"><strong>{total.toFixed(3)}</strong><span>Total power (arb)</span></div>
        </div>

        <div className="power-meter">
          <div className="meter-level" style={{ width: `${Math.min(100, total * 50)}%`, background: total > 1.5 ? '#ff6b6b' : '#06d6a0' }} />
        </div>

        <div className="power-explain">
          {voltage > 1.0 && <div className="explain warn">Voltage increased — dynamic power grows with V²</div>}
          {frequency > 1.2 && <div className="explain warn">High frequency increases switching power</div>}
          {total <= 0.8 && <div className="explain good">Low power operating point</div>}
        </div>
      </div>
    </div>
  )
}
