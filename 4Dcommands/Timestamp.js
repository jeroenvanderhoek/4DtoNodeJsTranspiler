// 4D command: Timestamp
// Returns the current UTC time in ISO format with milliseconds
// Based on 4D v20 documentation: Returns current time in ISO 8601 format (yyyy-MM-ddTHH:mm:ss.SSSZ)
// Essential for backend server logging and precise timing in distributed systems
// Timestamp -> Function result
// Function result    String    <-    Current time in ISO format with milliseconds

export default function Timestamp(processState) {
    try {
        // Get current UTC time and format as ISO 8601 with milliseconds
        // Format: yyyy-MM-ddTHH:mm:ss.SSSZ (Z indicates GMT/UTC timezone)
        const timestamp = new Date().toISOString();

        // Log the timestamp request for debugging
        if (processState.logs) {
            processState.logs.push({
                timestamp: timestamp,
                level: 'INFO',
                source: 'Timestamp',
                message: `Timestamp generated: ${timestamp}`,
                data: { timestamp }
            });
        }

        return timestamp;

    } catch (error) {
        console.error('Timestamp error:', error.message);
        
        // Log the error
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Timestamp',
                message: `Failed to generate timestamp: ${error.message}`,
                data: { error: error.message }
            });
        }

        // Return a fallback timestamp
        return new Date().toISOString();
    }
}