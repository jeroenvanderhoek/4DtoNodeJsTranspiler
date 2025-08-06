// 4D command: JSON Parse
// Parses a JSON string and returns the corresponding object
// JSON Parse ( jsonString ) -> Function result
// Parameter		Type		Description
// jsonString		String		JSON string to parse
// Function result		Variant		Parsed JSON object

export default function JSON_Parse(processState, jsonString) {
    // Handle null/undefined input
    if (jsonString === null || jsonString === undefined) {
        return null;
    }
    
    // Convert to string if needed
    const str = String(jsonString);
    
    try {
        return JSON.parse(str);
    } catch (error) {
        console.error('JSON Parse error:', error.message);
        return null;
    }
}