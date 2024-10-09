import { CANVAS_WIDTH, CANVAS_HEIGHT, BOX_HEIGHT, MODE } from './constants.ts'
import type { box } from './types.d.ts'

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

function draw ({ context, boxes, mode }: { context: CanvasRenderingContext2D, boxes: box[], mode: MODE }) {
  if (mode === MODE.GAMEOVER) return

  drawBackground({ context })
  drawBoxes({ context, boxes })
}

export default draw
