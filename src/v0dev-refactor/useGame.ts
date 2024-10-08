// useGame.ts
import { useState, useEffect, useRef, useCallback } from 'react'
import { MODES, BOX_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, INITIAL_BOX_WIDTH, INITIAL_X_SPEED, INITIAL_Y_SPEED } from './constants.ts'
import { drawBackground, gameOver, createStepColor } from './gameLogic.ts'

export function useGame () {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const gameMode = useRef<MODES>(MODES.BOUNCE)
  const boxes = useRef([{
    x: (CANVAS_WIDTH / 2) - (INITIAL_BOX_WIDTH / 2),
    y: 200,
    width: INITIAL_BOX_WIDTH,
    color: 'white'
  }])
  const debris = useRef({ x: 0, y: 0, width: 0 })

  const currentRef = useRef(0)
  const xSpeedRef = useRef(INITIAL_X_SPEED)
  const ySpeedRef = useRef(INITIAL_Y_SPEED)
  const scrollRef = useRef(0)
  const cameraRef = useRef(0)

  const createNewBox = useCallback(() => {
    const lastBox = boxes.current[boxes.current.length - 1]
    boxes.current.push({
      x: 0,
      y: lastBox.y + BOX_HEIGHT,
      width: lastBox.width,
      color: createStepColor(boxes.current.length)
    })
    currentRef.current = boxes.current.length - 1
  }, [])

  const handleBoxLanding = useCallback(() => {
    if (currentRef.current < 1 || currentRef.current >= boxes.current.length) return

    const currentBox = boxes.current[currentRef.current]
    const previousBox = boxes.current[currentRef.current - 1]
    
    if (!currentBox || !previousBox) return

    const difference = currentBox.x - previousBox.x
    
    if (Math.abs(difference) >= currentBox.width) {
      gameMode.current = MODES.GAMEOVER
      return
    }
    
    if (currentBox.x > previousBox.x) {
      currentBox.width -= difference
    } else {
      currentBox.width += difference
      currentBox.x = previousBox.x
    }

    debris.current = {
      x: currentBox.x > previousBox.x ? currentBox.x + currentBox.width : currentBox.x,
      y: currentBox.y,
      width: Math.abs(difference)
    }
    
    xSpeedRef.current += xSpeedRef.current > 0 ? 1 : -1
    scrollRef.current = BOX_HEIGHT
    gameMode.current = MODES.BOUNCE
    
    setScore(prevScore => prevScore + 1)
    
    createNewBox()
  }, [createNewBox])

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    drawBackground(context)

    // Draw boxes
    boxes.current.forEach((box) => {
      const { x, y, width, color } = box
      const newY = CANVAS_HEIGHT - 200 - y + cameraRef.current
      context.fillStyle = color
      context.fillRect(x, newY, width, BOX_HEIGHT)
    })

    // Draw debris
    const { x, y, width } = debris.current
    const newY = CANVAS_HEIGHT - 200 - y + cameraRef.current
    context.fillStyle = 'red'
    context.fillRect(x, newY, width, BOX_HEIGHT)

    if (gameMode.current === MODES.BOUNCE && currentRef.current < boxes.current.length) {
      const currentBox = boxes.current[currentRef.current]
      currentBox.x += xSpeedRef.current
      
      if (currentBox.x + currentBox.width > CANVAS_WIDTH || currentBox.x < 0) {
        xSpeedRef.current = -xSpeedRef.current
      }
    } else if (gameMode.current === MODES.FALL && currentRef.current < boxes.current.length) {
      const currentBox = boxes.current[currentRef.current]
      const previousBox = boxes.current[currentRef.current - 1]
      if (currentBox && previousBox) {
        currentBox.y -= ySpeedRef.current
        
        if (currentBox.y <= previousBox.y + BOX_HEIGHT) {
          handleBoxLanding()
        }
      }
    }

    debris.current.y -= ySpeedRef.current

    if (scrollRef.current > 0) {
      cameraRef.current++
      scrollRef.current--
    }
    
    if (gameMode.current !== MODES.GAMEOVER) {
      requestAnimationFrame(gameLoop)
    } else {
      gameOver(context)
    }
  }, [handleBoxLanding])

  useEffect(() => {
    if (canvasRef.current) {
      gameLoop()
    }
  }, [gameLoop])

  const handleInput = useCallback(() => {
    if (gameMode.current === MODES.GAMEOVER) {
      // Restart game
      boxes.current = [{
        x: (CANVAS_WIDTH / 2) - (INITIAL_BOX_WIDTH / 2),
        y: 200,
        width: INITIAL_BOX_WIDTH,
        color: 'white'
      }]
      debris.current = { x: 0, y: 0, width: 0 }
      currentRef.current = 0
      xSpeedRef.current = INITIAL_X_SPEED
      ySpeedRef.current = INITIAL_Y_SPEED
      scrollRef.current = 0
      cameraRef.current = 0
      setScore(0)
      gameMode.current = MODES.BOUNCE
      createNewBox()
      gameLoop()
    } else if (gameMode.current === MODES.BOUNCE) {
      gameMode.current = MODES.FALL
    }
  }, [createNewBox, gameLoop])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        handleInput()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleInput])

  return { canvasRef, score, handleInput }
}
