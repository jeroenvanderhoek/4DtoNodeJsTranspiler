// This 4D command is fixed and tested.
// 4D command: Tan
// Returns the tangent of an angle in radians
// Essential for mathematical operations

export default function(processState) {
    return function Tan(radians) {
        try {
            if (typeof radians !== 'number') {
                throw new Error('Input must be a number (radians)');
            }
            
            const result = Math.tan(radians);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Tan',
                message: 'Tangent calculated',
                data: { radians, result }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Tan',
                message: `Error calculating tangent: ${error.message}`,
                data: { error: error.message, radians }
            });
            processState.OK = 0;
            return 0;
        }
    };
};