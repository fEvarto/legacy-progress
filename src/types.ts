export type SkillId = 'physical' | 'social' | 'craft' | 'knowledge' | 'creativity' | 'survival'
export type SkillCategory = 'Body' | 'Mind' | 'Society'
export type TabId = 'overview' | 'skills' | 'economy' | 'shop' | 'settings'

export type SkillState = {
  level: number
  xp: number
  category: SkillCategory
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

