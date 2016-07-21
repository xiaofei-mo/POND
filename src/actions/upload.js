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
import getStringFromSeconds from '../utils/getStringFromSeconds'
import { push } from 'react-router-redux'

export default {

  handleDroppedFiles: (files, x, y, authData, pageId) => {
    return (dispatch, getState) => {
      const file = files[0]
      const ref = new Firebase(config.FIREBASE_URL).child('uploads')
      const uploadRef = ref.push({
        pageId: pageId,
        x: x,
        y: y,
        userId: authData.get('uid')
      })
      const uploadId = uploadRef.key()
      request.get('/upload-values').end((err, res) => {
        // One of these values is the assemblyId. Add it to our upload item in 
        // Firebase.
        uploadRef.update({
          assemblyId: res.body.assemblyId,
          id: uploadId
        })
        // let formData = new FormData()
        // formData.append('file', file)
        // formData.append('params', res.body.params)
        // formData.append('signature', res.body.signature)
        // formData.append('uploadId', uploadId)
        // request.post(res.body.uri).send(formData).end()
        // setTimeout(() => {
        //   _pollTransloadit(uploadRef, res.body.uri)
        // }, 1000)
      })
    }
  },

  listenToUploads: (userId) => {
    console.log('listenToUploads, userId = ', userId)
    return (dispatch, getState) => {
      let ref = new Firebase(config.FIREBASE_URL).child('uploads')
      ref = ref.orderByChild('userId').equalTo(userId)
      ref.on('value', (snapshot) => {
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

  saveUpload: (uploadId) => {
    return (dispatch, getState) => {
      const ref = new Firebase(config.FIREBASE_URL)
      const itemsRef = ref.child('items')
      const uploadRef = ref.child('uploads').child(uploadId)
      uploadRef.once('value', (uploadSnapshot) => {
        const upload = uploadSnapshot.val()
        _determineTiming(upload.results.encode, ref).then((timingRef) => {
          const timing = timingRef.snapshot.val()
          const initialDimensions = _getInitialDimensions(upload.results.encode)
          const itemRef = itemsRef.push({
            height: initialDimensions.height,
            isFeatured: false,
            pageId: upload.pageId,
            results: upload.results,
            timing: timing,
            type: 'video',
            upload: upload.upload,
            userId: upload.userId,
            width: initialDimensions.width,
            x: upload.x,
            y: upload.y
          })
          itemRef.once('value', (itemSnapshot) => {
            itemRef.child('id').set(itemSnapshot.key())
            const timingString = getStringFromSeconds(timing)
            dispatch(push('/' + timingString))
          })
          uploadRef.remove()
        })
      })
    }
  },

  stopListeningToUploads: () => {
    return (dispatch, getState) => {
      console.log('stopListeningToUploads')
      let ref = new Firebase(config.FIREBASE_URL).child('uploads')
      ref.off('value')      
    }
  }
}

const _determineTiming = (encode, ref) => {
  return ref.child('lastTiming').transaction((lastTiming) => {
    if (lastTiming === null) {
      return 0
    }
    return Math.ceil(lastTiming) + Math.ceil(encode.meta.duration) + 1
  })
}

const _getInitialDimensions = (encode) => {
  let height = Math.floor(encode.meta.height)
  let width = Math.floor(encode.meta.height * encode.meta.aspect_ratio)
  if (width > 853) {
    height = Math.floor(height / 2)
    width = Math.floor(width / 2)
  }
  return {
    height: height,
    width: width
  }
}

const _pollTransloadit = (uploadRef, uri) => {
  request.get(uri).end((err, res) => {
    if (err || res.body.error !== undefined) {
      if (res.status === 404) {
        setTimeout(() => {
          _pollTransloadit(uploadRef, uri)
        }, 500)
      }
      return
    }
    if (res.body.ok === 'ASSEMBLY_COMPLETED') {
      uploadRef.update({
        results: {
          original: res.body.results[':original'][0],
          encode: res.body.results.encode[0]
        }
      })
      console.log('this is where we save')
    }
    else {
      if (res.body.ok === 'ASSEMBLY_EXECUTING') {
        uploadRef.update({
          upload: res.body.uploads[0]
        })
      }
      setTimeout(() => {
        _pollTransloadit(uploadRef, uri)
      }, 500)
    }
  })
}
