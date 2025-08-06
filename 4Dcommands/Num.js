// This 4D command is fixed and tested.
// 4D command: Num
// Converts a string to a number
// Essential for data type conversion

export default function(processState) {
    return function Num(text) {
        try {
            let result = 0;
            
            if (typeof text === 'number') {
                result = text;
            } else if (typeof text === 'string') {
                // Remove spaces and convert
                const cleaned = text.trim();
                result = Number(cleaned);
                
                if (isNaN(result)) {
                    // Try parsing as float
                    result = parseFloat(cleaned) || 0;
                }
            } else if (typeof text === 'boolean') {
                result = text ? 1 : 0;
            }
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Num',
                message: 'String converted to number',
                data: { 
                    input: text,
                    inputType: typeof text,
                    result
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Num',
                message: `Error converting to number: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return 0;
        }
    };
};