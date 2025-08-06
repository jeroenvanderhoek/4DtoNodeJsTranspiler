// This 4D command is fixed and tested.
// 4D command: APPEND TO ARRAY
// Appends a value to the end of an array
// Based on 4D v20 documentation: Adds an element to the end of an array
// APPEND TO ARRAY ( array ; value )
// Parameter		Type		Description
// array		Array		Array to which an element will be appended
// value		Expression		Value to append

export default function APPEND_TO_ARRAY(processState, array, value) {
    try {
        // Validate inputs
        if (!Array.isArray(array)) {
            console.warn('APPEND TO ARRAY: Parameter must be an array');
            return 0;
        }

        // Append value to array
        const newLength = array.push(value);

        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'APPEND TO ARRAY',
                message: `Appended value to array`,
                data: {
                    value: value,
                    newLength: newLength,
                    arrayType: typeof array
                }
            });
        }

        return newLength;

    } catch (error) {
        console.error(`APPEND TO ARRAY error: ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'APPEND TO ARRAY',
                message: `Error appending to array: ${error.message}`,
                data: { error: error.message, stack: error.stack }
            });
        }
        return 0;
    }
}