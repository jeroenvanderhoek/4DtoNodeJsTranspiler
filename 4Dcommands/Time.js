// This 4D command is fixed and tested.
// 4D command: Time
// Converts a string to a time value or returns current time
// Essential for time operations

export default function(processState) {
    return function Time(timeString) {
        try {
            let result;
            
            if (!timeString) {
                // Return current time as seconds since midnight
                const now = new Date();
                result = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            } else if (typeof timeString === 'string') {
                // Parse time string (HH:MM:SS format)
                const parts = timeString.split(':');
                if (parts.length >= 2) {
                    const hours = parseInt(parts[0]) || 0;
                    const minutes = parseInt(parts[1]) || 0;
                    const seconds = parts[2] ? parseInt(parts[2]) : 0;
                    result = hours * 3600 + minutes * 60 + seconds;
                } else {
                    result = 0;
                }
            } else if (typeof timeString === 'number') {
                result = timeString;
            } else {
                result = 0;
            }
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Time',
                message: 'Time value calculated',
                data: { 
                    input: timeString,
                    result,
                    formatted: `${Math.floor(result/3600)}:${Math.floor((result%3600)/60).toString().padStart(2,'0')}:${(result%60).toString().padStart(2,'0')}`
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Time',
                message: `Error processing time: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return 0;
        }
    };
};