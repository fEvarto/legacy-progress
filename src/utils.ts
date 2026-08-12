import type { Skills, Job, JobProgressState, MetaLevel } from './types'

/** Round a number to a given number of decimal places, avoiding floating-point drift */
export const roundTo = (value: number, decimals: number = 2): number => {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export const levelThreshold = (level: number) => 100 + (level - 1) * 60

export const requiredXpForLevel = (job: Job, level: number) =>
  Math.round(job.requiredXpBase * (1 + (level - 1) * 0.45))

export const wageMultiplierForLevel = (level: number) => 1 + Math.log10(Math.max(level, 1)) * 0.32

export const wageForJobLevel = (job: Job, level: number) => Math.round(job.dailyWage * wageMultiplierForLevel(level))

export const isJobUnlocked = (job: Job, jobProgress: JobProgressState) => {
  if (!job.unlock) return true

  const requiredProgress = jobProgress[job.unlock.requiredJobId] ?? { level: 1, xp: 0 }
  return requiredProgress.level >= job.unlock.requiredLevel
}

export const gainExperience = (skills: Skills, job: Job, days: number, multiplier: number) => {
  const nextSkills = { ...skills }

  Object.entries(job.skills).forEach(([skillId, gain]) => {
    const key = skillId as keyof Skills
    const current = nextSkills[key]
    let xp = roundTo(current.xp + (gain as number) * days * multiplier, 2)
    let level = current.level

    while (xp >= levelThreshold(level)) {
      xp = roundTo(xp - levelThreshold(level))
      level += 1
    }

    nextSkills[key] = {
      ...current,
      level,
      xp,
    }
  })

  return nextSkills
}

/** Meta progression – how much XP needed per meta level (spans prestiges) */
export const metaLevelThreshold = (level: number) => 25 + ((level - 1) * 5)

/** Average level across all unlocked skills – drives the meta XP so it spans generations */
export const averageSkillLevel = (skills: Skills): number => {
  const unlocked = Object.values(skills)
  if (unlocked.length === 0) return 0
  return roundTo(unlocked.reduce((sum, skill) => sum + skill.level, 0) / unlocked.length, 2)
}

/**
 * Derive the meta level from accumulated meta XP.
 * The meta XP equals the average level of all unlocked skills, and the level
 * persists (never resets) across level-ups and generations.
 */
export const metaLevelFromXp = (xp: number): MetaLevel => {
  let level = 1
  let remaining = Math.max(0, xp)

  while (remaining >= metaLevelThreshold(level)) {
    remaining -= metaLevelThreshold(level)
    level += 1
  }

  return { level, xp: roundTo(xp, 2) }
}

