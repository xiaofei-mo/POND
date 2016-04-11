import C from 'src/constants'
import request from 'superagent'
import Immutable from 'immutable'

export default {
  
  cancelUpload: (uploadId) => {
    return (dispatch, getState) => {
      const ref = new Firebase(C.FIREBASE).child('uploads').child(uploadId)
      ref.remove()
    }
  },

  handleDroppedFiles: (files) => {
    return (dispatch, getState) => {
      const file = files[0]
      const ref = new Firebase(C.FIREBASE).child('uploads')
      const uploadRef = ref.push({
        originalName: file.name,
        originalType: file.type,
        status: 'dropped',
        uploaded: Firebase.ServerValue.TIMESTAMP
      })
      const uploadId = uploadRef.key()
      request.get('/upload-values').end((err, res) => {
        // One of these values is the assemblyId. Add it to our upload item in 
        // Firebase.
        const assemblyId = res.body.assemblyId
        uploadRef.update({
          assemblyId: assemblyId,
          percent: 0,
          status: 'uploading'
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

  //listenToUploads: (userId) => {
  listenToUploads: () => {
    return (dispatch, getState) => {
      let ref = new Firebase(C.FIREBASE).child('uploads')
      // ref = ref.orderByChild('user').equalTo(userId)
      ref.on('value', (snapshot) => {
        let uploads = Immutable.Map()
        if (snapshot.val() !== null) {
          uploads = Immutable.fromJS(snapshot.val())
        }
        dispatch({
          type: C.RECEIVED_UPLOADS, 
          uploads: uploads
        })
      })
    }
  },

  saveUpload: (uploadId) => {
    return (dispatch, getState) => {
      const ref = new Firebase(C.FIREBASE)
      const itemsRef = ref.child('items')
      const uploadRef = ref.child('uploads').child(uploadId)
      dispatch({
        type: C.UPLOAD_WAS_SAVED, 
        uploadId: uploadId
      })
    }
  }
}

function _pollTransloadit(uploadRef, uri) {
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
      console.log('ASSEMBLY_COMPLETED, res.body = ', res.body)
      uploadRef.child('status').set('done')
    }
    else {
      if (res.body.ok === 'ASSEMBLY_UPLOADING') {
        console.log('ASSEMBLY_UPLOADING, res.body = ', res.body)
        uploadRef.child('status').set('uploading')
      }
      else if (res.body.ok === 'ASSEMBLY_EXECUTING') {
        console.log('ASSEMBLY_EXECUTING, res.body = ', res.body)
        uploadRef.child('status').set('processing')
      }
      setTimeout(() => {
        _pollTransloadit(uploadRef, uri)
      }, 500)
    }
  })
}
