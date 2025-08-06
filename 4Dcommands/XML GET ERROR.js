// 4D command: XML GET ERROR
// Retrieves information about the last XML parsing error that occurred
// Based on 4D patterns: Essential for backend XML processing error handling and debugging
// Provides detailed error information when XML parsing, validation, or processing fails
// XML GET ERROR ( elementRef ; errorText ; lineNumber ; columnNumber )
// elementRef     String    ->    XML element reference (or empty for global error)
// errorText      String    <-    Description of the XML error
// lineNumber     Integer   <-    Line number where error occurred
// columnNumber   Integer   <-    Column number where error occurred

export default function XML_GET_ERROR(processState, elementRef, errorText, lineNumber, columnNumber) {
    try {
        // Initialize output parameters
        let error = { text: '', line: 0, column: 0 };

        // Check if we have XML error tracking in processState
        if (processState.xmlErrors && processState.xmlErrors.length > 0) {
            // Get the most recent error
            const lastError = processState.xmlErrors[processState.xmlErrors.length - 1];
            
            // Check if error is related to a specific element reference
            if (elementRef && elementRef.trim() !== '') {
                // Find error specific to this element reference
                const elementError = processState.xmlErrors.find(err => err.elementRef === elementRef);
                if (elementError) {
                    error = elementError;
                } else {
                    // No specific error for this element
                    error = { text: '', line: 0, column: 0 };
                }
            } else {
                // Return the most recent global error
                error = lastError;
            }
        } else {
            // No errors recorded
            error = { text: '', line: 0, column: 0 };
        }

        // Set output parameters (simulating by reference behavior)
        if (typeof errorText === 'object' && errorText !== null) {
            errorText.value = error.text || '';
        }
        if (typeof lineNumber === 'object' && lineNumber !== null) {
            lineNumber.value = error.line || 0;
        }
        if (typeof columnNumber === 'object' && columnNumber !== null) {
            columnNumber.value = error.column || 0;
        }

        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'XML GET ERROR',
                message: error.text ? `XML error retrieved: ${error.text}` : 'No XML errors found',
                data: {
                    elementRef: elementRef || 'global',
                    errorText: error.text,
                    lineNumber: error.line,
                    columnNumber: error.column,
                    hasError: !!error.text
                }
            });
        }

        // Return error info object for easier usage
        return {
            hasError: !!error.text,
            errorText: error.text || '',
            lineNumber: error.line || 0,
            columnNumber: error.column || 0,
            elementRef: elementRef || null
        };

    } catch (error) {
        console.error(`XML GET ERROR: An error occurred - ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'XML GET ERROR',
                message: `Error retrieving XML error info: ${error.message}`,
                data: { error: error.message, elementRef: elementRef }
            });
        }

        // Return empty error info on failure
        return {
            hasError: false,
            errorText: '',
            lineNumber: 0,
            columnNumber: 0,
            elementRef: elementRef || null
        };
    }
}
