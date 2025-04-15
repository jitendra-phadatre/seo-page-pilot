
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Define content security policy headers
const getSecurityHeaders = () => {
  const scriptSrc = process.env.ALLOWED_SCRIPT_SRC || "'self'";
  const connectSrc = process.env.ALLOWED_CONNECT_SRC || "'self'";
  const imgSrc = process.env.ALLOWED_IMG_SRC || "'self'";
  const frameSrc = process.env.ALLOWED_FRAME_SRC || "'self'";
  const objectSrc = process.env.ALLOWED_OBJECT_SRC || "'none'";
  const styleSrc = process.env.ALLOWED_STYLE_SRC || "'self'";
  const fontSrc = process.env.ALLOWED_FONT_SRC || "'self'";
  
  return {
    'Content-Security-Policy': `default-src 'self'; script-src 'self' ${scriptSrc}; connect-src 'self' ${connectSrc}; img-src 'self' data: ${imgSrc}; frame-src ${frameSrc}; object-src ${objectSrc}; style-src 'self' 'unsafe-inline' ${styleSrc}; font-src ${fontSrc};`,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
};

// Handler for API Gateway events
exports.handler = async (event, context) => {
  // Get the requested path from the event
  const requestPath = event.path || event.rawPath || '/';
  
  // Detect preferred language from header if available
  const acceptLanguageHeader = event.headers?.['accept-language'] || event.headers?.['Accept-Language'] || '';
  const detectedLanguage = parseAcceptLanguage(acceptLanguageHeader);

  // Base directory where static assets are stored
  const basePath = path.join(__dirname, 'dist');
  
  // Prepare path to the requested file
  let filePath = requestPath === '/' ? '/index.html' : requestPath;
  
  // Handle language path prefix if present (e.g., /es/about -> /about in Spanish)
  const langMatch = filePath.match(/^\/([a-z]{2})(\/.*|$)/);
  let selectedLanguage = null;
  
  if (langMatch) {
    selectedLanguage = langMatch[1];
    filePath = langMatch[2] || '/index.html';
    if (filePath === '/') filePath = '/index.html';
  } else {
    // If no language specified in URL, use detected language or default
    selectedLanguage = detectedLanguage || 'en';
  }
  
  // Full path to the requested file
  let fullPath = path.join(basePath, filePath);
  
  // If file doesn't exist, try language-specific version first
  if (!fs.existsSync(fullPath) && selectedLanguage) {
    const langPath = path.join(basePath, `${selectedLanguage}${filePath}`);
    if (fs.existsSync(langPath)) {
      fullPath = langPath;
    }
  }
  
  // SPA fallback: use index.html for non-existent paths that don't have file extensions
  if (!fs.existsSync(fullPath) && !path.extname(filePath)) {
    fullPath = path.join(basePath, 'index.html');
  }
  
  try {
    // Read the file
    const fileContents = fs.readFileSync(fullPath);
    
    // Determine content type based on file extension
    const contentType = mime.lookup(fullPath) || 'text/html';
    
    // Get security headers
    const securityHeaders = getSecurityHeaders();
    
    // Return the response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        ...securityHeaders,
        // Add CORS headers if configured
        ...(process.env.ALLOW_CORSORIGIN ? {
          'Access-Control-Allow-Origin': process.env.ALLOW_CORSORIGIN,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        } : {})
      },
      body: fileContents.toString('base64'),
      isBase64Encoded: true
    };
  } catch (err) {
    console.error('Error serving file:', err);
    
    // Return a 404 if file not found, 500 for other errors
    const isNotFound = err.code === 'ENOENT';
    
    return {
      statusCode: isNotFound ? 404 : 500,
      headers: {
        'Content-Type': 'text/html',
        ...getSecurityHeaders()
      },
      body: isNotFound ? 'Page not found' : 'Server error',
    };
  }
};

// Helper function to parse Accept-Language header
function parseAcceptLanguage(header) {
  if (!header) return null;
  
  try {
    // Extract language code (e.g., "en-US,en;q=0.9" -> "en")
    const match = header.match(/^([a-zA-Z]{2})-?[a-zA-Z]*\b/);
    return match ? match[1].toLowerCase() : null;
  } catch (e) {
    console.error('Error parsing Accept-Language:', e);
    return null;
  }
}
