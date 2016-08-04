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
import url from 'url'

export default {

  attemptLogin: (email, password) => {
    return (dispatch, getState) => {
      const auth = firebase.auth()
      auth.signInWithEmailAndPassword(email, password).catch((err) => {
        dispatch({
          type: A.LOGIN_FAILED
        })
      })
    }
  },

  closeLogin: () => {
    return {
      type: A.CLOSE_LOGIN
    }
  },

  hideMetadata: () => {
    return {
      type: A.HIDE_METADATA
    }
  },
  
  listenToAuth: () => {
    return (dispatch, getState) => {
      const auth = firebase.auth()
      auth.onAuthStateChanged((authData) => {
        if (authData === null) {
          dispatch({
            type: A.RECEIVED_USER,
            payload: Immutable.Map({
              user: Immutable.Map()
            })
          })
        }
        else {
          const ref = firebase.database().ref()
          const userRef = ref.child('users').child(authData.uid)
          userRef.once('value', (userSnapshot) => {
            const user = userSnapshot.val()
            dispatch({
              type: A.RECEIVED_USER,
              payload: Immutable.Map({
                user: Immutable.Map({
                  email: authData.email,
                  uid: authData.uid,
                  username: user.username
                })
              })
            })
          })
        }
      })
    }
  },

  logout: () => {
    return (dispatch, getState) => {
      const auth = firebase.auth()
      auth.signOut()
    }
  },

  openLogin: () => {
    return {
      type: A.OPEN_LOGIN
    }
  },

  setBaseUrl: (href) => {
    const parsedUrl = url.parse(href)
    const baseUrl = parsedUrl.protocol + '//' + parsedUrl.host + '/'
    return {
      type: A.RECEIVED_BASE_URL,
      payload: Immutable.Map({
        baseUrl: baseUrl
      })
    }
  },

  showMetadata: () => {
    return {
      type: A.SHOW_METADATA
    }
  }
}
