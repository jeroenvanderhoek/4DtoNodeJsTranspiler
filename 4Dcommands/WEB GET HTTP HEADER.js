// 4D command: WEB GET HTTP HEADER
// Returns the value of an HTTP header from the current web request
// WEB GET HTTP HEADER ( headerName ) -> Function result
// Parameter		Type		Description
// headerName		String		Name of the HTTP header to retrieve
// Function result		String		Value of the HTTP header

export default function WEB_GET_HTTP_HEADER(processState, headerName) {
    // Check if we have a current request
    if (!processState.req || !processState.req.headers) {
        return '';
    }
    
    // Get the header value (case-insensitive)
    const headerValue = processState.req.headers[headerName.toLowerCase()];
    
    // Return the header value or empty string if not found
    return headerValue || '';
}
