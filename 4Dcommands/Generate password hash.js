// 4D command: Generate password hash
// Generates a secure password hash using bcrypt algorithm
// Based on 4D v19 documentation: Creates a secure hash from a password using cryptographic algorithms
// Generate password hash ( password {; options} ) -> Function result
// Parameter		Type		Description
// password		String		The user's password (only first 72 characters are used)
// options		Object		Object containing algorithm and cost options (optional)
// Function result	String		Returns the hashed password string

import bcrypt from 'bcryptjs';

export default function Generate_password_hash(processState, password, options = null) {
    try {
        // Validate input parameters
        if (typeof password !== 'string') {
            console.error('Generate password hash: Password must be a string');
            return '';
        }
        
        // Handle empty password
        if (!password) {
            console.error('Generate password hash: Password cannot be empty');
            return '';
        }
        
        // Truncate password to 72 characters as per bcrypt specification
        const truncatedPassword = password.substring(0, 72);
        
        // Default options
        let algorithm = 'bcrypt';
        let cost = 10;
        
        // Parse options if provided
        if (options && typeof options === 'object') {
            if (options.algorithm && typeof options.algorithm === 'string') {
                algorithm = options.algorithm;
            }
            
            if (options.cost && typeof options.cost === 'number') {
                cost = options.cost;
            }
        }
        
        // Validate algorithm (only bcrypt is supported as per 4D documentation)
        if (algorithm !== 'bcrypt') {
            console.error('Generate password hash: Unsupported algorithm. Only "bcrypt" is supported.');
            
            // Store error in processState for potential error handling
            if (processState.lastError) {
                processState.lastError = {
                    code: 850,
                    message: 'Password-hash: Unsupported algorithm.'
                };
            }
            
            return '';
        }
        
        // Validate cost parameter (must be between 4 and 31 for bcrypt)
        if (cost < 4 || cost > 31) {
            console.error('Generate password hash: Invalid bcrypt cost parameter. Must be between 4 and 31.');
            
            // Store error in processState for potential error handling
            if (processState.lastError) {
                processState.lastError = {
                    code: 852,
                    message: 'Password-hash: Unavailable bcrypt cost parameter, please provide a value between 4 and 31.'
                };
            }
            
            return '';
        }
        
        // Generate salt and hash the password
        const salt = bcrypt.genSaltSync(cost);
        const hash = bcrypt.hashSync(truncatedPassword, salt);
        
        // Log the operation (without storing the password for security)
        if (processState.logEvents) {
            processState.logEvents.push({
                timestamp: new Date().toISOString(),
                type: 1, // Info level
                typeName: 'INFO',
                message: `Password hash generated using ${algorithm} with cost factor ${cost}`
            });
        }
        
        // Store operation details in processState
        if (!processState.passwordOperations) {
            processState.passwordOperations = [];
        }
        
        processState.passwordOperations.push({
            timestamp: new Date().toISOString(),
            operation: 'hash_generation',
            algorithm: algorithm,
            cost: cost,
            passwordLength: password.length,
            truncated: password.length > 72
        });
        
        return hash;
        
    } catch (error) {
        console.error('Generate password hash error:', error.message);
        
        // Log the error
        if (processState.logEvents) {
            processState.logEvents.push({
                timestamp: new Date().toISOString(),
                type: 3, // Error level
                typeName: 'ERROR',
                message: `Password hash generation failed with error: ${error.message}`
            });
        }
        
        return '';
    }
}
