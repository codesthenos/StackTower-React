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

  const canvasRef = useCanvas()

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

  /*
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
  */

  function draw ({ context, boxes, mode }: { context: CanvasRenderingContext2D, boxes: box[], mode: MODES }) {
    if (mode === MODES.GAMEOVER) return
  
    drawBackground({ context })
    drawBoxes({ context, boxes })
    //initialBoxMove()

  }
  
  return (
    <>
      <Aside />
      <Canvas ref={canvasRef} draw={draw} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </>
  )
}

export default App
