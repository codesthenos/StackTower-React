import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.ts"

export function drawBackground (context: CanvasRenderingContext2D | null) {
  if (!context) return
  context.fillStyle = 'rgba(0, 0, 0, 0.5)'
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

export function gameOver (context: CanvasRenderingContext2D | null) {

  if (!context) return
  context.fillStyle = 'rgba(255, 0, 0, 0.5)'
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  context.font = 'bold 20px Arial'
  context.fillStyle = 'white'
  context.textAlign = 'center'
  context.fillText(
    'Game Over',
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2
  )
}

export function createStepColor (step: number) {
  if (step === 0) return 'white'

  const red = Math.floor(Math.random() * 255)
  const green = Math.floor(Math.random() * 255)
  const blue = Math.floor(Math.random() * 255)

  return `rgb(${red}, ${green}, ${blue})`
}
