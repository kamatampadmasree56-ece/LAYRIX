type VideoLessonProps = {
  title: string
  description: string
  placeholderText?: string
}

export default function VideoLesson({ title, description, placeholderText = 'Video placeholder for a future visual explanation.' }: VideoLessonProps) {
  return (
    <article className="video-lesson">
      <div className="video-frame">
        <div className="video-badge">Watch Visual Explanation</div>
        <div className="video-placeholder">{placeholderText}</div>
      </div>
      <div className="video-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  )
}
