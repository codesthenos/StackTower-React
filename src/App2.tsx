import { useEffect, useRef } from 'react'
import { MODES, CANVAS_WIDTH, CANVAS_HEIGHT, BOX_HEIGHT, INITIAL_BOX_WIDTH, INITIAL_X_SPEED, INITIAL_Y_SPEED, INITIAL_BOX_Y } from './constants.ts'
import { createStepColor, gameOver } from './gameLogic.ts'
import type { box } from './types.d.ts'

function App () {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scoreRef = useRef<HTMLSpanElement | null>(null)
  const currentRef = useRef(1)
  const modeRef = useRef<MODES>(MODES.BOUNCE)
  const scrollRef = useRef(0)
  const cameraRef = useRef(0)
  const xSpeedRef = useRef(INITIAL_X_SPEED)
  const ySpeedRef = useRef(INITIAL_Y_SPEED)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
  
    const score = scoreRef.current
  
    // STATE
    let boxes: box[] = []
    let debris = { x: 0, y: 0, width: 0 }
  
    function drawBackground () {
      if (!context) return
      context.fillStyle = 'rgba(0, 0, 0, 0.5)'
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }
    
    function drawDebris () {
      if (!context) return
      const { x, y, width } = debris
      const newY = INITIAL_BOX_Y - y + cameraRef.current
      
      context.fillStyle = 'red'
      context.fillRect(x, newY, width, BOX_HEIGHT)
    }
    
    function drawBoxes () {
      if (!context) return
      boxes.forEach((box) => {
        const { x, y, width, color } = box
        const newY = INITIAL_BOX_Y - y + cameraRef.current
        
        context.fillStyle = color
        context.fillRect(x, newY, width, BOX_HEIGHT)
      })
    }
  
    function updateCamera () {
      if (scrollRef.current > 0) {
        cameraRef.current++
        scrollRef.current--
      }
    }
    
    function createNewBox () {
      boxes[currentRef.current] = {
        x: 0,
        y: (currentRef.current + 5) * BOX_HEIGHT,
        width: boxes[currentRef.current - 1].width,
        color: createStepColor(currentRef.current)
      }
    }
    
    function createNewDebris (difference) {
      const currentBox = boxes[currentRef.current]
      const previousBox = boxes[currentRef.current - 1]
      
      const debrisX = currentBox.x > previousBox.x
        ? currentBox.x + currentBox.width
        : currentBox.x
        
      debris = {
        x: debrisX,
        y: currentBox.y,
        width: difference
      }
    }
    
    function updateFallMode () {
      const currentBox = boxes[currentRef.current]
      currentBox.y -= ySpeedRef.current
      
      const positionPreviousBox = boxes[currentRef.current - 1].y + BOX_HEIGHT
      
      if (currentBox.y === positionPreviousBox) {
        handleBoxLanding()
      }
    }
    
    function adjustCurrentBox (difference) {
      const currentBox = boxes[currentRef.current]
      const previousBox = boxes[currentRef.current - 1]
      
      if (currentBox.x > previousBox.x) {
        currentBox.width -= difference
      } else {
        currentBox.width += difference
        currentBox.x = previousBox.x
      }
    }

    function handleBoxLanding () {
      const currentBox = boxes[currentRef.current]
      const previousBox = boxes[currentRef.current - 1]
      
      const difference = currentBox.x - previousBox.x
      
      if (Math.abs(difference) >= currentBox.width) {
        gameOver(context, canvas)
        modeRef.current = MODES.GAMEOVER
        return
      }
      
      adjustCurrentBox(difference)
      createNewDebris(difference)
      
      xSpeedRef.current += xSpeedRef.current > 0 ? 1 : -1
      currentRef.current += 1
      scrollRef.current = BOX_HEIGHT
      modeRef.current = MODES.BOUNCE
      
      if (score) score.textContent = `${currentRef.current - 1}`
      
      createNewBox()
    }
    
    function moveAndDetectCollision () {
      const currentBox = boxes[currentRef.current]
      currentBox.x += xSpeedRef.current
      
      const isMovingRight = xSpeedRef.current > 0
      const isMovingLeft = xSpeedRef.current < 0
      
      const hasHitRightSide =
      currentBox.x + currentBox.width > CANVAS_WIDTH
      
      const hasHitLeftSide = currentBox.x < 0
      
      if (
        (isMovingRight && hasHitRightSide) ||
        (isMovingLeft && hasHitLeftSide)
      ) {
        xSpeedRef.current = -xSpeedRef.current
      }
    }
    
    document.addEventListener('keydown', (event) => {
      if (event.key === ' ' && modeRef.current === MODES.BOUNCE) {
        modeRef.current = MODES.FALL
      }
    })
    
    canvas.onpointerdown = () => {
      if (modeRef.current === MODES.GAMEOVER) {
        restart()
      } else if (modeRef.current === MODES.BOUNCE) {
        modeRef.current = MODES.FALL
      }
    }
    
    function initializeGameState () {
      boxes = [{
        x: (CANVAS_WIDTH / 2) - (INITIAL_BOX_WIDTH / 2),
        y: 200,
        width: INITIAL_BOX_WIDTH,
        color: 'white'
      }]
  
      debris = { x: 0, y: 0, width: 0 }
      currentRef.current = 1
      modeRef.current = MODES.BOUNCE
      xSpeedRef.current = INITIAL_X_SPEED
      ySpeedRef.current = INITIAL_Y_SPEED
      scrollRef.current = 0
      cameraRef.current = 0
  
      createNewBox()
    }
    
    function draw () {
      if (modeRef.current === MODES.GAMEOVER) return
      
      drawBackground()
      drawBoxes()
      drawDebris()
      
      if (modeRef.current === MODES.BOUNCE) {
        moveAndDetectCollision()
      } else if (modeRef.current === MODES.FALL) {
        updateFallMode()
      }
  
      debris.y -= ySpeedRef.current
      updateCamera()
      
      window.requestAnimationFrame(draw)
    }
    
    function restart () {
      initializeGameState()
      draw()
    }

    restart()
  })
  
  return (
    <>
      <span>Puntuación: <span ref={scoreRef} id="score">0</span></span>
      <canvas ref={canvasRef} id="canvas" width="320" height="500"></canvas>
    </>
  )
}
export default App
