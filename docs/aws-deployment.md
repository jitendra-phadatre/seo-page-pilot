
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
   ./deploy.sh
   ```

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
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://deployment.zip

# Or update an existing function
aws lambda update-function-code \
  --function-name seo-management-app \
  --zip-file fileb://deployment.zip
```

#### 5. Configure API Gateway

1. Create a new API Gateway REST API
2. Create a proxy resource with `{proxy+}` path
3. Set up the ANY method and integrate with your Lambda function
4. Deploy the API to a stage

## Environment Variables

For both deployment options, you should set these environment variables in the Lambda function:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase project API key

## Continuous Integration/Deployment

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
        run: npx serverless deploy --stage prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
```

## Performance Optimization

To optimize performance:

1. **Caching**: Add appropriate cache headers in the Lambda response
2. **Compression**: Enable GZIP/Brotli compression at API Gateway level
3. **Memory**: Increase Lambda memory (which also increases CPU) for faster response times

## Monitoring and Troubleshooting

- **CloudWatch Logs**: Monitor Lambda execution logs
- **CloudWatch Metrics**: Track invocation count, duration, and errors
- **X-Ray**: Enable tracing for request analysis (optional)

## Cost Considerations

- Lambda is charged by invocation count and duration
- API Gateway is charged by request count
- Set up budget alerts to monitor costs
