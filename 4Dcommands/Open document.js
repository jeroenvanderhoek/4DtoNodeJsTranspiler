// 4D command: Open document
// Opens a document with the default application
// Open document ( pathName )
// Parameter		Type		Description
// pathName		String		Path to the document to open

import { exec } from 'child_process';
import os from 'os';

export default function Open_document(processState, pathName) {
    if (!pathName || typeof pathName !== 'string') {
        console.warn('Open document: Invalid path provided');
        return;
    }
    
    const platform = os.platform();
    let command;
    
    switch (platform) {
        case 'win32':
            command = `start "" "${pathName}"`;
            break;
        case 'darwin':
            command = `open "${pathName}"`;
            break;
        case 'linux':
            command = `xdg-open "${pathName}"`;
            break;
        default:
            console.warn('Open document: Unsupported platform');
            return;
    }
    
    exec(command, (error) => {
        if (error) {
            console.error('Open document error:', error.message);
        }
    });
}