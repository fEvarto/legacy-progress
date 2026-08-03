import type { SkillId, Skills } from '../types'
import { levelThreshold } from '../utils'
import { skillMeta } from '../data'

type SkillsTabProps = {
  skills: Skills
}

export const SkillsTab = ({ skills }: SkillsTabProps) => {
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
                    <th>XP</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(([skillId, skill]) => (
                    <tr key={skillId}>
                      <td>{skillMeta[skillId as SkillId].name}</td>
                      <td>{skill.level}</td>
                      <td>{skill.xp}/{levelThreshold(skill.level)}</td>
                      <td>
                        <div className="progress-track skill-progress" aria-label={`${skillMeta[skillId as SkillId].name} level progress`}>
                          <div
                            className="progress-fill"
                            style={{ width: `${Math.min(100, (skill.xp / levelThreshold(skill.level)) * 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
