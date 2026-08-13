import React from 'react'

export type Mode = 'LEARNING' | 'ENGINEERING'

type Props = {
  title: string
  subtitle: string
  icon: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  mode: Mode
  onModeChange: (mode: Mode) => void
  onReset?: () => void
}

export const LabHeader: React.FC<Props> = ({
  title,
  subtitle,
  icon,
  difficulty,
  mode,
  onModeChange,
  onReset,
}) => {
  const difficultyColors = {
    Beginner: '#22C55E',
    Intermediate: '#F59E0B',
    Advanced: '#EF4444',
  }

  return (
    <div className="lab-header-component">
      <div className="lab-title-row">
        <div className="lab-title-main">
          <span className="lab-icon-badge">{icon}</span>
          <div>
            <h3>{title}</h3>
            <p className="lab-subtitle">{subtitle}</p>
          </div>
        </div>

        <div className="lab-header-controls">
          <span
            className="lab-diff-badge"
            style={{ backgroundColor: difficultyColors[difficulty] }}
          >
            {difficulty}
          </span>

          <div className="mode-toggle-group">
            <button
              type="button"
              className={`mode-btn ${mode === 'LEARNING' ? 'active' : ''}`}
              onClick={() => onModeChange('LEARNING')}
            >
              🎓 Learning Mode
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'ENGINEERING' ? 'active' : ''}`}
              onClick={() => onModeChange('ENGINEERING')}
            >
              🛠️ Engineering Mode
            </button>
          </div>

          {onReset && (
            <button type="button" className="button secondary small" onClick={onReset}>
              🔄 Reset Lab
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
