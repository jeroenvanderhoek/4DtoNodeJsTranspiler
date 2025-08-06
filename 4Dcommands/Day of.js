// This 4D command is fixed and tested.
// 4D command: Day of
// Returns the day of the month from a date (1-31)
// Essential for date operations and reporting

export default function(processState) {
    return function Day_of(date) {
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
            
            const result = dateObj.getDate();
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Day of',
                message: 'Day of month retrieved',
                data: { 
                    date: dateObj.toISOString(),
                    dayOfMonth: result
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Day of',
                message: `Error getting day of month: ${error.message}`,
                data: { error: error.message, date }
            });
            processState.OK = 0;
            return 0;
        }
    };
};