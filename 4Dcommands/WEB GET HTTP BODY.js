// 4D command: WEB GET HTTP BODY
// Returns the HTTP request body as raw data
// Based on 4D v20 documentation: Returns the body of the HTTP request as text
// WEB GET HTTP BODY ( body )
// Parameter		Type		Description
// body		String		HTTP request body content

export default function WEB_GET_HTTP_BODY(processState) {
    // Check if we have a request object with body data
    if (!processState.req) {
        console.warn('WEB GET HTTP BODY: No HTTP request context available');
        return '';
    }
    
    // Return the request body
    // In Express.js, the body is available through req.body for parsed data
    // or through req.rawBody for raw string data if configured
    let body = '';
    
    if (processState.req.rawBody !== undefined) {
        // Raw body data (string)
        body = processState.req.rawBody;
    } else if (processState.req.body !== undefined) {
        // Parsed body data (object) - convert to string
        if (typeof processState.req.body === 'string') {
            body = processState.req.body;
        } else if (typeof processState.req.body === 'object') {
            try {
                body = JSON.stringify(processState.req.body);
            } catch (error) {
                body = String(processState.req.body);
            }
        } else {
            body = String(processState.req.body);
        }
    } else if (processState.req.text !== undefined) {
        // Some middleware stores text body here
        body = processState.req.text;
    }
    
    // Store the retrieved body in processState for debugging
    if (!processState.httpRequestData) {
        processState.httpRequestData = {};
    }
    processState.httpRequestData.body = body;
    processState.httpRequestData.bodyRetrievedAt = new Date().toISOString();
    
    return body;
}
