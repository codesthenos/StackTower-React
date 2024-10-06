import type { MODES } from './constants.ts'
import type { box } from './types.d.ts'

function Canvas (props: { ref: React.MutableRefObject<null>, draw: ({ context, boxes, mode }: { context: CanvasRenderingContext2D, boxes: box[], mode: MODES }) => void, width: number, height: number }) {
  const { draw, ...rest } = props
  const canvasRef = useRef(null)

  useEffect(() => {
    //Canvas context
    const canvas = document.getElementById('canvas')
    if (!(canvas instanceof HTMLCanvasElement)) return
    const context = canvas.getContext('2d')
    if (!context) return
  }, [])
  
  return (
    <>
      <canvas ref={canvasRef} { ...rest } ></canvas>
    </>
  )
}

export default Canvas
