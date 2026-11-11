import type { Job, JobProgressState, SkillId, Skills } from '../types'
import { skillMeta } from '../data'
import { isJobUnlocked, isSkillUnlocked, requiredXpForLevel, wageForJobLevel } from '../utils'

type OverviewTabProps = {
  jobs: Job[]
  jobProgress: JobProgressState
  skills: Skills
  selectedJobId: string
  onSelectJob: (jobId: string) => void
}

export const OverviewTab = ({ jobs, jobProgress, skills, selectedJobId, onSelectJob }: OverviewTabProps) => {
  const groupedJobs = jobs.reduce<Record<string, Job[]>>((acc, job) => {
    const category = job.category
    if (!acc[category]) acc[category] = []
    acc[category].push(job)
    return acc
  }, {})

  return (
    <>
      <div className="table-group-grid">
        {Object.entries(groupedJobs).map(([category, categoryJobs]) => (
          <section key={category} className="panel">
            <div className="table-wrapper">
              <table className="job-table" data-category={category}>
                <thead>
                  <tr>
                    <th>{category}</th>
                    <th>Level</th>
                    <th>Wage/day</th>
                    <th>Job XP/day</th>
                    <th>Improving skills</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const firstLockedIndex = categoryJobs.findIndex((job) => !isJobUnlocked(job, jobProgress, skills))
                    const visibleJobs = firstLockedIndex === -1 ? categoryJobs : categoryJobs.slice(0, firstLockedIndex + 1)

                    return visibleJobs.map((job) => {
                      const unlocked = isJobUnlocked(job, jobProgress, skills)
                      const jobState = jobProgress[job.id] ?? { level: 1, xp: 0 }

                      const levelWage = wageForJobLevel(job, jobState.level)
                      const nextXp = requiredXpForLevel(job, jobState.level)
                      const progressPercent = nextXp > 0 ? Math.min(100, (jobState.xp / nextXp) * 100) : 0
                      const improvingSkills = Object.keys(job.skills) as SkillId[]

                      const requiredJob = job.unlock ? jobs.find((item) => item.id === job.unlock?.requiredJobId) : undefined
                      // Only surface requirements that are still missing, so met ones disappear.
                      const unmetRequirements: string[] = []
                      if (job.unlock && requiredJob && (jobProgress[job.unlock.requiredJobId]?.level ?? 1) < job.unlock.requiredLevel) {
                        unmetRequirements.push(`${requiredJob.title} Lv.${job.unlock.requiredLevel}`)
                      }
                      Object.entries(job.requiredSkills ?? {}).forEach(([skillId, level]) => {
                        const key = skillId as SkillId
                        const skill = skills[key]
                        if (!skill || !isSkillUnlocked(key, skills) || skill.level < level) {
                          unmetRequirements.push(`${skillMeta[key].name} Lv.${level}`)
                        }
                      })
                      const requirement = unmetRequirements.length > 0 ? `Requires ${unmetRequirements.join(' · ')}` : 'Locked'

                      return (
                        <tr
                          key={job.id}
                          className={`${selectedJobId === job.id ? 'selected-row' : ''} ${!unlocked ? 'locked-row' : ''}`}
                          onClick={() => unlocked && onSelectJob(job.id)}
                          role={unlocked ? 'button' : undefined}
                          tabIndex={unlocked ? 0 : -1}
                          onKeyDown={(e) => {
                            if (unlocked && (e.key === 'Enter' || e.key === ' ')) onSelectJob(job.id)
                          }}
                          aria-label={unlocked ? job.title : `${job.title}. ${requirement}`}
                        >
                          <td>
                            <div className="job-name-cell">
                              <span className="job-title">{job.title}</span>
                              {!unlocked && unmetRequirements.length > 0 && (
                                <small className="job-requirement">{requirement}</small>
                              )}
                            </div>
                          </td>
                          <td className="cell-level">{unlocked ? jobState.level : '—'}</td>
                          <td className="cell-number">{unlocked ? levelWage : '—'}</td>
                          <td className="cell-number">{unlocked ? job.dailyXpRate : '—'}</td>
                          <td>
                            {unlocked ? (
                              <div className="skill-chip-list">
                                {improvingSkills.map((skillId) => (
                                  <span
                                    key={skillId}
                                    className="skill-chip"
                                    data-category={skillMeta[skillId].category}
                                  >
                                    {skillMeta[skillId].name}
                                  </span>
                                ))}
                              </div>
                            ) : '—'}
                          </td>
                          <td>
                            {unlocked ? (
                              <div className="progress-track job-progress" aria-label={`${job.title} level progress`}>
                                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                              </div>
                            ) : (
                              <span className="locked-requirement">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  })()}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
