// 4D command: WEB SEND HTTP REDIRECT
// Sends an HTTP redirect response to the client
// WEB SEND HTTP REDIRECT ( url {; statusCode} )
// Parameter		Type		Description
// url		String		URL to redirect to
// statusCode		Longint		HTTP status code (optional, defaults to 302)

export default function WEB_SEND_HTTP_REDIRECT(processState, url, statusCode = 302) {
    // Check if we have a current response
    if (!processState.res) {
        console.warn('WEB SEND HTTP REDIRECT: No response object available');
        return;
    }
    
    // Validate status code
    if (statusCode !== 301 && statusCode !== 302 && statusCode !== 303 && statusCode !== 307 && statusCode !== 308) {
        statusCode = 302; // Default to temporary redirect
    }
    
    // Send the redirect
    processState.res.redirect(statusCode, url);
}
