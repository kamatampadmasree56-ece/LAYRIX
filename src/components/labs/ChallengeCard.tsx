import React, { useState } from 'react'

export type Challenge = {
  id: string
  title: string
  question: string
  options?: string[]
  correctAnswer: string
  hint: string
  solution: string
  explanation: string
}

type Props = {
  labId: string
  challenges: Challenge[]
}

const STORAGE_KEY = 'LAYRIX_CHALLENGES_V1'

export const ChallengeCard: React.FC<Props> = ({ challenges }) => {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [textAnswer, setTextAnswer] = useState<string>('')
  const [showHint, setShowHint] = useState<boolean>(false)
  const [showSolution, setShowSolution] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null)
  
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch (e) {
      console.error('Failed to load challenge status', e)
    }
    return {}
  })

  const current = challenges[activeChallengeIdx]

  const handleSelectChallenge = (idx: number) => {
    setActiveChallengeIdx(idx)
    setSelectedOption('')
    setTextAnswer('')
    setShowHint(false)
    setShowSolution(false)
    setFeedback(null)
  }

  const handleCheckAnswer = () => {
    const userAns = current.options ? selectedOption : textAnswer.trim()
    if (!userAns) return

    const isCorrect = userAns.toLowerCase() === current.correctAnswer.toLowerCase()
    if (isCorrect) {
      setFeedback({ msg: '✓ Correct! Excellent reasoning.', isCorrect: true })
      const nextCompleted = { ...completed, [current.id]: true }
      setCompleted(nextCompleted)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCompleted))
      } catch (e) {
        console.error('Failed to save challenge status', e)
      }
    } else {
      setFeedback({ msg: '✕ Incorrect. Review the hint or try again.', isCorrect: false })
    }
  }

  return (
    <div className="lab-challenge-container">
      <div className="challenge-header-bar">
        <h4>🏆 Lab Challenges ({challenges.filter((c) => completed[c.id]).length}/{challenges.length} Solved)</h4>
        <div className="challenge-tabs">
          {challenges.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={`challenge-tab ${activeChallengeIdx === i ? 'active' : ''} ${completed[c.id] ? 'solved' : ''}`}
              onClick={() => handleSelectChallenge(i)}
            >
              Challenge {i + 1} {completed[c.id] ? '✓' : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="challenge-body">
        <h5>{current.title}</h5>
        <p className="challenge-q">{current.question}</p>

        {current.options ? (
          <div className="challenge-options-grid">
            {current.options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`challenge-opt-btn ${selectedOption === opt ? 'selected' : ''}`}
                onClick={() => setSelectedOption(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="challenge-text-input">
            <input
              type="text"
              placeholder="Type your answer here..."
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
            />
          </div>
        )}

        <div className="challenge-actions">
          <button type="button" className="button primary small" onClick={handleCheckAnswer}>
            Check Answer
          </button>
          <button type="button" className="button secondary small" onClick={() => setShowHint(!showHint)}>
            {showHint ? 'Hide Hint' : 'Show Hint 💡'}
          </button>
          <button type="button" className="button secondary small" onClick={() => setShowSolution(!showSolution)}>
            {showSolution ? 'Hide Solution' : 'Show Solution 🔑'}
          </button>
        </div>

        {feedback && (
          <div className={`challenge-feedback-box ${feedback.isCorrect ? 'pass' : 'fail'}`}>
            {feedback.msg}
          </div>
        )}

        {showHint && (
          <div className="challenge-hint-box">
            <strong>💡 Hint:</strong> {current.hint}
          </div>
        )}

        {showSolution && (
          <div className="challenge-solution-box">
            <p><strong>Correct Answer:</strong> {current.correctAnswer}</p>
            <p><strong>Solution:</strong> {current.solution}</p>
            <p><strong>Explanation:</strong> {current.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}
