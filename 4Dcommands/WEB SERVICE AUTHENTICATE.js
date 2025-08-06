// 4D command: WEB SERVICE AUTHENTICATE
// Sets authentication credentials for web service calls (SOAP/REST)
// Based on 4D v20 patterns: Configures authentication for subsequent web service requests
// Essential for backend server integration with secured web services requiring authentication
// WEB SERVICE AUTHENTICATE ( name ; password {; method} )
// name        String    ->    User name for authentication
// password    String    ->    Password for authentication
// method      Integer   ->    Authentication method (1=Basic, 2=Digest, default=1)

export default function WEB_SERVICE_AUTHENTICATE(processState, name, password, method = 1) {
    try {
        // Validate input parameters
        if (typeof name !== 'string') {
            console.error('WEB SERVICE AUTHENTICATE: User name must be a string');
            return;
        }
        if (typeof password !== 'string') {
            console.error('WEB SERVICE AUTHENTICATE: Password must be a string');
            return;
        }
        if (typeof method !== 'number' || (method !== 1 && method !== 2)) {
            console.error('WEB SERVICE AUTHENTICATE: Method must be 1 (Basic) or 2 (Digest)');
            return;
        }

        // Initialize web service authentication configuration in processState
        if (!processState.webServiceAuth) {
            processState.webServiceAuth = {
                enabled: false,
                credentials: null,
                method: 1, // Default to Basic authentication
                lastModified: new Date()
            };
        }

        // Set authentication configuration
        processState.webServiceAuth.enabled = true;
        processState.webServiceAuth.credentials = {
            username: name.trim(),
            password: password // Store as-is; encoding will be done when making requests
        };
        processState.webServiceAuth.method = method;
        processState.webServiceAuth.lastModified = new Date();

        // Track authentication changes in history
        if (!processState.webServiceAuthHistory) {
            processState.webServiceAuthHistory = [];
        }
        processState.webServiceAuthHistory.push({
            action: 'authenticate',
            username: name.trim(),
            method: method === 1 ? 'Basic' : 'Digest',
            timestamp: new Date().toISOString()
        });

        // Log the authentication setup (without password for security)
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'WEB SERVICE AUTHENTICATE',
                message: `Web service authentication configured for user: ${name.trim()}`,
                data: {
                    username: name.trim(),
                    authMethod: method === 1 ? 'Basic' : 'Digest',
                    enabled: true
                }
            });
        }

        console.log(`WEB SERVICE AUTHENTICATE: Authentication configured for user '${name.trim()}' using ${method === 1 ? 'Basic' : 'Digest'} method`);

    } catch (error) {
        console.error(`WEB SERVICE AUTHENTICATE: An error occurred - ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'WEB SERVICE AUTHENTICATE',
                message: `Error setting web service authentication: ${error.message}`,
                data: { 
                    error: error.message, 
                    username: name,
                    method: method
                }
            });
        }
    }
}
