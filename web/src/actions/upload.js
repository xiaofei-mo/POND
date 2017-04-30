/*
 * Copyright (C) 2017 Mark P. Lindsay
 * 
 * This file is part of mysteriousobjectsatnoon.
 *
 * mysteriousobjectsatnoon is free software: you can redistribute it and/or 
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * mysteriousobjectsatnoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with mysteriousobjectsatnoon.  If not, see 
 * <http://www.gnu.org/licenses/>.
 */

import { A } from '../constants'
import firebase from '../utils/firebase'
import request from 'superagent'
import Immutable from 'immutable'
import { push } from 'react-router-redux'

export default {

  cancelUpload: (assemblyId) => {
    const ref = firebase.database().ref()
    const uploadsRef = ref.child('uploads')
    const uploadRef = uploadsRef.child(assemblyId)
    uploadRef.remove()
  },

  handleDroppedFiles: (files, x, y, user, pageId) => {
    return (dispatch, getState) => {
      const file = files[0]
      const ref = firebase.database().ref()
      const uploadsRef = ref.child('uploads')
      request.get('/get-upload-values').end((err, res) => {
        const assemblyId = res.body.assembly_id
        const params = res.body.params
        const signature = res.body.signature
        const uri = res.body.uri
        const uploadRef = uploadsRef.child(assemblyId)
        uploadRef.set({
          assemblyId: assemblyId,
          name: file.name,
          pageId: pageId,
          size: file.size,
          status: 'dropped',
          uri: uri,
          userId: user.get('uid'),
          x: x,
          y: y
        })
        let formData = new FormData()
        formData.append('file', file)
        formData.append('params', params)
        formData.append('signature', signature)
        request.post(res.body.uri).send(formData).end((err, res) => {
          const body = JSON.parse(res.text)
          uploadRef.update({
            status: 'uploaded'
          })
        })
      })
    }
  },

  listenToUploads: (userId) => {
    return (dispatch, getState) => {
      const ref = firebase.database().ref()
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
      const ref = firebase.database().ref()
      const uploadsRef = ref.child('uploads')
      uploadsRef.off('value')
      dispatch({
        type: A.STOPPED_LISTENING_TO_UPLOADS
      })
    }
  }
}

