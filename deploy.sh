#!/bin/bash

# Copyright (C) 2016 Mark P. Lindsay
# 
# This file is part of mysteriousobjectsatnoon.
#
# mysteriousobjectsatnoon is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# mysteriousobjectsatnoon is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with mysteriousobjectsatnoon.  If not, see <http://www.gnu.org/licenses/>.

# Log in to ECR.
eval `aws ecr get-login --region us-west-2 --profile mysteriousobjectsatnoon`

# Build, tag, and push image to ECR.
docker build -t mysteriousobjectsatnoon .
docker tag mysteriousobjectsatnoon:latest 639407601096.dkr.ecr.us-west-2.amazonaws.com/mysteriousobjectsatnoon:latest
docker push 639407601096.dkr.ecr.us-west-2.amazonaws.com/mysteriousobjectsatnoon:latest

# Run Elastic Beanstalk deploy.
eb deploy
