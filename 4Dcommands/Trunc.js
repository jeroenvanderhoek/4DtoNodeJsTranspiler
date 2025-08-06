// This 4D command is fixed and tested.
// 4D command: Trunc
// Truncates a number to the specified number of decimal places
// Essential for mathematical operations

export default function(processState) {
    return function Trunc(number, places = 0) {
        try {
            if (typeof number !== 'number') {
                number = Number(number);
                if (isNaN(number)) {
                    throw new Error('First parameter must be a number');
                }
            }
            
            const multiplier = Math.pow(10, places);
            const result = Math.trunc(number * multiplier) / multiplier;
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Trunc',
                message: 'Number truncated',
                data: { 
                    input: number,
                    places,
                    result
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Trunc',
                message: `Error truncating number: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return 0;
        }
    };
};