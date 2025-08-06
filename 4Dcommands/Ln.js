// 4D command: Ln
// Calculates the natural logarithm (base e) of a number
// Ln ( number ) -> Function result
// Parameter		Type		Description
// number		Real		Number for which to calculate the natural logarithm
// Function result		Real		Natural logarithm of the number

export default function Ln(processState, number) {
    // Handle null/undefined input
    if (number === null || number === undefined) {
        return Number.NEGATIVE_INFINITY;
    }
    
    // Convert to number if not already
    const num = parseFloat(number);
    if (isNaN(num)) {
        return Number.NaN;
    }
    
    // Handle negative numbers and zero
    if (num <= 0) {
        return Number.NEGATIVE_INFINITY;
    }
    
    // Return natural logarithm
    return Math.log(num);
}