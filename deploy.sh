#!/bin/bash

# Log in to ECR.
eval `aws ecr get-login --region us-west-2 --profile mysteriousobjectsatnoon`

# Build, tag, and push image to ECR.
docker build -t mysteriousobjectsatnoon .
docker tag mysteriousobjectsatnoon:latest 639407601096.dkr.ecr.us-west-2.amazonaws.com/mysteriousobjectsatnoon:latest
docker push 639407601096.dkr.ecr.us-west-2.amazonaws.com/mysteriousobjectsatnoon:latest

# Run Elastic Beanstalk deploy.
eb deploy
