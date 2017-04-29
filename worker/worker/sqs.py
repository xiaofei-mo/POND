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

import json

import boto3


class SQS:
    def __init__(self, aws_access_key_id, aws_secret_access_key, region_name,
                 queue_name):
        resource = boto3.resource(
            'sqs', 
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name
        )
        self.queue = resource.get_queue_by_name(QueueName=queue_name)

    def read(self, handler, delete_messages=True):
        messages = self.queue.receive_messages(
            WaitTimeSeconds=20,
            MaxNumberOfMessages=10
        )
        if not messages:
            return None
        return_value = handler(messages)
        for message in messages:
            message.delete()
        return return_value

    def write(self, payload):
        return self.queue.send_message(MessageBody=json.dumps(payload))
