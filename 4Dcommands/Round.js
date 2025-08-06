// 4D command: Round
// Rounds a number to a specified number of decimal places
// Round ( number ; places ) -> Function result
// Parameter		Type		Description
// number		Real		Number to round
// places		Longint		Number of decimal places
// Function result		Real		Rounded number

export default function Round(processState, number, places = 0) {
    // Handle null/undefined input
    if (number === null || number === undefined) {
        return 0;
    }
    
    // Convert to number if not already
    const num = parseFloat(number);
    if (isNaN(num)) {
        return 0;
    }
    
    // Handle places parameter
    const decimals = parseInt(places) || 0;
    
    // Round to specified decimal places
    const multiplier = Math.pow(10, decimals);
    return Math.round(num * multiplier) / multiplier;
}