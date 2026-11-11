import type { Innate, SkillId } from '../types'
import { skillMeta } from '../data'

type InnateSidePanelProps = {
  innate?: Innate
}

const skillIds = Object.keys(skillMeta) as SkillId[]

/**
 * Innate-specific side panel. Each innate can expose a different widget here:
 * an active skill, a parameter to manage, a mentorship picker, and so on.
 * The current widgets are visual placeholders until their mechanics are added.
 */
export const InnateSidePanel = ({ innate }: InnateSidePanelProps) => {
  if (!innate) {
    return (
      <aside className="hero-innate-side hero-innate-side--empty" aria-label="Innate panel">
        <span className="hero-innate-side__title">Innate</span>
        <p className="hero-innate-side__hint">No innate bound. Choose one in Prestige.</p>
      </aside>
    )
  }

  const widget = (() => {
    switch (innate.id) {
      case 'quick-study':
        return (
          <div className="hero-innate-side__slot">
            <span className="hero-innate-side__label">Active skill</span>
            <strong className="hero-innate-side__value">Study Sprint</strong>
            <span className="hero-innate-side__hint">A burst of focused XP.</span>
            <button type="button" className="hero-innate-side__button" disabled>Coming soon</button>
          </div>
        )
      case 'golden-touch':
        return (
          <div className="hero-innate-side__slot">
            <span className="hero-innate-side__label">Parameter</span>
            <strong className="hero-innate-side__value">Ambition</strong>
            <input
              type="range"
              min={0}
              max={100}
              defaultValue={50}
              disabled
              aria-label="Ambition placeholder"
            />
            <span className="hero-innate-side__hint">Trade income for another stat.</span>
          </div>
        )
      case 'natural-teacher':
        return (
          <div className="hero-innate-side__slot">
            <span className="hero-innate-side__label">Mentorship</span>
            <select disabled aria-label="Mentored skill placeholder" defaultValue="">
              <option value="">Choose a skill</option>
              {skillIds.map((skillId) => (
                <option key={skillId} value={skillId}>{skillMeta[skillId].name}</option>
              ))}
            </select>
            <span className="hero-innate-side__hint">Focus XP on one skill.</span>
          </div>
        )
      default:
        return (
          <div className="hero-innate-side__slot">
            <span className="hero-innate-side__hint">No panel content for this innate yet.</span>
          </div>
        )
    }
  })()

  return (
    <aside className="hero-innate-side" aria-label={`${innate.title} innate panel`}>
      <span className="hero-innate-side__title">{innate.title}</span>
      {widget}
    </aside>
  )
}
