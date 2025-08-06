// 4D command: WEB Get Current Session ID
// Returns the UUID of the current web session
// Based on 4D v20 documentation: Returns the session ID for the current web request
// WEB Get Current Session ID -> Function result
// Function result		String		Session UUID or empty string if no session

export default function WEB_Get_Current_Session_ID(processState) {
    // Check if we have a request context
    if (!processState.req) {
        console.warn('WEB Get Current Session ID: No HTTP request context available');
        return '';
    }
    
    let sessionId = '';
    
    // Try to get session ID from various sources
    
    // 1. Express session middleware
    if (processState.req.session && processState.req.session.id) {
        sessionId = processState.req.session.id;
    }
    // 2. Express session store
    else if (processState.req.sessionID) {
        sessionId = processState.req.sessionID;
    }
    // 3. Custom session storage in processState
    else if (processState.session && processState.session.id) {
        sessionId = processState.session.id;
    }
    // 4. Look for session cookie
    else if (processState.req.cookies) {
        // Check for common session cookie names
        sessionId = processState.req.cookies['connect.sid'] || 
                   processState.req.cookies['sessionid'] || 
                   processState.req.cookies['session'] || 
                   processState.req.cookies['4d-session'] || '';
        
        // Clean up cookie value (remove signature if present)
        if (sessionId && sessionId.startsWith('s:')) {
            sessionId = sessionId.substring(2, sessionId.indexOf('.'));
        }
    }
    // 5. Look for session in headers
    else if (processState.req.headers) {
        sessionId = processState.req.headers['x-session-id'] || 
                   processState.req.headers['session-id'] || '';
    }
    
    // If no session exists, create one
    if (!sessionId) {
        // Generate a UUID-like session ID
        sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        
        // Store the new session ID
        if (!processState.session) {
            processState.session = {};
        }
        processState.session.id = sessionId;
        processState.session.createdAt = new Date().toISOString();
        processState.session.lastAccessedAt = new Date().toISOString();
        
        console.log(`WEB Get Current Session ID: Created new session ${sessionId}`);
    } else {
        // Update last accessed time for existing session
        if (processState.session) {
            processState.session.lastAccessedAt = new Date().toISOString();
        }
        
        console.log(`WEB Get Current Session ID: Retrieved existing session ${sessionId}`);
    }
    
    // Store session information for tracking
    if (!processState.webSessions) {
        processState.webSessions = {};
    }
    
    if (!processState.webSessions[sessionId]) {
        processState.webSessions[sessionId] = {
            id: sessionId,
            createdAt: new Date().toISOString(),
            lastAccessedAt: new Date().toISOString(),
            requestCount: 1
        };
    } else {
        processState.webSessions[sessionId].lastAccessedAt = new Date().toISOString();
        processState.webSessions[sessionId].requestCount = (processState.webSessions[sessionId].requestCount || 0) + 1;
    }
    
    return sessionId;
}
