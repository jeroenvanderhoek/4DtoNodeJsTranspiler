// 4D command: Data file
// Returns the absolute path to the current application's data file
// Based on 4D v20 documentation: Provides access to the main database data file location
// Essential for backend database operations, file management, and data persistence
// Data file {-> dataFilePath}
// Returns:    Text    -> Absolute path to the data file

import path from 'path';
import fs from 'fs';

export default function Data_file(processState) {
    try {
        let dataFilePath;
        
        // Try to get data file path from various sources
        if (processState.database && processState.database.dataFile) {
            // Use explicitly configured data file path
            dataFilePath = processState.database.dataFile;
        } else if (processState.dataFilePath) {
            // Use processState data file path
            dataFilePath = processState.dataFilePath;
        } else if (process.env.DATA_FILE_PATH) {
            // Use environment variable
            dataFilePath = process.env.DATA_FILE_PATH;
        } else {
            // Default data file path
            dataFilePath = path.join(process.cwd(), 'input', 'Data', 'database.4DD');
        }
        
        // Ensure absolute path
        const absolutePath = path.resolve(dataFilePath);
        
        // Check if file exists and gather information
        let fileExists = false;
        let fileStats = null;
        
        try {
            fileStats = fs.statSync(absolutePath);
            fileExists = true;
        } catch (err) {
            // File doesn't exist or can't be accessed
            fileExists = false;
        }
        
        // Cache data file information in processState
        if (!processState.dataFileInfo) {
            processState.dataFileInfo = {
                accessCount: 0,
                firstAccessed: new Date(),
                lastChecked: null
            };
        }
        
        processState.dataFileInfo.accessCount++;
        processState.dataFileInfo.lastChecked = new Date();
        processState.dataFileInfo.currentPath = absolutePath;
        processState.dataFileInfo.exists = fileExists;
        processState.dataFileInfo.stats = fileStats;
        
        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Data file',
                message: `Data file path requested: ${absolutePath}`,
                data: {
                    path: absolutePath,
                    exists: fileExists,
                    size: fileStats ? fileStats.size : 0,
                    accessCount: processState.dataFileInfo.accessCount
                }
            });
        }
        
        // Warn if data file doesn't exist
        if (!fileExists && processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'WARN',
                source: 'Data file',
                message: `Data file does not exist at path: ${absolutePath}`,
                data: {
                    path: absolutePath,
                    suggestion: 'Ensure database is properly initialized or check configuration'
                }
            });
        }
        
        return absolutePath;
        
    } catch (error) {
        console.error('Data file error:', error);
        
        // Return default path on error
        const defaultPath = path.join(process.cwd(), 'input', 'Data', 'database.4DD');
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Data file',
                message: `Error accessing data file, returning default: ${error.message}`,
                data: {
                    defaultPath: defaultPath,
                    error: error.message
                }
            });
        }
        
        return path.resolve(defaultPath);
    }
}
