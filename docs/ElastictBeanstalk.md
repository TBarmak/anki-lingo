# Elastic Beanstalk
## Uploading Images to ECR
### Login to ECR
`aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account id>.dkr.ecr.us-east-1.amazonaws.com`

### Clear cache
`docker system prune -af`

### Build and push the api image
1. `docker build -t anki-lingo-api -f Dockerfile.api .`
2. `docker tag anki-lingo-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/anki-lingo-api:latest`
3. `docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/anki-lingo-api:latest`

### Build and push the client image
1. `docker build -t anki-lingo-client -f Dockerfile.client .`
2. `docker tag anki-lingo-client:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/anki-lingo-client:latest`
3. `docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/anki-lingo-client:latest`

## Initialize Elastic Beanstalk
1. `eb init`
2. `eb create my-env`
3. `eb deploy`
