// This 4D command is fixed and tested.
// 4D command: Add to date
// Adds a specified number of years, months, or days to a date value
// Based on 4D date manipulation patterns: Allows precise date arithmetic for backend calculations
// Essential for date calculations in scheduling, reporting, and data processing systems
// Add to date ( date ; years ; months ; days ) -> Function result
// date           Date       ->    Source date to modify
// years          Integer    ->    Number of years to add (can be negative)  
// months         Integer    ->    Number of months to add (can be negative)
// days           Integer    ->    Number of days to add (can be negative)
// Function result Date      <-    New date with added time intervals

export default function Add_to_date(processState, sourceDate, years = 0, months = 0, days = 0) {
    try {
        // Validate input date
        let workingDate;
        
        if (sourceDate instanceof Date) {
            workingDate = new Date(sourceDate);
        } else if (typeof sourceDate === 'string') {
            workingDate = new Date(sourceDate);
        } else if (typeof sourceDate === 'number') {
            // Handle Date as timestamp
            workingDate = new Date(sourceDate);
        } else {
            console.error('Add to date: Invalid date parameter');
            return null;
        }

        // Check if date is valid
        if (isNaN(workingDate.getTime())) {
            console.error('Add to date: Invalid date provided');
            
            // Log the error
            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'ERROR',
                    source: 'Add to date',
                    message: `Invalid date provided: ${sourceDate}`,
                    data: { sourceDate: sourceDate }
                });
            }
            
            return null;
        }

        // Validate numeric parameters
        years = parseInt(years) || 0;
        months = parseInt(months) || 0;
        days = parseInt(days) || 0;

        // Add years first (preserves month/day when possible)
        if (years !== 0) {
            workingDate.setFullYear(workingDate.getFullYear() + years);
        }

        // Add months (handles month overflow correctly)
        if (months !== 0) {
            const currentMonth = workingDate.getMonth();
            const currentDay = workingDate.getDate();
            
            // Set to first day of month to avoid date overflow issues
            workingDate.setDate(1);
            workingDate.setMonth(currentMonth + months);
            
            // Restore the original day, handling month end cases
            const daysInNewMonth = new Date(workingDate.getFullYear(), workingDate.getMonth() + 1, 0).getDate();
            const adjustedDay = Math.min(currentDay, daysInNewMonth);
            workingDate.setDate(adjustedDay);
        }

        // Add days last (simplest operation)
        if (days !== 0) {
            workingDate.setDate(workingDate.getDate() + days);
        }

        // Log the date calculation for debugging
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Add to date',
                message: `Date calculation: ${sourceDate} + ${years}y ${months}m ${days}d = ${workingDate.toISOString()}`,
                data: { 
                    originalDate: sourceDate,
                    years: years,
                    months: months,
                    days: days,
                    resultDate: workingDate.toISOString()
                }
            });
        }

        // Store calculation in processState for potential reuse
        if (!processState.dateCalculations) {
            processState.dateCalculations = [];
        }
        
        processState.dateCalculations.push({
            operation: 'Add to date',
            source: sourceDate,
            adjustments: { years, months, days },
            result: workingDate,
            timestamp: new Date()
        });

        // Keep only last 50 calculations to prevent memory bloat
        if (processState.dateCalculations.length > 50) {
            processState.dateCalculations = processState.dateCalculations.slice(-50);
        }

        return workingDate;

    } catch (error) {
        console.error('Add to date error:', error.message);
        
        // Log the error
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Add to date',
                message: `Failed to calculate date: ${error.message}`,
                data: { 
                    sourceDate: sourceDate,
                    years: years,
                    months: months,
                    days: days,
                    error: error.message 
                }
            });
        }

        return null;
    }
}