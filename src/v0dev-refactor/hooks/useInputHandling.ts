import { useCallback, useEffect } from 'react'
import type { useGameState } from './useGameState.ts'
import { MODES, INITIAL_X_SPEED, INITIAL_Y_SPEED, INITIAL_BOX_WIDTH, CANVAS_WIDTH } from '../constants.ts'

export function useInputHandling (gameState: ReturnType<typeof useGameState>) {
  const { gameMode, setGameMode, setBoxes, setDebris, currentRef, xSpeedRef, ySpeedRef, scrollRef, cameraRef, setScore } = gameState

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === ' ' && gameMode === MODES.BOUNCE) {
      setGameMode(MODES.FALL)
    }
  }, [gameMode, setGameMode])

  const restartGame = useCallback(() => {
    setBoxes([{
      x: (CANVAS_WIDTH / 2) - (INITIAL_BOX_WIDTH / 2),
      y: 200,
      width: INITIAL_BOX_WIDTH,
      color: 'white'
    }])
    setDebris({ x: 0, y: 0, width: 0 })
    currentRef.current = 1
    xSpeedRef.current = INITIAL_X_SPEED
    ySpeedRef.current = INITIAL_Y_SPEED
    scrollRef.current = 0
    cameraRef.current = 0
    setScore(0)
    setGameMode(MODES.BOUNCE)
  }, [setBoxes, setDebris, currentRef, xSpeedRef, ySpeedRef, scrollRef, cameraRef, setScore, setGameMode])

  const handlePointerDown = useCallback(() => {
    if (gameMode === MODES.GAMEOVER) {
      restartGame()
    } else if (gameMode === MODES.BOUNCE) {
      setGameMode(MODES.FALL)
    }
  }, [gameMode, setGameMode, restartGame])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return handlePointerDown
}
