type SettingsTabProps = {
  tickRate: number
  onSelectTickRate: (rate: number) => void
  onExportSave: () => string
  onImportSave: (rawSave: string) => boolean
  onResetProgress: () => void
}

export const SettingsTab = ({ tickRate, onSelectTickRate, onExportSave, onImportSave, onResetProgress }: SettingsTabProps) => {
  const handleImport = () => {
    const input = window.prompt('Paste your save data JSON')
    if (!input) return

    const success = onImportSave(input)
    if (!success) {
      window.alert('Unable to import save data. Please paste a valid export.')
    }
  }

  const handleExport = () => {
    const saveData = onExportSave()
    if (saveData) {
      window.alert('Save data copied to the clipboard.')
    }
  }

  const handleReset = () => {
    const confirmed = window.confirm('Reset all progress? This cannot be undone.')
    if (confirmed) {
      onResetProgress()
    }
  }

  return (
    <div className="settings-grid">
      <section className="panel">
        <div className="panel-header">
          <h2>Settings</h2>
          <span>Personalize your run</span>
        </div>
        <div className="settings-list">
          <div className="settings-item">
            <strong>Tick rate</strong>
            <span>Visual frame rate only — gameplay stays the same.</span>
          </div>
          <div className="settings-actions">
            {[30, 60].map((rate) => (
              <button
                key={rate}
                type="button"
                className={`settings-choice ${tickRate === rate ? 'active' : ''}`}
                onClick={() => onSelectTickRate(rate)}
              >
                {rate} FPS
              </button>
            ))}
          </div>
          <div className="settings-actions">
            <button type="button" className="action-button" onClick={handleExport}>
              Export save
            </button>
            <button type="button" className="action-button" onClick={handleImport}>
              Import save
            </button>
            <button type="button" className="action-button danger" onClick={handleReset}>
              Reset progress
            </button>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Patch notes</h2>
          <span>Recent updates</span>
        </div>
        <ul className="notes-list">
          <li>
            <strong>v0.2</strong> Added tabbed navigation and a dedicated settings panel.
          </li>
          <li>
            <strong>v0.1</strong> Introduced jobs, skills, and a daily money loop.
          </li>
        </ul>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Social</h2>
          <span>Follow the project</span>
        </div>
        <div className="social-links">
          <a href="https://github.com/" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://x.com/" target="_blank" rel="noreferrer">
            X
          </a>
          <a href="https://discord.com/" target="_blank" rel="noreferrer">
            Discord
          </a>
        </div>
      </section>
    </div>
  )
}
