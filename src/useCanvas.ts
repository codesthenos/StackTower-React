import { useEffect, useRef } from 'react'
import type { box } from './types.d.ts'
import type { MODES } from './constants.ts'

function useCanvas (draw: ({ context, boxes, mode }: { context: CanvasRenderingContext2D, boxes: box[], mode: MODES }) => void) {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    
  }, [])

  return canvasRef
}
export default useCanvas
