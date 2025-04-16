
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

// List of supported languages
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'zh', 'ja', 'ar'];

// Handler for API Gateway events
exports.handler = async (event, context) => {
  // Get the requested path from the event
  const requestPath = event.path || event.rawPath || '/';
  
  // Detect preferred language from header if available
  const acceptLanguageHeader = event.headers?.['accept-language'] || event.headers?.['Accept-Language'] || '';
  const detectedLanguage = parseAcceptLanguage(acceptLanguageHeader);

  // Base directory where static assets are stored
  const basePath = path.join(__dirname, 'dist');
  
  try {
    // Check if the requested path is a static asset (has file extension)
    const hasFileExtension = path.extname(requestPath) !== '';
    
    if (hasFileExtension) {
      // For static assets, serve directly
      return await serveStaticFile(requestPath, basePath);
    }
    
    // Handle language path prefix if present (e.g., /es/about)
    const langMatch = requestPath.match(/^\/([a-z]{2})(\/.*|$)/);
    let selectedLanguage = null;
    let appPath = requestPath;
    
    if (langMatch && SUPPORTED_LANGUAGES.includes(langMatch[1])) {
      selectedLanguage = langMatch[1];
      appPath = langMatch[2] || '/';
    } else {
      // Try to use detected language from Accept-Language header
      selectedLanguage = detectedLanguage && SUPPORTED_LANGUAGES.includes(detectedLanguage) 
        ? detectedLanguage 
        : 'en'; // Default to English
    }
    
    // For all app routes (not static assets), serve index.html
    return await serveAppRoute(basePath, selectedLanguage);
    
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

// Serve a static file (JS, CSS, images, etc.)
async function serveStaticFile(requestPath, basePath) {
  const filePath = path.join(basePath, requestPath);
  const fileContents = fs.readFileSync(filePath);
  
  // Determine content type based on file extension
  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': contentType,
      ...getSecurityHeaders(),
    },
    body: fileContents.toString('base64'),
    isBase64Encoded: true
  };
}

// Serve the app for SPA routing
async function serveAppRoute(basePath, language) {
  const indexPath = path.join(basePath, 'index.html');
  let fileContents = fs.readFileSync(indexPath, 'utf8');
  
  // Optionally inject language information into the HTML
  if (language) {
    // Set the lang attribute in the HTML tag
    fileContents = fileContents.replace(
      /<html[^>]*>/i, 
      `<html lang="${language}" ${language === 'ar' ? 'dir="rtl"' : 'dir="ltr"'}>`
    );
    
    // Inject a script that sets the preferred language in localStorage
    const languageScript = `<script>
      if (!localStorage.getItem('preferred-language')) {
        localStorage.setItem('preferred-language', '${language}');
      }
    </script>`;
    
    // Insert the script right before the closing </head> tag
    fileContents = fileContents.replace('</head>', `${languageScript}</head>`);
  }
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      ...getSecurityHeaders(),
      // Add language info in header for clients that need it
      'Content-Language': language || 'en'
    },
    body: Buffer.from(fileContents).toString('base64'),
    isBase64Encoded: true
  };
}

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
