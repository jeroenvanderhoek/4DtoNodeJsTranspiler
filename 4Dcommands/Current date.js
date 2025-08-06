// 4D command: Current date
// Returns the current system date
// Current date -> Function result
// Function result		Date		Current system date

export default function Current_date(processState) {
    // Get current date and set time to midnight (start of day)
    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return currentDate;
}