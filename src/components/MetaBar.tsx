import type { MetaLevel } from '../types'
import { metaLevelThreshold, metaProgressPercent, metaXpIntoLevel } from '../utils'

type MetaBarProps = {
  metaLevel: MetaLevel
}

export const MetaBar = ({ metaLevel }: MetaBarProps) => {
  const metaXp = metaXpIntoLevel(metaLevel.xp, metaLevel.level)
  const metaProgress = metaProgressPercent(metaLevel.xp, metaLevel.level)

  return (
    <section className="meta-bar" aria-label="Meta progression">
      <div className="meta-bar__info">
        <span className="meta-bar__eyebrow">Meta progression</span>
        <strong className="meta-bar__level">Meta Level {metaLevel.level}</strong>
      </div>
      <div className="meta-bar__progress">
        <div
          className="meta-bar__track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={metaLevelThreshold(metaLevel.level)}
          aria-valuenow={metaXp}
        >
          <div className="progress-fill" style={{ width: `${metaProgress}%` }} />
        </div>
        <span className="meta-bar__xp">{metaXp} / {metaLevelThreshold(metaLevel.level)} XP</span>
      </div>
    </section>
  )
}
