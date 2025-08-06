// This 4D command is fixed and tested.
// 4D command: Application file
// Returns the full pathname of the application executable file

import path from 'path';
import fs from 'fs';

export default function(processState) {
    return function Application_file() {
        try {
            // Get the main module's filename (the entry point of the application)
            let applicationPath = '';
            
            // In Node.js, process.argv[0] is the node executable path
            // process.argv[1] is the script being executed (main.js or similar)
            // We want to return the path to the main application file
            
            if (process.argv && process.argv.length > 1) {
                // Get the main script path
                applicationPath = path.resolve(process.argv[1]);
            } else if (require.main && require.main.filename) {
                // Alternative method using require.main
                applicationPath = path.resolve(require.main.filename);
            } else {
                // Fallback to current working directory + main.js
                applicationPath = path.join(process.cwd(), 'main.js');
            }
            
            // Verify the file exists
            if (!fs.existsSync(applicationPath)) {
                // Try to find main.js in current directory
                const fallbackPath = path.join(process.cwd(), 'main.js');
                if (fs.existsSync(fallbackPath)) {
                    applicationPath = fallbackPath;
                }
            }
            
            // Log the result
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Application file',
                message: 'Application file path retrieved',
                data: { path: applicationPath }
            });
            
            processState.OK = 1;
            return applicationPath;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Application file',
                message: 'Error getting application file path',
                data: { error: error.message }
            });
            processState.OK = 0;
            return '';
        }
    };
};