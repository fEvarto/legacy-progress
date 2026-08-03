import type { Accessory, Housing, Potion, PotionState } from '../types'

type ShopTabProps = {
  housingOptions: Housing[]
  shopPotions: Potion[]
  accessories: Accessory[]
  selectedHouseId: string
  activePotions: PotionState[]
  ownedAccessories: string[]
  onBuyHouse: (house: Housing) => void
  onBuyPotion: (potion: Potion) => void
  onBuyAccessory: (accessory: Accessory) => void
}

export const ShopTab = ({ housingOptions, shopPotions, accessories, selectedHouseId, activePotions, ownedAccessories, onBuyHouse, onBuyPotion, onBuyAccessory }: ShopTabProps) => {
  return (
    <div className="shop-grid">
      <section className="panel">
        <div className="panel-header">
          <h2>Housing</h2>
          <span>Passive XP boost</span>
        </div>
        <div className="shop-list">
          {housingOptions.map((house) => (
            <article key={house.id} className={`shop-card ${selectedHouseId === house.id ? 'active-card' : ''}`}>
              <div>
                <h3>{house.title}</h3>
                <p>{house.description}</p>
              </div>
              <div className="shop-card-meta">
                <span>XP +{Math.round(house.xpBoost * 100)}%</span>
                <button type="button" onClick={() => onBuyHouse(house)}>
                  {house.cost === 0 ? 'Owned' : `Buy ${house.cost}`}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Potions</h2>
          <span>Temporary bonuses</span>
        </div>
        <div className="shop-list">
          {shopPotions.map((potion) => (
            <article key={potion.id} className="shop-card">
              <div>
                <h3>{potion.title}</h3>
                <p>{potion.description}</p>
              </div>
              <div className="shop-card-meta">
                <span>{potion.durationDays} days</span>
                <button type="button" onClick={() => onBuyPotion(potion)}>
                  Buy {potion.cost}
                </button>
              </div>
            </article>
          ))}
        </div>
        {activePotions.length > 0 && (
          <div className="boost-list">
            <strong>Active potions</strong>
            <ul>
              {activePotions.map((potionState) => {
                const potion = shopPotions.find((item) => item.id === potionState.id)
                return (
                  <li key={potionState.id}>
                    {potion?.title} – {potionState.daysLeft.toFixed(0)} days left
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Accessories</h2>
          <span>Permanent bonuses</span>
        </div>
        <div className="shop-list">
          {accessories.map((item) => (
            <article key={item.id} className={`shop-card ${ownedAccessories.includes(item.id) ? 'active-card' : ''}`}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="shop-card-meta">
                <span>{item.effect.type === 'wage' ? `Income +${Math.round(item.effect.value * 100)}%` : item.effect.type === 'skillXp' ? `Skill XP +${Math.round(item.effect.value * 100)}%` : `Job XP +${Math.round(item.effect.value * 100)}%`}</span>
                <button type="button" onClick={() => onBuyAccessory(item)} disabled={ownedAccessories.includes(item.id)}>
                  {ownedAccessories.includes(item.id) ? 'Owned' : `Buy ${item.cost}`}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
