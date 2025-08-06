// This 4D command is fixed and tested.
// 4D command: Cos
// Returns the cosine of an angle expressed in radians
// Essential for mathematical calculations in backend processing

export default function(processState) {
    return function Cos(radians) {
        try {
            if (typeof radians !== 'number') {
                throw new Error('Input must be a number (radians)');
            }
            
            const result = Math.cos(radians);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Cos',
                message: 'Cosine calculated',
                data: { radians, result }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Cos',
                message: `Error calculating cosine: ${error.message}`,
                data: { error: error.message, radians }
            });
            processState.OK = 0;
            return 0;
        }
    };
};