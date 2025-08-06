// 4D command: WEB SERVICE SET PARAMETER
// Sets parameters for the next web service call (SOAP/REST)
// Based on 4D v20 patterns: Configures input parameters for subsequent web service requests
// Essential for backend server web service integration to send structured data to external services
// WEB SERVICE SET PARAMETER ( paramName ; paramValue {; paramType} )
// paramName     String      ->    Name of the parameter to set
// paramValue    Any         ->    Value of the parameter
// paramType     Integer     ->    Optional type specification (for SOAP)

export default function WEB_SERVICE_SET_PARAMETER(processState, paramName, paramValue, paramType = 0) {
    try {
        // Validate input parameters
        if (typeof paramName !== 'string' || paramName.trim() === '') {
            console.error('WEB SERVICE SET PARAMETER: Parameter name must be a non-empty string');
            return;
        }
        if (typeof paramType !== 'number') {
            console.error('WEB SERVICE SET PARAMETER: Parameter type must be a number');
            return;
        }

        // Initialize web service parameters in processState if not exists
        if (!processState.webServiceParameters) {
            processState.webServiceParameters = {
                params: {},
                paramTypes: {},
                paramOrder: [], // Maintain order for SOAP envelope generation
                lastModified: new Date()
            };
        }

        const paramNameTrimmed = paramName.trim();
        
        // Store the parameter value
        processState.webServiceParameters.params[paramNameTrimmed] = paramValue;
        
        // Store parameter type if provided (for SOAP type annotations)
        if (paramType > 0) {
            processState.webServiceParameters.paramTypes[paramNameTrimmed] = paramType;
        }
        
        // Track parameter order for proper SOAP envelope construction
        if (!processState.webServiceParameters.paramOrder.includes(paramNameTrimmed)) {
            processState.webServiceParameters.paramOrder.push(paramNameTrimmed);
        }
        
        // Update modification timestamp
        processState.webServiceParameters.lastModified = new Date();

        // Track parameter changes in history
        if (!processState.webServiceParameterHistory) {
            processState.webServiceParameterHistory = [];
        }
        processState.webServiceParameterHistory.push({
            action: 'set',
            paramName: paramNameTrimmed,
            paramType: paramType,
            valueType: typeof paramValue,
            timestamp: new Date().toISOString()
        });

        // Update statistics
        if (!processState.webServiceStats) {
            processState.webServiceStats = { parametersSet: 0 };
        }
        processState.webServiceStats.parametersSet++;

        // Log the operation (without sensitive values)
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'WEB SERVICE SET PARAMETER',
                message: `Set web service parameter: ${paramNameTrimmed}`,
                data: {
                    paramName: paramNameTrimmed,
                    valueType: typeof paramValue,
                    paramType: paramType,
                    totalParams: Object.keys(processState.webServiceParameters.params).length
                }
            });
        }

        console.log(`WEB SERVICE SET PARAMETER: Set parameter '${paramNameTrimmed}' (type: ${typeof paramValue}${paramType > 0 ? `, SOAP type: ${paramType}` : ''})`);

    } catch (error) {
        console.error(`WEB SERVICE SET PARAMETER: An error occurred - ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'WEB SERVICE SET PARAMETER',
                message: `Error setting web service parameter: ${error.message}`,
                data: { 
                    error: error.message, 
                    paramName: paramName,
                    paramType: paramType
                }
            });
        }
    }
}
