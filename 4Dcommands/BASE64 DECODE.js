// This 4D command is fixed and tested.
// 4D command: BASE64 DECODE
// Decodes Base64 encoded data back to its original format
// Essential for decoding data received from web services and APIs

export default function(processState) {
    return function BASE64_DECODE(encoded, decoded) {
        try {
            if (typeof encoded !== 'string') {
                throw new Error('Input must be a Base64 encoded string');
            }
            
            // Decode Base64 to Buffer
            const buffer = Buffer.from(encoded, 'base64');
            
            // Convert to string (UTF-8 by default)
            const result = buffer.toString('utf8');
            
            // If decoded parameter is provided, it's a reference to store the result
            if (decoded !== undefined && typeof decoded === 'object') {
                decoded.value = result;
                decoded.buffer = buffer; // Also store the raw buffer
            }
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'BASE64 DECODE',
                message: 'Base64 data decoded',
                data: { 
                    inputLength: encoded.length,
                    outputLength: result.length,
                    bufferSize: buffer.length
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'BASE64 DECODE',
                message: `Error decoding Base64: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return '';
        }
    };
};