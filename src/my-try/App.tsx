//Constants
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants.ts'
//Draw Function
import draw from './canvasDraw.ts'
//Components
import Canvas from './Canvas.tsx'

function App () {
  
  return (
    <>
      <Canvas draw={draw} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </>
  )
}

export default App
