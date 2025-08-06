// 4D command: WEB GET VARIABLES
// Retrieves values from form fields and URL parameters sent in HTTP requests
// Based on 4D v20 documentation: Extracts variables from HTTP form submissions and URL parameters
// WEB GET VARIABLES ( nameArray ; valueArray )
// Parameter		Type		Description
// nameArray		Array		Array to receive variable names
// valueArray		Array		Array to receive variable values

export default function WEB_GET_VARIABLES(processState, nameArray, valueArray) {
    // Initialize arrays if not provided
    if (!Array.isArray(nameArray)) {
        nameArray = [];
    }
    if (!Array.isArray(valueArray)) {
        valueArray = [];
    }
    
    // Clear existing arrays
    nameArray.length = 0;
    valueArray.length = 0;
    
    if (!processState.req) {
        console.warn('WEB GET VARIABLES: No HTTP request context available');
        return;
    }
    
    const req = processState.req;
    
    // Extract variables from different sources
    const variables = {};
    
    // 1. URL Query parameters (GET parameters)
    if (req.query && typeof req.query === 'object') {
        Object.entries(req.query).forEach(([key, value]) => {
            // Handle array values (multiple values with same name)
            if (Array.isArray(value)) {
                value.forEach((v, index) => {
                    const arrayKey = index === 0 ? key : `${key}[${index}]`;
                    variables[arrayKey] = String(v);
                });
            } else {
                variables[key] = String(value);
            }
        });
    }
    
    // 2. Form data (POST body parameters)
    if (req.body && typeof req.body === 'object') {
        Object.entries(req.body).forEach(([key, value]) => {
            // Handle array values (multiple checkboxes, select multiple, etc.)
            if (Array.isArray(value)) {
                value.forEach((v, index) => {
                    const arrayKey = index === 0 ? key : `${key}[${index}]`;
                    variables[arrayKey] = String(v);
                });
            } else {
                variables[key] = String(value);
            }
        });
    }
    
    // 3. URL parameters (route params)
    if (req.params && typeof req.params === 'object') {
        Object.entries(req.params).forEach(([key, value]) => {
            variables[key] = String(value);
        });
    }
    
    // Convert to arrays following 4D convention
    Object.entries(variables).forEach(([name, value]) => {
        nameArray.push(name);
        valueArray.push(value);
    });
    
    // Store retrieved variables in processState for debugging
    if (!processState.httpRequestData) {
        processState.httpRequestData = {};
    }
    processState.httpRequestData.variables = variables;
    processState.httpRequestData.variableCount = nameArray.length;
    processState.httpRequestData.variablesRetrievedAt = new Date().toISOString();
    
    // Log retrieval for debugging
    console.log(`WEB GET VARIABLES: Retrieved ${nameArray.length} variables:`, 
                nameArray.map((name, i) => `${name}=${valueArray[i]}`).join(', '));
    
    return { nameArray, valueArray };
}
