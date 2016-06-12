export default function fadeIn (func, duration, cb) {
  let incrementer
  let v = 0.00
  const increment = () => {
    if (v < 1.00) {
      v = Math.round((v + 0.1) * 1e12) / 1e12
      func(v)
    }
    else {
      clearInterval(incrementer)
      if (cb !== undefined) {
        cb()
      }
    }
  }
  const d = duration * 0.1
  incrementer = setInterval(increment, d)
}
