// This 4D command is fixed and tested.
// 4D command: Milliseconds
// Returns the number of milliseconds elapsed since machine startup
// Based on 4D v20 documentation: Used for precise timing and performance measurement
// Essential for backend performance monitoring and timing operations
// Milliseconds -> Function result
// Function result    Longint    <-    Number of milliseconds elapsed since startup

export default function Milliseconds(processState) {
    try {
        // Get high resolution time since Node.js process started
        // This provides precise timing for performance measurement
        const [seconds, nanoseconds] = process.hrtime();
        const milliseconds = Math.floor(seconds * 1000 + nanoseconds / 1000000);

        // For more compatibility with 4D behavior, we can also use uptime
        const uptimeMs = Math.floor(process.uptime() * 1000);

        // Store timing information in processState for performance tracking
        if (!processState.performance) {
            processState.performance = {
                measurements: [],
                startTime: Date.now()
            };
        }

        processState.performance.measurements.push({
            timestamp: Date.now(),
            hrTime: milliseconds,
            uptime: uptimeMs
        });

        // Keep only the last 100 measurements to prevent memory bloat
        if (processState.performance.measurements.length > 100) {
            processState.performance.measurements = processState.performance.measurements.slice(-100);
        }

        // Log timing request for debugging (but only occasionally to avoid spam)
        if (processState.logs && Math.random() < 0.1) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Milliseconds',
                message: `High resolution time: ${milliseconds}ms, uptime: ${uptimeMs}ms`,
                data: { hrTime: milliseconds, uptime: uptimeMs }
            });
        }

        // Return uptime in milliseconds (more similar to 4D behavior)
        return uptimeMs;

    } catch (error) {
        console.error('Milliseconds error:', error.message);
        
        // Log the error
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Milliseconds',
                message: `Failed to get milliseconds: ${error.message}`,
                data: { error: error.message }
            });
        }

        // Return fallback using Date.now() - start time if available
        const fallback = processState.performance?.startTime ? 
            Date.now() - processState.performance.startTime : 
            Date.now();
        
        return fallback;
    }
}