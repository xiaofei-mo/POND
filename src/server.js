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

import calculateSignature from './utils/calculateSignature'
import express from 'express'
import firebase from 'firebase'
import admin from 'firebase-admin'
import getExpiresDate from './utils/getExpiresDate'
import Immutable from 'immutable'
import request from 'superagent'
import tsml from 'tsml'
import uuid from 'node-uuid'
import bodyParser from 'body-parser'

const app = express()
const jsonParser = bodyParser.json()

const config = {
  CLOUDFRONT_HOSTNAME: process.env.CLOUDFRONT_HOSTNAME,
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  S3_HOSTNAME: process.env.S3_HOSTNAME
}

const templateIds = {
  video: process.env.TRANSLOADIT_VIDEO_TEMPLATE_ID,
  audio: process.env.TRANSLOADIT_AUDIO_TEMPLATE_ID
}

console.log(templateIds)

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

app.use(express.static(__dirname + '/../public'))

app.get('/get-upload-values/:type', (req, res, next) => {
  console.log(req.params.type)
  let templateId = templateIds[req.params.type]

  const paramsObj = {
    auth: {
      key: process.env.TRANSLOADIT_AUTH_KEY,
      expires: getExpiresDate()
    },
    template_id: templateId || process.env.TRANSLOADIT_VIDEO_TEMPLATE_ID
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

app.post('/sign-up', jsonParser, (req, res, next) => {
  const { email, username, password } = req.body;
  if (!(email && username && password)) res.sendStatus(400);
  const auth = admin.auth();
  const usersRef = ref.child('users');
  const userQuery = usersRef.orderByChild('username').equalTo(username);

  userQuery.once('value')
    .then((userSnapshot) => {
      if (userSnapshot.exists()) return Promise.reject(new Error('USERNAME_EXISTS'));
      return auth.createUser({
        email,
        password,
        displayName: username,
      });
    })
    .then((userRecord) => {
      return usersRef.child(userRecord.uid).set({
        username,
      });
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.status(400);
      res.json({
        error,
        code: 400,
        message: error.message || '',
      });
    });
});

app.get('*', (req, res, next) => {
  // debugger;
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

    switch (upload.type) {
      case 'audio':
        _determineTiming(upload.results.encode).then((timingRef) => {
          const timing = timingRef.snapshot.val()
          const itemRef = itemsRef.push({
            height: 100,
            pageId: upload.pageId,
            results: upload.results,
            timing: timing,
            type: 'audio',
            uploadId: upload.id,
            userId: upload.userId,
            width: 320,
            x: upload.x,
            y: upload.y
          })
          itemRef.once('value', (itemSnapshot) => {
            itemRef.child('id').set(itemSnapshot.key)
          })
          uploadRef.remove()
        })
        break

      case 'video':
      default:
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
            itemRef.child('id').set(itemSnapshot.key)
          })
          uploadRef.remove()
        })
        break
    }
  })
}

const _abortUpload = (uploadId) => {
  const uploadRef = ref.child('uploads').child(uploadId)
  uploadRef.remove()
}

ref.child('uploads').on('child_changed', snapshot => {
  const upload = snapshot.val()
  if (upload === null) {
    return
  }
  switch (upload.status) {
    case 'aborted':
      _abortUpload(upload.id)
      break
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
            switch (body.uploads[0].type) {
              case 'audio':
                uploadRef.update({
                  results: {
                    encode: body.results.encode[0],
                    original: body.results[':original'][0],
                    waveform: body.results.waveform[0]
                  },
                  status: 'done'
                })
                break
              case 'video':
              default:
                uploadRef.update({
                  results: {
                    encode: body.results.encode[0],
                    original: body.results[':original'][0],
                    posterImage: body.results.poster_image[0]
                  },
                  status: 'done'
                })
                break
            }
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
  let vocabularies = Immutable.Map()
  let vocabulariesLookup = Immutable.Map()
  items.forEach(item => {
    if (item.has('metadata')) {
      item.get('metadata').forEach((terms, slug) => {
        if (slug !== 'title' && slug !== 'year') {
          let termsSet = Immutable.OrderedSet(terms)
          if (vocabularies.has(slug)) {
            termsSet = vocabularies.get(slug).union(termsSet)
          }
          termsSet = termsSet.sort()
          vocabularies = vocabularies.set(slug, termsSet)

          // Lookup "table" for filtering.
          let vocabularyLookup = vocabulariesLookup.get(slug, Immutable.Map())
          terms.forEach(term => {
            let itemIds = vocabularyLookup.get(term, Immutable.Set())
            itemIds = itemIds.add(item.get('id'))
            vocabularyLookup = vocabularyLookup.set(term, itemIds)
          })
          vocabulariesLookup = vocabulariesLookup.set(slug, vocabularyLookup)
        }
      })
    }
  })
  ref.child('vocabularies').set(vocabularies.toJS())
  ref.child('vocabulariesLookup').set(vocabulariesLookup.toJS())
})


