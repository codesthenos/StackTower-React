import useGame from './useGame.ts'

function App () {
  const { canvasRef, scoreRef } = useGame()

  return (
    <>
      <span>Puntuación: <span ref={scoreRef} id="score">0</span></span>
      <canvas ref={canvasRef} id="canvas" width="320" height="500"></canvas>
    </>
  )
}
export default App
