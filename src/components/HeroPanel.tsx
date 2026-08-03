import type { Housing, Job, JobProgressState, MetaLevel, PotionState, Skills, SkillId } from '../types'
import { metaLevelThreshold, levelThreshold, requiredXpForLevel } from '../utils'
import { accessories, shopPotions, skillMeta } from '../data'

type HeroPanelProps = {
  age: number
  lifespanYears: number
  money: number
  dailyIncome: number
  dailySpending: number
  netDaily: number
  generation: number
  metaLevel: MetaLevel
  currentJob: Job
  skills: Skills
  jobProgress: JobProgressState
  currentHouse: Housing
  activePotions: PotionState[]
  ownedAccessories: string[]
}

export const HeroPanel = ({ age, lifespanYears, money, dailyIncome, dailySpending, netDaily, generation, metaLevel, currentJob, skills, jobProgress, currentHouse, activePotions, ownedAccessories }: HeroPanelProps) => {
  const developingSkills = Object.entries(currentJob.skills) as [SkillId, number][]
  const progressRows = [currentJob].map((job) => {
    const state = jobProgress[job.id] ?? { level: 1, xp: 0 }
    const requiredXp = requiredXpForLevel(job, state.level)
    const progress = Math.min(100, (state.xp / requiredXp) * 100)
    return {
      job,
      state,
      progress,
    }
  })
  const currentPotionItems = activePotions
    .map((potionState) => shopPotions.find((item) => item.id === potionState.id))
    .filter((potion): potion is (typeof shopPotions)[number] => Boolean(potion))
  const currentAccessoryItems = ownedAccessories
    .map((accessoryId) => accessories.find((item) => item.id === accessoryId))
    .filter((accessory): accessory is (typeof accessories)[number] => Boolean(accessory))

  return (
    <section className="hero-panel">
      <div className="hero-meta-section">
        <div className="hero-meta-header">
          <span className="hero-meta-title">Meta Level {metaLevel.level}</span>
          <span className="hero-meta-xp">{metaLevel.xp} / {metaLevelThreshold(metaLevel.level)} XP</span>
        </div>
        <div className="hero-meta-track" aria-label="Meta progression">
          <div
            className="hero-meta-fill"
            style={{ width: `${Math.min(100, (metaLevel.xp / metaLevelThreshold(metaLevel.level)) * 100)}%` }}
          />
        </div>
      </div>

      <div className="hero-stats-grid">
        <div className="hero-stat-item">
          <span className="stat-label">Age</span>
          <strong className="stat-value">{age.toFixed(1)} / {lifespanYears} yrs</strong>
        </div>
        <div className="hero-stat-item">
          <span className="stat-label">Money</span>
          <strong className="stat-value">{Math.round(money)}</strong>
        </div>
        <div className="hero-stat-item">
          <span className="stat-label">Income / day</span>
          <strong className="stat-value">{dailyIncome}</strong>
        </div>
        <div className="hero-stat-item">
          <span className="stat-label">Spending / day</span>
          <strong className="stat-value">{dailySpending}</strong>
        </div>
        <div className="hero-stat-item">
          <span className="stat-label">Net / day</span>
          <strong className={`stat-value ${netDaily >= 0 ? 'positive' : 'negative'}`}>{netDaily}</strong>
        </div>
        <div className="hero-stat-item">
          <span className="stat-label">Generation</span>
          <strong className="stat-value">#{generation}</strong>
        </div>
      </div>

      <div className="hero-job-section">
        <div className="hero-job-header">
          <span className="hero-job-label">Current Job</span>
          <strong className="hero-job-title">{currentJob.title}</strong>
          <span className="hero-job-category">{currentJob.category}</span>
        </div>
        <div className="hero-progress-table">
          {progressRows.map(({ job, state, progress }) => (
            <div key={job.id} className="hero-progress-row active">
              <div className="hero-progress-row-main">
                <span>{job.title}</span>
                <span>Lv.{state.level}</span>
              </div>
              <div className="hero-progress-bar" aria-label={`${job.title} progress`}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="hero-dev-skills">
          <span className="hero-dev-label">Developing Skills</span>
          <div className="hero-dev-list">
            {developingSkills.map(([skillId, gain]) => {
              const skill = skills[skillId]
              const meta = skillMeta[skillId]
              const threshold = levelThreshold(skill.level)
              const progress = Math.min(100, (skill.xp / threshold) * 100)
              return (
                <div key={skillId} className="hero-dev-skill">
                  <div className="hero-dev-skill-header">
                    <span className="hero-dev-skill-name">{meta.name}</span>
                    <span className="hero-dev-skill-level">Lv.{skill.level}</span>
                    <span className="hero-dev-skill-gain">+{gain}/s</span>
                  </div>
                  <div className="progress-track" aria-label={`${meta.name} development`}>
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="hero-effects-section">
        <div className="hero-effects-label">Buffs &amp; Debuffs</div>
        <div className="hero-effects-slots">
            <div className="hero-innate-section">
          <div className="hero-innate-card hero-innate-card--empty">
            <span>No innate ability yet</span>
          </div>
        </div>
          <div className="effect-slot effect-slot--empty">
            <span>Empty</span>
          </div>
          <div className="effect-slot effect-slot--empty">
            <span>Empty</span>
          </div>
          <div className="effect-slot effect-slot--empty">
            <span>Empty</span>
          </div>
        </div>
        <div className="hero-setup-section">
          <div className="hero-setup-title">Current Setup</div>
          <div className="hero-setup-list">
            <div className="hero-setup-item">
              <span className="hero-setup-label">Housing</span>
              <strong>{currentHouse.title}</strong>
            </div>
            <div className="hero-setup-item">
              <span className="hero-setup-label">Potions</span>
              {currentPotionItems.length > 0 ? (
                <div className="hero-setup-inline-list">
                  {currentPotionItems.map((potion) => (
                    <span key={potion.id}>{potion.title}</span>
                  ))}
                </div>
              ) : (
                <span className="hero-setup-empty">None</span>
              )}
            </div>
            <div className="hero-setup-item">
              <span className="hero-setup-label">Accessories</span>
              {currentAccessoryItems.length > 0 ? (
                <div className="hero-setup-inline-list">
                  {currentAccessoryItems.map((accessory) => (
                    <span key={accessory.id}>{accessory.title}</span>
                  ))}
                </div>
              ) : (
                <span className="hero-setup-empty">None</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}