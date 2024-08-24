### Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:3000.

### Deploying your application to the cloud

1. Retrieve an authentication token and authenticate your Docker client to your registry.
```bash
aws ecr get-login-password --profile PushCMPCrawlerUsr --region eu-west-2 | docker login --username AWS --password-stdin 136647979260.dkr.ecr.eu-west-2.amazonaws.com
```

2. Build your Docker image using the following command.
```bash
docker build -t consent-protect-management .
```

3. After the build is completed, tag your image so you can push the image to this repository:
```bash
docker tag consent-protect-management:latest 136647979260.dkr.ecr.eu-west-2.amazonaws.com/consent-protect-management:latest
```

4. Run the following command to push this image to your newly created AWS repository:
```bash
docker push 136647979260.dkr.ecr.eu-west-2.amazonaws.com/consent-protect-management:latest
```

