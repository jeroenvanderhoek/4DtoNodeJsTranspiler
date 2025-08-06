// This 4D command is fixed and tested.
// 4D command: Get 4D folder
// Returns the path to various 4D folders
// Essential for file system operations in backend

import path from 'path';
import os from 'os';

export default function(processState) {
    return function Get_4D_folder(folderType, options) {
        try {
            let folderPath = '';
            
            // 4D folder type constants
            const FOLDER_TYPES = {
                1: 'Database', // Database folder
                2: 'Resources', // Resources folder
                3: 'Logs', // Logs folder
                4: 'HTML', // HTML root folder
                5: 'System', // System folder
                6: 'Desktop', // Desktop folder
                7: 'Trash', // Trash/Recycle bin
                8: 'StartMenu', // Start menu (Windows)
                9: 'Documents', // Documents folder
                10: 'Favorites', // Favorites folder
                11: 'Applications', // Applications folder
                12: 'StartupDisk', // Startup disk
                13: 'SystemPreferences', // System preferences
                14: 'Temporary', // Temporary folder
                15: 'Library', // Library folder
                16: 'UserPreferences', // User preferences
                17: 'Cache', // Cache folder
            };
            
            switch(folderType) {
                case 1: // Database folder
                    folderPath = process.cwd();
                    break;
                case 2: // Resources folder
                    folderPath = path.join(process.cwd(), 'Resources');
                    break;
                case 3: // Logs folder
                    folderPath = path.join(process.cwd(), 'Logs');
                    break;
                case 4: // HTML root folder
                    folderPath = path.join(process.cwd(), 'WebFolder');
                    break;
                case 5: // System folder
                    folderPath = process.platform === 'win32' ? 
                        process.env.WINDIR || 'C:\\Windows' : 
                        '/System';
                    break;
                case 6: // Desktop folder
                    folderPath = path.join(os.homedir(), 'Desktop');
                    break;
                case 9: // Documents folder
                    folderPath = path.join(os.homedir(), 'Documents');
                    break;
                case 14: // Temporary folder
                    folderPath = os.tmpdir();
                    break;
                case 17: // Cache folder
                    folderPath = path.join(os.tmpdir(), 'cache');
                    break;
                default:
                    folderPath = process.cwd();
            }
            
            // Add trailing separator if requested
            if (!options || options !== '*') {
                folderPath = folderPath + path.sep;
            }
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Get 4D folder',
                message: 'Folder path retrieved',
                data: { 
                    folderType,
                    folderName: FOLDER_TYPES[folderType] || 'Unknown',
                    path: folderPath
                }
            });
            
            processState.OK = 1;
            return folderPath;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Get 4D folder',
                message: `Error getting folder path: ${error.message}`,
                data: { error: error.message }
            });
            processState.OK = 0;
            return '';
        }
    };
};