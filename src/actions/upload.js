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
import request from 'superagent'
import Immutable from 'immutable'
import { push } from 'react-router-redux'
import throttle from 'lodash.throttle'

export default {

  handleDroppedFiles: (files, x, y, user, pageId) => {
    return (dispatch, getState) => {
      const file = files[0]
      const type = file.type.match(/(\w+)\/.+/)[1]
      const objUrl = window.URL.createObjectURL(file);
      const ref = firebase.database().ref()
      const uploadsRef = ref.child('uploads')
      const uploadRef = uploadsRef.push({
        pageId: pageId,
        userId: user.get('uid'),
        status: 'dropped',
        x: x,
        y: y,
        type,
        objUrl
      })
      request.get(`/get-upload-values/${type}`).end((err, res) => {
        uploadRef.update({
          assemblyId: res.body.assemblyId,
          id: uploadRef.key,
          status: 'uploading',
          uri: res.body.uri
        })
        let formData = new FormData()
        formData.append('file', file)
        formData.append('params', res.body.params)
        formData.append('signature', res.body.signature)
        formData.append('uploadId', uploadRef.key)

        const uploadReq = request.post(res.body.uri).send(formData)
        .on('progress', throttle((ev) => {
          dispatch({
            type: A.PROGRESS_UPDATED,
            payload: Immutable.Map([[uploadRef.key, Immutable.Map({ progress: ev.percent })]]),
          })
        }, 1e3, { leading: true }))
        .end((err, res) => {
          window.URL.revokeObjectURL(objUrl)
          if (err) {
            uploadRef.update({ status: 'aborted' })
            return
          }
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
      const uploadsQuery = ref.child('uploads').orderByChild('userId').equalTo(userId)
      uploadsQuery.on('value', (snapshot) => {
        const snapshotVal = snapshot.val()
        let uploads = Immutable.Map()
        if (snapshot.val() !== null) {
          // Object.keys(snapshotVal).forEach((key) => {
          //   if (snapshotVal[key].status !== 'uploading') delete snapshotVal[key]
          // })
          uploads = Immutable.fromJS(snapshotVal)
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
  },

  cancelUpload: (uploadId) => {
    return (dispatch, getState) => {
      const ref = firebase.database().ref()
      const uploadsRef = ref.child('uploads')
      const uploadRef = uploadsRef.child(uploadId)
      uploadRef.update({
        status: 'aborted'
      })
    }
  }
}

