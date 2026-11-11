import './App.css'
import { useEffect, useRef } from 'react'
import { HeroPanel } from './components/HeroPanel'
import { MetaBar } from './components/MetaBar'
import { OverviewTab } from './components/OverviewTab'
import { SettingsTab } from './components/SettingsTab'
import { ShopTab } from './components/ShopTab'
import { SkillsTab } from './components/SkillsTab'
import { PrestigeTab } from './components/PrestigeTab'
import { accessories, housingOptions, jobs, shopPotions, innates, prestigeResearches } from './data'
import { useSimulation } from './hooks/useSimulation'

function App() {
  const {
    heroName,
    age,
    lifespanYears,
    money,
    selectedJobId,
    selectedHouseId,
    activePotions,
    ownedAccessories,
    accessoryBoosts,
    skills,
    jobProgress,
    generation,
    metaLevel,
    runMetaXp,
    bestMetaLevel,
    metaPoints,
    purchasedResearches,
    researchInvestments,
    availableInnateIds,
    selectedInnateId,
    runStarted,
    tickRate,
    activeTab,
    currentJob,
    currentHouse,
    dailyIncome,
    dailySpending,
    jobUpkeepDaily,
    housingRentDaily,
    netDaily,
    skillXpMultiplier,
    happiness,
    happinessMultiplier,
    happinessBreakdown,
    tabs,
    selectJob,
    setActiveTab,
    setTickRate,
    buyHouse,
    buyPotion,
    buyAccessory,
    exportSave,
    importSave,
    resetProgress,
    chooseInnate,
    startRun,
    prestige,
    investResearch,
    potionCooldowns,
  } = useSimulation()

  const contentRef = useRef<HTMLElement>(null)

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [activeTab])

  return (
    <main className="sim-shell">
      <MetaBar metaLevel={metaLevel} />

      <div className="game-layout">
        <aside className="side-bar">
          <div className="side-scroll">
            <HeroPanel
              heroName={heroName}
              age={age}
              lifespanYears={lifespanYears}
              money={money}
              dailyIncome={dailyIncome}
              dailySpending={dailySpending}
              jobUpkeepDaily={jobUpkeepDaily}
              housingRentDaily={housingRentDaily}
              netDaily={netDaily}
              generation={generation}
              metaLevel={metaLevel}
              currentJob={currentJob}
              skills={skills}
              jobProgress={jobProgress}
              currentHouse={currentHouse}
              activePotions={activePotions}
              ownedAccessories={ownedAccessories}
              accessoryBoosts={accessoryBoosts}
              happiness={happiness}
              happinessMultiplier={happinessMultiplier}
              happinessBreakdown={happinessBreakdown}
              innate={innates.find((innate) => innate.id === selectedInnateId)}
            />
          </div>
        </aside>

        <section className="content-area" ref={contentRef}>
          <nav className="tab-bar" aria-label="Simulation sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {activeTab === 'overview' && (
            <OverviewTab
              jobs={jobs}
              jobProgress={jobProgress}
              skills={skills}
              selectedJobId={selectedJobId}
              onSelectJob={selectJob}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsTab skills={skills} currentJob={currentJob} skillXpMultiplier={skillXpMultiplier} />
          )}

          {activeTab === 'shop' && (
            <ShopTab
              housingOptions={housingOptions}
              shopPotions={shopPotions}
              accessories={accessories}
              selectedHouseId={selectedHouseId}
              potionCooldowns={potionCooldowns}
              ownedAccessories={ownedAccessories}
              onBuyHouse={buyHouse}
              onBuyPotion={buyPotion}
              onBuyAccessory={buyAccessory}
            />
          )}

          {activeTab === 'prestige' && (
            <PrestigeTab
              innates={innates}
              researches={prestigeResearches}
              availableInnateIds={availableInnateIds}
              selectedInnateId={selectedInnateId}
              runStarted={runStarted}
              age={age}
              lifespanYears={lifespanYears}
              runMetaXp={runMetaXp}
              metaLevel={metaLevel.level}
              bestMetaLevel={bestMetaLevel}
              metaPoints={metaPoints}
              purchasedResearches={purchasedResearches}
              researchInvestments={researchInvestments}
              onChooseInnate={chooseInnate}
              onStartRun={startRun}
              onPrestige={prestige}
              onInvestResearch={investResearch}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              tickRate={tickRate}
              onSelectTickRate={setTickRate}
              onExportSave={exportSave}
              onImportSave={importSave}
              onResetProgress={resetProgress}
            />
          )}
        </section>
      </div>
    </main>
  )
}

export default App

