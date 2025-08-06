// This 4D command is fixed and tested.
// 4D command: Sqrt
// Returns the square root of a number
// Essential for mathematical operations

export default function(processState) {
    return function Sqrt(number) {
        try {
            if (typeof number !== 'number') {
                number = Number(number);
                if (isNaN(number)) {
                    throw new Error('Input must be a number');
                }
            }
            
            if (number < 0) {
                throw new Error('Cannot calculate square root of negative number');
            }
            
            const result = Math.sqrt(number);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Sqrt',
                message: 'Square root calculated',
                data: { 
                    input: number,
                    result
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Sqrt',
                message: `Error calculating square root: ${error.message}`,
                data: { error: error.message, number }
            });
            processState.OK = 0;
            return 0;
        }
    };
};