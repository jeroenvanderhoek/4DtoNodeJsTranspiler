// 4D command: WEB SERVICE Get info
// Retrieves information about the last web service call (SOAP/REST)
// Based on 4D v20 patterns: Gets metadata and status information from the most recent web service request
// Essential for backend server web service integration to analyze call results and debug issues
// WEB SERVICE Get info ( info ) -> Function result
// info              Integer    ->    Type of information to retrieve
// Function result   Any        <-    Requested information about the web service call

export default function WEB_SERVICE_Get_info(processState, info) {
    try {
        // Validate input parameter
        if (typeof info !== 'number') {
            console.error('WEB SERVICE Get info: Info type must be a number');
            return null;
        }

        // Define information type constants (typical 4D web service info selectors)
        const WEB_SERVICE_HTTP_STATUS_CODE = 1;     // HTTP status code of last call
        const WEB_SERVICE_HTTP_STATUS_TEXT = 2;     // HTTP status text
        const WEB_SERVICE_RESPONSE_SIZE = 3;        // Size of response data
        const WEB_SERVICE_REQUEST_TIME = 4;         // Time taken for request in milliseconds
        const WEB_SERVICE_CONTENT_TYPE = 5;         // Content type of response
        const WEB_SERVICE_SOAP_FAULT_CODE = 6;      // SOAP fault code if applicable
        const WEB_SERVICE_SOAP_FAULT_STRING = 7;    // SOAP fault string if applicable
        const WEB_SERVICE_LAST_URL = 8;             // URL of last request
        const WEB_SERVICE_LAST_METHOD = 9;          // Method name of last call
        const WEB_SERVICE_RESPONSE_HEADERS = 10;    // Response headers as object
        const WEB_SERVICE_REQUEST_HEADERS = 11;     // Request headers that were sent
        const WEB_SERVICE_ERROR_MESSAGE = 12;       // Error message if request failed
        const WEB_SERVICE_REDIRECT_COUNT = 13;      // Number of redirects followed
        const WEB_SERVICE_CONNECTION_TIME = 14;     // Time to establish connection

        // Check if there's web service response data available
        if (!processState.webServiceResponse && !processState.webServiceCalls) {
            console.error('WEB SERVICE Get info: No web service call information available');
            return null;
        }

        let result = null;
        const response = processState.webServiceResponse;
        const lastCall = processState.webServiceCalls && processState.webServiceCalls.length > 0 
                        ? processState.webServiceCalls[processState.webServiceCalls.length - 1] 
                        : null;

        // Get the requested information
        switch (info) {
            case WEB_SERVICE_HTTP_STATUS_CODE:
                result = response ? response.statusCode : (lastCall ? lastCall.statusCode : 0);
                break;

            case WEB_SERVICE_HTTP_STATUS_TEXT:
                result = response ? response.statusText : (lastCall ? lastCall.statusText : '');
                break;

            case WEB_SERVICE_RESPONSE_SIZE:
                if (response && response.data) {
                    if (Buffer.isBuffer(response.data)) {
                        result = response.data.length;
                    } else if (typeof response.data === 'string') {
                        result = Buffer.byteLength(response.data, 'utf8');
                    } else {
                        result = Buffer.byteLength(JSON.stringify(response.data), 'utf8');
                    }
                } else {
                    result = 0;
                }
                break;

            case WEB_SERVICE_REQUEST_TIME:
                result = response ? response.requestTime : (lastCall ? lastCall.requestTime : 0);
                break;

            case WEB_SERVICE_CONTENT_TYPE:
                if (response && response.headers) {
                    result = response.headers['content-type'] || response.headers['Content-Type'] || '';
                } else {
                    result = '';
                }
                break;

            case WEB_SERVICE_SOAP_FAULT_CODE:
                if (response && response.responseType === 'SOAP' && response.soapFault) {
                    result = response.soapFault.code || '';
                } else {
                    result = '';
                }
                break;

            case WEB_SERVICE_SOAP_FAULT_STRING:
                if (response && response.responseType === 'SOAP' && response.soapFault) {
                    result = response.soapFault.string || '';
                } else {
                    result = '';
                }
                break;

            case WEB_SERVICE_LAST_URL:
                result = lastCall ? lastCall.url : '';
                break;

            case WEB_SERVICE_LAST_METHOD:
                result = lastCall ? lastCall.methodName : '';
                break;

            case WEB_SERVICE_RESPONSE_HEADERS:
                result = response ? (response.headers || {}) : {};
                break;

            case WEB_SERVICE_REQUEST_HEADERS:
                result = lastCall ? (lastCall.requestHeaders || {}) : {};
                break;

            case WEB_SERVICE_ERROR_MESSAGE:
                result = response ? response.errorMessage : (lastCall ? lastCall.errorMessage : '');
                break;

            case WEB_SERVICE_REDIRECT_COUNT:
                result = response ? (response.redirectCount || 0) : 0;
                break;

            case WEB_SERVICE_CONNECTION_TIME:
                result = response ? (response.connectionTime || 0) : 0;
                break;

            default:
                console.error(`WEB SERVICE Get info: Unknown info selector ${info}`);
                return null;
        }

        // Update statistics
        if (!processState.webServiceStats) {
            processState.webServiceStats = { infoRequests: 0 };
        }
        processState.webServiceStats.infoRequests++;

        // Log the operation (only occasionally to avoid spam)
        if (processState.logs && Math.random() < 0.2) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'WEB SERVICE Get info',
                message: `Retrieved web service info for selector ${info}`,
                data: {
                    infoSelector: info,
                    resultType: typeof result,
                    hasResponse: !!response,
                    hasCallHistory: !!(lastCall)
                }
            });
        }

        return result;

    } catch (error) {
        console.error(`WEB SERVICE Get info: An error occurred - ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'WEB SERVICE Get info',
                message: `Error getting web service info: ${error.message}`,
                data: { error: error.message, info: info }
            });
        }
        return null;
    }
}
