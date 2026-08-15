
import type { Housing, Job, JobProgressState, MetaLevel, PotionState, Skills, SkillId } from '../types'
import { metaLevelThreshold, levelThreshold, requiredXpForLevel } from '../utils'
import { shopPotions, skillMeta } from '../data'

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

export const HeroPanel = ({ age, lifespanYears, money, dailyIncome, dailySpending, netDaily, generation, metaLevel, currentJob, skills, jobProgress, currentHouse, activePotions }: HeroPanelProps) => {
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

  const buffEntries = activePotions.map((potionState) => {
    const potion = shopPotions.find((item) => item.id === potionState.id)
    return {
      id: potionState.id,
      title: potion?.title ?? potionState.id,
      value: `${potionState.daysLeft.toFixed(0)}d`,
      type: 'active' as const,
    }
  })

  return (
    <section className="hero-panel">
      <div className="hero-meta-section">
        <div className="hero-meta-header">
          <span className="hero-meta-title">Meta Level {metaLevel.level}</span>
          <span className="hero-meta-xp">{metaLevel.xp} / {metaLevelThreshold(metaLevel.level)} XP</span>
        </div>
        <div className="hero-meta-track" aria-label="Meta progression">
          <div
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
        <div className="hero-stat-item">
          <span className="stat-label">Innate</span>
          <strong className="stat-value">Standard</strong>
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
            {developingSkills.map(([skillId]) => {
              const skill = skills[skillId]
              const meta = skillMeta[skillId]
              const threshold = levelThreshold(skill.level)
              const progress = Math.min(100, (skill.xp / threshold) * 100)
              return (
                <div key={skillId} className="hero-dev-skill">
                  <div className="hero-dev-skill-header">
                    <span className="hero-dev-skill-name">{meta.name}</span>
                    <span className="hero-dev-skill-level">Lv.{skill.level}</span>
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
        <div className="buff-container">
          {buffEntries.length > 0 ? (
            buffEntries.map((buff) => (
              <div
                key={`${buff.type}-${buff.id}`}
                className="buff-card"
              >
                <span className="buff-card__title">{buff.title}</span>
                <span className="buff-card__value">{buff.value}</span>
              </div>
            ))
          ) : (
            <div className="buff-card buff-card--empty">
              <span className="buff-card__title">No active buffs</span>
              <span className="buff-card__value">Idle</span>
            </div>
          )}
        </div>
        <div className="hero-setup-section">
          <div className="hero-setup-title">Current Setup</div>
          <div className="hero-setup-list">
            <div className="hero-setup-item">
              <span className="hero-setup-label">Housing</span>
              <strong>{currentHouse.title}</strong>
            </div>
          </div>
        </div>
        <div className="hero-active-section">
          <div className="hero-active-title">Active Skills</div>
        </div>
      </div>
    </section>
  )
}