export interface Box {
  x: number
  y: number
  width: number
  color: string
}

export interface Debris {
  x: number
  y: number
  width: number
}

export interface State {
  current: number
  mode: MODES
  xSpeed: number
  boxes: Box[]
}
