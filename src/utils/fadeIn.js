export default function fadeIn (func, cb) {
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
  incrementer = setInterval(increment, 50)
}
