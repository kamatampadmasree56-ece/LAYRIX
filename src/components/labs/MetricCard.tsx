import React from 'react'

type Props = {
  label: string
  value: string | number
  unit?: string
  status?: 'good' | 'warning' | 'danger' | 'neutral'
  subtext?: string
}

export const MetricCard: React.FC<Props> = ({
  label,
  value,
  unit = '',
  status = 'neutral',
  subtext,
}) => {
  const statusClasses = {
    good: 'metric-good',
    warning: 'metric-warning',
    danger: 'metric-danger',
    neutral: 'metric-neutral',
  }

  return (
    <div className={`metric-card-box ${statusClasses[status]}`}>
      <span className="metric-label">{label}</span>
      <div className="metric-value-row">
        <strong className="metric-val">{value}</strong>
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
      {subtext && <p className="metric-subtext">{subtext}</p>}
    </div>
  )
}
