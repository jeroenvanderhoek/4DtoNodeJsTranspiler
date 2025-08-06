// This 4D command is fixed and tested.
// 4D command: Day number
// Returns the day number from a date (1-7, where 1 is Sunday in 4D)
// Essential for date calculations and scheduling

export default function(processState) {
    return function Day_number(date) {
        try {
            let dateObj;
            
            if (date instanceof Date) {
                dateObj = date;
            } else if (typeof date === 'string' || typeof date === 'number') {
                dateObj = new Date(date);
            } else {
                dateObj = new Date();
            }
            
            if (isNaN(dateObj)) {
                throw new Error('Invalid date');
            }
            
            // In JavaScript, getDay() returns 0-6 (0 is Sunday)
            // In 4D, day numbers are 1-7 (1 is Sunday)
            const result = dateObj.getDay() + 1;
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Day number',
                message: 'Day number retrieved',
                data: { 
                    date: dateObj.toISOString(),
                    dayNumber: result,
                    dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dateObj.getDay()]
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Day number',
                message: `Error getting day number: ${error.message}`,
                data: { error: error.message, date }
            });
            processState.OK = 0;
            return 0;
        }
    };
};