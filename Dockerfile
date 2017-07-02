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

FROM node:latest

# Create app directory.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies.
COPY package.json /usr/src/app/
RUN npm install --silent --progress=false -g pm2
RUN npm install --silent --progress=false

# Bundle app source.
COPY . /usr/src/app

# Open up port 5000.
#EXPOSE 5000 5001

#CMD ["node", "src/mysteriousobjectsatnoon.js"]
