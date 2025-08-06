// This 4D command is fixed and tested.
// 4D command: ADD TO SET
// Adds a value to a set (collection of unique values)
// Based on 4D v20 documentation: Adds an element to a set, maintaining uniqueness
// ADD TO SET ( set ; element )
// Parameter		Type		Description
// set		Set		Set to add element to
// element		Variant		Element to add to the set

export default function ADD_TO_SET(processState, set, element) {
    try {
        // Validate inputs
        if (!set) {
            console.warn('ADD TO SET: No set specified');
            return false;
        }

        // Initialize set if it doesn't exist
        if (!processState.sets) {
            processState.sets = new Map();
        }

        // Get or create the set
        if (!processState.sets.has(set)) {
            processState.sets.set(set, new Set());
        }

        const targetSet = processState.sets.get(set);
        
        // Add element to set (Set automatically handles uniqueness)
        targetSet.add(element);

        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'ADD TO SET',
                message: `Added element to set: ${set}`,
                data: {
                    set: set,
                    element: element,
                    setSize: targetSet.size
                }
            });
        }

        return true;

    } catch (error) {
        console.error(`ADD TO SET error: ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'ADD TO SET',
                message: `Error adding to set: ${error.message}`,
                data: { error: error.message, stack: error.stack }
            });
        }
        return false;
    }
}
