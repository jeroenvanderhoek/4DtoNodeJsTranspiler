// 4D command: Time string
// Returns the current time as a string
// Time string -> Function result
// Function result		String		Current time as a string in HH:MM:SS format

export default function Time_string(processState) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
}
