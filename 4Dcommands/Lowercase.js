// This 4D command is fixed and tested.
// 4D command: Lowercase
// Converts a string to lowercase
// Essential for string manipulation in backend

export default function(processState) {
    return function Lowercase(text) {
        try {
            if (typeof text !== 'string') {
                text = String(text);
            }
            
            const result = text.toLowerCase();
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Lowercase',
                message: 'String converted to lowercase',
                data: { 
                    originalLength: text.length,
                    resultLength: result.length
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Lowercase',
                message: `Error converting to lowercase: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return '';
        }
    };
};