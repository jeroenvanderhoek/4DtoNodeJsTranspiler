// 4D command: WEB SEND RAW DATA
// Sends raw HTTP data to the web client
// Based on 4D v20 documentation: Sends raw HTTP response data including headers and body
// WEB SEND RAW DATA ( data {; chunked} )
// Parameter		Type		Description
// data		Blob/String		HTTP data to send (headers + body)
// chunked		Boolean		If true, send data in chunked format (optional)

export default function WEB_SEND_RAW_DATA(processState, data, chunked = false) {
    if (!processState.res) {
        console.warn('WEB SEND RAW DATA: No HTTP response context available');
        return;
    }
    
    if (!data) {
        console.warn('WEB SEND RAW DATA: No data provided to send');
        return;
    }
    
    try {
        let rawData;
        
        // Convert data to string if it's not already
        if (typeof data === 'string') {
            rawData = data;
        } else if (Buffer.isBuffer(data)) {
            rawData = data.toString('utf8');
        } else if (data instanceof ArrayBuffer) {
            rawData = Buffer.from(data).toString('utf8');
        } else {
            rawData = String(data);
        }
        
        // Parse headers and body from raw data
        const parts = rawData.split('\r\n\r\n');
        let headerSection = '';
        let bodySection = '';
        
        if (parts.length >= 2) {
            headerSection = parts[0];
            bodySection = parts.slice(1).join('\r\n\r\n');
        } else {
            // No headers provided, treat entire data as body
            bodySection = rawData;
        }
        
        // Parse headers if provided
        const headers = {};
        if (headerSection) {
            const headerLines = headerSection.split('\r\n');
            
            headerLines.forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const name = line.substring(0, colonIndex).trim();
                    const value = line.substring(colonIndex + 1).trim();
                    headers[name] = value;
                }
            });
        }
        
        // Set chunked transfer encoding if requested
        if (chunked) {
            headers['Transfer-Encoding'] = 'chunked';
        }
        
        // Set default content type if not provided
        if (!headers['Content-Type'] && !headers['content-type']) {
            headers['Content-Type'] = 'text/html; charset=utf-8';
        }
        
        // Set headers on response
        Object.entries(headers).forEach(([name, value]) => {
            try {
                processState.res.setHeader(name, value);
            } catch (error) {
                console.warn(`WEB SEND RAW DATA: Could not set header ${name}: ${error.message}`);
            }
        });
        
        // Send the body
        if (chunked) {
            // For chunked encoding, we'll let Express handle the chunking
            processState.res.write(bodySection);
            processState.res.end();
        } else {
            processState.res.send(bodySection);
        }
        
        // Log the operation
        if (!processState.httpResponseData) {
            processState.httpResponseData = {};
        }
        
        processState.httpResponseData.sentRawData = {
            timestamp: new Date().toISOString(),
            dataLength: rawData.length,
            chunked: chunked,
            headersCount: Object.keys(headers).length,
            headers: headers
        };
        
        console.log(`WEB SEND RAW DATA: Sent ${rawData.length} bytes${chunked ? ' (chunked)' : ''}`);
        
    } catch (error) {
        console.error('WEB SEND RAW DATA error:', error.message);
        
        // Try to send a basic error response if headers haven't been sent
        if (!processState.res.headersSent) {
            try {
                processState.res.status(500).send('Internal Server Error');
            } catch (fallbackError) {
                console.error('WEB SEND RAW DATA: Could not send error response:', fallbackError.message);
            }
        }
    }
}
