import express from 'express'
import Firebase from 'firebase'
import C from './src/constants'

const app = express()

app.use(express.static(__dirname + '/public'))

app.listen(5000, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('listening on 5000')
})

import seed from './seed.json'
let ref = new Firebase(C.FIREBASE)
ref.remove((err) => {
  if (err) {
    console.log('problem wiping firebase')
  }
  else {
    let users = []

    seed.users.forEach((u) => {
      let pushedRef = ref.child('users').push(u)
      users.push(pushedRef.key())
    })

    seed.items.forEach((i) => {
      ref.child('items').push(Object.assign({}, i, {
        user: users[0]
      }))
    })
  }
})
