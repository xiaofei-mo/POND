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
import queryString from 'query-string'

export default {

  clearAppliedFilters: () => {
    return (dispatch, getState) => {
      dispatch(push('/'))
    }
  },

  closeAllVocabularies: () => {
    return {
      type: A.CLOSE_ALL_VOCABULARIES
    }
  },

  listenToFilteredItems: (appliedFilters) => {
    return (dispatch, getState) => {
      const ref = firebase.database().ref()
      const itemsRef = ref.child('items')
      const vlRef = ref.child('vocabulariesLookup')
      let itemPromises = []
      let vlPromises = []
      let filteredItems = Immutable.Map()
      appliedFilters.forEach((terms, slug) => {
        terms.forEach(term => {
          vlPromises.push(vlRef.child(slug + '/' + term).once('value'))
        })
      })
      Promise.all(vlPromises).then(snapshots => {
        snapshots.forEach(snapshot => {
          snapshot.val().forEach(itemId => {
            itemPromises.push(itemsRef.child(itemId).once('value'))
          })
        })
        Promise.all(itemPromises).then(itemSnapshots => {
          itemSnapshots.forEach(itemSnapshot => {
            const item = Immutable.fromJS(itemSnapshot.val())
            filteredItems = filteredItems.set(item.get('id'), item)
          })
          dispatch({
            type: A.RECEIVED_FILTERED_ITEMS, 
            payload: Immutable.Map({
              filteredItems: filteredItems
            })
          })
        })
      })
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
            vocabularies: vocabularies
          })
        })
      })
    }
  },

  toggleAppliedFilter: (slug, term) => {
    return (dispatch, getState) => {
      let appliedFilters = getState().getIn(['filter', 'appliedFilters'])
      if (appliedFilters.has(slug)) {
        let appliedTerms = appliedFilters.get(slug)
        if (appliedTerms.contains(term)) {
          appliedTerms = appliedTerms.delete(term)
        }
        else {
          appliedTerms = appliedTerms.add(term)
        }
        if (!appliedTerms.isEmpty()) {
          appliedFilters = appliedFilters.set(slug, appliedTerms)
        }
        else {
          appliedFilters = appliedFilters.delete(slug)
        }
      }
      else {
        appliedFilters = appliedFilters.set(slug, Immutable.Set([term]))
      }
      if (appliedFilters.isEmpty()) {
        dispatch(push('/'))
      }
      else {
        let pathname = '/filter/'
        pathname += queryString.stringify(appliedFilters.toJS())
        dispatch(push(pathname))
      }
    }
  },

  // Switch to slug
  toggleVocabulary: name => {
    return {
      type: A.TOGGLE_VOCABULARY,
      payload: Immutable.Map({
        name: name
      })
    }
  }

}
