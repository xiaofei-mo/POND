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

const initialState = Immutable.Map({
  isShowingMetadata: false,
  loginFailed: false,
  user: Immutable.Map(),
  userIsLoaded: false,
  shouldResetPassword: false,
  sendEmailFailed: false,
  attemptedEmail: null,
  emailSent: false,
  shouldSignUp: false,
  signedUp: false,
  signUpFailed: false,
  token: null
})

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case A.HIDE_METADATA:
    case A.METADATA_WAS_SET:
    case A.TOGGLE_LINKING_MODE:
      return state.set('isShowingMetadata', false)

    case A.RESET_LOGIN_STATE:
      return state.withMutations((map) => {
        map.set('loginFailed', false)
          .set('shouldResetPassword', false)
          .set('sendEmailFailed', false)
          .set('attemptedEmail', null)
          .set('emailSent', false)
          .set('shouldSignUp', false)
          .set('signedUp', false)
          .set('signUpFailed', false)
          .set('idToken', null)
      })

    case A.LOGIN_ATTEMPTED:
      return state.set('loginFailed', false)

    case A.LOGIN_FAILED:
      return state.withMutations((map) => {
        map.set('loginFailed', true)
          .set('attemptedEmail', null)
      })

    case A.LOGIN_WITH_WRONG_PWD:
      if (state.get('attemptedEmail') === action.payload) {
        return state.withMutations((map) => {
          map.set('shouldResetPassword', true)
            .set('attemptedEmail', null)
        })
      }
      return state.withMutations((map) => {
        map.set('attemptedEmail', action.payload)
          .set('loginFailed', true)
      })
    case A.REQUEST_RESET_PWD:
      return state.withMutations((map) => {
        map.set('sendEmailFailed', false)
          .set('emailSent', false)
      })
    case A.RESET_EMAIL_SENT:
      return state.withMutations((map) => {
        map.set('shouldResetPassword', false)
          .set('sendEmailFailed', false)
          .set('emailSent', true)
      })
    case A.INVALID_EMAIL_ADDR:
      return state.set('sendEmailFailed', true)

    case A.MEET_NEW_USER:
      return state.withMutations((map) => {
        map.set('shouldSignUp', true)
          .set('signedUp', false)
      })
    case A.SIGNED_UP:
      return state.withMutations((map) => {
        map.set('shouldSignUp', false)
          .set('signedUp', true)
      })
    case A.REQUEST_SIGN_UP:
      return state.set('signUpFailed', false)
    case A.INVALID_USERNAME:
      return state.set('signUpFailed', true)

    case A.PAGE_CLICKED:
      if (state.get('isShowingMetadata')) {
        return state.set('isShowingMetadata', false)
      }
      return state

    case A.RECEIVED_USER:
      return state.merge({
        loginFailed: false,
        user: action.payload.get('user'),
        userIsLoaded: true
      })

    case A.RECEIVED_TOKEN:
      return state.merge({
        token: action.payload
      })

    case A.SHOW_METADATA:
      return state.set('isShowingMetadata', true)

    default:
      return state
  }
}
