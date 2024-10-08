export function gameOver (context: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement | null) {

  if (!context || !canvas) return
  context.fillStyle = 'rgba(255, 0, 0, 0.5)'
  context.fillRect(0, 0, canvas.width, canvas.height)
  
  context.font = 'bold 20px Arial'
  context.fillStyle = 'white'
  context.textAlign = 'center'
  context.fillText(
    'Game Over',
    canvas.width / 2,
    canvas.height / 2
  )
}

export function createStepColor (step: number) {
  if (step === 0) return 'white'

  const red = Math.floor(Math.random() * 255)
  const green = Math.floor(Math.random() * 255)
  const blue = Math.floor(Math.random() * 255)

  return `rgb(${red}, ${green}, ${blue})`
}
