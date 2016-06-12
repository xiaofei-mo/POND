export default function fadeOut (func, duration, cb) {
  let decrementer
  let v = 1.00
  const decrement = () => {
    if (v > 0.00) {
      v = Math.round((v - 0.1) * 1e12) / 1e12
      func(v)
    }
    else {
      clearInterval(decrementer)
      if (cb !== undefined) {
        cb()
      }
    }
  }
  const d = duration * 0.1
  decrementer = setInterval(decrement, d)
}
