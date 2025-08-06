// This 4D command is fixed and tested.
// 4D command: ARRAY TO COLLECTION
// Converts an array to a collection
// Based on 4D v20 documentation: Converts an array to a collection object
// ARRAY TO COLLECTION ( array ; collection )
// Parameter		Type		Description
// array		Array		Array to convert
// collection		Collection		Collection to store the converted array

export default function ARRAY_TO_COLLECTION(processState, array, collection) {
    try {
        // Validate inputs
        if (!Array.isArray(array)) {
            console.warn('ARRAY TO COLLECTION: Parameter must be an array');
            return false;
        }

        // Initialize collections if not exists
        if (!processState.collections) {
            processState.collections = new Map();
        }

        // Create collection from array
        const newCollection = new Map();
        array.forEach((item, index) => {
            newCollection.set(index, item);
        });

        // Store collection in processState
        processState.collections.set(collection, newCollection);

        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'ARRAY TO COLLECTION',
                message: `Array converted to collection: ${collection}`,
                data: {
                    arrayLength: array.length,
                    collectionName: collection,
                    collectionSize: newCollection.size
                }
            });
        }

        return true;

    } catch (error) {
        console.error(`ARRAY TO COLLECTION error: ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'ARRAY TO COLLECTION',
                message: `Error converting array to collection: ${error.message}`,
                data: { error: error.message, stack: error.stack }
            });
        }
        return false;
    }
}
