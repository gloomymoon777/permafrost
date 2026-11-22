import { useState, useEffect } from 'react'
import './InstructionBox.css'

function InstructionBox({ scene, itemsFrozen, brewedPotions }) {

    let message = ''
let instructionKey = ''

if (scene === 'lab') {
    if (!itemsFrozen) {
        instructionKey = 'lab-freeze'
        message = 'As an ice witch (the best type of witch!), I should frost my ingredients before I start brewing (•̀ᴗ•́ )و'
    } else if (brewedPotions.length > 0) {
        instructionKey = 'lab-activate'
        message = 'I brewed potions! I can test out these spells now (๑ > ᴗ < ๑)'
    } else {
        instructionKey = 'lab-brew'
        message = 'My ingredients are prepared.. Time to enter the cauldron and brew! ( • ̀ω•́ )✧'
    }
}

    const [displayedText, setDisplayedText] = useState('')
    const [visible, setVisible] = useState(false)

    const [seenInstructions, setSeenInstructions] = useState(() => {
        return JSON.parse(localStorage.getItem('seenInstructions') || '[]')
    })

    const [finished, setFinished] = useState(() => {
        return localStorage.getItem('instructionsCompleted') === 'true'
    })

    // Show each instruction only once
    useEffect(() => {
        if (!message || finished || seenInstructions.includes(instructionKey)) {
            setVisible(false)
            return
        }

        setVisible(true)
        setDisplayedText('')

        let index = 0

        const timer = setInterval(() => {
            index++
            setDisplayedText(message.slice(0, index))

            if (index >= message.length) {
                clearInterval(timer)
            }
        }, 30)

        return () => clearInterval(timer)

    }, [instructionKey, message, finished, seenInstructions])

    // Dismiss on any click or tap
    useEffect(() => {
        if (!visible) return

        const dismiss = () => {
            setVisible(false)

            const updated = [...seenInstructions, instructionKey]

            setSeenInstructions(updated)
            localStorage.setItem('seenInstructions', JSON.stringify(updated))

            // Finish instructions after the final activation message
            if (scene === 'activate') {
                setFinished(true)
                localStorage.setItem('instructionsCompleted', 'true')
            }
        }

        window.addEventListener('pointerdown', dismiss)

        return () => {
            window.removeEventListener('pointerdown', dismiss)
        }

    }, [visible, instructionKey, scene, seenInstructions])

    if (!visible || !message) return null

    return (
        <div className="instruction-box">
            <p>
                {displayedText}
                <span className="instruction-cursor">▌</span>
            </p>
        </div>
    )
}

export default InstructionBox