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

import C from '../constants'
import Firebase from 'firebase'
import Immutable from 'immutable'

export default {

  attemptLogin: (email, password) => {
    return (dispatch, getState) => {
      const ref = new Firebase(config.FIREBASE_URL)
      ref.authWithPassword({
        email: email,
        password: password
      }, (err, authData) => {
        if (err) {
          dispatch({
            type: C.LOGIN_FAILED
          })
        }
      })
    }
  },

  closeLogin: () => {
    return {
      type: C.CLOSE_LOGIN
    }
  },

  hideMetadata: () => {
    return {
      type: C.HIDE_METADATA
    }
  },
  
  listenToAuth: () => {
    return (dispatch, getState) => {
      const ref = new Firebase(config.FIREBASE_URL)
      ref.onAuth((authData) => {
        if (authData === null) {
          dispatch({
            type: C.RECEIVED_AUTH_DATA,
            payload: Immutable.Map({
              authData: Immutable.Map()
            })
          })
        }
        else {
          const userRef = ref.child('users').child(authData.uid)
          userRef.once('value', (userSnapshot) => {
            const user = userSnapshot.val()
            authData.username = user.username
            dispatch({
              type: C.RECEIVED_AUTH_DATA,
              payload: Immutable.Map({
                authData: Immutable.fromJS(authData)
              })
            })
          })
        }
      })
    }
  },

  logout: () => {
    return (dispatch, getState) => {
      const ref = new Firebase(config.FIREBASE_URL)
      ref.unauth()
    }
  },

  openLogin: () => {
    return {
      type: C.OPEN_LOGIN
    }
  },

  setBaseUrl: (href) => {
    return {
      type: C.SET_BASE_URL,
      payload: Immutable.Map({
        href: href
      })
    }
  },

  showMetadata: () => {
    return {
      type: C.SHOW_METADATA
    }
  }
}
