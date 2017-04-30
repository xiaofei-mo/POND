# Copyright (C) 2017 Mark P. Lindsay
# 
# This file is part of mysteriousobjectsatnoon.
#
# mysteriousobjectsatnoon is free software: you can redistribute it and/or 
# modify it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# mysteriousobjectsatnoon is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with mysteriousobjectsatnoon.  If not, see 
# <http://www.gnu.org/licenses/>.

import os
import time

import pyrebase
import requests
import schedule


def _get_assembly(upload):
    r = requests.get(upload['uri'])
    return r.json()


def _get_status(assembly):
    ok = assembly['ok']
    if ok == 'ASSEMBLY_UPLOADING':
        return 'uploaded'
    if ok == 'ASSEMBLY_EXECUTING':
        return 'processing'
    if ok == 'ASSEMBLY_COMPLETED':
        return 'done'
    return 'error'


class Worker(object):
    def __init__(self):
        self._uploads = {}
        firebase = pyrebase.initialize_app({
            'apiKey': os.environ['FIREBASE_API_KEY'],
            'authDomain': os.environ['FIREBASE_AUTH_DOMAIN'],
            'databaseURL': os.environ['FIREBASE_DATABASE_URL'],
            'serviceAccount': {
                # Your "Service account ID," which looks like an email address.
                'client_email': os.environ['FIREBASE_CLIENT_EMAIL'], 
                # The part of your Firebase database URL before 
                # `firebaseio.com`. e.g. `fiery-flames-1234`
                'client_id': os.environ['FIREBASE_CLIENT_ID'],
                # The key itself, a long string with newlines, starting with 
                # `-----BEGIN PRIVATE KEY-----\n`
                'private_key': os.environ['FIREBASE_PRIVATE_KEY']
                               .replace('\\n', '\n'),
                # Your service account "key ID." Mine is 40 alphanumeric 
                # characters.
                'private_key_id': os.environ['FIREBASE_PRIVATE_KEY_ID'],
                'type': 'service_account'
            },
            'storageBucket': ''
        })
        self._db = firebase.database()
        schedule.every(15).seconds.do(self._check_transloadit)
        print('Worker initialized.')

    def work(self):
        self._check_transloadit()
        while True:
            schedule.run_pending()
            time.sleep(1)

    def _check_transloadit(self):
        for upload_ref in self._db.child('uploads').get().each():
            assembly_id = upload_ref.key()
            upload = upload_ref.val()
            assembly = _get_assembly(upload)
            status = _get_status(assembly)
            if upload['status'] != status:
                self._db.child('uploads').child(assembly_id) \
                        .child('status').set(status)
            if status == 'done' and not self._item_exists(assembly_id):
                self._create_item(assembly)

    def _create_item(self, assembly):
        print('should create item from assembly = ', assembly)
        # Did we already create an item?
        # item = self._db.child('items').child(upload['assemblyId']).get()
        # print('existing item = ', item)

    def _item_exists(self, assembly_id):
        item = self._db.child('items').child(assembly_id).get().val()
        return item != None
