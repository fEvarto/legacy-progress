import type { Job, JobProgressState, SkillId, Skills } from '../types'
import { skillMeta } from '../data'
import { isJobUnlocked, requiredXpForLevel, wageForJobLevel } from '../utils'

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
      <div className="panel-header overview-caption">
          <h2>Choose a livelihood</h2>
        <span>Click a row to select the job</span>
        </div>
      <div className="table-group-grid">
        {Object.entries(groupedJobs).map(([category, categoryJobs]) => (
          <section key={category} className="panel">
            <div className="panel-header">
              <h2>{category}</h2>
              <span>{categoryJobs.length} job{categoryJobs.length > 1 ? 's' : ''}</span>
            </div>
            <div className="table-wrapper">
              <table className="job-table">
                                <thead>
                  <tr>
                    <th>Job</th>
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
                      const improvingSkills = Object.entries(job.skills)
                        .map(([skillId]) => `${skillMeta[skillId as SkillId].name}`)
                        .join(', ')
                                            const requiredJob = job.unlock ? jobs.find((item) => item.id === job.unlock?.requiredJobId) : undefined
                      const skillRequirements = Object.entries(job.requiredSkills ?? {})
                        .map(([skillId, level]) => `${skillMeta[skillId as SkillId].name} level ${level}`)
                      const requirements = [
                        job.unlock && requiredJob ? `${requiredJob.title} level ${job.unlock.requiredLevel}` : '',
                        ...skillRequirements,
                      ].filter(Boolean)
                      const requirement = requirements.length > 0 ? `Requires ${requirements.join(' and ')}` : 'Locked'

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
                          aria-label={unlocked ? job.title : `${job.title}. ${requirement ?? 'Locked'}`}
                        >
                          <td>
                            <div className="job-name-cell">
                              <span>{job.title}</span>
                              {!unlocked && <small className="job-requirement">{requirement}</small>}
                            </div>
                          </td>
                          <td>{unlocked ? jobState.level : '—'}</td>
                          <td>{unlocked ? levelWage : '—'}</td>
                          <td>{unlocked ? job.dailyXpRate : '—'}</td>
                          <td>{unlocked ? improvingSkills : '—'}</td>
                          <td>
                            {unlocked ? (
                              <div className="progress-track job-progress" aria-label={`${job.title} level progress`}>
                                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                              </div>
                            ) : (
                              <span className="locked-requirement">{requirement}</span>
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

