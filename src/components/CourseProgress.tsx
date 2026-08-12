type CourseProgressProps = {
  completedStages: number
  totalStages: number
  currentStage: string
}

export default function CourseProgress({ completedStages, totalStages, currentStage }: CourseProgressProps) {
  const progress = Math.min(100, Math.round((completedStages / totalStages) * 100))

  return (
    <section className="course-progress-panel" id="course-progress">
      <div className="progress-copy">
        <p className="eyebrow">Course progress</p>
        <h2>Physical Design course roadmap</h2>
        <p>
          Track your journey from fundamentals to industry-style physical-design closure with hands-on labs and challenges.
        </p>
      </div>

      <div className="progress-details">
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-summary">
          <strong>{progress}% complete</strong>
          <span>{completedStages} of {totalStages} stages finished</span>
          <span>Current focus: {currentStage}</span>
        </div>
      </div>
    </section>
  )
}
