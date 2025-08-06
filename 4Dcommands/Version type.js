// 4D command: Version type
// Returns version type information about the application or environment
// Based on 4D usage patterns: Provides information about application versioning state
// Version type -> Function result
// Function result\t\tInteger\t\tVersion type indicator

export default function Version_type(processState) {
    try {
        // Since this command isn't clearly documented in v20, we'll implement it as a utility
        // that returns version-related information based on common 4D patterns
        
        // Check if we have application version information in processState
        if (processState.applicationInfo && processState.applicationInfo.version) {
            const version = processState.applicationInfo.version;
            
            // Determine version type based on version string format
            if (typeof version === 'string') {
                // Check for development version (usually contains 'dev', 'alpha', 'beta')
                if (/dev|alpha|beta|rc/i.test(version)) {
                    return 1; // Development/Pre-release version
                }
                
                // Check for release version (standard x.y.z format)
                if (/^\d+\.\d+(\.\d+)?$/.test(version)) {
                    return 0; // Release version  
                }
                
                // Other version formats
                return 2; // Custom version format
            }
        }
        
        // If no version information available, check for Node.js environment info
        if (typeof process !== 'undefined' && process.version) {
            return 0; // Standard Node.js environment (release)
        }
        
        // Default case - assume release version
        return 0;
        
    } catch (error) {
        console.error('Version type error:', error.message);
        return -1; // Error indicator
    }
}
