import { useEffect, useRef } from 'react'
import type { box } from './types.d.ts'
import { INITIAL_BOXES, INITIAL_X_SPEED, MODES } from './constants.ts'

function useCanvas (draw: ({ context, boxes, mode }: { context: CanvasRenderingContext2D, boxes: box[], mode: MODES }) => void) {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameIdRef = useRef(0)
  const speedRef = useRef(INITIAL_X_SPEED)
  const boxesRef = useRef<box[]>(INITIAL_BOXES)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    
    function render () {
      if (!context) return
      //console.log('FRAME ID', frameIdRef.current)
      
      //const isMovingForwards = speedRef.current > 0
      //const isMovingBackwards = speedRef.current < 0

      //const isOnRightLimit = boxesRef.current[0].x === CANVAS_WIDTH / 2
      //const isOnLeftLimit = boxesRef.current[0].x - CANVAS_WIDTH === 0
      /*
      if (
        (isMovingForwards && isOnRightLimit) ||
        (isMovingBackwards && isOnLeftLimit)
      ) {
        speedRef.current = -speedRef.current
      }
      console.log('BOX X', boxesRef.current[0].x)
      console.log('SPEED REF', speedRef.current)
      const mode = boxesRef.current[0].x < -50 ? MODES.GAMEOVER : MODES.BOUNCE
      if (mode === MODES.GAMEOVER) return
      */

      if ((speedRef.current > 0 && boxesRef.current[0].x > 350) || (speedRef.current < 0 && boxesRef.current[0].x < -50) ) {
        speedRef.current = -speedRef.current
      }
      
      boxesRef.current[0].x += speedRef.current

      draw({ context, boxes: boxesRef.current, mode: MODES.BOUNCE })
      frameIdRef.current = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(frameIdRef.current)
    }
  }, [draw])

  return { canvasRef }
}
export default useCanvas
