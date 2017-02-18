FROM mhart/alpine-node:7.5

RUN apk update && \
  apk add --no-cache make gcc g++ python bash && \
  npm install --ignore-optional -g node-gyp \
  yarn \
  && mkdir app

COPY package.json /app/package.json
COPY src /app/src/
COPY ssl /app/ssl/
# COPY cli /app/cli
# COPY index.js /app/

WORKDIR /app
RUN npm i --production
# RUN yarn install

# match config port
EXPOSE 3010
CMD ["node", "index.js"]