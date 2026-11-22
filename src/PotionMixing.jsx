
import './PotionMixing.css'
import { useState } from 'react'

import bottle from "./assets/bottle.png"
import water from "./assets/lightened-water.png"
import grimoire from "./assets/grimoire.png"



function PotionMixing({onBack, ingredients, brewedPotions, setBrewedPotions}) {
    
    const [addedIng, setAddedIng] = useState([])
    const [grimoireOpen, setGrimoireOpen] = useState(false)

    const [brewMessage, setBrewMessage] = useState('')

    const recipes = [
    {
        id: 'restoration',
        name: 'restoration potion',
        description: 'restores things to their original state.',
        ingredients: ['fern', 'blossom'],
        color: '#8dbb72'
    },
    {
        id: 'frost',
        name: 'frostbite essence',
        description: 'a chilling potion infused with frozen minerals; summons snow and ice',
        ingredients: ['crystal', 'resin'],
        color: '#8acde0'
    },
    {
    id: 'rain',
    name: 'rainfall elixir',
    description: 'summons a gentle rain, bringing nourishment and renewal to the world.',
    ingredients: ['mushroom', 'crystal'],
    color: '#79b9d1'
    },
    {
        id: 'luminescence',
        name: 'luminescence nectar',
        description: 'glows softly in the dark, revealing things hidden from the naked eye.',
        ingredients: ['blossom', 'crystal'],
        color: '#f5e68a'
    },
    {
        id: 'evergreen',
        name: 'evergreen tonic',
        description: 'a concentrated essence of the forest, said to preserve even the most delicate plants.',
        ingredients: ['fern', 'resin'],
        color: '#397b50'
    },
    {
        id: 'dream',
        name: "dreamweaver's draught",
        description: 'releases a gentle mist that carries the mind into a world of wandering dreams.',
        ingredients: ['blossom', 'resin'],
        color: '#b99ad9'
    },
    {
        id: 'earth',
        name: 'earthbound elixir',
        description: 'draws upon the strength of ancient roots, grounding anything it touches.',
        ingredients: ['fern', 'crystal'],
        color: '#bd875c'
    }
]
    
    function handleDragStart(e, item) {
        e.dataTransfer.setData('ingredient', item.id)
    }

    function handleDragOver(e) {
        e.preventDefault()
    }

    function handleDrop(e) {
        e.preventDefault()

        const id = e.dataTransfer.getData('ingredient')
        const item = ingredients.find((item) => item.id === id)

        if (!item) return

        setAddedIng(prev => {
            if (prev.some((ingredient) => ingredient.id === id)) {
                return prev
            }

            return [...prev, item]
        })
    }

    function hex2rgb(hex) {
        const value = hex.replace("#", '')
        return [
            parseInt(value.slice(0,2), 16),
            parseInt(value.slice(2,4), 16), 
            parseInt(value.slice(4,6),16 )
        ]
    }

    function finishPotion() {
        const recipe = recipes.find(recipe =>
            recipe.ingredients.length === addedIng.length &&
            recipe.ingredients.every(id =>
                addedIng.some(item => item.id === id)
            )
        )

        if (!recipe) {
            setBrewMessage('the ingredients do not form a known potion...')
            return
        }

        setBrewedPotions(prev => [...prev, recipe])
        setBrewMessage(`${recipe.name} successfully brewed!`)
        setAddedIng([])
    }

    const activeRecipe = recipes.find(recipe =>
    recipe.ingredients.length === addedIng.length &&
    recipe.ingredients.every(id =>
            addedIng.some(item => item.id === id)
        )
    )

    const waterColor = activeRecipe
        ? activeRecipe.color
        : addedIng.length === 1
            ? addedIng[0].color
            : 'transparent'

    const showWater = addedIng.length > 0

    const brewedPotionCounts = brewedPotions.reduce((counts, potion) => {
        if (!counts[potion.id]) {
            counts[potion.id] = {
                ...potion,
                count: 0
            }
        }

        counts[potion.id].count++

        return counts
    }, {})

    return (
        <div className="scene" >
            <button className="backbtn"onClick={onBack}>
                back to lab
            </button>

            <header className="header"><h1>- brewing 𖤐 cauldron - </h1><p>click and drag ingredient combos into the bottle! (check book for recipes)</p></header>
            
            <section className="content">
          <aside className="ingredients">
            
             <div className="ingredient-list">
              {ingredients.map((item) => (
                <div
                    className="ingredient"
                    key={item.id}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, item)}
                >
                    <div
                        className="ingredient-image"
                        style={{ '--ingredient-image': `url(${item.image})` }}
                    >
                        <img src={item.image} alt={item.name} />
                        <div className="ingredient-blue-overlay"></div>
                    </div>

                    <p>{item.name}</p>
                </div>
              ))}
            </div>
          </aside>

          

           <section className="brewing-area">
              <div className="potionstuff">
                <div className="drop-zone" onDragOver={handleDragOver} onDrop={handleDrop}>
                    <img className="bottle" src={bottle}></img>
                    <div className="water-container">
                    <img
                        className="water"
                        src={water}
                        style={{
                            opacity: showWater ? 1 : 0
                        }}
                    />

                    <div
                        className="water-tint"
                        style={{
                            backgroundColor: waterColor,
                            opacity: showWater ? 1 : 0,
                            maskImage: `url(${water})`,
                            WebkitMaskImage: `url(${water})`,
                            maskSize: '100% 100%',
                            WebkitMaskSize: '100% 100%',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat'
                        }}
                    />
                </div>
                </div>
              </div>

              <div className="buttonrow">
                <div>
                    <button className="sigil" onClick={finishPotion}>stir to finish!</button>
                    <button className="sigil" onClick={() => setAddedIng([])} >dump</button>
                </div>
                
                <p class="brewmessage">{brewMessage}</p>
              </div>
              

              
             

           </section>

           <section className="right-column">
            <button className="spellbook">
              <img className="grimoireimg" src={grimoire} onClick={() => setGrimoireOpen(prev => !prev)}></img>
              <p>grimoire</p>
            </button>
            
            {grimoireOpen && (
                <div className="grimoire-panel">
                    <div className="grimoire-header"><h2>recipes</h2><button className="close-grimoire" onClick={() => setGrimoireOpen(false)}>x</button></div>
                    
                    {recipes.map(recipe => (
                        <div className="recipe" key={recipe.id}>
                            <h3>{recipe.name}</h3>
                            <p>{recipe.description}</p>
                            <p className="recipe-label">ingredients: {recipe.ingredients.map(id => {
                                const item = ingredients.find(
                                    ingredient => ingredient.id === id
                                )

                                return (
                                    item ? item.name : id
                                )
                            })}</p>
                    
                </div>
            ))}

            <div className="saved-potions">
                <h3>brewed potions</h3>

                {Object.keys(brewedPotionCounts).length === 0 ? (
                    <p>no potions brewed yet...</p>
                ) : (
                    Object.values(brewedPotionCounts).map(potion => (
                        <div className="saved-potion" key={potion.id}>
                            <p>{potion.name}</p>
                            <p>× {potion.count}</p>
                        </div>
                    ))
                )}
            </div>
            </div>


        )}

           </section>

           


        </section>



        </div>
    )
}

export default PotionMixing