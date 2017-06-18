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

// This code is adapted from the Perlin noise generator that is a component of
// https://github.com/processing/p5.js. Their code is in itself an adaptation 
// of other implementations.

const PERLIN_AMP_FALLOFF = 0.5
const PERLIN_OCTAVES = 4 
const PERLIN_SIZE = 4095
const PERLIN_YWRAPB = 4
const PERLIN_YWRAP = 1<<PERLIN_YWRAPB
const PERLIN_ZWRAPB = 8
const PERLIN_ZWRAP = 1<<PERLIN_ZWRAP

const getScaledCosine = function (i) {
  return 0.5 * (1.0 - Math.cos(i * Math.PI))
}

var perlin = null

export default function noise (x) {
  let y = 0
  let z = 0

  if (perlin === null) {
    perlin = new Array(PERLIN_SIZE + 1)
    for (var i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random()
    }
  }

  if (x < 0) { 
    x =- x 
  }
  if (y < 0) { 
    y =- y 
  }
  if (z < 0) { 
    z =- z 
  }

  let xi = Math.floor(x)
  let yi = Math.floor(y)
  let zi = Math.floor(z)
  let xf = x - xi
  let yf = y - yi
  let zf = z - zi
  let rxf
  let ryf

  let r = 0
  let ampl = 0.5

  let n1
  let n2
  let n3

  for (var o = 0; o < PERLIN_OCTAVES; o += 1) {
    let of = xi + (yi<<PERLIN_YWRAPB) + (zi<<PERLIN_ZWRAPB)

    rxf = getScaledCosine(xf)
    ryf = getScaledCosine(yf)

    n1 = perlin[of&PERLIN_SIZE]
    n1 += rxf * (perlin[(of + 1)&PERLIN_SIZE] - n1)
    n2 = perlin[(of + PERLIN_YWRAP)&PERLIN_SIZE]
    n2 += rxf * (perlin[(of + PERLIN_YWRAP+1)&PERLIN_SIZE] - n2)
    n1 += ryf * (n2 - n1)

    of += PERLIN_ZWRAP
    n2 = perlin[of&PERLIN_SIZE]
    n2 += rxf * (perlin[(of + 1)&PERLIN_SIZE] - n2)
    n3 = perlin[(of + PERLIN_YWRAP)&PERLIN_SIZE]
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1)&PERLIN_SIZE] - n3)
    n2 += ryf * (n3 - n2)

    n1 += getScaledCosine(zf) * (n2 - n1)

    r += n1 * ampl
    ampl *= PERLIN_AMP_FALLOFF
    xi<<=1
    xf *= 2
    yi<<=1
    yf *= 2
    zi<<=1
    zf *= 2

    if (xf >= 1.0) { 
      xi += 1
      xf -= 1 
    }
    if (yf >= 1.0) { 
      yi += 1
      yf -= 1 
    }
    if (zf >= 1.0) { 
      zi += 1
      zf -= 1 
    }
  }

  return r
}
