// 4D command: Log
// Logs a message to the console
// Log ( message {; ...} )
// Parameter		Type		Description
// message		String		Message to log
// ...		Variant		Additional values to log (optional)

export default function Log(processState, ...args) {
    // Convert all arguments to strings and join them
    const message = args.map(arg => {
        if (arg === null || arg === undefined) {
            return '';
        }
        if (typeof arg === 'object') {
            try {
                return JSON.stringify(arg);
            } catch (e) {
                return '[Object]';
            }
        }
        return String(arg);
    }).join(' ');
    
    // Log to console
    console.log(message);
    
    // Store in processState for potential retrieval
    if (!processState.logs) {
        processState.logs = [];
    }
    
    processState.logs.push({
        timestamp: new Date().toISOString(),
        message,
        args
    });
}
