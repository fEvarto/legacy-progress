
import { useState } from 'react'
import type { Housing, Job, JobProgressState, MetaLevel, PotionState, Skills, SkillId, Innate } from '../types'
import { levelThreshold, metaProgressPercent, metaXpIntoLevel, metaLevelThreshold, requiredXpForLevel } from '../utils'
import { accessories, shopPotions, skillMeta } from '../data'


type HeroPanelProps = {
  age: number
  lifespanYears: number
  money: number
  dailyIncome: number
  dailySpending: number
  jobUpkeepDaily: number
  housingRentDaily: number
  netDaily: number
  generation: number
  metaLevel: MetaLevel
  currentJob: Job
  skills: Skills
  jobProgress: JobProgressState
  currentHouse: Housing
  activePotions: PotionState[]
  ownedAccessories: string[]
    innate?: Innate
}

type ModalKind = 'age' | 'money' | 'generation' | 'innate' | 'job'

export const HeroPanel = ({ age, lifespanYears, money, dailyIncome, dailySpending, jobUpkeepDaily, housingRentDaily, netDaily, generation, metaLevel, currentJob, skills, jobProgress, currentHouse, activePotions, ownedAccessories, innate }: HeroPanelProps) => {
  const [openModal, setOpenModal] = useState<ModalKind | null>(null)
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

  const currentProgress = jobProgress[currentJob.id] ?? { level: 1, xp: 0 }
  const jobRequiredXp = requiredXpForLevel(currentJob, currentProgress.level)
  const jobProgressPercent = Math.min(100, (currentProgress.xp / jobRequiredXp) * 100)
  const metaXp = metaXpIntoLevel(metaLevel.xp, metaLevel.level)
  const metaProgress = metaProgressPercent(metaLevel.xp, metaLevel.level)
  const incomeSources = [{ label: 'Base job wage', value: `${currentJob.dailyWage}/day` }, ...activePotions.filter((state) => shopPotions.find((potion) => potion.id === state.id)?.effect.type === 'income').map((state) => ({ label: shopPotions.find((potion) => potion.id === state.id)?.title ?? state.id, value: 'income modifier' })), ...ownedAccessories.filter((id) => accessories.find((item) => item.id === id)?.effect.type === 'wage').map((id) => ({ label: accessories.find((item) => item.id === id)?.title ?? id, value: 'wage modifier' })), ...(innate?.effect.type === 'income' ? [{ label: innate.title, value: 'income modifier' }] : []), { label: 'Skills, research and meta progress', value: 'applied to total' }]
  const expenseSources = [{ label: `${currentJob.title} upkeep`, value: `-${jobUpkeepDaily}/day` }, { label: `${currentHouse.title} rent`, value: `-${housingRentDaily}/day` }]

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
    <>
    <section className="hero-panel">
      <div className="hero-meta-section">
        <div className="hero-meta-header">
          <span className="hero-meta-title">Meta Level {metaLevel.level}</span>
                    <span className="hero-meta-xp">{metaXp} / {metaLevelThreshold(metaLevel.level)} XP</span>
        </div>
        <div className="hero-meta-track" aria-label="Meta progression">
          <div className="progress-fill" style={{ width: `${metaProgress}%` }} />
        </div>
      </div>

      <div className="hero-stats-grid">
                <button type="button" className="hero-stat-item hero-clickable" onClick={() => setOpenModal('age')}><span className="stat-label">Age</span><strong className="stat-value">{age.toFixed(1)} / {lifespanYears} yrs</strong></button>
        <button type="button" className="hero-stat-item hero-clickable hero-money-stat" onClick={() => setOpenModal('money')}><span className="stat-label">Money &amp; daily saldo</span><strong className="stat-value">{Math.round(money)}</strong><span className="stat-detail">+{dailyIncome} / -{dailySpending} / {netDaily} per day</span></button>
        <button type="button" className="hero-stat-item hero-clickable" onClick={() => setOpenModal('generation')}><span className="stat-label">Generation</span><strong className="stat-value">#{generation}</strong></button>
        <button type="button" className="hero-stat-item hero-clickable" onClick={() => setOpenModal('innate')}><span className="stat-label">Innate</span><strong className="stat-value">{innate?.title ?? 'Standard'}</strong></button>
      </div>

      <button type="button" className="hero-job-section hero-job-clickable" onClick={() => setOpenModal('job')}>
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
            </button>

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
    {openModal && (
      <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpenModal(null) }}>
        <section className="hero-modal" role="dialog" aria-modal="true" aria-labelledby="hero-modal-title">
          <div className="modal-header"><h2 id="hero-modal-title">{openModal === 'age' ? 'Age & lifespan' : openModal === 'money' ? 'Money & daily saldo' : openModal === 'generation' ? 'Generation lineage' : openModal === 'innate' ? 'Innate details' : 'Current job'}</h2><button type="button" className="modal-close" aria-label="Close modal" onClick={() => setOpenModal(null)}>×</button></div>
          {openModal === 'age' && <div className="modal-content"><p><strong>{age.toFixed(1)} years old</strong>, with {Math.max(0, lifespanYears - age).toFixed(1)} years remaining.</p><div className="modal-list"><div><span>Base lifespan</span><strong>{lifespanYears} years</strong></div><div><span>Time flow</span><strong>1 day per simulation day</strong></div><div><span>Active modifiers</span><strong>None</strong></div></div></div>}
          {openModal === 'money' && <div className="modal-content"><div className="modal-list"><div><span>Current balance</span><strong>{Math.round(money)}</strong></div><div><span>Daily income</span><strong className="positive">+{dailyIncome}</strong></div><div><span>Daily expenses</span><strong className="negative">-{dailySpending}</strong></div><div><span>Net daily saldo</span><strong>{netDaily}</strong></div></div><h3>Income sources</h3><div className="modal-list">{incomeSources.map((source) => <div key={source.label}><span>{source.label}</span><strong>{source.value}</strong></div>)}</div><h3>Expense sources</h3><div className="modal-list">{expenseSources.map((source) => <div key={source.label}><span>{source.label}</span><strong>{source.value}</strong></div>)}</div></div>}
          {openModal === 'generation' && <div className="modal-content"><p>This is generation <strong>#{generation}</strong>. Ancestor history will appear here as new generations are created.</p><div className="modal-list"><div><span>Current generation</span><strong>#{generation}</strong></div><div><span>Ancestors recorded</span><strong>{Math.max(0, generation - 1)}</strong></div><div><span>Meta level</span><strong>{metaLevel.level}</strong></div></div></div>}
          {openModal === 'innate' && <div className="modal-content">{innate ? <><h3>{innate.title}</h3><p>{innate.description}</p><div className="modal-list"><div><span>Effect category</span><strong>{innate.effect.type}</strong></div><div><span>Effect</span><strong>{innate.effect.type} +{Math.round(innate.effect.value * 100)}%</strong></div></div></> : <p>No innate is currently selected. Choose one in Prestige.</p>}</div>}
          {openModal === 'job' && <div className="modal-content"><h3>{currentJob.title}</h3><p>{currentJob.description}</p><div className="modal-list"><div><span>Category</span><strong>{currentJob.category}</strong></div><div><span>Job level</span><strong>Lv.{currentProgress.level}</strong></div><div><span>Job XP</span><strong>{currentProgress.xp} / {jobRequiredXp}</strong></div></div><h3>Developing skills</h3>{developingSkills.map(([skillId]) => { const skill = skills[skillId]; const meta = skillMeta[skillId]; return <div key={skillId} className="modal-skill"><span>{meta.name} · Lv.{skill.level}</span><div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(100, skill.xp / levelThreshold(skill.level) * 100)}%` }} /></div></div> })}<div className="hero-progress-bar"><div className="progress-fill" style={{ width: `${jobProgressPercent}%` }} /></div></div>}
                </section>
      </div>
    )}
    </>
  )
}