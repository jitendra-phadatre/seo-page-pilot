
# Deploying to AWS Lambda with API Gateway

This document outlines the steps to deploy the SEO Management Tool to AWS Lambda with API Gateway for serverless operation.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Node.js v16+ installed
4. Serverless Framework recommended (`npm install -g serverless`)

## Deployment Options

### Option 1: Using Serverless Framework (Recommended)

The Serverless Framework provides a simple way to deploy Lambda functions with all necessary resources.

1. **Install Serverless Framework**:
   ```
   npm install -g serverless
   ```

2. **Configure AWS credentials**:
   ```
   aws configure
   ```

3. **Run deploy script**:
   ```
   ./deploy.sh [environment]
   ```

   Where `[environment]` is one of: `dev`, `qa`, `stage`, `prod`

### Option 2: Manual Deployment

#### 1. Build your React application

```bash
npm run build
```

#### 2. Prepare the Lambda package

Your Lambda package should have the following structure:
```
/
├── dist/           # The build output folder of your React application
│   ├── index.html
│   ├── static/
│   └── ...
├── index.js        # The Lambda handler
├── serverless.yml  # Serverless configuration
└── node_modules/   # Only production dependencies
```

#### 3. Create a deployment package

```bash
# Install production dependencies only
npm ci --production

# Create a zip file
zip -r deployment.zip index.js dist node_modules
```

#### 4. Deploy to AWS Lambda

**Using AWS CLI:**
```bash
# Create a new Lambda function
aws lambda create-function \
  --function-name seo-management-app \
  --runtime nodejs16.x \
  --architecture arm64 \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://deployment.zip

# Or update an existing function
aws lambda update-function-code \
  --function-name seo-management-app \
  --zip-file fileb://deployment.zip
```

## Environment Variables

These environment variables are configured in the serverless.yml file or can be set directly in the Lambda function:

- `STAGE`: Deployment environment (dev, qa, stage, prod)
- `JS_VERSION`: Build version identifier
- `MAX_AJAX_RETRIES`: Number of API request retries
- `DATE_FORMAT`: Standard date format
- `DEBUG_MODE`: Enable/disable debug mode
- `ALLOWED_SCRIPT_SRC`: CSP script-src directive
- `ALLOWED_CONNECT_SRC`: CSP connect-src directive
- `ALLOWED_IMG_SRC`: CSP img-src directive
- `ALLOWED_FRAME_SRC`: CSP frame-src directive
- `ALLOWED_OBJECT_SRC`: CSP object-src directive
- `ALLOWED_STYLE_SRC`: CSP style-src directive
- `ALLOWED_FONT_SRC`: CSP font-src directive

## VPC Configuration

This application is configured to run within a VPC for enhanced security. The specific security groups and subnets are defined in the `serverless.yml` file for each environment.

## Security Headers

The application implements the following security headers:

- Content-Security-Policy (CSP)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security
- Referrer-Policy

## Monitoring and Troubleshooting

- **CloudWatch Logs**: Monitor Lambda execution logs
- **CloudWatch Metrics**: Track invocation count, duration, and errors
- **X-Ray**: Enable tracing for request analysis (optional)

## CI/CD Integration

For CI/CD, you can use GitHub Actions or AWS CodePipeline to automate the build and deployment process.

### GitHub Actions Example

Create a file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS Lambda

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Deploy with Serverless Framework
        run: npx serverless deploy --stage prod --jsVersion $(date +%Y%m%d%H%M%S)
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```
