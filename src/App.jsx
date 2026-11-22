import { useState } from 'react'


import './App.css'


import PotionMixing from './PotionMixing'
import Freezer from './Freezer'
import Activate from './Activate'
import InstructionBox from './InstructionBox'

import bottle from "./assets/bottle.png"
import fern from "./assets/fern.png"
import crystal from "./assets/crystal.png"
import mushroom from "./assets/mushroom.png"
import blossom from "./assets/blossom.png"
import resin from "./assets/sap.png"
import backgroundimg from './assets/finalbg.png'

import windowsill from './assets/watercolor.png'

function App() {

    const [itemsFrozen, setItemsFrozen] = useState(false)
    const [testedPotions, setTestedPotions] = useState([])

  
  const ingredients = [
    {id: 'fern', name: 'fern', image: fern, frozen: itemsFrozen, color: '#3e5932'},
    {id: 'crystal', name: 'crystal', image: crystal, frozen: itemsFrozen, color: '#a8c3cb'},
    {id: 'resin', name: 'resin', image: resin, frozen: itemsFrozen, color: '#fbfba3'},
    {id: 'mushroom', name: 'mushroom', image: mushroom, frozen: itemsFrozen, color: '#b0456e'},
    {id: 'blossom', name: 'blossom', image: blossom, frozen: itemsFrozen, color: '#e8d3db'},
]

  const [scene, setScene] = useState('lab')
  const [brewedPotions, setBrewedPotions] = useState([])
  const [activatedPotions, setActivatedPotions] = useState([])


  function activatePotion(potion) {
    setBrewedPotions(prev => {
        const index = prev.findIndex(item => item.id === potion.id)

        if (index === -1) return prev

        return prev.filter((_, i) => i !== index)
    })

    setTestedPotions(prev => {
    if (prev.includes(potion.id)) return prev
    return [...prev, potion.id]
    })

    if (potion.id === 'restoration') {
        setActivatedPotions([])
    } else {
        setActivatedPotions(prev => {
            if (prev.some(item => item.id === potion.id)) {
                return prev
            }

            return [...prev, potion]
        })
    }

    setScene('lab')
  }

  const potionTypes = [
    'restoration',
    'frost',
    'luminescence',
    'evergreen',
    'dream',
    'earth'
    ]

    const allPotionsTested = potionTypes.every(id =>
        testedPotions.includes(id)
    )

  return (
    <>

    {scene === 'lab' && (
      <main 
        className="maincontainer" 
       style={{
          backgroundImage: `url(${backgroundimg})`
        }}
      >
        <header className="header">
           <h1> - tower 𖤐 lab - </h1>
        </header>

        <button className="buttons cauldron" onClick={() => setScene('mixing')}>
          enter cauldron
        </button>

        <button className="buttons freezer" onClick={() => setScene('freezer')}>
          freeze materials
        </button>

        <button className="buttons activate" onClick={() => setScene('activate')}>
          activate spells 
        </button>

        {activatedPotions.map(potion => (
            <div
                key={potion.id}
                className={`potion-effect effect-${potion.id}`}
            >
                {['frost', 'evergreen', 'luminescence'].includes(potion.id) &&
                  Array.from({ length: 35 }).map((_, i) => (
                      <span
                          key={i}
                          style={{
                              '--x': `${25 + ((i * 37) % 50)}%`,
                              '--y': `${30 + ((i * 61) % 45)}%`,
                              '--delay': `${-((i * 13) % 15)}s`,
                              '--duration': `${16 + (i * 7) % 12}s`,
                              '--drift': `${((i * 17) % 50) - 25}px`,
                              '--size': `${2 + (i * 5) % 3}px`
                          }}
                      />
                  ))
              }
            </div>
        ))}
      </main>
    
    )}
    
     {scene === 'mixing' && (
      <PotionMixing
          ingredients={ingredients}
          brewedPotions={brewedPotions}
          setBrewedPotions={setBrewedPotions}
          onBack={() => setScene('lab')}
      />
    )}


      {scene === 'freezer' && (
        <Freezer
            ingredients={ingredients}
            onBack={() => setScene('lab')}
            itemsFrozen={itemsFrozen}
            setItemsFrozen={setItemsFrozen}
        />
      )}


      {scene === 'activate' && (
          <main
              className="maincontainer"
              style={{ backgroundImage: `url(${windowsill})` }}
          >
              <Activate
                  brewedPotions={brewedPotions}
                  onBack={() => setScene('lab')}
                  onActivate={activatePotion}
              />
          </main>
      )}

      <InstructionBox
          scene={scene}
          itemsFrozen={itemsFrozen}
          brewedPotions={brewedPotions}
          allPotionsTested={allPotionsTested}
      />
    </>
  )
}

export default App
