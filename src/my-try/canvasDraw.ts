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

export function getColor () {
  const red = Math.floor(Math.random() * 255)
  const green = Math.floor(Math.random() * 255)
  const blue = Math.floor(Math.random() * 255)

  return `rgb(${red}, ${green}, ${blue})`
}

export function getWidth (boxesRef: box[], currentRef: number) {
  const currentBox = boxesRef[currentRef]

  if (currentRef === 0) return currentBox.width

  const previousBox = boxesRef[currentRef - 1]

  const overlapStart = Math.max(previousBox.x, currentBox.x)
  const overlapEnd = Math.min(previousBox.x + previousBox.width, currentBox.x + currentBox.width)
  
  return overlapEnd > overlapStart ? overlapEnd - overlapStart : 0
}
