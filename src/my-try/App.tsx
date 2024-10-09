//Constants
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants.ts'
//Draw Function
import draw from './canvasDraw.ts'
//Components
import Canvas from './Canvas.tsx'
import Aside from './Aside.tsx'

function App () {
  
  return (
    <>
      <Aside />
      <Canvas draw={draw} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </>
  )
}

export default App
