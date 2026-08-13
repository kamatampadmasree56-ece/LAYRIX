const STORAGE_KEY = 'LAYRIX_PROGRESS_V1'

export type ProgressData = {
  completedLevels: number[]
  completedLabs: string[]
  completedExercises: string[]
  completedProjects: string[]
}

const defaultProgress: ProgressData = {
  completedLevels: [0, 1], // Start with Level 0 & 1 unlocked
  completedLabs: ['digital-logic', 'cmos-inverter'],
  completedExercises: ['ex-1'],
  completedProjects: [],
}

export function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load progress', e)
  }
  return defaultProgress
}

export function saveProgress(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save progress', e)
  }
}
