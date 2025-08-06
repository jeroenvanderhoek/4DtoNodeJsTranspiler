// 4D command: Year of
// Extracts the year from a date
// Year of ( date ) -> Function result
// Parameter		Type		Description
// date		Date		Date from which to extract the year
// Function result		Longint		Year value

export default function Year_of(processState, date) {
    // Handle null/undefined input
    if (date === null || date === undefined) {
        return 0;
    }
    
    // Handle Date objects
    if (date instanceof Date) {
        return date.getFullYear();
    }
    
    // Try to parse as date string
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return 0;
    }
    
    return parsedDate.getFullYear();
}
