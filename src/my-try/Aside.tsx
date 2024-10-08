import {
  INITIAL_X_SPEED,
  INITIAL_Y_SPEED } from './constants.ts'

function Aside () {
  return (
    <aside>
      <div className="score">
        <h2>SCORE</h2>
        <span>xSpeed = {INITIAL_X_SPEED}</span>
        <span>ySpeed = {INITIAL_Y_SPEED}</span>
      </div>
      <button onClick={() => {}}>ReStart</button>
    </aside>
  )
}
export default Aside
