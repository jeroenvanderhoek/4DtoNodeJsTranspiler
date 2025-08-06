// This 4D command is fixed and tested.
// This 4D command is fixed and tested.
// 4D command: String
// Converts an expression to its string representation
// String ( expression {; format {; addTime}} ) -> Function result
// Parameter		Type		Description
// expression		Expression		Expression to convert to string (Real, Integer, Long Integer, Date, Time String, Text, Boolean, Undefined, or Null)
// format		String, Longint		Display format (optional)
// addTime		Time		Time to add if expression is a date (optional)
// Function result		String		String form of the expression

export default function String(processState, value, format, addTime) {
    // Handle null/undefined values
    if (value === null || value === undefined) {
        return '';
    }
    
    // Handle boolean values
    if (typeof value === 'boolean') {
        return value ? 'True' : 'False';
    }
    
    // Handle numbers
    if (typeof value === 'number') {
        // Apply format if provided
        if (format !== undefined) {
            // Basic number formatting - can be extended
            if (typeof format === 'string') {
                return value.toFixed(parseInt(format) || 0);
            }
        }
        return value.toString();
    }
    
    // Handle strings
    if (typeof value === 'string') {
        return value;
    }
    
    // Handle dates
    if (value instanceof Date) {
        let dateStr = value.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Add time if requested
        if (addTime !== undefined) {
            const timeStr = value.toTimeString().split(' ')[0]; // HH:MM:SS format
            dateStr += ' ' + timeStr;
        }
        
        return dateStr;
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
        return value.map(item => String(processState, item)).join(', ');
    }
    
    // Handle objects
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return '[Object]';
        }
    }
    
    // Default: convert to string using toString method
    return value.toString();
}