import type { Innate, PrestigeResearch } from '../types'

type Props = {
  innates: Innate[]
  researches: PrestigeResearch[]
  selectedInnateId: string | null
  runStarted: boolean
  runMetaXp: number
  metaLevel: number
  bestMetaLevel: number
  metaPoints: number
  purchasedResearches: string[]
  onChooseInnate: (innate: Innate) => void
  onStartRun: () => void
  onPrestige: () => void
  onBuyResearch: (id: string) => void
}

export const PrestigeTab = ({ innates, researches, selectedInnateId, runStarted, runMetaXp, metaLevel, bestMetaLevel, metaPoints, purchasedResearches, onChooseInnate, onStartRun, onPrestige, onBuyResearch }: Props) => (
  <div className="prestige-grid">
    <section className="panel">
      <div className="panel-header"><h2>Prestige</h2><span>End this life and carry your knowledge forward</span></div>
      <div className="prestige-summary">
        <strong>{metaPoints.toFixed(2)} meta points</strong>
        <span>Run meta XP: {runMetaXp.toFixed(2)} · Current meta level: {metaLevel} · Best level: {bestMetaLevel}</span>
        <span>Best level boost: ×{Math.pow(1.1, Math.max(0, bestMetaLevel - 1)).toFixed(2)} overall XP</span>
      </div>
      <p className="muted">Prestige grants meta points equal to all meta XP earned this run. Money, housing, skills, job progress, potions and accessories are reset.</p>
      <button type="button" className="action-button danger" disabled={!runStarted || runMetaXp <= 1} onClick={onPrestige}>Prestige for {runMetaXp.toFixed(2)} points</button>
    </section>
    <section className="panel">
      <div className="panel-header"><h2>Choose an innate</h2><span>{runStarted ? 'Locked until your next run' : 'Choose one before starting'}</span></div>
      <div className="innate-grid">{innates.map((innate) => <button type="button" key={innate.id} className={`innate-card ${selectedInnateId === innate.id ? 'selected' : ''}`} disabled={runStarted} onClick={() => onChooseInnate(innate)}><strong>{innate.title}</strong><span>{innate.description}</span></button>)}</div>
      {!runStarted && <button type="button" className="action-button" disabled={!selectedInnateId} onClick={onStartRun}>Start run</button>}
    </section>
    <section className="panel">
      <div className="panel-header"><h2>Meta research</h2><span>Permanent upgrades</span></div>
      <div className="research-list">{researches.map((research) => { const owned = purchasedResearches.includes(research.id); return <div className="research-card" key={research.id}><div><strong>{research.title}</strong><span>{research.description}</span></div><button type="button" className="action-button" disabled={owned || metaPoints < research.cost} onClick={() => onBuyResearch(research.id)}>{owned ? 'Owned' : `${research.cost} points`}</button></div> })}</div>
    </section>
  </div>
)
