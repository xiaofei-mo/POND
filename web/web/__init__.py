import datetime
import hashlib
import hmac
import json
import os
import pytz
import uuid

import boto3
from flask import Flask, jsonify, render_template
import pyrebase


app = Flask('web')


firebase = pyrebase.initialize_app({
    'apiKey': os.environ['FIREBASE_API_KEY'],
    'authDomain': os.environ['FIREBASE_AUTH_DOMAIN'],
    'databaseURL': os.environ['FIREBASE_DATABASE_URL'],
    'serviceAccount': {
        # Your "Service account ID," which looks like an email address.
        'client_email': os.environ['FIREBASE_CLIENT_EMAIL'], 
        # The part of your Firebase database URL before `firebaseio.com`. 
        # e.g. `fiery-flames-1234`
        'client_id': os.environ['FIREBASE_CLIENT_ID'],
        # The key itself, a long string with newlines, starting with 
        # `-----BEGIN PRIVATE KEY-----\n`
        'private_key': os.environ['FIREBASE_PRIVATE_KEY'].replace('\\n', '\n'),
        # Your service account "key ID." Mine is 40 alphanumeric characters.
        'private_key_id': os.environ['FIREBASE_PRIVATE_KEY_ID'],
        'type': 'service_account'
    },
    'storageBucket': ''
})


sqs_resource = boto3.resource(
    'sqs', 
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    region_name=['AWS_DEFAULT_REGION']
)
sqs_queue = resource.get_queue_by_name(QueueName=os.environ['SQS_QUEUE'])


@app.route('/get-upload-values')
def get_upload_values():
    params = json.dumps({
        'auth': {
            'key': os.environ['TRANSLOADIT_AUTH_KEY'],
            'expires': _get_expires_date()
        },
        'template_id': os.environ['TRANSLOADIT_TEMPLATE_ID']
    })
    signature = _calculate_signature(params)
    assembly_id = _get_assembly_id()
    uri = 'https://api2.transloadit.com/assemblies/{0}'.format(assembly_id)
    return jsonify({
        'assembly_id': assembly_id,
        'params': params,
        'signature': signature,
        'uri': uri
    })


@app.route('/')
def index():
    config = {
        'CLOUDFRONT_HOSTNAME': os.environ['CLOUDFRONT_HOSTNAME'],
        'FIREBASE_API_KEY': os.environ['FIREBASE_API_KEY'],
        'FIREBASE_AUTH_DOMAIN': os.environ['FIREBASE_AUTH_DOMAIN'],
        'FIREBASE_DATABASE_URL': os.environ['FIREBASE_DATABASE_URL'],
        'NODE_ENV': os.environ['NODE_ENV'],
        'S3_HOSTNAME': os.environ['S3_HOSTNAME']
    }
    return render_template('index.html', 
        config=config
    )


@app.route('/upload')
def upload():
    payload = {
        'hi': 'there'
    }
    sqs_queue.send_message(MessageBody=json.dumps(payload))


def _calculate_signature(params):
    key = bytes(os.environ['TRANSLOADIT_AUTH_SECRET'], 'UTF-8')
    msg = bytes(params, 'UTF-8')
    digester = hmac.new(key, msg, hashlib.sha1)
    return digester.hexdigest()


def _get_assembly_id():
    return str(uuid.uuid4()).replace('-', '')


def _get_expires_date():
    now = datetime.datetime.now(pytz.timezone('UTC'))
    one_day = datetime.timedelta(days=1)
    expires_date = now + one_day
    return expires_date.isoformat()
