// 4D command: Average
// Returns the average of an array of numbers
// Average ( array ) -> Function result
// Parameter		Type		Description
// array		Array		Array of numbers to average
// Function result		Real		Average of the array

export default function Average(processState, array) {
    // Handle null/undefined
    if (array === null || array === undefined) {
        return 0;
    }
    
    // Handle arrays
    if (Array.isArray(array)) {
        const validNumbers = array.filter(item => {
            const num = parseFloat(item);
            return !isNaN(num);
        });
        
        if (validNumbers.length === 0) {
            return 0;
        }
        
        const sum = validNumbers.reduce((total, item) => total + parseFloat(item), 0);
        return sum / validNumbers.length;
    }
    
    // Handle single numbers
    if (typeof array === 'number') {
        return array;
    }
    
    // Convert to number if possible
    const num = parseFloat(array);
    return isNaN(num) ? 0 : num;
}
