import { useEffect, useRef } from 'react'
import type { box } from './types.d.ts'
import { INITIAL_BOXES, INITIAL_X_SPEED, MODE } from './constants.ts'

function useCanvas (draw: ({ context, boxes, mode }: { context: CanvasRenderingContext2D, boxes: box[], mode: MODE }) => void) {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameIdRef = useRef(0)
  const speedRef = useRef(INITIAL_X_SPEED)
  const boxesRef = useRef<box[]>(INITIAL_BOXES)
  const modeRef = useRef<MODE>(MODE.BOUNCE)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    
    function render () {
      if (!context) return

      function moveBox () {
        if ((speedRef.current > 0 && boxesRef.current[0].x > 350) || (speedRef.current < 0 && boxesRef.current[0].x < -50) ) {
          speedRef.current = -speedRef.current
        }
        
        boxesRef.current[0].x += speedRef.current
      }

      //Start Gameloop
      if (modeRef.current === MODE.BOUNCE) moveBox()
      draw({ context, boxes: boxesRef.current, mode: modeRef.current })
      frameIdRef.current = window.requestAnimationFrame(render)
    }
    render()
    
    function handleInput () {
      if (modeRef.current === MODE.BOUNCE) modeRef.current = MODE.STOP
      else if (modeRef.current === MODE.STOP) modeRef.current = MODE.BOUNCE
    }

    canvas.addEventListener('pointerdown', handleInput)
    document.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
        handleInput()
      }
    })
    
    return () => {
      canvas.removeEventListener('pointerdown', handleInput)
      document.removeEventListener('keydown', handleInput)
      window.cancelAnimationFrame(frameIdRef.current)
    }
  }, [draw])

  return { canvasRef }
}
export default useCanvas
