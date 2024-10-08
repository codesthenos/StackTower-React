import { useState, useRef } from 'react'
import { MODES, INITIAL_X_SPEED, INITIAL_Y_SPEED, INITIAL_BOX_WIDTH, CANVAS_WIDTH } from '../constants.ts'
import type { Box, Debris } from '../types.d.ts'

export function useGameState () {
  const [score, setScore] = useState(0)
  const [gameMode, setGameMode] = useState<MODES>(MODES.BOUNCE)
  const [boxes, setBoxes] = useState<Box[]>([{
    x: (CANVAS_WIDTH / 2) - (INITIAL_BOX_WIDTH / 2),
    y: 200,
    width: INITIAL_BOX_WIDTH,
    color: 'white'
  }])
  const [debris, setDebris] = useState<Debris>({ x: 0, y: 0, width: 0 })

  const currentRef = useRef(1)
  const xSpeedRef = useRef(INITIAL_X_SPEED)
  const ySpeedRef = useRef(INITIAL_Y_SPEED)
  const scrollRef = useRef(0)
  const cameraRef = useRef(0)

  return {
    score,
    setScore,
    gameMode,
    setGameMode,
    boxes,
    setBoxes,
    debris,
    setDebris,
    currentRef,
    xSpeedRef,
    ySpeedRef,
    scrollRef,
    cameraRef
  }
}
