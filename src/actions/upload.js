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
import Firebase from 'firebase'
import request from 'superagent'
import Immutable from 'immutable'
import { push } from 'react-router-redux'

export default {

  handleDroppedFiles: (files, x, y, authData, pageId) => {
    return (dispatch, getState) => {
      const file = files[0]
      const ref = new Firebase(config.FIREBASE_URL).child('uploads')
      const uploadRef = ref.push({
        pageId: pageId,
        userId: authData.get('uid'),
        status: 'dropped',
        x: x,
        y: y
      })
      const uploadId = uploadRef.key()
      request.get('/get-upload-values').end((err, res) => {
        uploadRef.update({
          assemblyId: res.body.assemblyId,
          id: uploadId,
          status: 'uploading',
          uri: res.body.uri
        })
        let formData = new FormData()
        formData.append('file', file)
        formData.append('params', res.body.params)
        formData.append('signature', res.body.signature)
        formData.append('uploadId', uploadId)
        request.post(res.body.uri).send(formData).end((err, res) => {
          uploadRef.update({
            status: 'uploaded'
          })
        })
      })
    }
  },

  listenToUploads: (userId) => {
    return (dispatch, getState) => {
      const ref = new Firebase(config.FIREBASE_URL)
      const uploadsRef = ref.child('uploads').orderByChild('userId').equalTo(userId)
      uploadsRef.on('value', (snapshot) => {
        let uploads = Immutable.Map()
        if (snapshot.val() !== null) {
          uploads = Immutable.fromJS(snapshot.val())
        }
        dispatch({
          type: A.RECEIVED_UPLOADS, 
          payload: Immutable.Map({
            uploads: uploads
          })
        })
      })
    }
  },

  stopListeningToUploads: () => {
    return (dispatch, getState) => {
      let ref = new Firebase(config.FIREBASE_URL).child('uploads')
      ref.off('value')
      dispatch({
        type: A.STOPPED_LISTENING_TO_UPLOADS
      })
    }
  }
}

