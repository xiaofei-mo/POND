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

import chai from 'chai'
import chaiImmutable from 'chai-immutable'
import Immutable from 'immutable'
import getPaddingLeft from '../../src/selectors/getPaddingLeft'

chai.use(chaiImmutable)

describe('src/selectors/getPaddingLeft no items', () => {

  it('returns correct value with negative item x values', () => {
    const state = Immutable.Map({
      page: Immutable.Map({
        items: Immutable.Map({
          abc: Immutable.Map({
            x: -4464
          }),
          def: Immutable.Map({
            x: -4784
          }),
          ghi: Immutable.Map({
            x: -5286
          }),
          jkl: Immutable.Map({
            x: -2816
          }),
          mno: Immutable.Map({
            x: -5674
          })
        }),
        width: 1024
      })
    })
    chai.assert.strictEqual(getPaddingLeft(state), 6698)
  })

  it('returns correct value with positive item x values', () => {
    const state = Immutable.Map({
      page: Immutable.Map({
        items: Immutable.Map({
          abc: Immutable.Map({
            x: 4464
          }),
          def: Immutable.Map({
            x: 4784
          }),
          ghi: Immutable.Map({
            x: 5286
          }),
          jkl: Immutable.Map({
            x: 2816
          }),
          mno: Immutable.Map({
            x: 5674
          })
        }),
        width: 1024
      })
    })
    chai.assert.strictEqual(getPaddingLeft(state), -1792)
  })

  it('returns 0 with no items', () => {
    const state = Immutable.Map({
      page: Immutable.Map({
        items: Immutable.Map(),
        width: 1024
      })
    })
    chai.assert.strictEqual(getPaddingLeft(state), 0)
  })

})
