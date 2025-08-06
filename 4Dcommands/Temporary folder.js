// 4D command: Temporary folder
// Returns the path to the temporary folder
// Temporary folder -> Function result
// Function result		String		Path to the temporary folder

import os from 'os';

export default function Temporary_folder(processState) {
    // Return the temporary folder path
    // This is the system's temporary directory
    return os.tmpdir();
}
