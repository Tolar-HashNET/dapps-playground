# Requirements

```
node --version 
v14.18.0

npm --version
6.14.15
```

# Running

```
npm install
npm start
```

# Docker

Build and push the image to GCP image registry:
```
docker build -t dapps-playground:<version> .
docker tag dapps-playground:<version> gcr.io/tolar-devops-311210/dapps-playground:<version>
docker push gcr.io/tolar-devops-311210/dapps-playground:<version>
```
Instructions similar to the ones in the faucet repository: https://github.com/Tolar-HashNET/faucet#build-docker-image-and-deploy-to-gcp
