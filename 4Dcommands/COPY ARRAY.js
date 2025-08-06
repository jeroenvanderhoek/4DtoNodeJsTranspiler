// 4D command: COPY ARRAY
// Copies the contents of one array to another array
// Based on 4D v20 documentation: Allows copying array elements from source to destination array
// Unlike variable assignment, arrays cannot be directly assigned - COPY ARRAY is required
// COPY ARRAY ( source ; destination {; size} )
// source     Array    ->    Source array to copy from
// destination Array   ->    Destination array to copy to  
// size       Integer  ->    Optional: Number of elements to copy

export default function COPY_ARRAY(processState, sourceArray, destinationArray, copySize = null) {
    try {
        // Validate input parameters
        if (!Array.isArray(sourceArray)) {
            console.error('COPY ARRAY: Source must be an array');
            return;
        }

        // Determine copy size
        let elementsToCopy = copySize !== null ? copySize : sourceArray.length;
        
        // Ensure we don't copy more elements than exist in source
        if (elementsToCopy > sourceArray.length) {
            elementsToCopy = sourceArray.length;
        }

        // Clear destination array and copy elements
        destinationArray.length = 0;
        
        for (let i = 0; i < elementsToCopy; i++) {
            // Deep copy objects/arrays, shallow copy primitives
            if (sourceArray[i] && typeof sourceArray[i] === 'object') {
                if (Array.isArray(sourceArray[i])) {
                    destinationArray[i] = [...sourceArray[i]];
                } else {
                    destinationArray[i] = { ...sourceArray[i] };
                }
            } else {
                destinationArray[i] = sourceArray[i];
            }
        }

        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO', 
                source: 'COPY ARRAY',
                message: `Copied ${elementsToCopy} elements from source array to destination array`,
                data: { 
                    sourceLength: sourceArray.length,
                    destinationLength: destinationArray.length,
                    copiedElements: elementsToCopy
                }
            });
        }

    } catch (error) {
        console.error('COPY ARRAY error:', error.message);
        
        // Log the error
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'COPY ARRAY',
                message: `Failed to copy array: ${error.message}`,
                data: { error: error.message }
            });
        }
    }
}