// This 4D command is fixed and tested.
// 4D command: Exp
// Returns e raised to the power of the specified number
// Essential for exponential calculations

export default function(processState) {
    return function Exp(exponent) {
        try {
            if (typeof exponent !== 'number') {
                throw new Error('Exponent must be a number');
            }
            
            const result = Math.exp(exponent);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Exp',
                message: 'Exponential calculated',
                data: { 
                    exponent,
                    result
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Exp',
                message: `Error calculating exponential: ${error.message}`,
                data: { error: error.message, exponent }
            });
            processState.OK = 0;
            return 0;
        }
    };
};