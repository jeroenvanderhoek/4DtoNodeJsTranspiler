// 4D command: COPY DOCUMENT
// Copies a document/file from source to destination
// Based on 4D v20 documentation: Copies a document from one location to another
// Essential for backend file operations and document management
// COPY DOCUMENT ( sourcePath ; destinationPath )
// sourcePath      Text -> Path of the source document to copy
// destinationPath Text -> Path where the document should be copied

import fs from 'fs';
import path from 'path';

export default function COPY_DOCUMENT(processState, sourcePath, destinationPath) {
    try {
        if (!processState) {
            throw new Error('processState is required');
        }

        if (!sourcePath || typeof sourcePath !== 'string') {
            throw new Error('COPY DOCUMENT: sourcePath parameter must be a non-empty string');
        }

        if (!destinationPath || typeof destinationPath !== 'string') {
            throw new Error('COPY DOCUMENT: destinationPath parameter must be a non-empty string');
        }

        // Resolve absolute paths
        const absoluteSourcePath = path.resolve(sourcePath);
        const absoluteDestPath = path.resolve(destinationPath);

        // Initialize copy statistics
        if (!processState.copyStats) {
            processState.copyStats = {
                totalCopied: 0,
                totalFailed: 0,
                totalBytesCopied: 0,
                lastCopied: null,
                recentOperations: [],
                copiedDocuments: []
            };
        }

        // Check if source file exists
        if (!fs.existsSync(absoluteSourcePath)) {
            throw new Error(`COPY DOCUMENT: Source file '${absoluteSourcePath}' does not exist`);
        }

        // Check if source is a file (not a directory)
        const sourceStats = fs.statSync(absoluteSourcePath);
        if (!sourceStats.isFile()) {
            throw new Error(`COPY DOCUMENT: Source '${absoluteSourcePath}' is not a file`);
        }

        // Check if destination directory exists
        const destDir = path.dirname(absoluteDestPath);
        if (!fs.existsSync(destDir)) {
            throw new Error(`COPY DOCUMENT: Destination directory '${destDir}' does not exist`);
        }

        // Check if destination is writable
        try {
            fs.accessSync(destDir, fs.constants.W_OK);
        } catch (err) {
            throw new Error(`COPY DOCUMENT: Destination directory '${destDir}' is not writable`);
        }

        // Check if destination file already exists
        if (fs.existsSync(absoluteDestPath)) {
            throw new Error(`COPY DOCUMENT: Destination file '${absoluteDestPath}' already exists`);
        }

        // Copy the file
        fs.copyFileSync(absoluteSourcePath, absoluteDestPath);

        // Get destination file stats after copy
        const destStats = fs.statSync(absoluteDestPath);
        const copyInfo = {
            sourcePath: absoluteSourcePath,
            destinationPath: absoluteDestPath,
            sourceSize: sourceStats.size,
            destinationSize: destStats.size,
            copied: destStats.birthtime,
            permissions: destStats.mode
        };

        // Update statistics
        processState.copyStats.totalCopied++;
        processState.copyStats.totalBytesCopied += sourceStats.size;
        processState.copyStats.lastCopied = new Date();

        processState.copyStats.recentOperations.push({
            timestamp: new Date(),
            operation: 'COPY_DOCUMENT',
            sourcePath: absoluteSourcePath,
            destinationPath: absoluteDestPath,
            fileSize: sourceStats.size,
            success: true
        });

        processState.copyStats.copiedDocuments.push({
            timestamp: new Date(),
            sourcePath: absoluteSourcePath,
            destinationPath: absoluteDestPath,
            copyInfo: copyInfo,
            reason: 'COPY DOCUMENT command'
        });

        // Limit recent operations history
        if (processState.copyStats.recentOperations.length > 100) {
            processState.copyStats.recentOperations.shift();
        }

        // Limit copied documents history
        if (processState.copyStats.copiedDocuments.length > 200) {
            processState.copyStats.copiedDocuments.shift();
        }

        // Log the operation
        if (!processState.logs) {
            processState.logs = [];
        }

        processState.logs.push({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: `Document copied: ${absoluteSourcePath} -> ${absoluteDestPath}`,
            command: 'COPY DOCUMENT',
            sourcePath: absoluteSourcePath,
            destinationPath: absoluteDestPath,
            fileSize: sourceStats.size,
            totalCopied: processState.copyStats.totalCopied,
            totalBytesCopied: processState.copyStats.totalBytesCopied
        });

        return copyInfo;

    } catch (error) {
        // Update failure statistics
        if (processState && processState.copyStats) {
            processState.copyStats.totalFailed++;
            processState.copyStats.recentOperations.push({
                timestamp: new Date(),
                operation: 'COPY_DOCUMENT',
                sourcePath: sourcePath,
                destinationPath: destinationPath,
                success: false,
                error: error.message
            });
        }

        if (processState && processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                message: `COPY DOCUMENT command error: ${error.message}`,
                command: 'COPY DOCUMENT',
                sourcePath: sourcePath,
                destinationPath: destinationPath,
                error: error.stack
            });
        }

        throw new Error(`COPY DOCUMENT command failed: ${error.message}`);
    }
}
