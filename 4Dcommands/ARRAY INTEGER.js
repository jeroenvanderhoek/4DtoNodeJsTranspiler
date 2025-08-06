// 4D command: ARRAY INTEGER
// Creates or resizes an integer array with specified number of elements
// Based on 4D v20 documentation: Creates a one or two-dimensional array for storing integer values
// ARRAY INTEGER ( arrayName ; size {; size2} )
// arrayName   Array    ->    Name of the array to create/resize
// size        Integer  ->    Number of elements in the array (or rows for 2D)
// size2       Integer  ->    Optional: Number of columns for 2D array

export default function ARRAY_INTEGER(processState, arrayName, size1, size2 = null) {
    try {
        // Validate parameters
        if (typeof size1 !== 'number' || size1 < 0) {
            console.error('ARRAY INTEGER: Size must be a non-negative number');
            return null;
        }

        let newArray;

        if (size2 !== null) {
            // Create 2D array
            if (typeof size2 !== 'number' || size2 < 0) {
                console.error('ARRAY INTEGER: Second dimension size must be a non-negative number');
                return null;
            }
            
            newArray = [];
            for (let i = 0; i < size1; i++) {
                newArray[i] = new Array(size2).fill(0);
            }
        } else {
            // Create 1D array
            newArray = new Array(size1).fill(0);
        }

        // Store array reference in processState for persistence
        if (!processState.arrays) {
            processState.arrays = {};
        }
        processState.arrays[arrayName] = newArray;

        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'ARRAY INTEGER',
                message: `Created integer array '${arrayName}' with ${size1}${size2 ? ` x ${size2}` : ''} elements`,
                data: { 
                    arrayName,
                    size1,
                    size2,
                    is2D: size2 !== null,
                    totalElements: size2 !== null ? size1 * size2 : size1
                }
            });
        }

        return newArray;

    } catch (error) {
        console.error('ARRAY INTEGER error:', error.message);
        
        // Log the error
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'ARRAY INTEGER',
                message: `Failed to create integer array '${arrayName}': ${error.message}`,
                data: { error: error.message }
            });
        }

        return null;
    }
}