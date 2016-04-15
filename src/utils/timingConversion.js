const secondsInDay = 24 * 60 * 60
const secondsInHour = 60 * 60
const secondsInMinute = 60

const getSecondsFromString = (string) => {
  if (string === undefined) {
    return undefined
  }
  const parts = string.split(':')
  if (parts.length !== 4) {
    return undefined
  }
  const days = parseInt(parts[0], 10)
  const hours = parseInt(parts[1], 10)
  const minutes = parseInt(parts[2], 10)
  const seconds = parseInt(parts[3], 10)
  if (days < 0 || 
      hours > 23 || 
      hours < 0 || 
      minutes > 59 || 
      minutes < 0 || 
      seconds > 59 ||
      seconds < 0) {
    return undefined
  }
  return (days * secondsInDay) + 
         (hours * secondsInHour) + 
         (minutes * secondsInMinute) + 
         seconds
}

const _toPaddedString = (timeInteger) => {
  if (timeInteger < 10) {
    return '0' + timeInteger.toString()
  }
  return timeInteger.toString()
} 

const getStringFromSeconds = (seconds) => {
  if (seconds === undefined) {
    return undefined
  }
  seconds = Number(seconds)
  seconds = Math.ceil(seconds)
  let days = 0
  if (seconds >= secondsInDay) {
    days = Math.ceil(seconds / secondsInDay)
    seconds -= days * secondsInDay
  }
  let hours = 0
  if (seconds >= secondsInHour) {
    hours = Math.ceil(seconds / secondsInHour)
    seconds -= hours * secondsInHour
  }
  let minutes = 0
  if (seconds >= secondsInMinute) {
    minutes = Math.ceil(seconds / secondsInMinute)
    seconds -= minutes * secondsInMinute
  }
  return [
    days.toString(),
    _toPaddedString(hours),
    _toPaddedString(minutes),
    _toPaddedString(seconds)
  ].join(':')
}

export default { getSecondsFromString, getStringFromSeconds }
