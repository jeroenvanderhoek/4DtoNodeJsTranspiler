// This 4D command is fixed and tested.
// 4D command: After
// Executes a method after a specified delay in ticks (1 tick = 1/60 second)
// In Node.js, we simulate this with setTimeout

export default function(processState) {
    return function After(method, delay, processNumber = 0) {
        try {
            // Validate inputs
            if (typeof method !== 'function' && typeof method !== 'string') {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'ERROR',
                    source: 'After',
                    message: 'Invalid method parameter',
                    data: { method, delay, processNumber }
                });
                processState.OK = 0;
                return;
            }

            // Convert ticks to milliseconds (1 tick = 1/60 second = ~16.67ms)
            const delayMs = Math.round(delay * (1000 / 60));

            // Log the scheduling
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'After',
                message: `Scheduling method execution after ${delay} ticks (${delayMs}ms)`,
                data: { method: typeof method === 'function' ? 'function' : method, delay, delayMs, processNumber }
            });

            // Schedule the execution
            setTimeout(() => {
                try {
                    if (typeof method === 'function') {
                        // Direct function execution
                        method(processState);
                    } else if (typeof method === 'string') {
                        // Method name - try to execute from global scope or processState
                        if (processState.methods && processState.methods[method]) {
                            processState.methods[method](processState);
                        } else if (global[method]) {
                            global[method](processState);
                        } else {
                            processState.logs.push({
                                timestamp: new Date().toISOString(),
                                level: 'WARNING',
                                source: 'After',
                                message: `Method '${method}' not found`,
                                data: { method }
                            });
                        }
                    }

                    processState.logs.push({
                        timestamp: new Date().toISOString(),
                        level: 'INFO',
                        source: 'After',
                        message: 'Delayed method executed successfully',
                        data: { method: typeof method === 'function' ? 'function' : method }
                    });
                } catch (execError) {
                    processState.logs.push({
                        timestamp: new Date().toISOString(),
                        level: 'ERROR',
                        source: 'After',
                        message: 'Error executing delayed method',
                        data: { error: execError.message, method: typeof method === 'function' ? 'function' : method }
                    });
                }
            }, delayMs);

            processState.OK = 1;
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'After',
                message: 'Error in After command',
                data: { error: error.message }
            });
            processState.OK = 0;
        }
    };
};