/*
 * Copyright (C) 2016 Mark P. Lindsay
 * 
 * This file is part of video-site.
 *
 * video-site is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * video-site is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with video-site.  If not, see <http://www.gnu.org/licenses/>.
 */

const secondsInDay = 24 * 60 * 60
const secondsInHour = 60 * 60
const secondsInMinute = 60

export default function getSecondsFromString (string) {
  if (string === undefined || string === null) {
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
  if (days != parts[0] ||
      isNaN(days) ||
      days < 0 || 
      hours != parts[1] ||
      isNaN(hours) ||
      hours > 23 || 
      hours < 0 || 
      minutes != parts[2] ||
      isNaN(minutes) ||
      minutes > 59 || 
      minutes < 0 || 
      seconds != parts[3] ||
      isNaN(seconds) ||
      seconds > 59 ||
      seconds < 0) {
    return undefined
  }
  return (days * secondsInDay) + 
         (hours * secondsInHour) + 
         (minutes * secondsInMinute) + 
         seconds
}
