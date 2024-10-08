import { useEffect, useRef, useCallback } from 'react'
import type { useGameState } from './useGameState.ts'
import { drawBackground, gameOver, createStepColor } from '../gameLogic.ts'
import { MODES, BOX_HEIGHT, CANVAS_WIDTH, INITIAL_BOX_Y } from '../constants.ts'
import type { Box } from '../types.d.ts'

export function useGameLoop (
  gameState: ReturnType<typeof useGameState>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) {
  const animationFrameRef = useRef<number>()

  const {
    gameMode,
    setGameMode,
    boxes,
    setBoxes,
    debris,
    setDebris,
    currentRef,
    xSpeedRef,
    ySpeedRef,
    scrollRef,
    cameraRef,
    setScore
  } = gameState

  const drawBoxes = useCallback((context: CanvasRenderingContext2D) => {
    boxes.forEach((box) => {
      const { x, y, width, color } = box
      const newY = INITIAL_BOX_Y - y + cameraRef.current
      
      context.fillStyle = color
      context.fillRect(x, newY, width, BOX_HEIGHT)
    })
  }, [boxes, cameraRef])

  const drawDebris = useCallback((context: CanvasRenderingContext2D) => {
    const { x, y, width } = debris
    const newY = INITIAL_BOX_Y - y + cameraRef.current
    
    context.fillStyle = 'red'
    context.fillRect(x, newY, width, BOX_HEIGHT)
  }, [debris, cameraRef])

  const updateCamera = useCallback(() => {
    if (scrollRef.current > 0) {
      cameraRef.current++
      scrollRef.current--
    }
  }, [scrollRef, cameraRef])

  const createNewBox = useCallback(() => {
    const newBox: Box = {
      x: 0,
      y: (currentRef.current + 5) * BOX_HEIGHT,
      width: boxes[currentRef.current - 1].width,
      color: createStepColor(currentRef.current)
    }
    setBoxes(prevBoxes => [...prevBoxes, newBox])
  }, [boxes, currentRef, setBoxes])

  const createNewDebris = useCallback((difference: number) => {
    const currentBox = boxes[currentRef.current]
    const previousBox = boxes[currentRef.current - 1]
    
    const debrisX = currentBox.x > previousBox.x
      ? currentBox.x + currentBox.width
      : currentBox.x
      
    setDebris({
      x: debrisX,
      y: currentBox.y,
      width: difference
    })
  }, [boxes, currentRef, setDebris])

  const updateFallMode = useCallback(() => {
    setBoxes(prevBoxes => {
      const newBoxes = [...prevBoxes]
      const currentBox = newBoxes[currentRef.current]
      currentBox.y -= ySpeedRef.current
      
      const positionPreviousBox = newBoxes[currentRef.current - 1].y + BOX_HEIGHT
      
      if (currentBox.y <= positionPreviousBox) {
        handleBoxLanding()
      }

      return newBoxes
    })
  }, [setBoxes, currentRef, ySpeedRef])

  const adjustCurrentBox = useCallback((difference: number) => {
    setBoxes(prevBoxes => {
      const newBoxes = [...prevBoxes]
      const currentBox = newBoxes[currentRef.current]
      const previousBox = newBoxes[currentRef.current - 1]
      
      if (currentBox.x > previousBox.x) {
        currentBox.width -= difference
      } else {
        currentBox.width += difference
        currentBox.x = previousBox.x
      }

      return newBoxes
    })
  }, [setBoxes, currentRef])

  const handleBoxLanding = useCallback(() => {
    const currentBox = boxes[currentRef.current]
    const previousBox = boxes[currentRef.current - 1]
    
    const difference = currentBox.x - previousBox.x
    
    if (Math.abs(difference) >= currentBox.width) {
      setGameMode(MODES.GAMEOVER)
      return
    }
    
    adjustCurrentBox(difference)
    createNewDebris(difference)
    
    xSpeedRef.current += xSpeedRef.current > 0 ? 1 : -1
    currentRef.current += 1
    scrollRef.current = BOX_HEIGHT
    setGameMode(MODES.BOUNCE)
    
    setScore(currentRef.current - 1)
    
    createNewBox()
  }, [boxes, currentRef, xSpeedRef, scrollRef, setGameMode, setScore, adjustCurrentBox, createNewDebris, createNewBox])

  const moveAndDetectCollision = useCallback(() => {
    setBoxes(prevBoxes => {
      const newBoxes = [...prevBoxes]
      const currentBox = newBoxes[currentRef.current]
      currentBox.x += xSpeedRef.current
      
      const isMovingRight = xSpeedRef.current > 0
      const isMovingLeft = xSpeedRef.current < 0
      
      const hasHitRightSide = currentBox.x + currentBox.width > CANVAS_WIDTH
      const hasHitLeftSide = currentBox.x < 0
      
      if (
        (isMovingRight && hasHitRightSide) ||
        (isMovingLeft && hasHitLeftSide)
      ) {
        xSpeedRef.current = -xSpeedRef.current
      }

      return newBoxes
    })
  }, [setBoxes, currentRef, xSpeedRef])

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    drawBackground(context)
    drawBoxes(context)
    drawDebris(context)
    
    if (gameMode === MODES.BOUNCE) {
      moveAndDetectCollision()
    } else if (gameMode === MODES.FALL) {
      updateFallMode()
    }

    setDebris(prevDebris => ({
      ...prevDebris,
      y: prevDebris.y - ySpeedRef.current
    }))
    updateCamera()
    
    if (gameMode !== MODES.GAMEOVER) {
      animationFrameRef.current = requestAnimationFrame(drawFrame)
    } else {
      gameOver(context)
    }
  }, [canvasRef, gameMode, drawBoxes, drawDebris, moveAndDetectCollision, updateFallMode, updateCamera, setDebris, ySpeedRef])

  useEffect(() => {
    if (canvasRef.current) {
      drawFrame()
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [drawFrame, canvasRef])
}
