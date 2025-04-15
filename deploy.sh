
#!/bin/bash

# Get stage parameter or default to 'dev'
STAGE=${1:-dev}
JS_VERSION=$(date +%Y%m%d%H%M%S)

# Build the React application
echo "Building React application..."
npm run build

# Install production dependencies for Lambda
echo "Installing production dependencies..."
npm ci --production

# Create deployment package
echo "Creating deployment package..."
zip -r deployment.zip index.js dist node_modules serverless.yml

# Upload to S3 bucket based on environment
echo "Uploading deployment package to S3..."
S3_BUCKET="seo-management-${STAGE}"
if [ "$STAGE" == "stage" ] || [ "$STAGE" == "prod" ]; then
  S3_BUCKET="seo-management-${STAGE}-prod"
fi

# Create path for S3 upload
BUILD_NUMBER=${BUILD_NUMBER:-$(date +%Y%m%d%H%M%S)}
S3_PATH="seo-management-app/${STAGE}/build${BUILD_NUMBER}/seo-management-app.zip"

# Upload CloudFormation templates
echo "Uploading CloudFormation templates..."
aws s3 cp infrastructure/cloudformation/ s3://${S3_BUCKET}/cloudformation/ --recursive

# Upload deployment package
aws s3 cp deployment.zip s3://${S3_BUCKET}/${S3_PATH}
echo "Uploaded to s3://${S3_BUCKET}/${S3_PATH}"

# Create CloudFront invalidation
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
  echo "Creating CloudFront invalidation..."
  aws cloudfront create-invalidation \
    --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
    --paths "/*"
fi

# Deploy with CloudFormation if requested
if [ "$2" == "deploy" ]; then
  echo "Deploying with CloudFormation to $STAGE environment..."
  aws cloudformation deploy \
    --template-file infrastructure/cloudformation/main.json \
    --stack-name ${STAGE}-seo-management-app \
    --parameter-overrides \
      Environment=${STAGE} \
      BuildPath=${S3_PATH} \
      JsVersion=${JS_VERSION} \
      CloudFrontDistributionId=${CLOUDFRONT_DISTRIBUTION_ID}
fi

echo "Deployment process completed!"
