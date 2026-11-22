import './Freezer.css'
import { useState } from 'react'

function Freezer({ ingredients, onBack, itemsFrozen, setItemsFrozen }) {

    return (
        <main className="freezer-scene">

            <button className="freezer-back" onClick={onBack}>
                back
            </button>

            <header className="header">
                <h1>- freezing 𖤐 chamber -</h1>
                <p>preserve your materials in permafrost</p>
            </header>

            <section className="freezer-content">

                <div className="freezer-ingredients">
                    {ingredients.map(item => (
                        <div className="freezer-ingredient" key={item.id}>
                            <div
                                className="freezer-image"
                                style={{ '--ingredient-image': `url(${item.image})` }}
                            >
                                <img src={item.image} alt={item.name} />

                                {itemsFrozen && (
                                    <div className="freezer-blue-overlay" />
                                )}
                            </div>

                            <p>{item.name}</p>
                        </div>
                    ))}
                </div>

                <button
                    className="freeze-button"
                    onClick={() => setItemsFrozen(prev => !prev)}
                >
                    {itemsFrozen ? 'thaw items' : 'freeze items'}
                </button>

                {itemsFrozen && (
                    <p className="freeze-message">
                        all materials preserved in permafrost
                    </p>
                )}

            </section>
        </main>
    )
}

export default Freezer