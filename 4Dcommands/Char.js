// This 4D command is fixed and tested.
// 4D command: Char
// Returns a character from its ASCII/Unicode code
// Essential for character manipulation and text processing

export default function(processState) {
    return function Char(code) {
        try {
            if (typeof code !== 'number') {
                throw new Error('Character code must be a number');
            }
            
            // Convert code to character
            const result = String.fromCharCode(code);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Char',
                message: 'Character generated from code',
                data: { code, character: result }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Char',
                message: `Error generating character: ${error.message}`,
                data: { error: error.message, code }
            });
            processState.OK = 0;
            return '';
        }
    };
};