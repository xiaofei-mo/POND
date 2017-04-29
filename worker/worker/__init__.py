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

from worker.sqs import SQS


class Worker(object):
    def __init__(self):
        self.sqs = self._obtain_sqs()

    def work(self):
        while True:
            self.sqs.read(self._handle)

    def _handle(self, messages):
        if not messages:
            return False
        for message in messages:
            body = json.loads(message.body)
            print(message.md5_of_body)
            print(body)
        return True

    def _obtain_sqs(self):
        return SQS(
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
            region_name=os.environ['AWS_DEFAULT_REGION'],
            queue_name=os.environ['SQS_QUEUE']
        )
