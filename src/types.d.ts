export interface box {
  x: number
  y: number
  width: number
  color: string
}

export interface debris {
  x: number
  y: number
  width: number
}

export interface state {
  current: number
  mode: MODES
  xSpeed: number
  boxes: box[]
}
