// 4D command: WEB SERVICE SET OPTION
// Configures various options for web service calls (SOAP/REST)
// Based on 4D v20 patterns: Sets configuration options for web service client behavior
// Essential for backend server web service integration to control timeouts, headers, and protocol settings
// WEB SERVICE SET OPTION ( option ; value )
// option    Integer    ->    Option selector for web service configuration
// value     Any        ->    Value for the specified option

export default function WEB_SERVICE_SET_OPTION(processState, option, value) {
    try {
        // Validate input parameters
        if (typeof option !== 'number') {
            console.error('WEB SERVICE SET OPTION: Option must be a number');
            return;
        }

        // Initialize web service options in processState if not exists
        if (!processState.webServiceOptions) {
            processState.webServiceOptions = {
                // Default web service client options
                timeout: 30000,                    // Request timeout in milliseconds
                userAgent: '4D-WebService-Client', // User agent string
                keepAlive: false,                  // Keep connection alive
                followRedirects: true,             // Follow HTTP redirects
                maxRedirects: 5,                   // Maximum number of redirects
                compression: true,                 // Enable compression
                soapAction: '',                    // SOAP action header
                namespace: '',                     // Default namespace for SOAP
                encoding: 'UTF-8',                 // Character encoding
                httpVersion: '1.1',                // HTTP version
                customHeaders: {},                 // Custom HTTP headers
                proxyUrl: '',                      // Proxy server URL
                proxyAuth: '',                     // Proxy authentication
                clientCertificate: '',             // Client certificate path
                sslVerification: true,             // SSL certificate verification
                lastModified: new Date()
            };
        }

        // Define option constants (typical 4D web service option selectors)
        const WEB_SERVICE_TIMEOUT = 1;
        const WEB_SERVICE_USER_AGENT = 2;
        const WEB_SERVICE_KEEP_ALIVE = 3;
        const WEB_SERVICE_FOLLOW_REDIRECTS = 4;
        const WEB_SERVICE_MAX_REDIRECTS = 5;
        const WEB_SERVICE_COMPRESSION = 6;
        const WEB_SERVICE_SOAP_ACTION = 7;
        const WEB_SERVICE_NAMESPACE = 8;
        const WEB_SERVICE_ENCODING = 9;
        const WEB_SERVICE_HTTP_VERSION = 10;
        const WEB_SERVICE_PROXY_URL = 11;
        const WEB_SERVICE_PROXY_AUTH = 12;
        const WEB_SERVICE_SSL_VERIFICATION = 13;
        const WEB_SERVICE_CLIENT_CERTIFICATE = 14;

        let optionName = 'unknown';
        let oldValue;

        // Set the option based on selector
        switch (option) {
            case WEB_SERVICE_TIMEOUT:
                optionName = 'timeout';
                oldValue = processState.webServiceOptions.timeout;
                const timeout = parseInt(value, 10);
                if (isNaN(timeout) || timeout < 0) {
                    console.error('WEB SERVICE SET OPTION: Timeout must be a non-negative integer');
                    return;
                }
                processState.webServiceOptions.timeout = timeout;
                break;

            case WEB_SERVICE_USER_AGENT:
                optionName = 'userAgent';
                oldValue = processState.webServiceOptions.userAgent;
                if (typeof value !== 'string') {
                    console.error('WEB SERVICE SET OPTION: User agent must be a string');
                    return;
                }
                processState.webServiceOptions.userAgent = value;
                break;

            case WEB_SERVICE_KEEP_ALIVE:
                optionName = 'keepAlive';
                oldValue = processState.webServiceOptions.keepAlive;
                processState.webServiceOptions.keepAlive = Boolean(value);
                break;

            case WEB_SERVICE_FOLLOW_REDIRECTS:
                optionName = 'followRedirects';
                oldValue = processState.webServiceOptions.followRedirects;
                processState.webServiceOptions.followRedirects = Boolean(value);
                break;

            case WEB_SERVICE_MAX_REDIRECTS:
                optionName = 'maxRedirects';
                oldValue = processState.webServiceOptions.maxRedirects;
                const maxRedirects = parseInt(value, 10);
                if (isNaN(maxRedirects) || maxRedirects < 0) {
                    console.error('WEB SERVICE SET OPTION: Max redirects must be a non-negative integer');
                    return;
                }
                processState.webServiceOptions.maxRedirects = maxRedirects;
                break;

            case WEB_SERVICE_COMPRESSION:
                optionName = 'compression';
                oldValue = processState.webServiceOptions.compression;
                processState.webServiceOptions.compression = Boolean(value);
                break;

            case WEB_SERVICE_SOAP_ACTION:
                optionName = 'soapAction';
                oldValue = processState.webServiceOptions.soapAction;
                if (typeof value !== 'string') {
                    console.error('WEB SERVICE SET OPTION: SOAP action must be a string');
                    return;
                }
                processState.webServiceOptions.soapAction = value;
                break;

            case WEB_SERVICE_NAMESPACE:
                optionName = 'namespace';
                oldValue = processState.webServiceOptions.namespace;
                if (typeof value !== 'string') {
                    console.error('WEB SERVICE SET OPTION: Namespace must be a string');
                    return;
                }
                processState.webServiceOptions.namespace = value;
                break;

            case WEB_SERVICE_ENCODING:
                optionName = 'encoding';
                oldValue = processState.webServiceOptions.encoding;
                if (typeof value !== 'string') {
                    console.error('WEB SERVICE SET OPTION: Encoding must be a string');
                    return;
                }
                processState.webServiceOptions.encoding = value;
                break;

            case WEB_SERVICE_HTTP_VERSION:
                optionName = 'httpVersion';
                oldValue = processState.webServiceOptions.httpVersion;
                if (typeof value !== 'string' || !['1.0', '1.1', '2.0'].includes(value)) {
                    console.error('WEB SERVICE SET OPTION: HTTP version must be "1.0", "1.1", or "2.0"');
                    return;
                }
                processState.webServiceOptions.httpVersion = value;
                break;

            case WEB_SERVICE_PROXY_URL:
                optionName = 'proxyUrl';
                oldValue = processState.webServiceOptions.proxyUrl;
                if (typeof value !== 'string') {
                    console.error('WEB SERVICE SET OPTION: Proxy URL must be a string');
                    return;
                }
                processState.webServiceOptions.proxyUrl = value;
                break;

            case WEB_SERVICE_PROXY_AUTH:
                optionName = 'proxyAuth';
                oldValue = processState.webServiceOptions.proxyAuth;
                if (typeof value !== 'string') {
                    console.error('WEB SERVICE SET OPTION: Proxy auth must be a string');
                    return;
                }
                processState.webServiceOptions.proxyAuth = value;
                break;

            case WEB_SERVICE_SSL_VERIFICATION:
                optionName = 'sslVerification';
                oldValue = processState.webServiceOptions.sslVerification;
                processState.webServiceOptions.sslVerification = Boolean(value);
                break;

            case WEB_SERVICE_CLIENT_CERTIFICATE:
                optionName = 'clientCertificate';
                oldValue = processState.webServiceOptions.clientCertificate;
                if (typeof value !== 'string') {
                    console.error('WEB SERVICE SET OPTION: Client certificate must be a string');
                    return;
                }
                processState.webServiceOptions.clientCertificate = value;
                break;

            default:
                console.error(`WEB SERVICE SET OPTION: Unknown option selector ${option}`);
                return;
        }

        // Update last modified timestamp
        processState.webServiceOptions.lastModified = new Date();

        // Track option change history
        if (!processState.webServiceOptionHistory) {
            processState.webServiceOptionHistory = [];
        }
        processState.webServiceOptionHistory.push({
            option: optionName,
            oldValue: oldValue,
            newValue: processState.webServiceOptions[optionName],
            timestamp: new Date().toISOString()
        });

        // Update statistics
        if (!processState.webServiceStats) {
            processState.webServiceStats = { optionsSet: 0 };
        }
        processState.webServiceStats.optionsSet++;

        // Log the option change
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'WEB SERVICE SET OPTION',
                message: `Web service option '${optionName}' changed from ${oldValue} to ${processState.webServiceOptions[optionName]}`,
                data: {
                    option: optionName,
                    oldValue: oldValue,
                    newValue: processState.webServiceOptions[optionName],
                    optionSelector: option
                }
            });
        }

        console.log(`WEB SERVICE SET OPTION: Set option '${optionName}' to '${processState.webServiceOptions[optionName]}'`);

    } catch (error) {
        console.error(`WEB SERVICE SET OPTION: An error occurred - ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'WEB SERVICE SET OPTION',
                message: `Error setting web service option: ${error.message}`,
                data: { error: error.message, option: option, value: value }
            });
        }
    }
}
