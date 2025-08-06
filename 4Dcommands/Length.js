// This 4D command is fixed and tested.
// This 4D command is fixed and tested.
// 4D command: Length
// Returns the length of a string or array
// Length ( expression ) -> Function result
// Parameter		Type		Description
// expression		String, Array		Expression for which to return the length
// Function result		Longint		Length of the expression

export default function Length(processState, expression) {
    // Handle null/undefined
    if (expression === null || expression === undefined) {
        return 0;
    }
    
    // Handle strings
    if (typeof expression === 'string') {
        return expression.length;
    }
    
    // Handle arrays
    if (Array.isArray(expression)) {
        return expression.length;
    }
    
    // Handle objects (count keys)
    if (typeof expression === 'object') {
        return Object.keys(expression).length;
    }
    
    // Convert to string and get length
    const str = String(expression);
    return str.length;
}