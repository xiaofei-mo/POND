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
  
  cancelUpload: (uploadId) => {
    return (dispatch, getState) => {
      const ref = new Firebase(config.FIREBASE_URL).child('uploads').child(uploadId)
      ref.remove()
    }
  },

  handleDroppedFiles: (files, authData) => {
    return (dispatch, getState) => {
      const file = files[0]
      console.log('file = ', file)
      const ref = new Firebase(config.FIREBASE_URL).child('uploads')
      const uploadRef = ref.push({
        originalName: file.name,
        originalType: file.type,
        size: file.size,
        status: 'Dropped',
        uploaded: Firebase.ServerValue.TIMESTAMP,
        userId: authData.get('uid')
      })
      const uploadId = uploadRef.key()
      request.get('/upload-values').end((err, res) => {
        // One of these values is the assemblyId. Add it to our upload item in 
        // Firebase.
        const assemblyId = res.body.assemblyId
        uploadRef.update({
          assemblyId: assemblyId,
          percent: 0,
          status: 'Uploading'
        })
        let formData = new FormData()
        formData.append('file', file)
        formData.append('params', res.body.params)
        formData.append('signature', res.body.signature)
        formData.append('uploadId', uploadId)
        request.post(res.body.uri)
        .send(formData)
        .on('progress', (event) => {
          if (event.percent !== undefined) {
            uploadRef.child('percent').set(event.percent)
          }
        }).end()
        setTimeout(() => {
          _pollTransloadit(uploadRef, res.body.uri)
        }, 1000)
      })
    }
  },

  listenToUploads: (userId) => {
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
          const initialLocation = _getInitialLocation(getState())
          const itemRef = itemsRef.push({
            height: initialDimensions.height,
            isFeatured: false,
            upload: upload.upload,
            results: upload.results,
            timing: timing,
            type: 'video',
            userId: upload.userId,
            width: initialDimensions.width,
            x: initialLocation.x,
            y: initialLocation.y
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

const _getInitialLocation = (state) => {
  const items = state.getIn(['page', 'items'])
  const rightmostItem = items.maxBy(item => (item.get('width') + item.get('x')))
  return {
    x: rightmostItem.get('width') + rightmostItem.get('x') + 100,
    y: 0
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
        },
        status: 'Done'
      })
    }
    else {
      if (res.body.ok === 'ASSEMBLY_UPLOADING') {
        uploadRef.child('status').set('uploading')
      }
      else if (res.body.ok === 'ASSEMBLY_EXECUTING') {
        uploadRef.update({
          upload: res.body.uploads[0],
          status: 'Processing'
        })
      }
      setTimeout(() => {
        _pollTransloadit(uploadRef, uri)
      }, 500)
    }
  })
}
