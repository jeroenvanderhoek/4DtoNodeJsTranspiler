// This 4D command is fixed and tested.
// 4D command: Replace string
// Replaces occurrences of a substring within a string
// Essential for string manipulation

export default function(processState) {
    return function Replace_string(source, oldString, newString, howMany = 0) {
        try {
            if (typeof source !== 'string') {
                source = String(source);
            }
            if (typeof oldString !== 'string') {
                oldString = String(oldString);
            }
            if (typeof newString !== 'string') {
                newString = String(newString);
            }
            
            let result = source;
            
            if (howMany === 0) {
                // Replace all occurrences
                result = source.split(oldString).join(newString);
            } else if (howMany > 0) {
                // Replace specific number of occurrences
                let count = 0;
                result = source.replace(new RegExp(oldString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), (match) => {
                    count++;
                    return count <= howMany ? newString : match;
                });
            }
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Replace string',
                message: 'String replacement completed',
                data: { 
                    sourceLength: source.length,
                    oldString,
                    newString,
                    howMany,
                    resultLength: result.length
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Replace string',
                message: `Error replacing string: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return source || '';
        }
    };
};