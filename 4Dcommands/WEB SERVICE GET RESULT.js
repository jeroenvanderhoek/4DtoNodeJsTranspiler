// 4D command: WEB SERVICE GET RESULT
// Retrieves the result from the last web service call (SOAP/REST)
// Based on 4D v20 patterns: Gets the response data from the most recent web service request
// Essential for backend server web service integration to process responses from external services
// WEB SERVICE GET RESULT ( result {; returnedSoapHeader} )
// result                Text/BLOB/Object    <-    Result of the web service call
// returnedSoapHeader    Text                <-    Optional SOAP header returned by the service

export default function WEB_SERVICE_GET_RESULT(processState, result, returnedSoapHeader) {
    try {
        // Check if there's a web service response available
        if (!processState.webServiceResponse) {
            console.error('WEB SERVICE GET RESULT: No web service response available. Call WEB SERVICE CALL first.');
            
            // Set empty results
            if (typeof result === 'object' && result !== null) {
                if (Buffer.isBuffer(result)) {
                    result.fill(0); // Clear BLOB
                } else {
                    Object.keys(result).forEach(key => delete result[key]); // Clear object
                }
            } else if (typeof result === 'string') {
                result = '';
            }
            
            if (returnedSoapHeader !== undefined) {
                returnedSoapHeader = '';
            }
            
            return false;
        }

        const response = processState.webServiceResponse;

        // Determine the response format and set the result accordingly
        let responseData = response.data;
        let responseHeaders = response.headers || {};
        let contentType = responseHeaders['content-type'] || responseHeaders['Content-Type'] || '';

        // Handle different result types based on what the caller expects
        if (typeof result === 'string') {
            // Text result expected
            if (typeof responseData === 'string') {
                result = responseData;
            } else if (Buffer.isBuffer(responseData)) {
                result = responseData.toString('utf8');
            } else if (typeof responseData === 'object') {
                result = JSON.stringify(responseData);
            } else {
                result = String(responseData);
            }
        } else if (Buffer.isBuffer(result)) {
            // BLOB result expected
            if (Buffer.isBuffer(responseData)) {
                responseData.copy(result);
            } else if (typeof responseData === 'string') {
                const buffer = Buffer.from(responseData, 'utf8');
                buffer.copy(result);
            } else {
                const buffer = Buffer.from(JSON.stringify(responseData), 'utf8');
                buffer.copy(result);
            }
        } else if (typeof result === 'object' && result !== null) {
            // Object result expected
            if (typeof responseData === 'object' && responseData !== null) {
                Object.assign(result, responseData);
            } else if (typeof responseData === 'string') {
                try {
                    const parsed = JSON.parse(responseData);
                    Object.assign(result, parsed);
                } catch (e) {
                    // If not JSON, create a simple object with the string
                    result.data = responseData;
                    result.raw = responseData;
                }
            } else {
                result.data = responseData;
                result.raw = String(responseData);
            }
        }

        // Handle SOAP header if requested
        if (returnedSoapHeader !== undefined) {
            if (response.soapHeader) {
                returnedSoapHeader = response.soapHeader;
            } else if (response.responseType === 'SOAP' && typeof responseData === 'string') {
                // Try to extract SOAP header from response
                const headerMatch = responseData.match(/<soap:Header[^>]*>(.*?)<\/soap:Header>/is);
                if (headerMatch) {
                    returnedSoapHeader = headerMatch[1].trim();
                } else {
                    returnedSoapHeader = '';
                }
            } else {
                returnedSoapHeader = '';
            }
        }

        // Update statistics
        if (!processState.webServiceStats) {
            processState.webServiceStats = { getResultCalls: 0 };
        }
        processState.webServiceStats.getResultCalls++;

        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'WEB SERVICE GET RESULT',
                message: `Retrieved web service result (${contentType})`,
                data: {
                    responseType: response.responseType,
                    statusCode: response.statusCode,
                    contentType: contentType,
                    dataSize: responseData ? (Buffer.isBuffer(responseData) ? responseData.length : String(responseData).length) : 0,
                    hasHeader: !!returnedSoapHeader
                }
            });
        }

        return true;

    } catch (error) {
        console.error(`WEB SERVICE GET RESULT: An error occurred - ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'WEB SERVICE GET RESULT',
                message: `Error retrieving web service result: ${error.message}`,
                data: { error: error.message }
            });
        }
        return false;
    }
}
