
import { useState, useEffect, useRef } from 'react'
import './InstructionBox.css'

function InstructionBox({
    scene,
    itemsFrozen,
    brewedPotions,
    allPotionsTested,
    isStirring
})  {

    let message = ''
    let instructionKey = ''

    if (allPotionsTested) {
        instructionKey = 'ending'
        message = 'I just tested all the potions I know!! The magic I gathered finally feels like home. I still have lots to learn though.. Perhaps this is only the beginning...'
    } else if (scene === 'lab') {
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
    } else if (scene === 'mixing' && isStirring) {
        instructionKey = 'mixing-stir'
        message = 'The ingredients are ready! point your index finger at the brew and move it in a circle until the meter fills!'
    }

    const [displayedText, setDisplayedText] = useState('')
    const [visible, setVisible] = useState(false)
    const [seenInstructions, setSeenInstructions] = useState([])
    const [skipped, setSkipped] = useState(false)
    const [textComplete, setTextComplete] = useState(false)

    const timerRef = useRef(null)

    // Typewriter effect
    useEffect(() => {
        if (!message || skipped || seenInstructions.includes(instructionKey)) {
            setVisible(false)
            return
        }

        setVisible(true)
        setDisplayedText('')
        setTextComplete(false)

        let index = 0

        clearInterval(timerRef.current)

        timerRef.current = setInterval(() => {
            index++
            setDisplayedText(message.slice(0, index))

            if (index >= message.length) {
                clearInterval(timerRef.current)
                timerRef.current = null
                setTextComplete(true)
            }
        }, 30)

        return () => {
            clearInterval(timerRef.current)
            timerRef.current = null
        }

    }, [instructionKey, message, seenInstructions, skipped])

    // Click anywhere to reveal, then click again to dismiss
    useEffect(() => {
        if (!visible) return

        function handleClick(e) {
            // Let the SKIP ALL button handle its own click
            if (e.target.closest?.('.skip-instructions')) return

            if (!textComplete) {
                // First click: reveal the entire message
                clearInterval(timerRef.current)
                timerRef.current = null

                setDisplayedText(message)
                setTextComplete(true)

            } else {
                // Second click: dismiss the message
                setVisible(false)

                setSeenInstructions(prev => {
                    if (prev.includes(instructionKey)) return prev
                    return [...prev, instructionKey]
                })
            }
        }

        window.addEventListener('pointerdown', handleClick)

        return () => {
            window.removeEventListener('pointerdown', handleClick)
        }

    }, [visible, textComplete, message, instructionKey])

    function skipInstructions(e) {
        e.stopPropagation()

        clearInterval(timerRef.current)
        timerRef.current = null

        setSkipped(true)
        setVisible(false)
    }

    if (!visible || !message) return null

    return (
        <div className="instruction-box">
            <button
                className="skip-instructions"
                onClick={skipInstructions}
            >
                SKIP ALL
            </button>

            <p>
                {displayedText}
                {!textComplete && (
                    <span className="instruction-cursor">▌</span>
                )}
            </p>
        </div>
    )
}

export default InstructionBox
