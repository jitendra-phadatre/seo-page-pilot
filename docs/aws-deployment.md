
# Deploying to AWS Lambda with CI/CD

This document outlines the steps to deploy the SEO Management Tool to AWS Lambda for serverless operation, including setting up a CI/CD pipeline for automated deployments.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Node.js v16+ installed
4. Serverless Framework installed (`npm install -g serverless`)
5. GitHub repository for your codebase

## Configuration Steps

### 1. Create a Serverless Framework configuration

Create a `serverless.yml` file in the root of your project:

```yaml
service: seo-management-tool

provider:
  name: aws
  runtime: nodejs16.x
  stage: ${opt:stage, 'dev'}
  region: ${opt:region, 'us-east-1'}
  environment:
    SUPABASE_URL: ${env:SUPABASE_URL}
    SUPABASE_KEY: ${env:SUPABASE_KEY}

functions:
  app:
    handler: server.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
    timeout: 30
    memorySize: 1024

plugins:
  - serverless-offline
  - serverless-dotenv-plugin

custom:
  dotenv:
    path: .env.${opt:stage, 'dev'}
```

### 2. Create a server wrapper for Express

Create a `server.js` file:

```javascript
const serverless = require('serverless-http');
const express = require('express');
const path = require('path');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Export for serverless
module.exports.handler = serverless(app);
```

### 3. Update package.json

Add the following dependencies:

```json
{
  "dependencies": {
    "express": "^4.17.1",
    "serverless-http": "^3.1.1"
  },
  "devDependencies": {
    "serverless-offline": "^12.0.4",
    "serverless-dotenv-plugin": "^4.0.2"
  }
}
```

### 4. Build script for deployment

```json
{
  "scripts": {
    "build:lambda": "npm run build && cp server.js package.json dist/",
    "deploy": "npm run build:lambda && cd dist && serverless deploy"
  }
}
```

## Setting up CI/CD with GitHub Actions

### 1. Create AWS IAM User for CI/CD

1. In your AWS Console, navigate to IAM
2. Create a new user with programmatic access
3. Attach the `AdministratorAccess` policy (or create a custom policy with Lambda, API Gateway, S3, CloudFormation, IAM, and CloudWatch permissions)
4. Save the Access Key ID and Secret Access Key

### 2. Add GitHub Repository Secrets

In your GitHub repository:
1. Go to Settings > Secrets and Variables > Actions
2. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: Your IAM user access key
   - `AWS_SECRET_ACCESS_KEY`: Your IAM user secret key
   - `AWS_REGION`: Your preferred AWS region (e.g., `us-east-1`)
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase project API key

### 3. Create GitHub Actions Workflow

Create a file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS Lambda

on:
  push:
    branches:
      - main  # or master, depending on your primary branch name

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Serverless Framework
        run: npm install -g serverless

      - name: Build application
        run: npm run build

      - name: Deploy to AWS Lambda
        run: |
          cp server.js package.json dist/
          cd dist
          npm install --production
          serverless deploy --stage prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
```

## Environment Variables

Create environment files for different deployment stages:

1. Create `.env.dev`, `.env.staging`, and `.env.prod` files with appropriate variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_api_key
   ```

2. Add these files to `.gitignore` to prevent committing sensitive information

## Deployment Process

### Manual Deployment

1. Set up AWS credentials:
   ```
   aws configure
   ```

2. Build and deploy:
   ```
   npm run deploy
   ```

### Automatic Deployment via CI/CD

Pushing to your main branch will automatically trigger the GitHub Actions workflow to:
1. Build your application
2. Deploy it to AWS Lambda
3. Set up the API Gateway

## Monitoring and Logging

- AWS CloudWatch is automatically integrated with Lambda functions
- View logs, set up alarms, and monitor performance metrics through the AWS Console
- Consider setting up CloudWatch Dashboards for key metrics

## Cost Optimization

- Lambda charges based on execution time and memory allocation
- Consider adjusting the `memorySize` in your `serverless.yml` based on actual usage
- Set up AWS Budgets to monitor costs

## Additional Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Express.js Documentation](https://expressjs.com/)
