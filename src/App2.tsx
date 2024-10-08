import { useEffect, useRef } from 'react'
import { MODES } from './constants.ts'
import { gameOver } from './gameLogic.ts'

function App () {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scoreRef = useRef<HTMLSpanElement | null>(null)
  const currentRef = useRef(1)
  const modeRef = useRef<MODES>(MODES.BOUNCE)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
  
    const score = scoreRef.current
  
    /* CONSTANTS */
    const INITIAL_BOX_WIDTH = 200
    const INITIAL_BOX_Y = 600
  
    const BOX_HEIGHT = 50
    const INITIAL_Y_SPEED = 5
    const INITIAL_X_SPEED = 2
  
    // STATE
    let boxes = []
    let debris = { x: 0, y: 0, width: 0 }
    let scrollCounter, cameraY, xSpeed, ySpeed
  
    function drawBackground () {
      context.fillStyle = 'rgba(0, 0, 0, 0.5)'
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    function drawDebris () {
      const { x, y, width } = debris
      const newY = INITIAL_BOX_Y - y + cameraY
      
      context.fillStyle = 'red'
      context.fillRect(x, newY, width, BOX_HEIGHT)
    }
    
    function drawBoxes () {
      boxes.forEach((box) => {
        const { x, y, width, color } = box
        const newY = INITIAL_BOX_Y - y + cameraY
        
        context.fillStyle = color
        context.fillRect(x, newY, width, BOX_HEIGHT)
      })
    }
    
    function createStepColor (step) {
      if (step === 0) return 'white'
  
      const red = Math.floor(Math.random() * 255)
      const green = Math.floor(Math.random() * 255)
      const blue = Math.floor(Math.random() * 255)
  
      return `rgb(${red}, ${green}, ${blue})`
    }
  
    function updateCamera () {
      if (scrollCounter > 0) {
        cameraY++
        scrollCounter--
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
      currentBox.y -= ySpeed
      
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
      
      xSpeed += xSpeed > 0 ? 1 : -1
      currentRef.current += 1
      scrollCounter = BOX_HEIGHT
      modeRef.current = MODES.BOUNCE
      
      score.textContent = currentRef.current - 1
      
      createNewBox()
    }
    
    function moveAndDetectCollision () {
      const currentBox = boxes[currentRef.current]
      currentBox.x += xSpeed
      
      const isMovingRight = xSpeed > 0
      const isMovingLeft = xSpeed < 0
      
      const hasHitRightSide =
      currentBox.x + currentBox.width > canvas.width
      
      const hasHitLeftSide = currentBox.x < 0
      
      if (
        (isMovingRight && hasHitRightSide) ||
        (isMovingLeft && hasHitLeftSide)
      ) {
        xSpeed = -xSpeed
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
        x: (canvas.width / 2) - (INITIAL_BOX_WIDTH / 2),
        y: 200,
        width: INITIAL_BOX_WIDTH,
        color: 'white'
      }]
  
      debris = { x: 0, y: 0, width: 0 }
      currentRef.current = 1
      modeRef.current = MODES.BOUNCE
      xSpeed = INITIAL_X_SPEED
      ySpeed = INITIAL_Y_SPEED
      scrollCounter = 0
      cameraY = 0
  
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
  
      debris.y -= ySpeed
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
