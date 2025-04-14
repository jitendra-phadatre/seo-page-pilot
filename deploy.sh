
#!/bin/bash

# Build the React application
echo "Building React application..."
npm run build

# Install production dependencies for Lambda
echo "Installing production dependencies..."
npm ci --production

# Deploy with serverless framework
echo "Deploying with Serverless Framework..."
npx serverless deploy --stage prod

echo "Deployment completed!"
