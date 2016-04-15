import express from 'express'
import Firebase from 'firebase'
import C from './src/constants'
import multer from 'multer'
import fs from 'fs'
import request from 'request'
import uuid from 'node-uuid'
import crypto from 'crypto'

const app = express()

app.use(express.static(__dirname + '/public'))

app.get('/upload-values', (req, res, next) => {
  const paramsObj = {
    steps: {
      encodeToIpad: {
        use: ':original',
        robot: '/video/encode',
        preset: 'ipad'
      }
    },
    auth: {
      key: process.env.TRANSLOADIT_AUTH_KEY,
      expires: _getExpiresDate()
    }
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
