import React from 'react'

type Variable = {
  symbol: string
  name: string
  value: string | number
  unit: string
}

type Props = {
  title: string
  formula: string
  variables: Variable[]
  substitution: string
  calculation: string
  result: string
  physicalMeaning: string
}

export const EquationBreakdown: React.FC<Props> = ({
  title,
  formula,
  variables,
  substitution,
  calculation,
  result,
  physicalMeaning,
}) => {
  return (
    <div className="equation-breakdown-panel">
      <h4 className="eq-panel-title">📐 Equation Breakdown — {title}</h4>
      
      <div className="eq-step-block">
        <span className="eq-step-label">1. FORMULA</span>
        <div className="eq-formula-display">{formula}</div>
      </div>

      <div className="eq-step-block">
        <span className="eq-step-label">2. VARIABLES & INPUTS</span>
        <div className="eq-var-grid">
          {variables.map((v) => (
            <div key={v.symbol} className="eq-var-item">
              <span className="var-sym">{v.symbol}</span>
              <span className="var-name">{v.name}:</span>
              <strong className="var-val">{v.value} {v.unit}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="eq-step-block">
        <span className="eq-step-label">3. SUBSTITUTION</span>
        <div className="eq-code-box">{substitution}</div>
      </div>

      <div className="eq-step-block">
        <span className="eq-step-label">4. CALCULATION</span>
        <div className="eq-code-box">{calculation}</div>
      </div>

      <div className="eq-step-block">
        <span className="eq-step-label">5. RESULT</span>
        <div className="eq-result-box">{result}</div>
      </div>

      <div className="eq-step-block">
        <span className="eq-step-label">6. PHYSICAL MEANING IN VLSI</span>
        <p className="eq-meaning-text">{physicalMeaning}</p>
      </div>
    </div>
  )
}
