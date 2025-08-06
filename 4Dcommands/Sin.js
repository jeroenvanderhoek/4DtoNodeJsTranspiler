// This 4D command is fixed and tested.
// 4D command: Sin
// Returns the sine of an angle in radians
// Essential for mathematical operations

export default function(processState) {
    return function Sin(radians) {
        try {
            if (typeof radians !== 'number') {
                throw new Error('Input must be a number (radians)');
            }
            
            const result = Math.sin(radians);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Sin',
                message: 'Sine calculated',
                data: { radians, result }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Sin',
                message: `Error calculating sine: ${error.message}`,
                data: { error: error.message, radians }
            });
            processState.OK = 0;
            return 0;
        }
    };
};