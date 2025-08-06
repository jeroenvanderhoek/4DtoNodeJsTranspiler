// This 4D command is fixed and tested.
// This 4D command is fixed and tested.
// 4D command: Arctan
// Returns the arctangent (inverse tangent) of a number
// Arctan ( number ) -> Function result
// Parameter		Type		Description
// number		Real		Number for which to return the arctangent
// Function result		Real		Arctangent of the number (in radians)

export default function Arctan(processState, value) {
    // Handle different input types
    if (typeof value === 'number') {
        return Math.atan(value);
    }
    
    // Convert string to number if possible
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
        return Math.atan(numValue);
    }
    
    // Return 0 for invalid inputs
    return 0;
}