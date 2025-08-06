// 4D command: System folder
// Returns the path to the system folder
// System folder -> Function result
// Function result		String		Path to the system folder

import os from 'os';
import path from 'path';

export default function System_folder(processState) {
    // Return the system folder path
    // On Windows, this is typically C:\Windows\System32
    // On macOS, this is typically /System
    // On Linux, this is typically /usr/bin
    
    const platform = os.platform();
    
    switch (platform) {
        case 'win32':
            return path.join(process.env.SYSTEMROOT || 'C:\\Windows', 'System32');
        case 'darwin':
            return '/System';
        case 'linux':
            return '/usr/bin';
        default:
            return '/usr/bin';
    }
}
