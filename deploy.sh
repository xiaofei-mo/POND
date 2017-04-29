#!/bin/bash

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

# Ensure `jq` is installed.
sudo apt-get install jq

# Log in to ECR.
eval `aws ecr get-login --region us-west-2 --profile mysteriousobjectsatnoon`

# Build, tag, and push web image to ECR.
docker build -t mysteriousobjectsatnoon-web ./web
docker tag mysteriousobjectsatnoon-web:latest 639407601096.dkr.ecr.us-west-2.amazonaws.com/mysteriousobjectsatnoon-web:latest
docker push 639407601096.dkr.ecr.us-west-2.amazonaws.com/mysteriousobjectsatnoon-web:latest

# Build, tag, and push web image to ECR.
docker build -t mysteriousobjectsatnoon-worker ./worker
docker tag mysteriousobjectsatnoon-worker:latest 639407601096.dkr.ecr.us-west-2.amazonaws.com/mysteriousobjectsatnoon-worker:latest
docker push 639407601096.dkr.ecr.us-west-2.amazonaws.com/mysteriousobjectsatnoon-worker:latest

# Stop the existing task, if one exists.
EXISTING_TASK_ARN=`aws ecs list-tasks --region us-west-2 --profile mysteriousobjectsatnoon --cluster production-cluster --service-name production-service | jq -r '.taskArns[0]'`
if [ $EXISTING_TASK_ARN ]
  then
    aws ecs stop-task --region us-west-2 --profile mysteriousobjectsatnoon --cluster production-cluster --task "$EXISTING_TASK_ARN"
fi

# Get the existing task definition JSON for the production-task-definition
# family.
aws ecs describe-task-definition --region us-west-2 --profile mysteriousobjectsatnoon --task-definition production-task-definition | \
# aws ecs register-task-definition is particular about what keys are present.
jq '.taskDefinition | del(.requiresAttributes, .revision, .status, .taskDefinitionArn)' > production-task-definition.json

# Register a new task definition version.
NEW_TASK_DEFINITION_ARN=`aws ecs register-task-definition --region us-west-2 --profile mysteriousobjectsatnoon --family production-task-definition --cli-input-json file://production-task-definition.json | jq -r '.taskDefinition.taskDefinitionArn'`

# Delete the task definition JSON file.
rm production-task-definition.json

# Update production-service to use the new task definition ersion.
aws ecs update-service --region us-west-2 --profile mysteriousobjectsatnoon --cluster production-cluster --service production-service --task-definition "$NEW_TASK_DEFINITION_ARN"
