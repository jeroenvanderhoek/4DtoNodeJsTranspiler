// 4D command: CREATE FOLDER
// Creates a new folder/directory in the file system
// Based on 4D v20 documentation: Creates a new folder at the specified path
// Essential for backend file system operations and directory management
// CREATE FOLDER ( folderPath )
// folderPath    Text -> Path where the folder should be created

import fs from 'fs';
import path from 'path';

export default function CREATE_FOLDER(processState, folderPath) {
    try {
        if (!processState) {
            throw new Error('processState is required');
        }

        if (!folderPath || typeof folderPath !== 'string') {
            throw new Error('CREATE FOLDER: folderPath parameter must be a non-empty string');
        }

        // Resolve the absolute path
        const absolutePath = path.resolve(folderPath);

        // Initialize folder creation statistics
        if (!processState.folderStats) {
            processState.folderStats = {
                totalCreated: 0,
                totalFailed: 0,
                lastCreated: null,
                recentOperations: [],
                createdFolders: []
            };
        }

        // Check if folder already exists
        try {
            const stats = fs.statSync(absolutePath);
            if (stats.isDirectory()) {
                throw new Error(`CREATE FOLDER: Folder '${absolutePath}' already exists`);
            } else {
                throw new Error(`CREATE FOLDER: Path '${absolutePath}' exists but is not a directory`);
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                // Path doesn't exist, we can create it
            } else if (err.message.includes('already exists') || err.message.includes('not a directory')) {
                throw err;
            } else {
                // Other error, check if parent directory exists
                const parentDir = path.dirname(absolutePath);
                try {
                    fs.accessSync(parentDir, fs.constants.W_OK);
                } catch (parentErr) {
                    throw new Error(`CREATE FOLDER: Cannot create folder '${absolutePath}' - parent directory is not writable or does not exist`);
                }
            }
        }

        // Create the folder with recursive option
        fs.mkdirSync(absolutePath, { recursive: true });

        // Get folder information after creation
        const folderStats = fs.statSync(absolutePath);
        const folderInfo = {
            path: absolutePath,
            name: path.basename(absolutePath),
            created: folderStats.birthtime,
            permissions: folderStats.mode,
            size: 0 // Empty folder
        };

        // Update statistics
        processState.folderStats.totalCreated++;
        processState.folderStats.lastCreated = new Date();

        processState.folderStats.recentOperations.push({
            timestamp: new Date(),
            operation: 'CREATE_FOLDER',
            path: absolutePath,
            success: true
        });

        processState.folderStats.createdFolders.push({
            timestamp: new Date(),
            path: absolutePath,
            folderInfo: folderInfo,
            reason: 'CREATE FOLDER command'
        });

        // Limit recent operations history
        if (processState.folderStats.recentOperations.length > 100) {
            processState.folderStats.recentOperations.shift();
        }

        // Limit created folders history
        if (processState.folderStats.createdFolders.length > 200) {
            processState.folderStats.createdFolders.shift();
        }

        // Log the operation
        if (!processState.logs) {
            processState.logs = [];
        }

        processState.logs.push({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: `Folder created: ${absolutePath}`,
            command: 'CREATE FOLDER',
            folderPath: absolutePath,
            folderName: path.basename(absolutePath),
            totalCreated: processState.folderStats.totalCreated
        });

        return folderInfo;

    } catch (error) {
        // Update failure statistics
        if (processState && processState.folderStats) {
            processState.folderStats.totalFailed++;
            processState.folderStats.recentOperations.push({
                timestamp: new Date(),
                operation: 'CREATE_FOLDER',
                path: folderPath,
                success: false,
                error: error.message
            });
        }

        if (processState && processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                message: `CREATE FOLDER command error: ${error.message}`,
                command: 'CREATE FOLDER',
                folderPath: folderPath,
                error: error.stack
            });
        }

        throw new Error(`CREATE FOLDER command failed: ${error.message}`);
    }
}
