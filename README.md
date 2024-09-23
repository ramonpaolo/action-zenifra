# action-zenifra
This GitHub Action facilitates the deployment of Docker images to [Zenifra](https://homepage-ad5846ff46dac8d0a7.zenifra.com), a platform designed to streamline application hosting and management.

## Input parameters

| Name           | Description                      | Required | Default          |
| :------------- | :------------------------------- | :------- | :--------------- |
| image          | The Docker image to be deployed  | `true`   | N/A              |
| project_id     | The ID of the project on Zenifra | `true`   | N/A              |

## Example

The example below demonstrates a complete workflow that builds and publishes a Docker image to Docker Hub, followed by deploying this new image on Zenifra.

```yaml
name: Deploy PRD
on:
  push: 
    branches: 
      - main

jobs:
  build: # Job to build and publish the Docker image
    name: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@main

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Docker Registry
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Publish Docker Image
        run: docker buildx build -t <username_docker>/<name_image>:<tag> --platform=linux/amd64 --push .

  deploy: # Job to deploy the Docker image on Zenifra
    needs: build
    name: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code 
        uses: actions/checkout@main

      - name: Deploy Image to Zenifra
        uses: ramonpaolo/action-zenifra@main
        with:
          project_id: <project_id>
          image: <username_docker>/<name_image>:<tag>
