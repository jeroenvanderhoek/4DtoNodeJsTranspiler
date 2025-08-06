// This 4D command is fixed and tested.
// 4D command: BASE64 ENCODE
// Encodes text or blob data to Base64 format
// Essential for encoding binary data for transmission over text-based protocols

export default function(processState) {
    return function BASE64_ENCODE(input, encoded) {
        try {
            let result = '';
            
            if (typeof input === 'string') {
                // Encode string to Base64
                result = Buffer.from(input, 'utf8').toString('base64');
            } else if (Buffer.isBuffer(input)) {
                // Encode buffer to Base64
                result = input.toString('base64');
            } else if (input instanceof Uint8Array) {
                // Encode Uint8Array to Base64
                result = Buffer.from(input).toString('base64');
            } else {
                throw new Error('Input must be a string, Buffer, or Uint8Array');
            }
            
            // If encoded parameter is provided, it's a reference to store the result
            if (encoded !== undefined && typeof encoded === 'object') {
                encoded.value = result;
            }
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'BASE64 ENCODE',
                message: 'Data encoded to Base64',
                data: { 
                    inputLength: typeof input === 'string' ? input.length : input.byteLength,
                    outputLength: result.length 
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'BASE64 ENCODE',
                message: `Error encoding to Base64: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return '';
        }
    };
};