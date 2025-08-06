// This 4D command is fixed and tested.
// 4D command: BLOB to text
// Converts BLOB data to text using specified character encoding
// Essential for reading text data from binary sources

export default function(processState) {
    return function BLOB_to_text(blob, encoding = 'utf8') {
        try {
            let result = '';
            
            if (Buffer.isBuffer(blob)) {
                // Convert Buffer to text with specified encoding
                result = blob.toString(encoding);
            } else if (blob instanceof Uint8Array) {
                // Convert Uint8Array to text
                result = Buffer.from(blob).toString(encoding);
            } else if (typeof blob === 'string') {
                // Already a string, return as is
                result = blob;
            } else if (blob === null || blob === undefined) {
                result = '';
            } else {
                throw new Error('Input must be a Buffer, Uint8Array, or string');
            }
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'BLOB to text',
                message: 'BLOB converted to text',
                data: { 
                    encoding: encoding,
                    inputType: blob ? blob.constructor.name : 'null',
                    outputLength: result.length
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'BLOB to text',
                message: `Error converting BLOB to text: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return '';
        }
    };
};