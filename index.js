
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

// Add security headers based on environment variables
const getSecurityHeaders = () => {
  const scriptSrc = process.env.ALLOWED_SCRIPT_SRC || '';
  const connectSrc = process.env.ALLOWED_CONNECT_SRC || '';
  const imgSrc = process.env.ALLOWED_IMG_SRC || '';
  const frameSrc = process.env.ALLOWED_FRAME_SRC || '';
  const objectSrc = process.env.ALLOWED_OBJECT_SRC || '';
  const styleSrc = process.env.ALLOWED_STYLE_SRC || '';
  const fontSrc = process.env.ALLOWED_FONT_SRC || '';
  
  return {
    'Content-Security-Policy': `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${scriptSrc}; connect-src 'self' ${connectSrc}; img-src 'self' data: ${imgSrc}; frame-src 'self' ${frameSrc}; object-src 'self' ${objectSrc}; style-src 'self' 'unsafe-inline' ${styleSrc}; font-src 'self' ${fontSrc};`,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
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
    
    // Set appropriate cache control based on file type
    const cacheControl = ext === '.html' ? 'no-cache' : 'max-age=31536000';
    
    // Get security headers
    const securityHeaders = getSecurityHeaders();
    
    // Return the response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        ...securityHeaders,
        // Add CORS headers if needed
        'Access-Control-Allow-Origin': process.env.ALLOW_CORSORIGIN || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
