/*
 * Copyright (C) 2016 Mark P. Lindsay
 * 
 * This file is part of mysteriousobjectsatnoon.
 *
 * mysteriousobjectsatnoon is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * mysteriousobjectsatnoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with mysteriousobjectsatnoon.  If not, see <http://www.gnu.org/licenses/>.
 */

const secondsInDay = 24 * 60 * 60
const secondsInHour = 60 * 60
const secondsInMinute = 60

const _toPaddedString = (timeInteger) => {
  if (timeInteger < 10) {
    return '0' + timeInteger.toString()
  }
  return timeInteger.toString()
} 

export default function getStringFromSeconds (secondsInput) {
  if (secondsInput === undefined || 
      secondsInput === null || 
      isNaN(secondsInput) ||
      !isFinite(secondsInput)) {
    return undefined
  }
  let seconds = Math.floor(secondsInput)
  if (seconds != secondsInput) {
    return undefined
  }
  if (seconds < 0) {
    return undefined
  }
  let days = 0
  if (seconds >= secondsInDay) {
    days = Math.floor(seconds / secondsInDay)
    seconds -= days * secondsInDay
  }
  let hours = 0
  if (seconds >= secondsInHour) {
    hours = Math.floor(seconds / secondsInHour)
    seconds -= hours * secondsInHour
  }
  let minutes = 0
  if (seconds >= secondsInMinute) {
    minutes = Math.floor(seconds / secondsInMinute)
    seconds -= minutes * secondsInMinute
  }
  return [
    days.toString(),
    _toPaddedString(hours),
    _toPaddedString(minutes),
    _toPaddedString(seconds)
  ].join(':')
}
