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

import calculateSignature from './src/utils/calculateSignature'
import express from 'express'
import getExpiresDate from './src/utils/getExpiresDate'
import request from 'request'
import tsml from 'tsml'
import uuid from 'node-uuid'

const app = express()

app.use(express.static(__dirname + '/public'))

app.get('/upload-values', (req, res, next) => {
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
  const uri = '//api2.transloadit.com/assemblies/' + assemblyId
  res.json({
    params: params,
    signature: signature,
    assemblyId: assemblyId,
    uri: uri
  })
})

const config = {
  FIREBASE_URL: process.env.FIREBASE_URL,
  NODE_ENV: process.env.NODE_ENV
}

app.get('*', (req, res, next) => {
  res.send(tsml`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" type="text/css" href="static/style.css" />
        <script>
          var config=${JSON.stringify(config)}
        </script>
        <title>mysteriousobjectsatnoon</title>
      </head>
      <body>
        <div id="mount"></div>
        <img alt="" class="hidden" src="static/haumea_uploading.gif" />
      </body>
      <script src="static/bundle.js"></script>
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
