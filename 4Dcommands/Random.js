// This 4D command is fixed and tested.
// 4D command: Random
// Returns a random integer between 0 and 32767
// Essential for generating random values

export default function(processState) {
    return function Random() {
        try {
            // 4D Random returns integer between 0 and 32767
            const result = Math.floor(Math.random() * 32768);
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Random',
                message: 'Random number generated',
                data: { result }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Random',
                message: `Error generating random number: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return 0;
        }
    };
};