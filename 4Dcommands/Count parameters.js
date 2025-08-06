// This 4D command is fixed and tested.
// 4D command: Count parameters
// Returns the number of parameters passed to the current method
// Essential for handling variable parameter methods

export default function(processState) {
    return function Count_parameters() {
        try {
            // In 4D context, this would count the actual method parameters
            // In our implementation, we check the arguments passed to the parent function
            // This is typically stored in processState during method invocation
            let count = 0;
            
            if (processState.currentMethodParameters) {
                count = processState.currentMethodParameters.length;
            } else if (processState.methodContext && processState.methodContext.parameters) {
                count = processState.methodContext.parameters.length;
            }
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Count parameters',
                message: 'Parameter count retrieved',
                data: { count }
            });
            
            processState.OK = 1;
            return count;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Count parameters',
                message: `Error counting parameters: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return 0;
        }
    };
};