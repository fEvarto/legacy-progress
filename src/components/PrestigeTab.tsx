import { useRef } from 'react'
import type { Innate, PrestigeResearch } from '../types'

type Props = {
  innates: Innate[]
  researches: PrestigeResearch[]
  availableInnateIds: string[]
  selectedInnateId: string | null
  runStarted: boolean
  age: number
  lifespanYears: number
  runMetaXp: number
  metaLevel: number
  bestMetaLevel: number
  metaPoints: number
  purchasedResearches: string[]
  researchInvestments: Record<string, number>
  onChooseInnate: (innate: Innate) => void
  onStartRun: () => void
  onPrestige: () => void
  onInvestResearch: (id: string) => void
}

export const PrestigeTab = ({ innates, researches, availableInnateIds, selectedInnateId, runStarted, age, lifespanYears, runMetaXp, metaLevel, bestMetaLevel, metaPoints, purchasedResearches, researchInvestments, onChooseInnate, onStartRun, onPrestige, onInvestResearch }: Props) => {
  const holdTimers = useRef<Record<string, number>>({})
  const startInvesting = (id: string) => {
    onInvestResearch(id)
    holdTimers.current[id] = window.setInterval(() => onInvestResearch(id), 100)
  }
  const stopInvesting = (id: string) => {
    window.clearInterval(holdTimers.current[id])
    delete holdTimers.current[id]
  }
  const prestigeAge = lifespanYears * 0.9

  return (
  <div className="prestige-grid">
    <section className="panel">
      <div className="panel-header"><h2>Prestige</h2><span>End this life and carry your knowledge forward</span></div>
      <div className="prestige-summary">
        <strong>{Math.ceil(metaPoints)} meta points</strong>
        <span>Run meta XP: {runMetaXp.toFixed(2)} · Current meta level: {metaLevel} · Best level: {bestMetaLevel}</span>
        <span>Best level boost: ×{Math.pow(1.1, Math.max(0, bestMetaLevel - 1)).toFixed(2)} overall XP</span>
      </div>
      <p className="muted">Prestige grants rounded-up meta points. It becomes available at age {prestigeAge.toFixed(1)}, or 90% of the lifespan.</p>
      <button type="button" className="action-button danger" disabled={!runStarted || age < prestigeAge || runMetaXp <= 1} onClick={onPrestige}>{age < prestigeAge ? `Prestige unlocks at ${prestigeAge.toFixed(1)}` : `Prestige for ${Math.ceil(runMetaXp)} points`}</button>
    </section>
    <section className="panel">
      <div className="panel-header"><h2>Choose an innate</h2><span>{runStarted ? 'Locked until your next run' : 'Choose one before starting'}</span></div>
      <div className="innate-grid">{innates.filter((innate) => availableInnateIds.includes(innate.id)).map((innate) => <button type="button" key={innate.id} className={`innate-card ${selectedInnateId === innate.id ? 'selected' : ''}`} disabled={runStarted} onClick={() => onChooseInnate(innate)}><strong>{innate.title}</strong><span>{innate.description}</span></button>)}</div>
      {!runStarted && <button type="button" className="action-button" disabled={!selectedInnateId} onClick={onStartRun}>Start run</button>}
    </section>
    <section className="panel">
      <div className="panel-header"><h2>Meta research</h2><span>Permanent upgrades</span></div>
      <div className="research-list">{researches.map((research) => { const owned = purchasedResearches.includes(research.id); const invested = researchInvestments[research.id] ?? 0; return <div className="research-card" key={research.id}><div><strong>{research.title}</strong><span>{research.description}</span><small>{invested.toFixed(1)} / {research.cost} invested</small></div><button type="button" className="action-button" disabled={owned || metaPoints <= 0} onPointerDown={() => startInvesting(research.id)} onPointerUp={() => stopInvesting(research.id)} onPointerLeave={() => stopInvesting(research.id)}>{owned ? 'Owned' : 'Hold to invest'}</button></div> })}</div>
    </section>
  </div>
)
}
