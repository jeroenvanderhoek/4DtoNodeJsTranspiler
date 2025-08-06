// 4D command: WEB Validate digest
// Validates user credentials using digest authentication for web server security
// Based on 4D v20 documentation: Checks the validity of user identification (name and password) in Digest mode authentication
// Essential for backend web server authentication, providing secure HTTP digest authentication validation
// Must be used in the On Web Authentication Database Method for Digest mode web authentication
// WEB Validate digest ( userName ; password ) -> Function result
// userName          String     ->    User name to validate
// password          String     ->    User password to validate
// Function result   Boolean    <-    True if authentication OK, False if authentication failed

import crypto from 'crypto';

export default function WEB_Validate_digest(processState, userName, password) {
    try {
        // Validate input parameters
        if (typeof userName !== 'string' || typeof password !== 'string') {
            console.error('WEB Validate digest: Username and password must be strings');
            return false;
        }

        // Get HTTP request headers and digest information from processState
        let authorizationHeader = '';
        let requestMethod = 'GET';
        let requestUri = '/';

        if (processState.req && processState.req.headers) {
            authorizationHeader = processState.req.headers.authorization || '';
            requestMethod = processState.req.method || 'GET';
            requestUri = processState.req.url || '/';
        }

        // Check if this is a digest authentication request
        if (!authorizationHeader.toLowerCase().startsWith('digest ')) {
            console.error('WEB Validate digest: Not a digest authentication request');
            return false;
        }

        // Parse digest authentication header
        const digestInfo = parseDigestAuth(authorizationHeader);
        if (!digestInfo || digestInfo.username !== userName) {
            return false;
        }

        // Calculate expected digest response
        const ha1 = crypto.createHash('md5').update(`${userName}:${digestInfo.realm}:${password}`).digest('hex');
        const ha2 = crypto.createHash('md5').update(`${requestMethod}:${digestInfo.uri || requestUri}`).digest('hex');
        
        let expectedResponse;
        if (digestInfo.qop === 'auth') {
            expectedResponse = crypto.createHash('md5')
                .update(`${ha1}:${digestInfo.nonce}:${digestInfo.nc}:${digestInfo.cnonce}:${digestInfo.qop}:${ha2}`)
                .digest('hex');
        } else {
            expectedResponse = crypto.createHash('md5')
                .update(`${ha1}:${digestInfo.nonce}:${ha2}`)
                .digest('hex');
        }

        const isValid = expectedResponse === digestInfo.response;

        // Log the authentication attempt
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: isValid ? 'INFO' : 'WARN',
                source: 'WEB Validate digest',
                message: `Digest authentication ${isValid ? 'successful' : 'failed'} for user: ${userName}`,
                data: {
                    userName: userName,
                    isValid: isValid,
                    realm: digestInfo.realm,
                    nonce: digestInfo.nonce,
                    uri: digestInfo.uri || requestUri,
                    method: requestMethod
                }
            });
        }

        return isValid;

    } catch (error) {
        console.error(`WEB Validate digest: An error occurred - ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'WEB Validate digest',
                message: `Error validating digest authentication: ${error.message}`,
                data: { error: error.message, userName: userName }
            });
        }
        return false;
    }
}

// Helper function to parse digest authentication header
function parseDigestAuth(authHeader) {
    try {
        const digest = {};
        const authString = authHeader.substring(7); // Remove "Digest " prefix
        
        // Parse key=value pairs, handling quoted values
        const regex = /(\w+)=(?:"([^"]+)"|([^,\s]+))/g;
        let match;
        
        while ((match = regex.exec(authString)) !== null) {
            const key = match[1];
            const value = match[2] || match[3];
            digest[key] = value;
        }

        // Ensure required fields are present
        if (!digest.username || !digest.realm || !digest.nonce || !digest.response) {
            return null;
        }

        return digest;
    } catch (error) {
        console.error('Error parsing digest auth header:', error.message);
        return null;
    }
}
