import type { ChangeEvent } from 'react'
import { useMemo, useState, useEffect } from 'react'

type Props = {
  clockPeriod?: number // ns
  skew?: number // ns
  c2q?: number
  combDelay?: number
  wireDelay?: number
  setup?: number
  hold?: number
  onTimingChange?: (metrics: { setupSlack: number; holdSlack: number }) => void
}

export default function TimingLab({ clockPeriod = 2, skew = 0, c2q = 0.1, combDelay = 1.0, wireDelay = 0.2, setup = 0.1, hold = 0.05, onTimingChange }: Props) {
  const [periodOverride, setPeriodOverride] = useState<number | undefined>(undefined)
  const [skOverride, setSkOverride] = useState<number | undefined>(undefined)
  const [c2qVal, setC2qVal] = useState(c2q)
  const [comb, setComb] = useState(combDelay)
  const [wire, setWire] = useState(wireDelay)
  const [setupT, setSetupT] = useState(setup)
  const [holdT, setHoldT] = useState(hold)

  const period = periodOverride ?? clockPeriod
  const sk = skOverride ?? skew

  const launchTime = useMemo(() => 0 + c2qVal + comb + wire, [c2qVal, comb, wire])
  const captureTime = useMemo(() => period - sk, [period, sk])
  const requiredTime = captureTime - setupT
  const arrivalTime = launchTime
  const setupSlack = requiredTime - arrivalTime
  const holdSlack = arrivalTime - holdT

  useEffect(() => {
    if (onTimingChange) onTimingChange({ setupSlack, holdSlack })
  }, [setupSlack, holdSlack, onTimingChange])

  function reset() {
    setPeriodOverride(undefined)
    setSkOverride(undefined)
    setC2qVal(0.1)
    setComb(1.0)
    setWire(0.2)
    setSetupT(0.1)
    setHoldT(0.05)
  }

  function makeViolation() {
    setComb((v) => v + 1.2)
  }

  function optimize() {
    setComb((v) => Math.max(0.2, v - 0.5))
    setWire((w) => Math.max(0.05, w - 0.1))
    setPeriodOverride((prev) => Math.max(1, (prev ?? clockPeriod) + 0.2))
  }

  return (
    <div className="timing-scene">
      <div className="timing-controls">
        <label>Clock period (ns): <input type="range" min={0.8} max={5} step={0.1} value={period} onChange={(e: ChangeEvent<HTMLInputElement>) => setPeriodOverride(Number(e.target.value))} /> {period.toFixed(2)} ns</label>
        <label>Clock skew (ns): <input type="range" min={0} max={0.8} step={0.01} value={sk} onChange={(e: ChangeEvent<HTMLInputElement>) => setSkOverride(Number(e.target.value))} /> {sk.toFixed(3)} ns</label>
        <label>Clock-to-Q (ns): <input type="range" min={0.01} max={0.5} step={0.01} value={c2qVal} onChange={(e) => setC2qVal(Number(e.target.value))} /> {c2qVal.toFixed(2)} ns</label>
        <label>Combinational delay (ns): <input type="range" min={0} max={3} step={0.05} value={comb} onChange={(e) => setComb(Number(e.target.value))} /> {comb.toFixed(2)} ns</label>
        <label>Wire delay (ns): <input type="range" min={0} max={1} step={0.01} value={wire} onChange={(e) => setWire(Number(e.target.value))} /> {wire.toFixed(2)} ns</label>

        <div className="timing-buttons">
          <button className="button" onClick={reset}>Reset</button>
          <button className="button warning" onClick={makeViolation}>Make Timing Violation</button>
          <button className="button secondary" onClick={optimize}>Optimize Timing</button>
        </div>
      </div>

      <div className="timing-visual">
        <svg width={640} height={120} viewBox="0 0 640 120">
          {/* simple timing diagram: clock edge at t=0, data launches, arrives at capture */}
          <rect x={20} y={20} width={600} height={70} fill="#111" rx={6} />
          <text x={40} y={40} fill="#fff">Launch FF</text>
          <text x={300} y={40} fill="#fff">Combinational</text>
          <text x={540} y={40} fill="#fff">Capture FF</text>

          {/* bars showing times */}
          <rect x={80} y={60} width={Math.max(6, launchTime * 60)} height={10} fill="#06d6a0" />
          <rect x={80 + Math.max(6, launchTime * 60)} y={60} width={Math.max(6,  (period - sk - arrivalTime) * 60)} height={10} fill={setupSlack >= 0 ? '#06d6a0' : '#ff6b6b'} />

          <text x={40} y={100} fill="#fff">Setup slack: <tspan fill={setupSlack >= 0 ? '#06d6a0' : '#ff6b6b'}>{setupSlack.toFixed(3)} ns</tspan></text>
          <text x={320} y={100} fill="#fff">Hold slack: <tspan fill={holdSlack >= 0 ? '#06d6a0' : '#ff6b6b'}>{holdSlack.toFixed(3)} ns</tspan></text>
        </svg>

        <div className="timing-feedback">
          {setupSlack < 0 && <div className="explain warn">🔴 Setup violation detected</div>}
          {setupSlack >= 0 && <div className="explain good">🟢 Timing passes on setup</div>}
          {holdSlack < 0 && <div className="explain warn">🔴 Hold violation detected</div>}
        </div>
      </div>
    </div>
  )
}
