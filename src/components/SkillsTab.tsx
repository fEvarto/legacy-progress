import type { Job, SkillEffectType, SkillId, Skills } from '../types'
import { isSkillUnlocked, levelThreshold } from '../utils'
import { skillMeta } from '../data'

type SkillsTabProps = {
  skills: Skills
  currentJob: Job
  skillXpMultiplier: number
}

const effectLabels: Record<SkillEffectType, string> = {
  jobXp: 'Job XP',
  jobPay: 'Job pay',
  skillXp: 'Skill XP',
  jobUpkeep: 'Job upkeep',
  housingRent: 'Housing rent',
}

export const SkillsTab = ({ skills, currentJob, skillXpMultiplier }: SkillsTabProps) => {
  const groupedSkills = Object.entries(skills).reduce<Record<string, Array<[string, { level: number; xp: number; category: string }]>>>((acc, entry) => {
    const [skillId, skill] = entry
    const category = skillMeta[skillId as SkillId].category
    if (!acc[category]) acc[category] = []
    acc[category].push([skillId, skill])
    return acc
  }, {})

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Skills</h2>
        <span>Level and grow</span>
      </div>
      <div className="skill-groups">
        {Object.entries(groupedSkills).map(([category, entries]) => (
          <div key={category} className="skill-group">
            <div className="table-wrapper">
              <table className="skill-table" data-category={category}>
                <thead>
                  <tr>
                    <th>{category}</th>
                    <th>Level</th>
                    <th>XP/day</th>
                    <th>Effects</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(([skillId, skill]) => {
                    const key = skillId as SkillId
                    const unlocked = isSkillUnlocked(key, skills)
                    // Only show requirements that are still missing.
                    const unmetRequirements = Object.entries(skillMeta[key].requirements ?? {})
                      .filter(([requiredSkillId, level]) => {
                        const requiredSkill = skills[requiredSkillId as SkillId]
                        return !requiredSkill || requiredSkill.level < level
                      })
                      .map(([requiredSkillId, level]) => `${skillMeta[requiredSkillId as SkillId].name} Lv.${level}`)
                    const jobSkillGain = currentJob.skills[key] ?? 0
                    const dailyXp = unlocked ? Math.round(jobSkillGain * skillXpMultiplier) : 0
                    const effects = unlocked ? Object.entries(skillMeta[key].effects ?? {})
                      .map(([effect, value]) => {
                        const currentBonus = Math.max(0, skill.level - 1) * value
                        const sign = effect === 'jobUpkeep' || effect === 'housingRent' ? '-' : '+'
                        return `${effectLabels[effect as SkillEffectType]} ${sign}${(currentBonus * 100).toFixed(1)}%`
                      }) : []

                    return (
                      <tr key={skillId} className={!unlocked ? 'locked-row' : ''}>
                        <td>
                          <div className="job-name-cell">
                            <span className="job-title">{skillMeta[key].name}</span>
                            {!unlocked && unmetRequirements.length > 0 && (
                              <small className="job-requirement">Requires {unmetRequirements.join(' · ')}</small>
                            )}
                          </div>
                        </td>
                        <td className="cell-level">{unlocked ? skill.level : '—'}</td>
                        <td className="cell-number">{dailyXp}</td>
                        <td>
                          {effects.length > 0 ? (
                            <div className="effect-chip-list">
                              {effects.map((effect) => (
                                <span key={effect} className="effect-chip">{effect}</span>
                              ))}
                            </div>
                          ) : '—'}
                        </td>
                        <td>
                          <div className="progress-track skill-progress" aria-label={`${skillMeta[key].name} level progress`}>
                            <div
                              className="progress-fill"
                              style={{ width: `${unlocked ? Math.min(100, (skill.xp / levelThreshold(skill.level)) * 100) : 0}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
