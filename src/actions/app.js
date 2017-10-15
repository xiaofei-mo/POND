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
import request from 'superagent'
import url from 'url'
import { push } from 'react-router-redux'

export default {
  resetLogin: () => (dispatch, getState) => {
    dispatch({
      type: A.RESET_LOGIN_STATE
    })
  },
  attemptLogin: (email, password) => {
    return (dispatch, getState) => {
      dispatch({
        type: A.LOGIN_ATTEMPTED
      })
      const auth = firebase.auth()
      auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
          // Bring user to personal page
          dispatch(push(`/${user.displayName}`))
        })
        .catch((err) => {
          switch (err.code) {
            case 'auth/wrong-password':
              dispatch({
                type: A.LOGIN_WITH_WRONG_PWD,
                payload: email
              })
              break

            case 'auth/user-not-found':
              dispatch({
                type: A.MEET_NEW_USER
              })
              break

            default:
              dispatch({
                type: A.LOGIN_FAILED
              })
          }
        })
    }
  },

  requestResetPassword: email => (dispatch, getState) => {
    dispatch({
      type: A.REQUEST_RESET_PWD
    })
    const auth = firebase.auth()
    auth.sendPasswordResetEmail(email)
      .then(() => {
        dispatch({
          type: A.RESET_EMAIL_SENT
        })
      }, (err) => {
        dispatch({
          type: A.INVALID_EMAIL_ADDR
        })
      })
  },

  signUp: (email, password, username) => (dispatch, getState) => {
    dispatch({
      type: A.REQUEST_SIGN_UP
    })
    request.post('/sign-up')
      .send({ email, password, username })
      .end((err, res) => {
        if (err) {
          dispatch({
            type: A.INVALID_USERNAME
          })
          return
        }
        dispatch({
          type: A.SIGNED_UP
        })
      })
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
  },

  navigateToUserPage: (username) => {
    return push(`/${username}`)
  }
}
