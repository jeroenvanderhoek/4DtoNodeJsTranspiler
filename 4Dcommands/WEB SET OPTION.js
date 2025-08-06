// 4D command: WEB SET OPTION
// Configures web server options for HTTP/HTTPS server operations
// Based on 4D v20 documentation: Sets various web server configuration parameters
// Essential for backend web server configuration and customization
// WEB SET OPTION ( option ; value )
// option      Longint   -> Web server option selector
// value       Expression -> New value for the option

export default function WEB_SET_OPTION(processState, option, value) {
    try {
        // Validate inputs
        if (typeof option !== 'number' || option < 1) {
            console.warn('WEB SET OPTION: Invalid option selector');
            return;
        }
        
        // Initialize web server options if not exists
        if (!processState.webServerOptions) {
            processState.webServerOptions = {
                httpPort: 80,
                httpsPort: 443,
                enableHttps: false,
                htmlRootFolder: './WebFolder',
                maxConcurrentProcesses: 32,
                connectionTimeout: 15,
                serverCache: true,
                keepAlive: true,
                corsEnabled: false,
                corsOrigin: '*',
                sessionTimeout: 60,
                logRequests: true,
                compressionEnabled: true,
                maxRequestSize: 2097152, // 2MB
                lastModified: new Date()
            };
        }
        
        // Track option change history
        if (!processState.webServerOptionHistory) {
            processState.webServerOptionHistory = [];
        }
        
        let optionName = 'unknown';
        let oldValue = null;
        let validationError = null;
        
        // Set option based on selector
        switch (option) {
            case 1: // HTTP Port
                optionName = 'httpPort';
                oldValue = processState.webServerOptions.httpPort;
                if (typeof value === 'number' && value > 0 && value <= 65535) {
                    processState.webServerOptions.httpPort = value;
                } else {
                    validationError = 'HTTP port must be a number between 1 and 65535';
                }
                break;
                
            case 2: // HTTPS Port
                optionName = 'httpsPort';
                oldValue = processState.webServerOptions.httpsPort;
                if (typeof value === 'number' && value > 0 && value <= 65535) {
                    processState.webServerOptions.httpsPort = value;
                } else {
                    validationError = 'HTTPS port must be a number between 1 and 65535';
                }
                break;
                
            case 3: // Enable HTTPS
                optionName = 'enableHttps';
                oldValue = processState.webServerOptions.enableHttps;
                processState.webServerOptions.enableHttps = Boolean(value);
                break;
                
            case 4: // HTML Root Folder
                optionName = 'htmlRootFolder';
                oldValue = processState.webServerOptions.htmlRootFolder;
                if (typeof value === 'string' && value.length > 0) {
                    processState.webServerOptions.htmlRootFolder = value;
                } else {
                    validationError = 'HTML root folder must be a non-empty string';
                }
                break;
                
            case 5: // Max Concurrent Processes
                optionName = 'maxConcurrentProcesses';
                oldValue = processState.webServerOptions.maxConcurrentProcesses;
                if (typeof value === 'number' && value > 0) {
                    processState.webServerOptions.maxConcurrentProcesses = value;
                } else {
                    validationError = 'Max concurrent processes must be a positive number';
                }
                break;
                
            case 6: // Connection Timeout
                optionName = 'connectionTimeout';
                oldValue = processState.webServerOptions.connectionTimeout;
                if (typeof value === 'number' && value >= 0) {
                    processState.webServerOptions.connectionTimeout = value;
                } else {
                    validationError = 'Connection timeout must be a non-negative number';
                }
                break;
                
            case 7: // Enable Server Cache
                optionName = 'serverCache';
                oldValue = processState.webServerOptions.serverCache;
                processState.webServerOptions.serverCache = Boolean(value);
                break;
                
            case 8: // Enable Keep Alive
                optionName = 'keepAlive';
                oldValue = processState.webServerOptions.keepAlive;
                processState.webServerOptions.keepAlive = Boolean(value);
                break;
                
            case 9: // Enable CORS
                optionName = 'corsEnabled';
                oldValue = processState.webServerOptions.corsEnabled;
                processState.webServerOptions.corsEnabled = Boolean(value);
                break;
                
            case 10: // CORS Origin
                optionName = 'corsOrigin';
                oldValue = processState.webServerOptions.corsOrigin;
                if (typeof value === 'string') {
                    processState.webServerOptions.corsOrigin = value;
                } else {
                    validationError = 'CORS origin must be a string';
                }
                break;
                
            default:
                validationError = `Unknown web server option: ${option}`;
                break;
        }
        
        // Handle validation errors
        if (validationError) {
            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'WARN',
                    source: 'WEB SET OPTION',
                    message: `Option validation failed: ${validationError}`,
                    data: {
                        option: option,
                        optionName: optionName,
                        value: value,
                        error: validationError
                    }
                });
            }
            return;
        }
        
        // Record option change
        processState.webServerOptionHistory.push({
            timestamp: new Date(),
            option: option,
            optionName: optionName,
            oldValue: oldValue,
            newValue: processState.webServerOptions[optionName],
            requestId: processState.webServerOptionHistory.length + 1
        });
        
        // Limit history to prevent memory growth
        if (processState.webServerOptionHistory.length > 100) {
            processState.webServerOptionHistory.shift();
        }
        
        // Update last modified timestamp
        processState.webServerOptions.lastModified = new Date();
        
        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'WEB SET OPTION',
                message: `Web server option '${optionName}' changed from '${oldValue}' to '${processState.webServerOptions[optionName]}'`,
                data: {
                    option: option,
                    optionName: optionName,
                    oldValue: oldValue,
                    newValue: processState.webServerOptions[optionName]
                }
            });
        }
        
    } catch (error) {
        console.error('WEB SET OPTION error:', error);
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'WEB SET OPTION',
                message: `Error setting web server option: ${error.message}`,
                data: {
                    option: option,
                    value: value,
                    error: error.message
                }
            });
        }
    }
}
