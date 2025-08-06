// This 4D command is fixed and tested.
// 4D command: Not
// Returns the logical negation of a boolean expression

export default function(processState) {
    return function Not(expression) {
        try {
            // Convert to boolean and negate
            const result = !Boolean(expression);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Not',
                message: 'Logical NOT operation',
                data: { input: expression, result }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Not',
                message: 'Error in Not command',
                data: { error: error.message }
            });
            processState.OK = 0;
            return false;
        }
    };
};