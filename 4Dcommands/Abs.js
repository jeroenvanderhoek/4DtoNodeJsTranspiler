// This 4D command is fixed and tested.
// 4D command: Abs
// Returns the absolute value of a number
// Abs ( number ) -> Function result
// Parameter		Type		Description
// number		Real		Number for which to return the absolute value
// Function result		Real		Absolute value of the number

export default function Abs(processState, number) {
    // Handle different input types
    if (typeof number === 'number') {
        return Math.abs(number);
    }
    
    // Convert string to number if possible
    const numValue = parseFloat(number);
    if (!isNaN(numValue)) {
        return Math.abs(numValue);
    }
    
    // Return 0 for invalid inputs
    return 0;
}