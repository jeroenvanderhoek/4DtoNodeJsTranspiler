// 4D command: ALERT
// Shows an alert dialog box with a message and an OK button
// Based on 4D v20 documentation: Displays an alert dialog box composed of a note icon, a message, and an OK button
// ALERT ( message {; okButtonTitle} )
// Parameter		Type		Description
// message		String		Message to display in the alert dialog box
// okButtonTitle		String		OK button title (optional, defaults to "OK")

export default function ALERT(processState, message, okButtonTitle = 'OK') {
    // Handle null/undefined input
    if (message === null || message === undefined) {
        message = '';
    }
    
    // Convert message to string
    const alertMessage = String(message);
    
    // In a backend context, we log the alert instead of showing a dialog
    const logMessage = `[ALERT - ${okButtonTitle}] ${alertMessage}`;
    console.log(logMessage);
    
    // Store in processState for potential retrieval and testing
    if (!processState.alerts) {
        processState.alerts = [];
    }
    
    processState.alerts.push({
        timestamp: new Date().toISOString(),
        message: alertMessage,
        okButtonTitle,
        type: 'alert'
    });
    
    // In a web context, we could send this to the client via headers
    if (processState.res && !processState.res.headersSent) {
        try {
            processState.res.setHeader('X-Alert-Message', encodeURIComponent(alertMessage));
            processState.res.setHeader('X-Alert-Button', encodeURIComponent(okButtonTitle));
        } catch (error) {
            // Headers already sent, ignore silently
        }
    }
}