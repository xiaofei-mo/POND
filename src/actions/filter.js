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

import { A } from '../constants'
import Immutable from 'immutable'
import { push } from 'react-router-redux'

export default {

  closeAllVocabularies: () => {
    return {
      type: A.CLOSE_ALL_VOCABULARIES
    }
  },

  listenToVocabularies: () => {
    return (dispatch, getState) => {
      dispatch({
        type: A.RECEIVED_VOCABULARIES,
        payload: Immutable.Map({
          vocabularies: Immutable.List([
            Immutable.Map({ 
              isOpen: false,
              name: 'Color', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Rhythm', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Period', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Things', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Forms', 
              terms: Immutable.List([
                Immutable.Map({ name: 'ripple' }), 
                Immutable.Map({ name: 'bubble' }), 
                Immutable.Map({ name: 'meteorite' }), 
                Immutable.Map({ name: 'animals' })
              ])
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Concepts', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Sensory', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Movement', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Perspective', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Source', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'User', 
              terms: Immutable.List()
            })
          ])
        })
      })
    }
  },

  toggleVocabulary: (name) => {
    return {
      type: A.TOGGLE_VOCABULARY,
      payload: Immutable.Map({
        name: name
      })
    }
  }

}
