
# Deploying to AWS Lambda

This document outlines the steps to deploy the SEO Management Tool to AWS Lambda for serverless operation.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Node.js v16+ installed
4. Serverless Framework installed (`npm install -g serverless`)

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
    "serverless-offline": "^12.0.4"
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

## Deployment Process

1. Set up AWS credentials:
   ```
   aws configure
   ```

2. Build and deploy:
   ```
   npm run deploy
   ```

## Environment Variables

The following environment variables need to be set in the AWS Console or via the serverless.yml:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase project API key

## Additional Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [Express.js Documentation](https://expressjs.com/)

## Monitoring and Logging

AWS CloudWatch is automatically integrated with Lambda functions. You can view logs, set up alarms, and monitor performance metrics through the AWS Console.
