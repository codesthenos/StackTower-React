export const CANVAS_HEIGHT = 800
export const CANVAS_WIDTH = 400

export const INITIAL_BOX_WIDTH = 300
export const BOX_HEIGHT = 50
export const INITIAL_BOX_X = CANVAS_WIDTH / 2 - INITIAL_BOX_WIDTH /2
export const INITIAL_BOX_COLOR = 'blueviolet'

export const INITIAL_BOX = { x: INITIAL_BOX_X, y: BOX_HEIGHT, width: INITIAL_BOX_WIDTH, color: INITIAL_BOX_COLOR }

export const INITIAL_Y_SPEED = 0
export const INITIAL_X_SPEED = 1

export enum MODE {
  STOP = 'stop',
  BOUNCE = 'bounce',
  GAMEOVER = 'gameover'
}
