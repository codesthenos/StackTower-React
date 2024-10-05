import { useEffect, useState } from "react"
//Constants and enum
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  INITIAL_BOX_WIDTH,
  INITIAL_X_SPEED,
  INITIAL_Y_SPEED,
  BOX_HEIGHT,
  MODES } from "./constants.ts"
//Types
import type { state } from "./types.d.ts"

function App () {
  //State
  const [gameState, setGameState] = useState<state>({
    current: 0,
    mode: MODES.BOUNCE,
    xSpeed: INITIAL_X_SPEED,
    boxes: [{
      x: (CANVAS_WIDTH / 2) - (INITIAL_BOX_WIDTH / 2),
      y: BOX_HEIGHT,
      width: INITIAL_BOX_WIDTH,
      color: "#fff"
    }]
  })
  const [ySpeed, setYSpeed] = useState(INITIAL_Y_SPEED)
  const [scrollCounter, setScrollCounter] = useState(0)
  const [cameraY, setCameraY] = useState(0)

  //Initial box move
  function initialBoxMove () {    
    const isMovingForwards = gameState.xSpeed > 0
    const isMovingBackwards = gameState.xSpeed < 0
    
    const isOnRightLimit = gameState.boxes[gameState.current].x === CANVAS_WIDTH
    const isOnLeftLimit = gameState.boxes[gameState.current].x - CANVAS_WIDTH === 0
          
    if (
      (isMovingForwards && isOnRightLimit) ||
      (isMovingBackwards && isOnLeftLimit)
    ) {
      setGameState({ ...gameState, mode: MODES.GAMEOVER })
      console.log(gameState.mode)
      return
    }

    const movingCurrentBoxBoxes = gameState.boxes.map(box => box === gameState.boxes[gameState.current] ? { ...box, x: box.x + gameState.xSpeed } : box)
    setGameState({ ...gameState, boxes: movingCurrentBoxBoxes })
  }

  useEffect(() => {
    //Canvas context
    const canvas = document.getElementById('canvas')
    if (!(canvas instanceof HTMLCanvasElement)) return
    const context = canvas.getContext('2d')
    if (!context) return
    //Draw Background
    function drawBackground () {
      if (!context) return
      context.fillStyle = "#e3bb56"
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }
    //Draw boxes
    function drawBoxes () {
      gameState.boxes.forEach((box) => {
        const { x, y, width, color } = box
        const newY = CANVAS_HEIGHT - y + cameraY
        
        if (!context) return
        context.fillStyle = color
        context.fillRect(x, newY, width, BOX_HEIGHT)
      })
    }
    //Draw game
    function draw () {
      if (gameState.mode === MODES.GAMEOVER) return
  
      drawBackground()
      drawBoxes()
  
      if (gameState.mode === MODES.BOUNCE) {
        initialBoxMove()
      }
  
      window.requestAnimationFrame(draw)
    }
  
    draw()
  }, [])
  //Restart Game to initial values
  function restart () {
    setGameState({
      current: 0,
      mode: MODES.BOUNCE,
      xSpeed: INITIAL_X_SPEED,
      boxes: [{
        x: (CANVAS_WIDTH / 2) - (INITIAL_BOX_WIDTH / 2),
        y: BOX_HEIGHT,
        width: INITIAL_BOX_WIDTH,
        color: "#fff"
      }]
    })
    setCameraY(0)
    setScrollCounter(0)
    setYSpeed(INITIAL_Y_SPEED)
  }
  
  return (
    <>
      <aside>
        <div className="score">
          <h2>SCORE</h2>
          <span>{gameState.current}</span>
          <span>xSpeed = {gameState.xSpeed}</span>
          <span>ySpeed = {ySpeed}</span>
          <span>scrollCounter = {scrollCounter}</span>
        </div>
        <button onClick={restart}>ReStart</button>
      </aside>
      <canvas id="canvas" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
    </>
  )
}

export default App
