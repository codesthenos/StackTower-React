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
import type { box } from "./types.d.ts"

function App () {
  //State
  const [boxes, setBoxes] = useState<box[]>([{
    x: (CANVAS_WIDTH / 2) - (INITIAL_BOX_WIDTH / 2),
    y: BOX_HEIGHT,
    width: INITIAL_BOX_WIDTH,
    color: "#fff"
  }])
  const [current, setCurrent] = useState(0)
  const [mode, setMode] = useState<MODES>(MODES.BOUNCE)
  const [xSpeed, setXSpeed] = useState(INITIAL_X_SPEED)
  const [ySpeed, setYSpeed] = useState(INITIAL_Y_SPEED)
  const [scrollCounter, setScrollCounter] = useState(0)
  const [cameraY, setCameraY] = useState(0)

  //Initial box move
  function initialBoxMove () {
    const updatedBoxes = boxes.map(box => box === boxes[current] ? { ...box, x: box.x + INITIAL_X_SPEED } : box)
    setBoxes(updatedBoxes)
    
    const isMovingForwards = xSpeed > 0
    const isMovingBackwards = xSpeed < 0
    
    const isOnRightLimit = boxes[current].x === CANVAS_WIDTH
    const isOnLeftLimit = boxes[current].x - CANVAS_WIDTH === 0
          
    if (
      (isMovingForwards && isOnRightLimit) ||
      (isMovingBackwards && isOnLeftLimit)
    ) {
      setMode(MODES.GAMEOVER)
      console.log(mode)
    }
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
      boxes.forEach((box) => {
        const { x, y, width, color } = box
        const newY = CANVAS_HEIGHT - y + cameraY
        
        if (!context) return
        context.fillStyle = color
        context.fillRect(x, newY, width, BOX_HEIGHT)
      })
    }
    //Draw game
    function draw () {
      if (mode === MODES.GAMEOVER) return
  
      drawBackground()
      drawBoxes()
  
      if (mode === MODES.BOUNCE) {
        initialBoxMove()
      }
  
      window.requestAnimationFrame(draw)
    }
  
    draw()
  }, [])
  //Restart Game to initial values
  function restart () {
    setBoxes([{
      x: (CANVAS_WIDTH / 2) - (INITIAL_BOX_WIDTH / 2),
      y: BOX_HEIGHT,
      width: INITIAL_BOX_WIDTH,
      color: "#fff"
    }])
    setCurrent(0)
    setMode(MODES.BOUNCE)
    setXSpeed(INITIAL_X_SPEED)
    setYSpeed(INITIAL_Y_SPEED)
    setScrollCounter(0)
    setCameraY(0)
  }
  
  return (
    <>
      <aside>
        <div className="score">
          <h2>SCORE</h2>
          <span>{current}</span>
          <span>xSpeed = {xSpeed}</span>
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
