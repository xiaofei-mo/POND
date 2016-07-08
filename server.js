/*
 * Copyright (C) 2016 Mark P. Lindsay
 * 
 * This file is part of video-site.
 *
 * video-site is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * video-site is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with video-site.  If not, see <http://www.gnu.org/licenses/>.
 */

import express from 'express'
import C from './src/constants'
import fs from 'fs'
import request from 'request'
import uuid from 'node-uuid'
import crypto from 'crypto'

const app = express()

app.use(express.static(__dirname + '/public'))

app.get('/upload-values', (req, res, next) => {
  const paramsObj = {
    auth: {
      key: process.env.TRANSLOADIT_AUTH_KEY,
      expires: _getExpiresDate()
    },
    template_id: process.env.TRANSLOADIT_TEMPLATE_ID
  }
  const params = JSON.stringify(paramsObj)
  const signature = _calculateSignature(params)
  const assemblyId = uuid.v4().replace(/\-/g, '')
  const uri = '//api2.transloadit.com/assemblies/' + assemblyId
  res.json({
    params: params,
    signature: signature,
    assemblyId: assemblyId,
    uri: uri
  })
})

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.listen(5000, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('listening on 5000')
})

const _getExpiresDate = () => {
  let expiresDate = new Date()
  expiresDate.setDate(expiresDate.getDate() + 1);
  return expiresDate.toISOString()
}

const _calculateSignature = (params) => {
  const buffer = new Buffer(params, 'utf-8')
  const secret = process.env.TRANSLOADIT_AUTH_SECRET
  return crypto.createHmac('sha1', secret).update(buffer).digest('hex')
}
