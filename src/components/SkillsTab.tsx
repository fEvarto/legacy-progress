import type { Job, SkillId, Skills } from '../types'
import { isSkillUnlocked, levelThreshold } from '../utils'
import { skillMeta } from '../data'

type SkillsTabProps = {
  skills: Skills
  currentJob: Job
  skillXpMultiplier: number
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
            <h3>{category}</h3>
            <div className="table-wrapper">
              <table className="skill-table">
                <thead>
                  <tr>
                    <th>Skill</th>
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
                                      const skillRequirements = Object.entries(skillMeta[key].requirements ?? {})
                                        .map(([requiredSkillId, level]) => `${skillMeta[requiredSkillId as SkillId].name} ${level}`)
                                        .join(', ')
                                      const jobSkillGain = currentJob.skills[key] ?? 0
                                      const dailyXp = unlocked ? Math.round(jobSkillGain * skillXpMultiplier) : 0
                                      const effects = unlocked ? Object.entries(skillMeta[key].effects ?? {})
                                        .map(([effect, value]) => {
                                          const currentBonus = Math.max(0, skill.level - 1) * value
                                          const label = effect === 'jobXp' ? 'Current job XP' : effect === 'jobPay' ? 'Current job pay' : 'Skill XP'
                                                                                    return `${label} +${(currentBonus * 100).toFixed(1)}% (×${(1 + currentBonus).toFixed(3)})`
                                        }) : []

                    return (
                                            <tr key={skillId} className={!unlocked ? 'locked-row' : ''}>
                        <td>
                          <div className="job-name-cell">
                            <span>{skillMeta[key].name}</span>
                            {!unlocked && <small className="job-requirement">Requires {skillRequirements}</small>}
                          </div>
                        </td>
                        <td>{unlocked ? skill.level : '—'}</td>
                        <td>{dailyXp}</td>
                        <td>{effects.length > 0 ? effects.join(', ') : '—'}</td>
                        <td>
                          <div className="progress-track skill-progress" aria-label={`${skillMeta[skillId as SkillId].name} level progress`}>
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
