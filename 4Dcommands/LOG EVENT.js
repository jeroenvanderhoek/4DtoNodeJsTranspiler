// This 4D command is fixed and tested.
// 4D command: LOG EVENT
// Logs an event message to the system
// LOG EVENT ( eventType ; eventMessage )
// Parameter		Type		Description
// eventType		Longint		Type of event (1=Information, 2=Warning, 3=Error, 4=Debug)
// eventMessage		String		Message to log

export default function LOG_EVENT(processState, eventType, eventMessage) {
    const timestamp = new Date().toISOString();
    const typeNames = {
        1: 'INFO',
        2: 'WARNING', 
        3: 'ERROR',
        4: 'DEBUG'
    };
    
    const typeName = typeNames[eventType] || 'UNKNOWN';
    const logMessage = `[${timestamp}] [${typeName}] ${eventMessage}`;
    
    // Log to console
    switch (eventType) {
        case 1: // Information
            console.log(logMessage);
            break;
        case 2: // Warning
            console.warn(logMessage);
            break;
        case 3: // Error
            console.error(logMessage);
            break;
        case 4: // Debug
            console.debug(logMessage);
            break;
        default:
            console.log(logMessage);
    }
    
    // Store in processState for potential retrieval
    if (!processState.logEvents) {
        processState.logEvents = [];
    }
    
    processState.logEvents.push({
        timestamp,
        type: eventType,
        typeName,
        message: eventMessage
    });
}