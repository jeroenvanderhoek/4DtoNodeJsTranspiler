// This 4D command is fixed and tested.
// 4D command: Substring
// Extracts a substring from a string
// Essential for string manipulation

export default function(processState) {
    return function Substring(source, startPos, length) {
        try {
            if (typeof source !== 'string') {
                source = String(source);
            }
            
            // Convert 4D 1-based index to JavaScript 0-based
            const start = Math.max(0, startPos - 1);
            
            let result;
            if (length === undefined) {
                // From start to end
                result = source.substring(start);
            } else {
                // Specific length
                result = source.substr(start, length);
            }
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Substring',
                message: 'Substring extracted',
                data: { 
                    sourceLength: source.length,
                    startPos,
                    length,
                    resultLength: result.length
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Substring',
                message: `Error extracting substring: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return '';
        }
    };
};