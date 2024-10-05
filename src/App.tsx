import { useEffect, useState } from "react"
//Constants and enum
import {
  INITIAL_BOX_WIDTH,
  CANVAS_HEIGHT,
  INITIAL_X_SPEED,
  INITIAL_Y_SPEED,
  BOX_HEIGHT,
  MODES } from "./constants.ts"
//Types
import type { box } from "./types.d.ts"

function App () {
  //State
  const [boxes, setBoxes] = useState<box[]>([{
    x: 0,
    y: CANVAS_HEIGHT,
    width: INITIAL_BOX_WIDTH,
    color: "#fff"
  }])
  const [current, setCurrent] = useState(0)
  const [mode, setMode] = useState<MODES>(MODES.BOUNCE)
  const [xSpeed, setXSpeed] = useState(INITIAL_X_SPEED)
  const [ySpeed, setYSpeed] = useState(INITIAL_Y_SPEED)
  const [scrollCounter, setScrollCounter] = useState(0)
  const [cameraY, setCameraY] = useState(0)

  useEffect(() => {
    //Canvas context
    const canvas = document.getElementById('canvas')
    if (!(canvas instanceof HTMLCanvasElement)) return
    const context = canvas.getContext('2d')
    if (!context) return
    //Draw Background
    function drawBackground () {
      if (!context || !(canvas instanceof HTMLCanvasElement)) return
      context.fillStyle = "#e3bb56"
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
    //Draw boxes
    function drawBoxes () {
      boxes.forEach((box: box) => {
        const { x, y, width, color } = box
        const newY = CANVAS_HEIGHT - y + cameraY
        //console.log(`Drawing box at x: ${x}, newY: ${newY}, width: ${width}, color: ${color}`)
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

      window.requestAnimationFrame(draw)
    }

    draw()
  }, [boxes])
  //Restart Game to initial values
  function restart () {
    setBoxes([{
      x: 0,
      y: CANVAS_HEIGHT,
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
        </div>
        <button onClick={restart}>ReStart</button>
      </aside>
      <canvas id="canvas" width={400} height={CANVAS_HEIGHT}></canvas>
    </>
  )
}

export default App
