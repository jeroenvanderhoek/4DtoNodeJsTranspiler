// 4D command: WEB SEND BLOB
// Sends binary data (BLOB) to the web client
// Based on 4D v20 documentation: Sends binary data with specified MIME type to browser
// WEB SEND BLOB ( blob ; mimeType )
// Parameter		Type		Description
// blob		Blob/Buffer		Binary data to send
// mimeType		String		MIME type of the data

export default function WEB_SEND_BLOB(processState, blob, mimeType) {
    if (!processState.res) {
        console.warn('WEB SEND BLOB: No HTTP response context available');
        return;
    }
    
    if (!blob) {
        console.warn('WEB SEND BLOB: No blob data provided');
        return;
    }
    
    try {
        let binaryData;
        
        // Convert various data types to Buffer
        if (Buffer.isBuffer(blob)) {
            binaryData = blob;
        } else if (blob instanceof ArrayBuffer) {
            binaryData = Buffer.from(blob);
        } else if (blob instanceof Uint8Array) {
            binaryData = Buffer.from(blob);
        } else if (typeof blob === 'string') {
            // If it's a string, assume it's base64 encoded or treat as binary
            try {
                binaryData = Buffer.from(blob, 'base64');
            } catch (error) {
                binaryData = Buffer.from(blob, 'utf8');
            }
        } else {
            // Try to convert to string then to buffer
            binaryData = Buffer.from(String(blob), 'utf8');
        }
        
        // Set MIME type
        const contentType = mimeType || 'application/octet-stream';
        processState.res.setHeader('Content-Type', contentType);
        
        // Set content length
        processState.res.setHeader('Content-Length', binaryData.length);
        
        // Set additional headers for binary content
        processState.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        processState.res.setHeader('Pragma', 'no-cache');
        processState.res.setHeader('Expires', '0');
        
        // Send the binary data
        processState.res.send(binaryData);
        
        // Log the operation
        if (!processState.httpResponseData) {
            processState.httpResponseData = {};
        }
        
        processState.httpResponseData.sentBlob = {
            timestamp: new Date().toISOString(),
            dataSize: binaryData.length,
            mimeType: contentType,
            dataType: typeof blob
        };
        
        console.log(`WEB SEND BLOB: Sent ${binaryData.length} bytes as ${contentType}`);
        
    } catch (error) {
        console.error('WEB SEND BLOB error:', error.message);
        
        // Try to send an error response if headers haven't been sent
        if (!processState.res.headersSent) {
            try {
                processState.res.status(500).send('Error sending binary data');
            } catch (fallbackError) {
                console.error('WEB SEND BLOB: Could not send error response:', fallbackError.message);
            }
        }
    }
}
