import { useEffect, useRef, useState, useCallback } from 'react'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const BOX_WIDTH = 50
const BOX_HEIGHT = 50
const INITIAL_X_SPEED = 5

export default function App () {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boxXRef = useRef(CANVAS_WIDTH / 2 - BOX_WIDTH / 2)
  const xSpeedRef = useRef(INITIAL_X_SPEED)
  const [score, setScore] = useState(0)

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#e3bb56'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw box
    ctx.fillStyle = '#fff'
    ctx.fillRect(boxXRef.current, CANVAS_HEIGHT - BOX_HEIGHT, BOX_WIDTH, BOX_HEIGHT)
  }, [])

  const updateGameState = useCallback(() => {
    boxXRef.current += xSpeedRef.current

    if (boxXRef.current <= 0 || boxXRef.current + BOX_WIDTH >= CANVAS_WIDTH) {
      xSpeedRef.current = -xSpeedRef.current
      setScore(prevScore => prevScore + 1)
      boxXRef.current = Math.max(0, Math.min(boxXRef.current, CANVAS_WIDTH - BOX_WIDTH))
    }
  }, [])

  useEffect(() => {
    let animationId: number

    const gameLoop = () => {
      updateGameState()
      drawGame()
      animationId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [drawGame, updateGameState])

  return (
    <div>
      <div>Score: {score}</div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
    </div>
  )
}
