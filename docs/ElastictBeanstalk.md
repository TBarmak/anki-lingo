# Elastic Beanstalk
## Uploading Images to ECR
### Login to ECR
`aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account id>.dkr.ecr.us-east-1.amazonaws.com`

### Clear cache
`docker system prune -af`

### Build and push the api image
1. `docker build -t anki-lang-api -f Dockerfile.api .`
2. `docker tag anki-lang-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/anki-lang-api:latest`
3. `docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/anki-lang-api:latest`

### Build and push the client image
1. `docker build -t anki-lang-client -f Dockerfile.client .`
2. `docker tag anki-lang-client:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/anki-lang-client:latest`
3. `docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/anki-lang-client:latest`

## Initialize Elastic Beanstalk
1. `eb init`
2. `eb create my-env`
3. `eb deploy`
