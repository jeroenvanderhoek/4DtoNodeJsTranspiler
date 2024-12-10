// $D command: Add to date ( date ; years ; months ; days ) : Date
function addToDate(date, years, months, days) {
    let result = new Date(date);
    // Add years
    result.setFullYear(result.getFullYear() + years);
    // Add months
    result.setMonth(result.getMonth() + months);
    // Add days
    result.setDate(result.getDate() + days);
    return result;
}
export default addToDate;