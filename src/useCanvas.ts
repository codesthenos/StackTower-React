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
      const mode = frameIdRef.current < 300 ? MODES.BOUNCE : MODES.GAMEOVER
      if (mode === MODES.GAMEOVER) return
      
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
      */

      speedRef.current = INITIAL_X_SPEED * frameIdRef.current
      boxesRef.current = [{ ...INITIAL_BOXES[0], x: 100 + speedRef.current }]

      console.log('SPEED REF', speedRef.current)
      console.log('BOXES.X', boxesRef.current[0].x)
      draw({ context, boxes: boxesRef.current, mode })
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
