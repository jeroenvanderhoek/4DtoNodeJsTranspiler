// 4D command: JSON Stringify
// Converts an object to its JSON string representation
// JSON Stringify ( object {; space} ) -> Function result
// Parameter		Type		Description
// object		Variant		Object to convert to JSON string
// space		Longint		Number of spaces for indentation (optional)
// Function result		String		JSON string representation

export default function JSON_Stringify(processState, object, space = 0) {
    // Handle null/undefined input
    if (object === null || object === undefined) {
        return 'null';
    }
    
    try {
        return JSON.stringify(object, null, space);
    } catch (error) {
        console.error('JSON Stringify error:', error.message);
        return 'null';
    }
}
