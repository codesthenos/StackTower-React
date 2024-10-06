import { useRef, useEffect, useState, useCallback } from 'react'

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600
const BOX_WIDTH = 50
const BOX_HEIGHT = 50
const SPEED = 0.01

interface Box {
  x: number
  y: number
  moving: boolean
}

export default function BoxStacker () {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [boxes, setBoxes] = useState<Box[]>([
    { x: CANVAS_WIDTH / 2 - BOX_WIDTH / 2, y: CANVAS_HEIGHT - BOX_HEIGHT, moving: true }
  ])
  const animationRef = useRef<number>()
  const directionRef = useRef(1)

  const handleInput = useCallback(() => {
    setBoxes(prevBoxes => {
      const newBoxes = [...prevBoxes]
      const lastBox = newBoxes[newBoxes.length - 1]
      if (lastBox.moving) {
        lastBox.moving = false
        newBoxes.push({
          x: CANVAS_WIDTH / 2 - BOX_WIDTH / 2,
          y: lastBox.y - BOX_HEIGHT,
          moving: true
        })
      }
      return newBoxes
    })
  }, [])

  const updateGame = useCallback(() => {
    setBoxes(prevBoxes => {
      return prevBoxes.map((box, index) => {
        if (index === prevBoxes.length - 1 && box.moving) {
          let newX = box.x + SPEED * directionRef.current
          if (newX <= 0 || newX + BOX_WIDTH >= CANVAS_WIDTH) {
            directionRef.current *= -1
            newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - BOX_WIDTH))
          }
          return { ...box, x: newX }
        }
        return box
      })
    })
  }, [])

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    boxes.forEach((box, index) => {
      ctx.fillStyle = index === boxes.length - 1 ? 'red' : 'blue'
      ctx.fillRect(box.x, box.y, BOX_WIDTH, BOX_HEIGHT)
    })
  }, [boxes])

  const gameLoop = useCallback(() => {
    updateGame()
    drawGame()
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [updateGame, drawGame])

  useEffect(() => {
    gameLoop()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameLoop])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleInput()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleInput])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleInput}
        className="border border-white"
      />
      <p className="mt-4 text-white">Click or press Space to stack a box</p>
    </div>
  )
}
