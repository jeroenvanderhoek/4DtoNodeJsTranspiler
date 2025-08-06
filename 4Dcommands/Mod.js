// This 4D command is fixed and tested.
// 4D command: Mod
// Returns the modulo (remainder) of division
// Essential for mathematical operations

export default function(processState) {
    return function Mod(dividend, divisor) {
        try {
            if (divisor === 0) {
                throw new Error('Division by zero');
            }
            
            const result = dividend % divisor;
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Mod',
                message: 'Modulo calculated',
                data: { 
                    dividend,
                    divisor,
                    result
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Mod',
                message: `Error calculating modulo: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return 0;
        }
    };
};