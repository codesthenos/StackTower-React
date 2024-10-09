import { BOX_HEIGHT, CANVAS_HEIGHT, CANVAS_WIDTH, INITIAL_BOX_Y } from './constants.ts'
import type { Box, Debris } from './types.d.ts'

export function drawBackground (context: CanvasRenderingContext2D) {
  context.fillStyle = 'rgba(0, 0, 0, 0.5)'
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

export function gameOver (context: CanvasRenderingContext2D) {
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

export function drawDebris (context: CanvasRenderingContext2D, currentDebrisRef: Debris, currentCameraRef: number) {
  if (!context) return

  const { x, y, width } = currentDebrisRef
  const newY = INITIAL_BOX_Y - y + currentCameraRef
  
  context.fillStyle = 'red'
  context.fillRect(x, newY, width, BOX_HEIGHT)
}

export function drawBoxes (context: CanvasRenderingContext2D, currentBoxesRef: Box[], currentCameraRef: number) {
  if (!context) return

  currentBoxesRef.forEach((box) => {
    const { x, y, width, color } = box
    const newY = INITIAL_BOX_Y - y + currentCameraRef
    
    context.fillStyle = color
    context.fillRect(x, newY, width, BOX_HEIGHT)
  })
}
