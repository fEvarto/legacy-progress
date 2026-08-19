import { useEffect, useState } from 'react'
import type {
  Accessory,
  Housing,
  MetaLevel,
  Potion,
  PotionCooldown,
  PotionState,
  Skills,
  TabId,
  JobProgressState,
  Innate,
} from '../types'
import { accessories, housingOptions, initialJobProgress, initialSkills, jobs, shopPotions, innates, prestigeResearches } from '../data'
import {
  averageSkillLevel,
  gainExperience,
  isJobUnlocked,
  metaLevelFromXp,
  requiredXpForLevel,
  roundTo,
  skillEffectMultiplier,
  wageForJobLevel,
} from '../utils'

const daysPerSecond = 4
const lifespanYears = 35
const saveKey = 'legacy-progress-save'

type SaveState = {
  age: number
  money: number
  selectedJobId: string
  selectedHouseId: string
  activePotions: PotionState[]
  potionCooldowns: PotionCooldown[]
  ownedAccessories: string[]
  skills: Skills
  jobProgress: JobProgressState
  generation: number
  metaLevel: MetaLevel
  runMetaXp: number
  bestMetaLevel: number
  metaPoints: number
  purchasedResearches: string[]
  researchInvestments: Record<string, number>
  availableInnateIds: string[]
  selectedInnateId: string | null
  runStarted: boolean
  tickRate: number
}

const rollInnates = () => [...innates].sort(() => Math.random() - 0.5).map((innate) => innate.id)

const createInitialSave = (): SaveState => ({
  age: 18,
  money: 140,
  selectedJobId: jobs[0].id,
  selectedHouseId: housingOptions[0].id,
  activePotions: [],
  potionCooldowns: [],
  ownedAccessories: [],
  skills: initialSkills,
  jobProgress: initialJobProgress,
  generation: 1,
  metaLevel: metaLevelFromXp(averageSkillLevel(initialSkills)),
  runMetaXp: averageSkillLevel(initialSkills),
  bestMetaLevel: 1,
  metaPoints: 0,
  purchasedResearches: [],
  researchInvestments: {},
  availableInnateIds: [],
  selectedInnateId: null,
  runStarted: true,
  tickRate: 60,
})

const loadSave = (): SaveState => {
  if (typeof window === 'undefined') return createInitialSave()

  try {
    const raw = window.localStorage.getItem(saveKey)
    if (!raw) return createInitialSave()

    const parsed = JSON.parse(raw) as Partial<SaveState>
    return {
      ...createInitialSave(),
      ...parsed,
      selectedJobId: parsed.selectedJobId ?? jobs[0].id,
      selectedHouseId: parsed.selectedHouseId ?? housingOptions[0].id,
      activePotions: parsed.activePotions ?? [],
      potionCooldowns: parsed.potionCooldowns ?? [],
      ownedAccessories: parsed.ownedAccessories ?? [],
      skills: parsed.skills ?? initialSkills,
      jobProgress: parsed.jobProgress ?? initialJobProgress,
      metaLevel: parsed.metaLevel ?? metaLevelFromXp(averageSkillLevel(parsed.skills ?? initialSkills)),
      runMetaXp: parsed.runMetaXp ?? averageSkillLevel(parsed.skills ?? initialSkills),
      bestMetaLevel: parsed.bestMetaLevel ?? 1,
      metaPoints: parsed.metaPoints ?? 0,
      purchasedResearches: parsed.purchasedResearches ?? [],
      researchInvestments: parsed.researchInvestments ?? {},
      availableInnateIds: parsed.availableInnateIds ?? [],
      selectedInnateId: parsed.selectedInnateId ?? null,
      runStarted: parsed.runStarted ?? true,
      tickRate: parsed.tickRate ?? 60,
    }
  } catch {
    return createInitialSave()
  }
}

