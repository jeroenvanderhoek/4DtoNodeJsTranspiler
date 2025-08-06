// 4D command: WEB SET HTTP HEADER
// Sets an HTTP header for the current web response
// WEB SET HTTP HEADER ( headerName ; headerValue )
// Parameter		Type		Description
// headerName		String		Name of the HTTP header to set
// headerValue		String		Value of the HTTP header

export default function WEB_SET_HTTP_HEADER(processState, headerName, headerValue) {
    // Check if we have a current response
    if (!processState.res) {
        console.warn('WEB SET HTTP HEADER: No response object available');
        return;
    }
    
    // Set the header
    processState.res.setHeader(headerName, headerValue);
}
