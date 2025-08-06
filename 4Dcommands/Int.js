// This 4D command is fixed and tested.
// 4D command: Int
// Returns the integer part of a number
// Essential for mathematical operations

export default function(processState) {
    return function Int(number) {
        try {
            if (typeof number !== 'number') {
                // Try to convert to number
                number = Number(number);
                if (isNaN(number)) {
                    throw new Error('Input must be a number');
                }
            }
            
            // Get integer part (truncate towards zero)
            const result = Math.trunc(number);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Int',
                message: 'Integer part extracted',
                data: { 
                    input: number,
                    integerPart: result
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Int',
                message: `Error extracting integer part: ${error.message}`,
                data: { error: error.message, number }
            });
            processState.OK = 0;
            return 0;
        }
    };
};