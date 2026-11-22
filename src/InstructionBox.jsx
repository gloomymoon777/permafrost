
import { useState, useEffect, useRef } from 'react'
import './InstructionBox.css'

function InstructionBox({
    scene,
    itemsFrozen,
    brewedPotions,
    allPotionsTested,
    isStirring
}) {
    let message = ''
    let instructionKey = ''

    if (allPotionsTested) {
        instructionKey = 'ending'
        message = 'I just tested all the potions I know!! The magic I gathered finally feels like home. I still have lots to learn though.. Perhaps this is only the beginning... // congrats!! you finished the game! thanks for playingg :)'
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
        message = 'The ingredients are ready! Point your index finger at the brew and move it in a circle until the meter fills!'
    }

    const [displayedText, setDisplayedText] = useState('')
    const [visible, setVisible] = useState(false)
    const [skipped, setSkipped] = useState(false)
    const [textComplete, setTextComplete] = useState(false)

    // Stores completed instructions without causing unnecessary re-renders
    const seenInstructions = useRef(new Set())
    const timerRef = useRef(null)

    // Typewriter effect
    useEffect(() => {
        clearInterval(timerRef.current)
        timerRef.current = null

        if (
            !message ||
            skipped ||
            seenInstructions.current.has(instructionKey)
        ) {
            setVisible(false)
            return
        }

        setVisible(true)
        setDisplayedText('')
        setTextComplete(false)

        let index = 0

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
    }, [instructionKey, message, skipped])

    // First click reveals all text; second click dismisses it
    useEffect(() => {
        if (!visible) return

        function handleClick(e) {
            if (e.target.closest?.('.skip-instructions')) return

            if (!textComplete) {
                clearInterval(timerRef.current)
                timerRef.current = null

                setDisplayedText(message)
                setTextComplete(true)
            } else {
                seenInstructions.current.add(instructionKey)
                setVisible(false)
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
