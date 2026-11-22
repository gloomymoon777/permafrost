import { useEffect, useRef } from 'react'
import HandCamera from './HandCamera'
import './Trace.css'

// a five-point star, drawn as one line with 40 dots per edge
function glyphPath(w, h) {
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.32
  const tips = [0, 1, 2, 3, 4].map(k => {
    const a = -Math.PI / 2 + k * 2 * Math.PI / 5
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  })
  const order = [0, 2, 4, 1, 3, 0]
  const points = []
  for (let i = 0; i < order.length - 1; i++) {
    const a = tips[order[i]], b = tips[order[i + 1]]
    for (let t = 0; t < 40; t++) {
      points.push({ x: a.x + (b.x - a.x) * t / 40, y: a.y + (b.y - a.y) * t / 40, seen: false })
    }
  }
  return points
}

export default function Trace({ onDone, onBack }) {
  const canvas = useRef()
  const points = useRef([])
  const done = useRef(false)

  function draw() {
    const c = canvas.current, pen = c.getContext('2d')
    pen.clearRect(0, 0, c.width, c.height)
    let seen = 0
    for (const p of points.current) {
      pen.beginPath()
      if (p.seen) {
        seen++
        pen.fillStyle = '#c084fc'
        pen.arc(p.x, p.y, 5, 0, Math.PI * 2)
      } else {
        pen.fillStyle = 'rgba(255,255,255,.35)'
        pen.arc(p.x, p.y, 3, 0, Math.PI * 2)
      }
      pen.fill()
    }
    const pct = seen / points.current.length
    pen.fillStyle = '#fff'
    pen.font = '20px "Press Start 2P", monospace'
    pen.textAlign = 'center'
    pen.fillText(Math.round(pct * 100) + '%', c.width / 2, c.height - 40)
    return pct
  }

  useEffect(() => {
    const c = canvas.current
    const fit = () => {
      c.width = innerWidth
      c.height = innerHeight
      points.current = glyphPath(innerWidth, innerHeight)
      draw()
    }
    fit()
    addEventListener('resize', fit)
    return () => removeEventListener('resize', fit)
  }, [])

  // palm position from HandCamera; each dot within 50px of the palm counts as traced
  function onHand(hand) {
    if (done.current || !hand) return
    for (const p of points.current) {
      if (!p.seen && Math.hypot(hand.x - p.x, hand.y - p.y) < 50) p.seen = true
    }
    const pct = draw()
    if (pct >= 0.9) {
      done.current = true
      onDone()
    }
  }

  return (
    <div className="fog">
      <HandCamera onHand={onHand} showFeed />
      <canvas ref={canvas} className="glyph-canvas" />
      <p className="trace-text">trace the glyph with your palm to cast the spell</p>
      <button className="trace-back" onClick={onBack}>back to lab</button>
    </div>
  )
}
