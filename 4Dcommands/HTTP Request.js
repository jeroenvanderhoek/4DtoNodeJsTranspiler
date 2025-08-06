// 4D command: HTTP Request
// Sends HTTP requests to web servers and retrieves responses
// Based on 4D v20 documentation: Performs HTTP communication with external services
// Essential for backend API integration, web service calls, and microservice communication
// HTTP Request ( method ; url {; content {; response {; headerNames {; headerValues}}}} ) -> httpResponse
// method         Text      -> HTTP method (GET, POST, PUT, DELETE, etc.)
// url            Text      -> Target URL for the request
// content        Text/Blob -> Request body content (optional)
// response       Variable  -> Response content (optional)
// headerNames    Array     -> Request header names (optional)
// headerValues   Array     -> Request header values (optional)

import axios from 'axios';

export default async function HTTP_Request(processState, method, url, content = null, response = null, headerNames = [], headerValues = []) {
    try {
        // Validate inputs
        if (!method || typeof method !== 'string') {
            console.warn('HTTP Request: Method must be a valid string');
            return { status: 0, error: 'Invalid method' };
        }
        
        if (!url || typeof url !== 'string') {
            console.warn('HTTP Request: URL must be a valid string');
            return { status: 0, error: 'Invalid URL' };
        }
        
        // Initialize HTTP statistics
        if (!processState.httpRequests) {
            processState.httpRequests = {
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                recentRequests: [],
                lastRequest: null
            };
        }
        
        // Prepare headers object
        const headers = {};
        if (headerNames && headerValues && Array.isArray(headerNames) && Array.isArray(headerValues)) {
            for (let i = 0; i < Math.min(headerNames.length, headerValues.length); i++) {
                headers[headerNames[i]] = headerValues[i];
            }
        }
        
        // Set default headers
        if (!headers['User-Agent']) {
            headers['User-Agent'] = '4D-NodeJS-Transpiler/1.0';
        }
        
        // Prepare request configuration
        const config = {
            method: method.toUpperCase(),
            url: url,
            headers: headers,
            timeout: 30000, // 30 seconds timeout
            validateStatus: () => true // Accept all status codes
        };
        
        // Add content if provided
        if (content !== null && content !== undefined) {
            if (typeof content === 'string') {
                config.data = content;
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = 'text/plain';
                }
            } else if (Buffer.isBuffer(content)) {
                config.data = content;
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = 'application/octet-stream';
                }
            } else if (typeof content === 'object') {
                config.data = JSON.stringify(content);
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = 'application/json';
                }
            }
        }
        
        const startTime = Date.now();
        
        // Make the HTTP request
        const axiosResponse = await axios(config);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Prepare response object
        const httpResponse = {
            status: axiosResponse.status,
            statusText: axiosResponse.statusText,
            headers: axiosResponse.headers,
            data: axiosResponse.data,
            duration: duration,
            url: url,
            method: method.toUpperCase()
        };
        
        // Update response variable if provided
        if (response && typeof response === 'object') {
            response.value = axiosResponse.data;
            response.status = axiosResponse.status;
            response.headers = axiosResponse.headers;
        }
        
        // Update statistics
        processState.httpRequests.totalRequests++;
        if (axiosResponse.status >= 200 && axiosResponse.status < 400) {
            processState.httpRequests.successfulRequests++;
        } else {
            processState.httpRequests.failedRequests++;
        }
        
        processState.httpRequests.lastRequest = new Date();
        processState.httpRequests.recentRequests.push({
            timestamp: new Date(),
            method: method.toUpperCase(),
            url: url,
            status: axiosResponse.status,
            duration: duration,
            contentLength: axiosResponse.data ? axiosResponse.data.length || 0 : 0
        });
        
        // Limit recent requests history
        if (processState.httpRequests.recentRequests.length > 100) {
            processState.httpRequests.recentRequests.shift();
        }
        
        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: axiosResponse.status >= 400 ? 'WARN' : 'INFO',
                source: 'HTTP Request',
                message: `${method.toUpperCase()} ${url} -> ${axiosResponse.status} (${duration}ms)`,
                data: {
                    method: method.toUpperCase(),
                    url: url,
                    status: axiosResponse.status,
                    statusText: axiosResponse.statusText,
                    duration: duration,
                    contentLength: axiosResponse.data ? axiosResponse.data.length || 0 : 0,
                    totalRequests: processState.httpRequests.totalRequests
                }
            });
        }
        
        return httpResponse;
        
    } catch (error) {
        console.error('HTTP Request error:', error);
        
        // Update failed requests counter
        if (processState.httpRequests) {
            processState.httpRequests.totalRequests++;
            processState.httpRequests.failedRequests++;
        }
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'HTTP Request',
                message: `HTTP request failed: ${error.message}`,
                data: {
                    method: method,
                    url: url,
                    error: error.message,
                    code: error.code || 'UNKNOWN'
                }
            });
        }
        
        return {
            status: 0,
            error: error.message,
            code: error.code || 'HTTP_REQUEST_FAILED',
            method: method,
            url: url
        };
    }
}
