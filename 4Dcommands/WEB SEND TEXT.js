// This 4D command is fixed and tested.
// 4D command: WEB SEND TEXT
// Sends text data to a web browser with an optional MIME type
// Based on 4D v20 documentation: Sends text content to the web client with proper content-type headers
// WEB SEND TEXT ( htmlText {; type} )
// Parameter		Type		Description
// htmlText		Text		Text content to send to the web browser
// type			Text		MIME type for the content (optional, defaults to text/html)

export default function WEB_SEND_TEXT(processState, htmlText, type = 'text/html; charset=utf-8') {
    // Validate input parameters
    if (!processState.res) {
        console.warn('WEB SEND TEXT: No HTTP response context available');
        return;
    }
    
    if (htmlText === undefined || htmlText === null) {
        htmlText = '';
    }
    
    // Convert to string if not already
    const textContent = String(htmlText);
    
    try {
        // Set content type header with proper charset
        if (type) {
            processState.res.setHeader('Content-Type', type);
        } else {
            processState.res.setHeader('Content-Type', 'text/html; charset=utf-8');
        }
        
        // Set content length
        const contentLength = Buffer.byteLength(textContent, 'utf8');
        processState.res.setHeader('Content-Length', contentLength);
        
        // Set additional headers for proper caching and security
        processState.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        processState.res.setHeader('Pragma', 'no-cache');
        processState.res.setHeader('Expires', '0');
        
        // Send the text content
        processState.res.send(textContent);
        
        // Log the operation
        if (processState.logEvents) {
            processState.logEvents.push({
                timestamp: new Date().toISOString(),
                type: 1, // Info level
                typeName: 'INFO',
                message: `WEB SEND TEXT: Sent ${contentLength} bytes as '${type}'`
            });
        }
        
        console.log(`WEB SEND TEXT: Sent ${contentLength} bytes as '${type}'`);
        
    } catch (error) {
        console.error('WEB SEND TEXT error:', error.message);
        
        // Try to send an error response if headers haven't been sent
        if (processState.res && !processState.res.headersSent) {
            processState.res.status(500).send('Internal Server Error');
        }
    }
}