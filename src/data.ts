import type { Housing, Potion, Accessory, SkillId, SkillCategory, Skills, Job, JobProgressState } from './types'

export const housingOptions: Housing[] = [
  {
    id: 'simple-hut',
    title: 'Simple Hut',
    description: 'A humble shelter with basic comforts.',
    xpBoost: 0.00,
    rent: 0,
  },
  {
    id: 'stone-cottage',
    title: 'Stone Cottage',
    description: 'Sturdy walls and a warm hearth for better focus.',
    xpBoost: 0.5,
    rent: 10,
  },
  {
    id: 'artisan-home',
    title: 'Artisan Home',
    description: 'A crafted space that inspires faster learning.',
    xpBoost: 1.25,
    rent: 20,
  },
  {
    id: 'artisan-mansion',
    title: 'Artisan Mansion',
    description: 'A grand residence that provides exceptional learning opportunities.',
    xpBoost: 2.0,
    rent: 50,
  },
]

export const shopPotions: Potion[] = [
  {
    id: 'focus-brew',
    title: 'Focus Brew',
    description: '+50% XP gain',
    durationDays: 90,
    cooldownDays: 365,
    effect: { type: 'xp', value: 0.5 },
    cost: 60,
  },
  {
    id: 'wage-elixir',
    title: 'Wage Elixir',
    description: '+20% daily income',
    durationDays: 90,
    cooldownDays: 365,
    effect: { type: 'income', value: 0.2 },
    cost: 85,
  },
  {
    id: 'training-tonic',
    title: 'Training Tonic',
    description: '+50% job XP progress',
    durationDays: 90,
    cooldownDays: 365,
    effect: { type: 'jobXpRate', value: 0.5 },
    cost: 70,
  },
]

export const accessories: Accessory[] = [
  {
    id: 'artisan-chain',
    title: 'Artisan Chain',
    description: 'Adds a small permanent bonus to income.',
    effect: { type: 'wage', value: 0.2 },
    cost: 500,
  },
  {
    id: 'scribe-quill',
    title: 'Scribe Quill',
    description: 'Improves skill XP gain through better reflection.',
    effect: { type: 'skillXp', value: 0.5 },
    cost: 2000,
  },
  {
    id: 'motivator-badge',
    title: 'Motivator Badge',
    description: 'Supports faster job progress.',
    effect: { type: 'jobXpRate', value: 0.5 },
    cost: 10000,
  },
]

export const skillMeta: Record<SkillId, { name: string; category: SkillCategory; description: string }> = {
  physical: { name: 'Physical', category: 'Body', description: 'Strength and endurance' },
  social: { name: 'Social', category: 'Society', description: 'Persuasion and cooperation' },
  craft: { name: 'Craft', category: 'Body', description: 'Hands-on making and repair' },
  knowledge: { name: 'Knowledge', category: 'Mind', description: 'Study and analysis' },
  creativity: { name: 'Creativity', category: 'Mind', description: 'Design and invention' },
  survival: { name: 'Survival', category: 'Society', description: 'Adaptation and resilience' },
}

export const initialSkills: Skills = {
  physical: { level: 1, xp: 0, category: 'Body' },
  social: { level: 1, xp: 0, category: 'Society' },
  craft: { level: 1, xp: 0, category: 'Body' },
  knowledge: { level: 1, xp: 0, category: 'Mind' },
  creativity: { level: 1, xp: 0, category: 'Mind' },
  survival: { level: 1, xp: 0, category: 'Society' },
}

export const jobs: Job[] = [
  {
    id: 'chef',
    title: 'Fast Food Chef',
    category: 'Fast Food',
    description: 'Cook and plate meals in a busy kitchen chain.',
    dailyWage: 14,
    upkeep: 8,
    requiredXpBase: 95,
    dailyXpRate: 4,
    skills: { craft: 10, social: 10, survival: 10 },
  },
  {
    id: 'shift-supervisor',
    title: 'Shift Supervisor',
    category: 'Fast Food',
    description: 'Coordinate the kitchen rush and keep service moving.',
    dailyWage: 21,
    upkeep: 10,
    requiredXpBase: 130,
    dailyXpRate: 5,
    skills: { social: 10, craft: 10, knowledge: 10 },
    unlock: { requiredJobId: 'chef', requiredLevel: 10 },
  },
]

export const initialJobProgress: JobProgressState = jobs.reduce((acc, job) => {
  acc[job.id] = { level: 1, xp: 0 }
  return acc
}, {} as JobProgressState)