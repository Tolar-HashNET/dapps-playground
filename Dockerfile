FROM node:14

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl unzip jq && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./public/* /app/public/
COPY ./src/* /app/src/

RUN npm install

# copy contents of node modules from Docker build layer to final Docker image
COPY . .

RUN rm /app/src/config.js

COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# download necessary tools to be able to send transactions
RUN curl --output send_tx.zip https://artifactory.dev.tolar.io/artifactory/general/hashnet_binaries/latest/send_tx.zip && \
    unzip send_tx.zip && \
    chmod +x send_tx

ENTRYPOINT [ "/app/entrypoint.sh" ]