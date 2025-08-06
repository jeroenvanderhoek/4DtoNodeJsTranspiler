// 4D command: Test path name
// Tests if a path name is valid and accessible
// Test path name ( pathName ) -> Function result
// Parameter		Type		Description
// pathName		String		Path to test
// Function result		Boolean		True if path is valid and accessible, False otherwise

import fs from 'fs';
import path from 'path';

export default function Test_path_name(processState, pathName) {
    if (!pathName || typeof pathName !== 'string') {
        return false;
    }
    
    try {
        // Check if the path exists
        const stats = fs.statSync(pathName);
        return true;
    } catch (error) {
        // Path doesn't exist or is not accessible
        return false;
    }
}
