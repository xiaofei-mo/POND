import express from 'express'
import Firebase from 'firebase'
import C from './src/constants'
import multer from 'multer'
import fs from 'fs'
import request from 'request'
import uuid from 'node-uuid'
import crypto from 'crypto'

const app = express()

const _getParams = () => {

}
app.use(express.static(__dirname + '/public'))

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

   //  TransloaditClient.prototype._appendForm = function(req, params, fields) {
   //    console.log('_appendForm, params coming in = ', params)
   //    var form, jsonParams, key, sigData, signature, val;
   //    sigData = this.calcSignature(params);
   //    jsonParams = sigData.params;
   //    signature = sigData.signature;
   //    form = req.form();
   //    console.log('calling form.append(params) with params = ', jsonParams)
   //    form.append("params", jsonParams);
   //    if (fields == null) {
   //      fields = [];
   //    }
   //    for (key in fields) {
   //      val = fields[key];
   //      if (_.isObject(fields[key]) || _.isArray(fields[key])) {
   //        val = JSON.stringify(fields[key]);
   //      }
   //      form.append(key, val);
   //    }
   //    form.append("signature", signature);
   //    return _.each(this._streams, function(value, key) {
   //      return form.append(key, value);
   //    });
   //  };

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
  // const stream = fs.createReadStream(req.file.path);
  // }
  // const assemblyId = uuid.v4().replace(/\-/g, '')
  // const req_ = request.post({
  //   uri: 'https://api2.transloadit.com/assemblies/' + assemblyId + '?redirect=false',
  //   timeout: 86400000
  // })
  // let form = req_.form();
  // form.append('params', JSON.stringify(params))
  // form.append('id', req.body.id)
  // form.append(req.body.id, stream)
  // res.json({
  //   assemblyId: assemblyId
  // })
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

// import seed from './seed.json'
// let ref = new Firebase(C.FIREBASE)
// ref.remove((err) => {
//   if (err) {
//     console.log('problem wiping firebase')
//   }
//   else {
//     let users = []

//     seed.users.forEach((u) => {
//       let pushedRef = ref.child('users').push(u)
//       users.push(pushedRef.key())
//     })

//     seed.items.forEach((i) => {
//       ref.child('items').push(Object.assign({}, i, {
//         user: users[0]
//       }))
//     })
//   }
// })
