import type { Accessory, Housing, Potion, PotionCooldown } from '../types'

type ShopTabProps = {
  housingOptions: Housing[]
  shopPotions: Potion[]
  accessories: Accessory[]
  selectedHouseId: string
  potionCooldowns: PotionCooldown[]
  ownedAccessories: string[]
  onBuyHouse: (house: Housing) => void
  onBuyPotion: (potion: Potion) => void
  onBuyAccessory: (accessory: Accessory) => void
}

export const ShopTab = ({
  housingOptions,
  shopPotions,
  accessories,
  selectedHouseId,
  potionCooldowns,
  ownedAccessories,
  onBuyHouse,
  onBuyPotion,
  onBuyAccessory,
}: ShopTabProps) => {
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
                  {house.rent === 0 ? 'Owned' : `${house.rent} per day`}
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
          {shopPotions.map((potion) => {
            const onCooldown = potionCooldowns.some((cd) => cd.id === potion.id && cd.daysLeft > 0)
            const cooldownRemaining = potionCooldowns.find((cd) => cd.id === potion.id)?.daysLeft ?? 0

            return (
              <article key={potion.id} className="shop-card">
                <div>
                  <h3>{potion.title}</h3>
                  <p>{potion.description}</p>
                </div>
                <div className="shop-card-meta">
                  <span>{potion.durationDays} days</span>
                  {onCooldown ? (
                    <button type="button" disabled>
                      Cooldown — {cooldownRemaining.toFixed(0)}d
                    </button>
                  ) : (
                    <button type="button" onClick={() => onBuyPotion(potion)}>
                      Buy {potion.cost}
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>

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
                <span>
                  {item.effect.type === 'wage'
                    ? `Income +${Math.round(item.effect.value * 100)}%`
                    : item.effect.type === 'skillXp'
                      ? `Skill XP +${Math.round(item.effect.value * 100)}%`
                      : `Job XP +${Math.round(item.effect.value * 100)}%`}
                </span>
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

