# permafrost & potions

a webcam game where you play an ice witch, controlling everything with your bare hand: gather ingredients, freeze them, brew potions, and cast spells. made for anyone with a laptop and a webcam.

**live demo:** https://gloomymoon777.github.io/permafrost/prologue.html
**built by:** isabel (@gloomymoon777), Jaylyn (@jaxbirdros) 

![screenshot of the pr

## how do you use it?

allow the camera when the browser asks, then use your hand:

1. **collect ingredients.** the story starts in the frozen forest. make a **fist** over an ingredient to grab it. collect all five, then head back to the tower.
2. **freeze your materials** so they stay enchanted.
4. **brew a potion.** in the cauldron, make a fist over an ingredient to pick it up, then **open your hand** over the bottle to drop it in. add a recipe's ingredients (check the grimoire), then **swirl your open hand** around the bottle until the stir bar fills. you can also click and drag with the mouse.
5. **activate the spell.** on the spells screen, a foggy camera appears. **trace the star with your palm.** the spell only works once the star is traced.

## how we built it

- **react 19 + vite** for the lab (cauldron, freezer, spells, trace screen)
- **plain html, css and javascript** for the prologue (story screens, forest, tower, dialogue box and timers).
- **[mediapipe hands](https://github.com/google-ai-edge/mediapipe)** from google, loaded from a cdn, to track 21 points on your hand through the webcam
- https://permafrost-potions.vercel.app/prologue.html

how the hand tracking works: mediapipe gives us the position of every finger joint. we use the palm point as the "cursor." a hand counts as a **fist** when every fingertip is closer to the wrist than its own knuckle, and as **open** otherwise. the spell tracing and stirring math (angles around the bottle) are our own.

## run it yourself

OPEN https://permafrost-potions.vercel.app/prologue.html
no api keys or `.env` file are needed. you only need a webcam,( thank you icky google math) and the page needs internet for the hand-tracking scripts.
