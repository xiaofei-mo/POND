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
import firebase from '../utils/firebase'
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
      const vocabulariesRef = firebase.database().ref().child('vocabularies')
      vocabulariesRef.on('value', snapshot => {
        const vocabularies = Immutable.fromJS(snapshot.val())
        dispatch({
          type: A.RECEIVED_VOCABULARIES,
          payload: Immutable.Map({
            vocabularies: Immutable.List([
              Immutable.Map({ 
                isOpen: false,
                name: 'Things', 
                terms: vocabularies.get('things', Immutable.List())
              }),
              Immutable.Map({ 
                isOpen: false,
                name: 'Textures', 
                terms: vocabularies.get('textures', Immutable.List())
              }),
              Immutable.Map({ 
                isOpen: false,
                name: 'Forms', 
                terms: vocabularies.get('forms', Immutable.List())
              }),
              Immutable.Map({ 
                isOpen: false,
                name: 'Movements', 
                terms: vocabularies.get('movements', Immutable.List())
              }),
              Immutable.Map({ 
                isOpen: false,
                name: 'Emotions', 
                terms: vocabularies.get('emotions', Immutable.List())
              }),
              Immutable.Map({ 
                isOpen: false,
                name: 'Concepts', 
                terms: vocabularies.get('concepts', Immutable.List())
              }),
              Immutable.Map({ 
                isOpen: false,
                name: 'Source', 
                terms: vocabularies.get('source', Immutable.List())
              }),
              Immutable.Map({ 
                isOpen: false,
                name: 'Other', 
                terms: vocabularies.get('other', Immutable.List())
              })
            ])
          })
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
