import './Activate.css'

function Activate({ brewedPotions, onBack, onActivate }) {

    const potionCounts = brewedPotions.reduce((counts, potion) => {
        counts[potion.id] = (counts[potion.id] || 0) + 1
        return counts
    }, {})

    const uniquePotions = brewedPotions.filter((potion, index, self) =>
        index === self.findIndex(item => item.id === potion.id)
    )

    return (
        <main className="activate-scene">

            <button className="activate-back" onClick={onBack}>
                back to lab
            </button>

            <header className="header">
                <h1>- spell 𖤐 activation -</h1>
                <p>choose your potions!</p>
            </header>

            <section className="activation-list">

                {uniquePotions.length === 0 ? (
                    <p className="empty-potions">
                        you haven't brewed any potions yet...
                    </p>
                ) : (
                    <div className="potion-grid">
                        {uniquePotions.map(potion => (
                            <div className="activation-potion" key={potion.id}>
                                <h3>{potion.name}</h3>
                                <p>{potion.description}</p>

                                <span>
                                    potion count: {potionCounts[potion.id]}
                                </span>

                                <button
                                    className="sigil-button"
                                    onClick={() => onActivate(potion)}
                                >
                                    draw sigil
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </main>
    )
}

export default Activate