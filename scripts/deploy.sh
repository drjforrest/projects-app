#!/bin/bash

# Build the Docker image
docker build -t projects-app .

# Push to registry (if using)
docker tag projects-app registry.example.com/projects-app
docker push registry.example.com/projects-app

# Run database migrations
npm run migrate

# Deploy
docker-compose up -d 