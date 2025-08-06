// 4D command: Sum
// Returns the sum of an array of numbers
// Sum ( array ) -> Function result
// Parameter		Type		Description
// array		Array		Array of numbers to sum
// Function result		Real		Sum of the array

export default function Sum(processState, array) {
    // Handle null/undefined
    if (array === null || array === undefined) {
        return 0;
    }
    
    // Handle arrays
    if (Array.isArray(array)) {
        return array.reduce((sum, item) => {
            const num = parseFloat(item);
            return sum + (isNaN(num) ? 0 : num);
        }, 0);
    }
    
    // Handle single numbers
    if (typeof array === 'number') {
        return array;
    }
    
    // Convert to number if possible
    const num = parseFloat(array);
    return isNaN(num) ? 0 : num;
}
