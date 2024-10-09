import { useEffect, useRef } from 'react'
import type { box } from './types.d.ts'
import { BOX_HEIGHT, CANVAS_WIDTH, INITIAL_BOX, INITIAL_BOX_X, INITIAL_X_SPEED, MODE } from './constants.ts'
import { getColor, getWidth } from './canvasDraw.ts'

function useCanvas (draw: ({ context, boxes, mode }: { context: CanvasRenderingContext2D, boxes: box[], mode: MODE }) => void) {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameIdRef = useRef(0)
  const speedRef = useRef(INITIAL_X_SPEED)
  const boxesRef = useRef<box[]>([INITIAL_BOX])
  const modeRef = useRef<MODE>(MODE.BOUNCE)
  const currentRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    
    function moveBox () {
      if ((speedRef.current > 0 && boxesRef.current[currentRef.current].x > CANVAS_WIDTH - 50) || (speedRef.current < 0 && boxesRef.current[currentRef.current].x < -50) ) {
        speedRef.current = -speedRef.current
      }
      
      boxesRef.current[currentRef.current].x += speedRef.current
    }

    function addBox () {
      const newBox = {
        x: INITIAL_BOX_X,
        y: boxesRef.current[currentRef.current].y + BOX_HEIGHT,
        width: getWidth(boxesRef.current, currentRef.current),
        color: getColor()
      }
      boxesRef.current = [...boxesRef.current, newBox]
    }

    function render () {
      if (!context) return

      //Start Gameloop
      if (modeRef.current === MODE.BOUNCE) {
        moveBox()
      } else if (modeRef.current === MODE.STOP) {
        addBox()
        modeRef.current = MODE.BOUNCE
        currentRef.current++
        speedRef.current += speedRef.current > 0 ? 1 : -1
      }
      draw({ context, boxes: boxesRef.current, mode: modeRef.current })
      frameIdRef.current = window.requestAnimationFrame(render)
    }
    render()
    
    function handleInput () {
      if (modeRef.current === MODE.BOUNCE) modeRef.current = MODE.STOP
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
