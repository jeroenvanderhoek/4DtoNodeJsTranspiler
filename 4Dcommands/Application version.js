// This 4D command is fixed and tested.
// 4D command: Application version
// Returns the version number of the 4D environment or merged application

export default function(processState) {
    return function Application_version() {
        try {
            // In Node.js, we'll return the Node version as a proxy for the application version
            // In a real 4D environment, this would return the 4D version
            const version = process.version || 'v1.0.0';
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Application version',
                message: 'Application version retrieved',
                data: { version }
            });
            
            processState.OK = 1;
            return version;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Application version',
                message: 'Error getting application version',
                data: { error: error.message }
            });
            processState.OK = 0;
            return '';
        }
    };
};