
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

# Deploy with serverless framework
echo "Deploying with Serverless Framework to $STAGE environment..."
npx serverless deploy --stage $STAGE --jsVersion $JS_VERSION

echo "Deployment completed!"
