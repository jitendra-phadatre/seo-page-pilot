
# Deploying to AWS Lambda with API Gateway

This document outlines the steps to deploy the SEO Management Tool to AWS Lambda with API Gateway for serverless operation, following the Azure DevOps pipeline model.

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Node.js v16+ installed
4. Serverless Framework recommended (`npm install -g serverless`)

## Deployment Options

### Option 1: Using Azure DevOps Pipelines (Recommended)

The deployment process mirrors the TzyPackage.UI pipeline shown in the reference images, with:

1. **Build Pipeline**:
   - Source Code Checkout
   - Restore Dependencies
   - Build React Application
   - Publish Artifacts
   - S3 Upload to appropriate environment bucket

2. **Release Pipeline**:
   - CloudFormation deployment from S3 artifact
   - Configuration based on environment parameters

### Option 2: Using Serverless Framework

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

### Option 3: Manual CloudFormation Deployment

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
├── node_modules/   # Only production dependencies
└── serverless.yml  # Serverless configuration
```

#### 3. Create and upload a deployment package

```bash
# Install production dependencies only
npm ci --production

# Create a zip file
zip -r deployment.zip index.js dist node_modules serverless.yml

# Upload to S3
aws s3 cp deployment.zip s3://vsts-dev-lambda-drop/seo-management-app/dev/build$(date +%Y%m%d%H%M%S)/seo-management-app.zip
```

#### 4. Deploy with CloudFormation

```bash
# Deploy using CloudFormation
aws cloudformation deploy \
  --template-file cloudformation.json \
  --stack-name dev-seo-management-app \
  --parameter-overrides \
    Environment=dev \
    BuildPath=seo-management-app/dev/build$(date +%Y%m%d%H%M%S)/seo-management-app.zip \
    JsVersion=$(date +%Y%m%d%H%M%S)
```

## VPC Configuration

This application is configured to run within a VPC for enhanced security. The specific security groups and subnets are defined in the CloudFormation template for each environment.

## Security Headers

The application implements the following security headers:

- Content-Security-Policy (CSP)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security
- Referrer-Policy

## Mapping to Azure DevOps Pipeline

The deployment process maps to the Azure DevOps pipeline as follows:

1. **Build Pipeline**: 
   - Matches the steps in the first screenshot (TzyPackage.UI pipeline)
   - Source code checkout, restore, build, publish artifact
   - S3 upload steps for each environment target

2. **Release Pipeline**:
   - Matches the CloudFormation deployment step in the second screenshot
   - Uses CloudFormation template to create/update Lambda function
   - Configures environment variables and VPC settings

## CI/CD Integration

For Azure DevOps CI/CD, use the pipeline template shown in the screenshots as a reference. The key components are:

1. **Build Pipeline Tasks**:
   - Get sources
   - Restore dependencies
   - Build React app
   - Publish artifact
   - S3 Upload to environment bucket

2. **Release Pipeline Tasks**:
   - AWS CloudFormation Create/Update Stack task
   - Template parameters for BuildPath
   - Environment-specific configuration
