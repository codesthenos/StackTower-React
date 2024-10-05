"use client"

import { useEffect, useRef } from 'react'

const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 500
const BOX_WIDTH = 50
const BOX_HEIGHT = 50
const SPEED = 2

export default function App () {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let boxX = CANVAS_WIDTH / 2 - BOX_WIDTH / 2
    let direction = 1 // 1 for right, -1 for left

    const draw = () => {
      // Clear the canvas
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw the box
      ctx.fillStyle = 'white'
      ctx.fillRect(boxX, CANVAS_HEIGHT - BOX_HEIGHT, BOX_WIDTH, BOX_HEIGHT)

      // Move the box
      boxX += SPEED * direction

      // Check for wall collision
      if (boxX + BOX_WIDTH > CANVAS_WIDTH || boxX < 0) {
        direction *= -1
      }

      // Request next frame
      requestAnimationFrame(draw)
    }

    // Start the animation
    draw()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-white"
      />
    </div>
  )
}
