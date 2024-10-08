//Constants
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  BOX_HEIGHT,
  MODES } from './constants.ts'
//Types
import type { box } from './types.d.ts'
//Components
import Canvas from './Canvas.tsx'
import Aside from './Aside.tsx'

function App () {

  function drawBackground ({ context }: { context: CanvasRenderingContext2D }) {
    context.fillStyle = "#e3bb56"
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  function drawBoxes ({ context, boxes }: { context: CanvasRenderingContext2D, boxes: box[] }) {
    boxes.forEach((box) => {
      const { x, y, width, color } = box
      const newY = CANVAS_HEIGHT - y //+ cameraY
        
      context.fillStyle = color
      context.fillRect(x, newY, width, BOX_HEIGHT)
    })
  }

  function draw ({ context, boxes, mode }: { context: CanvasRenderingContext2D, boxes: box[], mode: MODES }) {
    if (mode === MODES.GAMEOVER) return
  
    drawBackground({ context })
    drawBoxes({ context, boxes })

  }
  
  return (
    <>
      <Aside />
      <Canvas draw={draw} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </>
  )
}

export default App
