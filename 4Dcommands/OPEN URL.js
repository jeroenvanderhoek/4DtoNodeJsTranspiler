// This 4D command is fixed and tested.
// 4D command: OPEN URL
// Opens a URL in the default browser
// OPEN URL ( url )
// Parameter		Type		Description
// url		String		URL to open

import { exec } from 'child_process';
import os from 'os';

export default function OPEN_URL(processState, url) {
    if (!url || typeof url !== 'string') {
        console.warn('OPEN URL: Invalid URL provided');
        return;
    }
    
    const platform = os.platform();
    let command;
    
    switch (platform) {
        case 'win32':
            command = `start "" "${url}"`;
            break;
        case 'darwin':
            command = `open "${url}"`;
            break;
        case 'linux':
            command = `xdg-open "${url}"`;
            break;
        default:
            console.warn('OPEN URL: Unsupported platform');
            return;
    }
    
    exec(command, (error) => {
        if (error) {
            console.error('OPEN URL error:', error.message);
        }
    });
}
