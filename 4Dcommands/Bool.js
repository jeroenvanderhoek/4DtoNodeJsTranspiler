// 4D command: Bool
// Converts an expression to a boolean value using 4D logic rules
// Based on 4D v20 documentation: Evaluates expressions and returns true or false
// Essential for backend conditional logic, validation, and data processing
// Bool ( expression ) -> Function result
// expression      Expression -> Any expression to evaluate as boolean
// Function result Boolean    -> Boolean evaluation of the expression

export default function Bool(processState, expression) {
    try {
        // Initialize boolean operations statistics
        if (!processState.booleanOperations) {
            processState.booleanOperations = {
                totalEvaluations: 0,
                trueResults: 0,
                falseResults: 0,
                lastEvaluation: null,
                recentEvaluations: []
            };
        }
        
        let result = false;
        let expressionType = typeof expression;
        
        // 4D Boolean evaluation rules
        switch (expressionType) {
            case 'boolean':
                result = expression;
                break;
                
            case 'number':
                // In 4D: 0 is false, any other number is true
                result = expression !== 0;
                break;
                
            case 'string':
                // In 4D: empty string is false, any other string is true
                result = expression.length > 0;
                break;
                
            case 'object':
                if (expression === null) {
                    result = false;
                } else if (Array.isArray(expression)) {
                    // Array: empty array is false, non-empty is true
                    result = expression.length > 0;
                } else {
                    // Object: null is false, any other object is true
                    result = true;
                }
                break;
                
            case 'undefined':
                result = false;
                break;
                
            case 'function':
                // Functions are truthy
                result = true;
                break;
                
            default:
                result = false;
                break;
        }
        
        // Update statistics
        processState.booleanOperations.totalEvaluations++;
        processState.booleanOperations.lastEvaluation = new Date();
        
        if (result) {
            processState.booleanOperations.trueResults++;
        } else {
            processState.booleanOperations.falseResults++;
        }
        
        processState.booleanOperations.recentEvaluations.push({
            timestamp: new Date(),
            operation: 'BOOL_EVALUATION',
            input: expressionType === 'string' ? expression.substring(0, 50) : expression,
            inputType: expressionType,
            result: result,
            success: true
        });
        
        // Limit recent evaluations history
        if (processState.booleanOperations.recentEvaluations.length > 100) {
            processState.booleanOperations.recentEvaluations.shift();
        }
        
        // Log complex or unusual evaluations
        if (processState.logs && (expressionType === 'object' || expressionType === 'function')) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Bool',
                message: `Boolean evaluation of ${expressionType}: ${result}`,
                data: {
                    inputType: expressionType,
                    result: result,
                    isArray: Array.isArray(expression),
                    isNull: expression === null,
                    totalEvaluations: processState.booleanOperations.totalEvaluations
                }
            });
        }
        
        return result;
        
    } catch (error) {
        console.error('Bool evaluation error:', error);
        
        if (processState.booleanOperations) {
            processState.booleanOperations.totalEvaluations++;
            processState.booleanOperations.falseResults++; // Error defaults to false
            
            processState.booleanOperations.recentEvaluations.push({
                timestamp: new Date(),
                operation: 'BOOL_EVALUATION',
                input: expression,
                error: error.message,
                result: false,
                success: false
            });
        }
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Bool',
                message: `Boolean evaluation error: ${error.message}`,
                data: {
                    expression: expression,
                    error: error.message
                }
            });
        }
        
        // Return false on error (safe default)
        return false;
    }
}
