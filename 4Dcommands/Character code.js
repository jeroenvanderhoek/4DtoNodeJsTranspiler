// This 4D command is fixed and tested.
// 4D command: Character code
// Returns the ASCII/Unicode code of a character
// Essential for character analysis and text processing

export default function(processState) {
    return function Character_code(character) {
        try {
            if (typeof character !== 'string' || character.length === 0) {
                throw new Error('Input must be a non-empty string');
            }
            
            // Get code of first character
            const result = character.charCodeAt(0);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Character code',
                message: 'Character code retrieved',
                data: { character: character[0], code: result }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Character code',
                message: `Error getting character code: ${error.message}`,
                data: { error: error.message, character }
            });
            processState.OK = 0;
            return 0;
        }
    };
};