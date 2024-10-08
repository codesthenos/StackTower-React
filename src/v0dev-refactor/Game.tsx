import { useGame } from './useGame.ts'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.ts'

function Game () {
  const { canvasRef, scoreRef, score } = useGame()

  return (
    <>
      <span>Score: <span ref={scoreRef}>{score}</span></span>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
    </>
  )
}

export default Game
