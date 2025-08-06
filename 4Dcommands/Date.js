// This 4D command is fixed and tested.
// 4D command: Date
// Converts a string to a date or creates a date from components
// Essential for date handling in backend operations

export default function(processState) {
    return function Date_4D(input) {
        try {
            let result;
            
            if (typeof input === 'string') {
                // Parse date string (supports various formats)
                result = new Date(input);
                if (isNaN(result)) {
                    // Try 4D format: DD/MM/YYYY or MM/DD/YYYY
                    const parts = input.split('/');
                    if (parts.length === 3) {
                        // Assume DD/MM/YYYY format for 4D compatibility
                        result = new Date(parts[2], parts[1] - 1, parts[0]);
                    }
                }
            } else if (input instanceof Date) {
                result = input;
            } else if (typeof input === 'number') {
                // Timestamp
                result = new Date(input);
            } else {
                result = new Date();
            }
            
            if (isNaN(result)) {
                throw new Error('Invalid date input');
            }
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Date',
                message: 'Date created/converted',
                data: { 
                    input: input,
                    result: result.toISOString()
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Date',
                message: `Error creating date: ${error.message}`,
                data: { error: error.message, input }
            });
            processState.OK = 0;
            return new Date(0); // Return epoch on error
        }
    };
};