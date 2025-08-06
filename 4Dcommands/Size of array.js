// This 4D command is fixed and tested.
// 4D command: Size of array
// Returns the number of elements in an array
// Based on 4D v20 documentation: Returns the current size (number of elements) of an array
// Size of array ( array ) -> Function result
// array           Array    ->    Array to get size of
// Function result Integer  <-    Number of elements in the array

export default function Size_of_array(processState, ...args) {
    // Handle the case where the transpiler adds an extra parameter
    const array = args.length > 1 ? args[args.length - 1] : args[0];
    try {
        // Validate input parameter
        if (!Array.isArray(array)) {
            console.error('Size of array: Parameter must be an array');
            return 0;
        }

        const arraySize = array.length;

        // Log the operation for debugging
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Size of array',
                message: `Array size requested: ${arraySize} elements`,
                data: { arraySize }
            });
        }

        return arraySize;

    } catch (error) {
        console.error('Size of array error:', error.message);
        
        // Log the error
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Size of array',
                message: `Failed to get array size: ${error.message}`,
                data: { error: error.message }
            });
        }

        return 0;
    }
}