import type { MODE } from './constants.ts'
import type { box } from './types.d.ts'
import useCanvas from './useCanvas.ts'

function Canvas (props: { draw: ({ context, boxes, mode }: { context: CanvasRenderingContext2D, boxes: box[], mode: MODE }) => void, width: number, height: number }) {
  const { draw, ...rest } = props
  const { canvasRef } = useCanvas(draw)
  
  return (
    <>
      <canvas ref={canvasRef} { ...rest } ></canvas>
    </>
  )
}

export default Canvas
