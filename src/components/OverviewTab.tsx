import type { Job, JobProgressState } from '../types'
import { requiredXpForLevel, wageForJobLevel } from '../utils'
type OverviewTabProps = {
  jobs: Job[]
  jobProgress: JobProgressState
  selectedJobId: string
  onSelectJob: (jobId: string) => void
}

export const OverviewTab = ({ jobs, jobProgress, selectedJobId, onSelectJob }: OverviewTabProps) => {
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
                    <th>XP/day</th>
                <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                  {categoryJobs.map((job) => {
                      const jobState = jobProgress[job.id] ?? { level: 1, xp: 0 }
                      const levelWage = wageForJobLevel(job, jobState.level)
                      const nextXp = requiredXpForLevel(job, jobState.level)
                    const progressPercent = nextXp > 0 ? Math.min(100, (jobState.xp / nextXp) * 100) : 0
                      return (
                  <tr
                    key={job.id}
                    className={selectedJobId === job.id ? 'selected-row' : ''}
                    onClick={() => onSelectJob(job.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') onSelectJob(job.id)
                    }}
                  >
                    <td>{job.title}</td>
                    <td>{jobState.level}</td>
                    <td>{levelWage}</td>
                    <td>{job.dailyXpRate}</td>
                          <td>
                      <div className="progress-track job-progress" aria-label={`${job.title} level progress`}>
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                              </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
      </section>
        ))}
      </div>
    </>
  )
}

