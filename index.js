
const fs = require('fs');
const path = require('path');

// Map of common file extensions to MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

exports.handler = async (event, context) => {
  try {
    // For API Gateway integration, the path is available in rawPath
    // For direct Lambda invocation, default to root
    let filePath = event.rawPath || event.path || '/';
    
    // Remove leading slash for path resolution
    if (filePath.startsWith('/')) {
      filePath = filePath.substring(1);
    }
    
    // Default to index.html for root path
    if (filePath === '') {
      filePath = 'index.html';
    }

    // Full path to the requested file in the build directory
    const buildDir = path.resolve(__dirname, 'dist');
    let fullPath = path.join(buildDir, filePath);
    
    // Check if requested file exists
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      // For SPA, serve index.html for any route that doesn't match a static file
      fullPath = path.join(buildDir, 'index.html');
    }
    
    // Read file
    const fileContents = fs.readFileSync(fullPath);
    
    // Determine content type based on file extension
    const ext = path.extname(fullPath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Return the response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'max-age=31536000',
      },
      body: fileContents.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error serving file:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: 'Internal Server Error',
    };
  }
};