export const useSimulation = () => {
  const persistedSave = loadSave()
  const [age, setAge] = useState(persistedSave.age)
  const [money, setMoney] = useState(persistedSave.money)
  const [selectedJobId, setSelectedJobId] = useState(persistedSave.selectedJobId)
  const [selectedHouseId, setSelectedHouseId] = useState(persistedSave.selectedHouseId)
  const [activePotions, setActivePotions] = useState<PotionState[]>(persistedSave.activePotions)
  const [potionCooldowns, setPotionCooldowns] = useState<PotionCooldown[]>(persistedSave.potionCooldowns)
  const [ownedAccessories, setOwnedAccessories] = useState<string[]>(persistedSave.ownedAccessories)
  const [skills, setSkills] = useState<Skills>(persistedSave.skills)
  const [jobProgress, setJobProgress] = useState<JobProgressState>(persistedSave.jobProgress)
  const [generation, setGeneration] = useState(persistedSave.generation)
  const [metaLevel, setMetaLevel] = useState<MetaLevel>(persistedSave.metaLevel)
  const [runMetaXp, setRunMetaXp] = useState(persistedSave.runMetaXp)
  const [bestMetaLevel, setBestMetaLevel] = useState(persistedSave.bestMetaLevel)
  const [metaPoints, setMetaPoints] = useState(persistedSave.metaPoints)
  const [purchasedResearches, setPurchasedResearches] = useState(persistedSave.purchasedResearches)
  const [researchInvestments, setResearchInvestments] = useState(persistedSave.researchInvestments)
  const [availableInnateIds, setAvailableInnateIds] = useState(persistedSave.availableInnateIds)
  const [selectedInnateId, setSelectedInnateId] = useState<string | null>(persistedSave.selectedInnateId)
  const [runStarted, setRunStarted] = useState(persistedSave.runStarted)
  const [tickRate, setTickRate] = useState(persistedSave.tickRate)
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const currentJob = jobs.find((job) => job.id === selectedJobId) ?? jobs[0]
  const currentJobProgress = jobProgress[selectedJobId] ?? { level: 1, xp: 0 }
  const currentHouse = housingOptions.find((house) => house.id === selectedHouseId) ?? housingOptions[0]
  const selectedInnate = innates.find((innate) => innate.id === selectedInnateId)
  const researchMultiplier = (type: 'xp' | 'income' | 'skillXp') => purchasedResearches.reduce((multiplier, id) => {
    const research = prestigeResearches.find((item) => item.id === id)
    return multiplier * (1 + (research?.effect.type === type ? research.effect.value : 0))
  }, 1)
  const overallXpBoost = Math.pow(1.1, Math.max(0, bestMetaLevel - 1))

  const houseXpBoost = currentHouse.xpBoost
  const potionIncomeMultiplier = activePotions.reduce((multiplier, potionState) => {
    const potion = shopPotions.find((item) => item.id === potionState.id)
    return multiplier * (1 + (potion?.effect.type === 'income' ? potion.effect.value : 0))
  }, 1)
  const potionXpMultiplier = activePotions.reduce((multiplier, potionState) => {
    const potion = shopPotions.find((item) => item.id === potionState.id)
    return multiplier * (1 + (potion?.effect.type === 'xp' ? potion.effect.value : 0))
  }, 1)
  const potionJobXpMultiplier = activePotions.reduce((multiplier, potionState) => {
    const potion = shopPotions.find((item) => item.id === potionState.id)
    return multiplier * (1 + (potion?.effect.type === 'jobXpRate' ? potion.effect.value : 0))
  }, 1)
  const accessoryIncomeMultiplier = ownedAccessories.reduce((multiplier, id) => {
    const accessory = accessories.find((item) => item.id === id)
    return multiplier * (1 + (accessory?.effect.type === 'wage' ? accessory.effect.value : 0))
  }, 1)
  const accessorySkillXpMultiplier = ownedAccessories.reduce((multiplier, id) => {
    const accessory = accessories.find((item) => item.id === id)
    return multiplier * (1 + (accessory?.effect.type === 'skillXp' ? accessory.effect.value : 0))
  }, 1)
  const accessoryJobXpMultiplier = ownedAccessories.reduce((multiplier, id) => {
    const accessory = accessories.find((item) => item.id === id)
    return multiplier * (1 + (accessory?.effect.type === 'jobXpRate' ? accessory.effect.value : 0))
  }, 1)

  // Each multiplier source is applied independently. This prevents a bonus from
  // becoming weaker as more sources are added and makes stacking predictable.
  const skillEffectPayMultiplier = skillEffectMultiplier(skills, 'jobPay')
  const skillEffectJobXpMultiplier = skillEffectMultiplier(skills, 'jobXp')
  const skillEffectSkillXpMultiplier = skillEffectMultiplier(skills, 'skillXp')
  const innateIncomeMultiplier = 1 + (selectedInnate?.effect.type === 'income' ? selectedInnate.effect.value : 0)
  const innateXpMultiplier = 1 + (selectedInnate?.effect.type === 'xp' ? selectedInnate.effect.value : 0)
  const innateSkillXpMultiplier = 1 + (selectedInnate?.effect.type === 'skillXp' ? selectedInnate.effect.value : 0)
  const dailyIncome = Math.round(
    wageForJobLevel(currentJob, currentJobProgress.level) *
      potionIncomeMultiplier *
      accessoryIncomeMultiplier *
      innateIncomeMultiplier *
      researchMultiplier('income') *
      skillEffectPayMultiplier,
  )
  const dailySpending = currentJob.upkeep + currentHouse.rent
  const skillXpMultiplier =
    (1 + houseXpBoost) *
    potionXpMultiplier *
    accessorySkillXpMultiplier *
    innateSkillXpMultiplier *
    researchMultiplier('skillXp') *
    innateXpMultiplier *
    researchMultiplier('xp') *
    skillEffectSkillXpMultiplier *
    overallXpBoost
  const jobXpMultiplier =
    (1 + houseXpBoost) *
    potionJobXpMultiplier *
    accessoryJobXpMultiplier *
    innateXpMultiplier *
    researchMultiplier('xp') *
    skillEffectJobXpMultiplier *
    overallXpBoost
  const netDaily = dailyIncome - dailySpending
  const requiredXp = requiredXpForLevel(currentJob, currentJobProgress.level)
  const jobXpPercent = Math.min(100, (currentJobProgress.xp / requiredXp) * 100)
  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills' },
    { id: 'shop', label: 'Shop' },
    { id: 'prestige', label: 'Prestige' },
    { id: 'settings', label: 'Settings' },
  ]

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMetaLevel(() => {
      const nextXp = Math.max(runMetaXp, averageSkillLevel(skills))
      setRunMetaXp(nextXp)
      return metaLevelFromXp(nextXp)
    })
  }, [skills, runMetaXp])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const saveData: SaveState = {
      age,
      money,
      selectedJobId,
      selectedHouseId,
      activePotions,
      potionCooldowns,
      ownedAccessories,
      skills,
      jobProgress,
      generation,
      metaLevel,
      runMetaXp,
      bestMetaLevel,
      metaPoints,
      purchasedResearches,
      researchInvestments,
      availableInnateIds,
      selectedInnateId,
      runStarted,
      tickRate,
    }

    window.localStorage.setItem(saveKey, JSON.stringify(saveData))
  }, [age, money, selectedJobId, selectedHouseId, activePotions, potionCooldowns, ownedAccessories, skills, jobProgress, generation, metaLevel, runMetaXp, bestMetaLevel, metaPoints, purchasedResearches,
  researchInvestments,
  availableInnateIds,
  selectedInnateId, runStarted, tickRate])

  useEffect(() => {
    const intervalMs = Math.max(1, Math.round(1000 / tickRate))
    const tickAmount = daysPerSecond / tickRate

    const interval = window.setInterval(() => {
      if (!runStarted) return
      setAge((prev) => prev + tickAmount / 365)
      setMoney((prev) => Math.max(0, roundTo(prev + dailyIncome * tickAmount - dailySpending * tickAmount)))
      setSkills((prevSkills) => gainExperience(prevSkills, currentJob, tickAmount, skillXpMultiplier))
      setJobProgress((prevProgress) => {
        const currentProgress = prevProgress[selectedJobId] ?? { level: 1, xp: 0 }
        let xp = roundTo(currentProgress.xp + currentJob.dailyXpRate * tickAmount * jobXpMultiplier)
        let level = currentProgress.level

        while (xp >= requiredXpForLevel(currentJob, level)) {
          xp = roundTo(xp - requiredXpForLevel(currentJob, level))
          level += 1
        }

        return {
          ...prevProgress,
          [selectedJobId]: { level, xp },
        }
      })

      setActivePotions((prev) =>
        prev
          .map((potion) => ({ ...potion, daysLeft: Math.max(0, potion.daysLeft - tickAmount) }))
          .filter((potion) => potion.daysLeft > 0),
      )

      setPotionCooldowns((prev) =>
        prev
          .map((cooldown) => ({ ...cooldown, daysLeft: Math.max(0, cooldown.daysLeft - tickAmount) }))
          .filter((cooldown) => cooldown.daysLeft > 0),
      )
    }, intervalMs)

    return () => window.clearInterval(interval)
  }, [currentJob, dailyIncome, dailySpending, selectedJobId, skillXpMultiplier, jobXpMultiplier, tickRate, runStarted])

  useEffect(() => {
    if (money <= 0) {
      setTimeout(() => {
        setSelectedHouseId('simple-hut')
        setActivePotions([])
        setPotionCooldowns([])
        setOwnedAccessories([])
      }, 0)
    }
  }, [money])

  const selectJob = (jobId: string) => {
    const job = jobs.find((item) => item.id === jobId)
    if (!job || !isJobUnlocked(job, jobProgress, skills)) return
    setSelectedJobId(jobId)
  }

  const buyHouse = (house: Housing) => {
    setSelectedHouseId(house.id)
  }

  const buyPotion = (potion: Potion) => {
    if (potion.cost > money) return
    const onCooldown = potionCooldowns.some((cooldown) => cooldown.id === potion.id && cooldown.daysLeft > 0)
    if (onCooldown) return

    setMoney((prev) => prev - potion.cost)
    setActivePotions((prev) => [...prev, { id: potion.id, daysLeft: potion.durationDays }])

    if (potion.cooldownDays > 0) {
      setPotionCooldowns((prev) => [...prev, { id: potion.id, daysLeft: potion.cooldownDays }])
    }
  }

  const buyAccessory = (accessory: Accessory) => {
    if (accessory.cost > money || ownedAccessories.includes(accessory.id)) return
    setMoney((prev) => prev - accessory.cost)
    setOwnedAccessories((prev) => [...prev, accessory.id])
  }

  const exportSave = () => {
    const saveData: SaveState = {
      age,
      money,
      selectedJobId,
      selectedHouseId,
      activePotions,
      potionCooldowns,
      ownedAccessories,
      skills,
      jobProgress,
      generation,
      metaLevel,
      runMetaXp,
      bestMetaLevel,
      metaPoints,
      purchasedResearches,
      researchInvestments,
      availableInnateIds,
      selectedInnateId,
      runStarted,
      tickRate,
    }

    const serialized = JSON.stringify(saveData)

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(serialized).catch(() => undefined)
    }

    return serialized
  }

  const importSave = (rawSave: string) => {
    if (!rawSave) return false

    try {
      const parsed = JSON.parse(rawSave) as Partial<SaveState>
      const nextSave: SaveState = {
        ...createInitialSave(),
        ...parsed,
        selectedJobId: parsed.selectedJobId ?? jobs[0].id,
        selectedHouseId: parsed.selectedHouseId ?? housingOptions[0].id,
        activePotions: parsed.activePotions ?? [],
        potionCooldowns: parsed.potionCooldowns ?? [],
        ownedAccessories: parsed.ownedAccessories ?? [],
        skills: parsed.skills ?? initialSkills,
        jobProgress: parsed.jobProgress ?? initialJobProgress,
        metaLevel: parsed.metaLevel ?? metaLevelFromXp(averageSkillLevel(parsed.skills ?? initialSkills)),
        runMetaXp: parsed.runMetaXp ?? averageSkillLevel(parsed.skills ?? initialSkills),
        bestMetaLevel: parsed.bestMetaLevel ?? 1,
        metaPoints: parsed.metaPoints ?? 0,
        purchasedResearches: parsed.purchasedResearches ?? [],
        researchInvestments: parsed.researchInvestments ?? {},
        availableInnateIds: parsed.availableInnateIds ?? [],
        selectedInnateId: parsed.selectedInnateId ?? null,
        runStarted: parsed.runStarted ?? true,
        tickRate: parsed.tickRate ?? 60,
      }

      setAge(nextSave.age)
      setMoney(nextSave.money)
      setSelectedJobId(nextSave.selectedJobId)
      setSelectedHouseId(nextSave.selectedHouseId)
      setActivePotions(nextSave.activePotions)
      setPotionCooldowns(nextSave.potionCooldowns)
      setOwnedAccessories(nextSave.ownedAccessories)
      setSkills(nextSave.skills)
      setJobProgress(nextSave.jobProgress)
      setGeneration(nextSave.generation)
      setMetaLevel(nextSave.metaLevel)
      setRunMetaXp(nextSave.runMetaXp)
      setBestMetaLevel(nextSave.bestMetaLevel)
      setMetaPoints(nextSave.metaPoints)
      setPurchasedResearches(nextSave.purchasedResearches)
      setResearchInvestments(nextSave.researchInvestments)
      setAvailableInnateIds(nextSave.availableInnateIds)
      setSelectedInnateId(nextSave.selectedInnateId)
      setRunStarted(nextSave.runStarted)
      setTickRate(nextSave.tickRate)
      return true
    } catch {
      return false
    }
  }

  const chooseInnate = (innate: Innate) => {
    if (!runStarted && availableInnateIds.includes(innate.id)) setSelectedInnateId(innate.id)
  }

  const startRun = () => {
    if (selectedInnateId && availableInnateIds.includes(selectedInnateId)) setRunStarted(true)
  }

  const prestige = () => {
    const prestigeAge = lifespanYears * 0.9
    if (!runStarted || age < prestigeAge || runMetaXp <= 1) return
    setMetaPoints((prev) => prev + Math.ceil(runMetaXp))
    setBestMetaLevel((prev) => Math.max(prev, metaLevel.level))
    setAge(18)
    setMoney(140)
    setSelectedJobId(jobs[0].id)
    setSelectedHouseId(housingOptions[0].id)
    setActivePotions([])
    setPotionCooldowns([])
    setOwnedAccessories([])
    setSkills(initialSkills)
    setJobProgress(initialJobProgress)
    setGeneration((prev) => prev + 1)
    setMetaLevel(metaLevelFromXp(1))
    setRunMetaXp(1)
    setAvailableInnateIds(rollInnates())
    setSelectedInnateId(null)
    setRunStarted(false)
  }

  const investResearch = (researchId: string) => {
    const research = prestigeResearches.find((item) => item.id === researchId)
    if (!research || purchasedResearches.includes(researchId)) return

    setMetaPoints((prevPoints) => {
      if (prevPoints <= 0) return prevPoints
      const invested = Math.min(0.1, prevPoints, research.cost - (researchInvestments[researchId] ?? 0))
      if (invested <= 0) return prevPoints
      setResearchInvestments((previous) => {
        const total = (previous[researchId] ?? 0) + invested
        if (total >= research.cost) setPurchasedResearches((owned) => [...owned, researchId])
        return { ...previous, [researchId]: Math.min(research.cost, total) }
      })
      return roundTo(prevPoints - invested, 2)
    })
  }

  const resetProgress = () => {
    const resetSave = createInitialSave()
    setAge(resetSave.age)
    setMoney(resetSave.money)
    setSelectedJobId(resetSave.selectedJobId)
    setSelectedHouseId(resetSave.selectedHouseId)
    setActivePotions(resetSave.activePotions)
    setPotionCooldowns(resetSave.potionCooldowns)
    setOwnedAccessories(resetSave.ownedAccessories)
    setSkills(resetSave.skills)
    setJobProgress(resetSave.jobProgress)
    setGeneration(resetSave.generation)
    setMetaLevel(resetSave.metaLevel)
    setRunMetaXp(resetSave.runMetaXp)
    setBestMetaLevel(resetSave.bestMetaLevel)
    setMetaPoints(resetSave.metaPoints)
    setPurchasedResearches(resetSave.purchasedResearches)
    setResearchInvestments(resetSave.researchInvestments)
    setAvailableInnateIds(resetSave.availableInnateIds)
    setSelectedInnateId(resetSave.selectedInnateId)
    setRunStarted(resetSave.runStarted)
    setTickRate(resetSave.tickRate)
  }

  return {
    age,
    lifespanYears,
    money,
    selectedJobId,
    selectedHouseId,
    activePotions,
    potionCooldowns,
    ownedAccessories,
    skills,
    jobProgress,
    generation,
    metaLevel,
    runMetaXp,
    bestMetaLevel,
    metaPoints,
    purchasedResearches,
    researchInvestments,
    availableInnateIds,
    selectedInnateId,
    runStarted,
    tickRate,
    activeTab,
    currentJob,
    currentJobProgress,
    currentHouse,
    dailyIncome,
    dailySpending,
    netDaily,
    skillXpMultiplier,
    jobXpMultiplier,
    requiredXp,
    jobXpPercent,
    tabs,
    selectJob,
    setActiveTab,
    setGeneration,
    setMetaLevel,
    setTickRate,
    buyHouse,
    buyPotion,
    buyAccessory,
    exportSave,
    importSave,
    resetProgress,
    chooseInnate,
    startRun,
    prestige,
    investResearch,
  }
}
