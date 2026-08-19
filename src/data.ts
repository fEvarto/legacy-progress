import type { Housing, Potion, Accessory, SkillId, Skills, Job, JobProgressState, SkillMeta, Innate, PrestigeResearch } from './types'

export const innates: Innate[] = [
  { id: 'quick-study', title: 'Quick Study', description: '+15% to all XP gained this run.', effect: { type: 'xp', value: 0.15 } },
  { id: 'golden-touch', title: 'Golden Touch', description: '+20% income this run.', effect: { type: 'income', value: 0.2 } },
  { id: 'natural-teacher', title: 'Natural Teacher', description: '+25% skill XP gained this run.', effect: { type: 'skillXp', value: 0.25 } },
]

export const prestigeResearches: PrestigeResearch[] = [
  { id: 'second-chance', title: 'Second Chance', description: 'Unlock a stronger choice of innates.', cost: 5, effect: { type: 'xp', value: 0.05 } },
  { id: 'deep-roots', title: 'Deep Roots', description: '+10% skill XP in every future run.', cost: 10, effect: { type: 'skillXp', value: 0.1 } },
  { id: 'prosperity', title: 'Prosperity', description: '+10% income in every future run.', cost: 15, effect: { type: 'income', value: 0.1 } },
]

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

export const skillMeta: Record<SkillId, SkillMeta> = {
  physical: {
    name: 'Physical',
    category: 'Body',
    description: 'Strength and endurance',
    effects: { jobPay: 0.01 },
  },
  social: {
    name: 'Social',
    category: 'Society',
    description: 'Persuasion and cooperation',
    effects: { jobXp: 0.01 },
  },
  craft: {
    name: 'Craft',
    category: 'Body',
    description: 'Hands-on making and repair',
    effects: { skillXp: 0.01 },
  },
  knowledge: {
    name: 'Knowledge',
    category: 'Mind',
    description: 'Study and analysis',
    effects: { jobXp: 0.005, skillXp: 0.005 },
  },
  creativity: {
    name: 'Creativity',
    category: 'Mind',
    description: 'Design and invention',
    requirements: { knowledge: 10 },
    effects: { skillXp: 0.01 },
  },
  survival: {
    name: 'Survival',
    category: 'Society',
    description: 'Adaptation and resilience',
    requirements: { knowledge: 20 },
    effects: { jobPay: 0.005 },
  },
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
    upkeep: 7,
    requiredXpBase: 100,
    dailyXpRate: 5,
    skills: { knowledge: 10, craft: 10, social: 10 },
    requiredSkills: { physical: 1, social: 1, craft: 1 },
  },
  {
    id: 'shift-supervisor',
    title: 'Shift Supervisor',
    category: 'Fast Food',
    description: 'Coordinate the kitchen rush and keep service moving.',
    dailyWage: 20,
    upkeep: 10,
    requiredXpBase: 150,
    dailyXpRate: 5,
    skills: { social: 10, survival: 10, knowledge: 10 },
    requiredSkills: { knowledge: 30 },
    unlock: { requiredJobId: 'chef', requiredLevel: 10 },
  },
  {
    id: 'assistant-manager',
    title: 'Assistant Manager',
    category: 'Fast Food',
    description: 'Support the manager, train staff, and keep the restaurant organized.',
    dailyWage: 30,
    upkeep: 15,
    requiredXpBase: 225,
    dailyXpRate: 5,
    skills: { social: 10, knowledge: 10, creativity: 10 },
    requiredSkills: { survival: 35 },
    unlock: { requiredJobId: 'shift-supervisor', requiredLevel: 10 },
  },
  {
    id: 'restaurant-manager',
    title: 'Restaurant Manager',
    category: 'Fast Food',
    description: 'Run the restaurant, manage performance, and deliver strong results.',
    dailyWage: 40,
    upkeep: 20,
    requiredXpBase: 337,
    dailyXpRate: 5,
    skills: { social: 10, knowledge: 10, creativity: 10 },
    requiredSkills: { creativity: 40 },
    unlock: { requiredJobId: 'assistant-manager', requiredLevel: 10 },
  },
  {
    id: 'regional-manager',
    title: 'Regional Manager',
    category: 'Fast Food',
    description: 'Lead several restaurants and set standards across the region.',
    dailyWage: 66,
    upkeep: 22,
    requiredXpBase: 500,
    dailyXpRate: 5,
    skills: { social: 10, knowledge: 10, creativity: 10 },
    requiredSkills: { creativity: 45, survival: 45 },
    unlock: { requiredJobId: 'restaurant-manager', requiredLevel: 10 },
  },
]

export const initialJobProgress: JobProgressState = jobs.reduce((acc, job) => {
  acc[job.id] = { level: 1, xp: 0 }
  return acc
}, {} as JobProgressState)