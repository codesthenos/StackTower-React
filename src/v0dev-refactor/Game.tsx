import { useGame } from './useGame.ts'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.ts'

function Game () {
  const { canvasRef, score, handleInput } = useGame()

  return (
    <>
      <span>Score: <span>{score}</span></span>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onPointerDown={handleInput}
      />
    </>
  )
}

export default Game
