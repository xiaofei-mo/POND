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

import calculateSignature from './utils/calculateSignature'
import express from 'express'
import firebase from 'firebase'
import admin from 'firebase-admin'
import getExpiresDate from './utils/getExpiresDate'
import Immutable from 'immutable'
import request from 'superagent'
import tsml from 'tsml'
import uuid from 'node-uuid'

const app = express()

app.use(express.static(__dirname + '/../public'))

app.get('/get-upload-values', (req, res, next) => {
  const paramsObj = {
    auth: {
      key: process.env.TRANSLOADIT_AUTH_KEY,
      expires: getExpiresDate()
    },
    template_id: process.env.TRANSLOADIT_TEMPLATE_ID
  }
  const params = JSON.stringify(paramsObj)
  const signature = calculateSignature(params)
  const assemblyId = uuid.v4().replace(/\-/g, '')
  const uri = 'https://api2.transloadit.com/assemblies/' + assemblyId
  res.json({
    params: params,
    signature: signature,
    assemblyId: assemblyId,
    uri: uri
  })
})

const config = {
  CLOUDFRONT_HOSTNAME: process.env.CLOUDFRONT_HOSTNAME,
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  S3_HOSTNAME: process.env.S3_HOSTNAME
}

app.get('*', (req, res, next) => {
  res.send(tsml`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" type="text/css" href="/static/style.css" />
        <script>
          var config=${JSON.stringify(config)}
        </script>
        <title>mysteriousobjectsatnoon</title>
      </head>
      <body>
        <div id="mount"></div>
        <img alt="" class="hidden" src="/static/haumea_uploading.gif" />
      </body>
      <script src="/static/bundle.js"></script>
    </html>
  `)
})

app.listen(5000, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('listening on 5000')
})

const credential = admin.credential.cert({
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  projectId: process.env.FIREBASE_PROJECT_ID
})
admin.initializeApp({
  credential: credential,
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

const ref = admin.database().ref()

const _determineTiming = (encode) => {
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

const _createItem = (uploadId) => {
  const itemsRef = ref.child('items')
  const uploadRef = ref.child('uploads').child(uploadId)  
  uploadRef.once('value', (uploadSnapshot) => {
    const upload = uploadSnapshot.val()
    _determineTiming(upload.results.encode).then((timingRef) => {
      const timing = timingRef.snapshot.val()
      const initialDimensions = _getInitialDimensions(upload.results.encode)
      const itemRef = itemsRef.push({
        height: initialDimensions.height,
        pageId: upload.pageId,
        results: upload.results,
        timing: timing,
        type: 'video',
        uploadId: upload.id,
        userId: upload.userId,
        width: initialDimensions.width,
        x: upload.x,
        y: upload.y
      })
      itemRef.once('value', (itemSnapshot) => {
        itemRef.child('id').set(itemSnapshot.key())
      })
      uploadRef.remove()
    })
  })
}

ref.child('uploads').on('child_changed', snapshot => {
  const upload = snapshot.val()
  if (upload === null) {
    return
  }
  switch (upload.status) {
    case 'done':
      _createItem(upload.id)
      break
    case 'uploaded':
      _pollTransloadit(upload.id, upload.uri)
      break
  }
})

const _pollTransloadit = (uploadId, uri) => {
  request.get(uri).end((err, res) => {
    const uploadRef = ref.child('uploads').child(uploadId)
    const body = JSON.parse(res.text)
    if (err || body.error !== undefined) {
      if (body.error === 'ASSEMBLY_NOT_FOUND') {
        setTimeout(() => {
          _pollTransloadit(uploadId, uri)
        }, 500)
      }
      return
    }
    switch (body.ok) {
      case 'ASSEMBLY_COMPLETED':
        uploadRef.once('value', snapshot => {
          const upload = snapshot.val()
          if (upload !== null) {
            uploadRef.update({
              results: {
                encode: body.results.encode[0],
                original: body.results[':original'][0]
              },
              status: 'done'
            })
          }
        })
        break
      case 'ASSEMBLY_EXECUTING':
      case 'ASSEMBLY_UPLOADING':
        uploadRef.once('value', snapshot => {
          const upload = snapshot.val()
          if (upload !== null) {
            uploadRef.update({
              status: 'processing'
            })
            setTimeout(() => {
              _pollTransloadit(uploadId, uri)
            }, 500)
          }
        })
        break
    }
  })
}

ref.child('items').on('value', (snapshot) => {
  const items = Immutable.fromJS(snapshot.val())
  const metadata = items.get('metadata')
  let vocabularies = Immutable.Map()
  items.forEach(item => {
    if (item.has('metadata')) {
      item.get('metadata').forEach((t, vocabulary) => {
        if (vocabulary !== 'title' && vocabulary !== 'year') {
          let terms = Immutable.OrderedSet(t)
          if (vocabularies.has(vocabulary)) {
            terms = vocabularies.get(vocabulary).union(terms)
          }
          terms = terms.sort()
          vocabularies = vocabularies.set(vocabulary, terms)
        }
      })
    }
  })
  ref.child('vocabularies').set(vocabularies.toJS())
})


