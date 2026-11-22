import { useEffect, useRef } from 'react'

const SCRIPTS = [
  'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
]

const loading = {}
const loadScript = src => loading[src] ||= new Promise(resolve => {
  const tag = document.createElement('script')
  tag.src = src
  tag.crossOrigin = 'anonymous'
  tag.onload = resolve
  document.head.appendChild(tag)
})

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

// fist: every fingertip closer to the wrist than its own middle knuckle
const isFist = hand => [[8, 6], [12, 10], [16, 14], [20, 18]].every(([tip, knuckle]) =>
  dist(hand[tip], hand[0]) < dist(hand[knuckle], hand[0]))

// turns the webcam on and calls onHand({ x, y, fist }) in screen pixels, or onHand(null) with no hand.
// the camera stops when this component leaves the screen.
export default function HandCamera({ onHand, showFeed }) {
  const video = useRef(), feed = useRef(), skeleton = useRef(), latest = useRef()
  latest.current = onHand

  useEffect(() => {
    const el = video.current
    let stopped = false, camera, hands

    async function start() {
      for (const src of SCRIPTS) await loadScript(src)
      if (stopped) return

      hands = new window.Hands({ locateFile: f => 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/' + f })
      hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.5 })

      hands.onResults(results => {
        if (stopped) return
        const w = el.videoWidth, h = el.videoHeight
        feed.current.width = skeleton.current.width = w
        feed.current.height = skeleton.current.height = h
        if (showFeed) feed.current.getContext('2d').drawImage(results.image, 0, 0, w, h)

        const hand = results.multiHandLandmarks[0]
        if (!hand) return latest.current(null)

        const pen = skeleton.current.getContext('2d')
        window.drawConnectors(pen, hand, window.HAND_CONNECTIONS, { color: '#a855f7', lineWidth: 5 })
        window.drawLandmarks(pen, hand, { color: '#d8b4fe', radius: 6 })

        // point 9 is the palm. undo the zoom and cropped edges, then flip x for the mirror.
        const zoom = Math.max(innerWidth / w, innerHeight / h)
        latest.current({
          x: innerWidth - (hand[9].x * w * zoom + (innerWidth - w * zoom) / 2),
          y: hand[9].y * h * zoom + (innerHeight - h * zoom) / 2,
          fist: isFist(hand)
        })
      })

      camera = new window.Camera(el, {
        onFrame: async () => { if (!stopped) await hands.send({ image: el }) },
        width: 1280, height: 720
      })
      camera.start()
    }
    start()

    return () => {
      stopped = true
      camera?.stop()
      el.srcObject?.getTracks().forEach(track => track.stop())
      hands?.close()
    }
  }, [])

  return (
    <>
      <video ref={video} muted playsInline style={{ position: 'fixed', width: 2, height: 2, opacity: 0 }} />
      <canvas ref={feed} className="hand-feed" hidden={!showFeed} />
      <canvas ref={skeleton} className="hand-skeleton" />
    </>
  )
}
