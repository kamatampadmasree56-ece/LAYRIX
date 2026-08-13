import { useEffect, useState } from 'react'
import { loadProgress, saveProgress, type ProgressData } from '../utils/progressStorage'

export default function ProgressTracker() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress())

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const totalLevels = 22 // 0 to 21
  const totalLabs = 10
  const totalExercises = 6
  const totalProjects = 6

  const levelsPct = Math.round((progress.completedLevels.length / totalLevels) * 100)
  const labsPct = Math.round((progress.completedLabs.length / totalLabs) * 100)
  const exPct = Math.round((progress.completedExercises.length / totalExercises) * 100)
  const projPct = Math.round((progress.completedProjects.length / totalProjects) * 100)

  const overallPct = Math.round(
    (levelsPct * 0.4) + (labsPct * 0.25) + (exPct * 0.15) + (projPct * 0.20)
  )

  const handleResetProgress = () => {
    if (window.confirm('Reset all learning progress in LAYRIX?')) {
      const resetData = {
        completedLevels: [0],
        completedLabs: [],
        completedExercises: [],
        completedProjects: [],
      }
      setProgress(resetData)
      saveProgress(resetData)
    }
  }

  return (
    <section className="section progress-tracker-section" id="progress">
      <div className="section-heading">
        <p className="section-eyebrow">Learning Progress System</p>
        <h2>Your LAYRIX Mastery Progress</h2>
        <p className="section-description">
          Track completed roadmap levels, interactive labs, practice exercises, and projects. Saved locally in your browser.
        </p>
      </div>

      <div className="overall-progress-card">
        <div className="overall-left">
          <div className="overall-circle">
            <span className="overall-pct-num">{overallPct}%</span>
            <span className="overall-label">Mastery</span>
          </div>
        </div>
        <div className="overall-right">
          <h3>Overall Platform Progress</h3>
          <p>
            You have completed <strong>{progress.completedLevels.length}</strong> of {totalLevels} Roadmap Levels,{' '}
            <strong>{progress.completedLabs.length}</strong> of {totalLabs} Visual Labs,{' '}
            <strong>{progress.completedExercises.length}</strong> of {totalExercises} Practice Exercises, and{' '}
            <strong>{progress.completedProjects.length}</strong> of {totalProjects} Projects.
          </p>
          <div className="overall-actions">
            <button type="button" className="button secondary small" onClick={handleResetProgress}>
              Reset Progress
            </button>
          </div>
        </div>
      </div>

      <div className="progress-metrics-grid">
        <div className="progress-metric-card">
          <div className="p-metric-header">
            <span>🗺️ Roadmap Levels</span>
            <strong>{progress.completedLevels.length} / {totalLevels}</strong>
          </div>
          <div className="p-bar-track">
            <div className="p-bar-fill" style={{ width: `${levelsPct}%` }} />
          </div>
          <span className="p-pct">{levelsPct}% Completed</span>
        </div>

        <div className="progress-metric-card">
          <div className="p-metric-header">
            <span>🔬 Interactive Labs</span>
            <strong>{progress.completedLabs.length} / {totalLabs}</strong>
          </div>
          <div className="p-bar-track">
            <div className="p-bar-fill" style={{ width: `${labsPct}%` }} />
          </div>
          <span className="p-pct">{labsPct}% Completed</span>
        </div>

        <div className="progress-metric-card">
          <div className="p-metric-header">
            <span>✏️ Practice Exercises</span>
            <strong>{progress.completedExercises.length} / {totalExercises}</strong>
          </div>
          <div className="p-bar-track">
            <div className="p-bar-fill" style={{ width: `${exPct}%` }} />
          </div>
          <span className="p-pct">{exPct}% Completed</span>
        </div>

        <div className="progress-metric-card">
          <div className="p-metric-header">
            <span>🚀 Projects & Capstone</span>
            <strong>{progress.completedProjects.length} / {totalProjects}</strong>
          </div>
          <div className="p-bar-track">
            <div className="p-bar-fill" style={{ width: `${projPct}%` }} />
          </div>
          <span className="p-pct">{projPct}% Completed</span>
        </div>
      </div>
    </section>
  )
}
