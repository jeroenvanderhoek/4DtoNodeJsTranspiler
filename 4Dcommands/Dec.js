// This 4D command is fixed and tested.
// 4D command: Dec
// Returns the decimal part of a number
// Essential for mathematical calculations

export default function(processState) {
    return function Dec(number) {
        try {
            if (typeof number !== 'number') {
                throw new Error('Input must be a number');
            }
            
            // Get decimal part
            const result = number - Math.floor(number);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Dec',
                message: 'Decimal part extracted',
                data: { 
                    input: number,
                    decimalPart: result
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Dec',
                message: `Error extracting decimal part: ${error.message}`,
                data: { error: error.message, number }
            });
            processState.OK = 0;
            return 0;
        }
    };
};