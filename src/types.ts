export type SkillId = 'physical' | 'social' | 'craft' | 'knowledge' | 'creativity' | 'survival'
export type SkillCategory = 'Body' | 'Mind' | 'Society'
export type SkillEffectType = 'jobXp' | 'jobPay' | 'skillXp'
export type TabId = 'overview' | 'skills' | 'economy' | 'shop' | 'prestige' | 'settings'

export type Innate = {
  id: string
  title: string
  description: string
  effect: { type: 'xp' | 'income' | 'skillXp'; value: number }
}

export type PrestigeResearch = {
  id: string
  title: string
  description: string
  cost: number
  effect: { type: 'xp' | 'income' | 'skillXp'; value: number }
}

export type SkillEffects = Partial<Record<SkillEffectType, number>>

export type SkillState = {
  level: number
  xp: number
  category: SkillCategory
}

export type SkillMeta = {
  name: string
  category: SkillCategory
  description: string
  // Other skills (and their levels) required before this skill becomes available.
  requirements?: Partial<Record<SkillId, number>>
  // Bonus to the corresponding multiplier for each level above level 1.
  effects?: SkillEffects
}

export type Skills = Record<SkillId, SkillState>

export type JobUnlock = {
  requiredJobId: string
  requiredLevel: number
}

export type Job = {
  id: string
  title: string
  category: string
  description: string
  dailyWage: number
  upkeep: number
  requiredXpBase: number
  dailyXpRate: number
  skills: Partial<Record<SkillId, number>>
  // Skill levels required to take this job, in addition to the job unlock chain.
  requiredSkills?: Partial<Record<SkillId, number>>
  unlock?: JobUnlock
}

export type JobProgressState = Record<string, { level: number; xp: number }>

export type Housing = {
  id: string
  title: string
  description: string
  xpBoost: number
  rent: number // daily money drain while living here
}

export type Potion = {
  id: string
  title: string
  description: string
  durationDays: number
  cooldownDays: number
  effect: { type: 'xp' | 'income' | 'jobXpRate'; value: number }
  cost: number
}

export type Accessory = {
  id: string
  title: string
  description: string
  effect: { type: 'wage' | 'skillXp' | 'jobXpRate'; value: number }
  cost: number
}

export type PotionState = {
  id: string
  daysLeft: number
}

export type PotionCooldown = {
  id: string
  daysLeft: number
}

export type MetaLevel = {
  level: number
  xp: number
}

export type Buff = {
  id: string
  title: string
  description: string
  type: 'buff' | 'debuff'
  remainingDays?: number
}

export type HeroInnate = {
  id: string
  title: string
  description: string
  type: 'passive' | 'active'
  icon?: string
}

