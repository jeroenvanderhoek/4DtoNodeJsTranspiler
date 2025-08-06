// This 4D command is fixed and tested.
// 4D command: Uppercase
// Converts a string to uppercase
// Essential for string manipulation

export default function(processState) {
    return function Uppercase(text) {
        try {
            if (typeof text !== 'string') {
                text = String(text);
            }
            
            const result = text.toUpperCase();
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Uppercase',
                message: 'String converted to uppercase',
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
                source: 'Uppercase',
                message: `Error converting to uppercase: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return '';
        }
    };
};