// 4D command: DELETE DOCUMENT
// Deletes a document/file from the file system
// Based on 4D v20 documentation: Removes a document from the file system
// Essential for backend file operations and document cleanup
// DELETE DOCUMENT ( documentPath )
// documentPath    Text -> Path of the document to delete

import fs from 'fs';
import path from 'path';

export default function DELETE_DOCUMENT(processState, documentPath) {
    try {
        if (!processState) {
            throw new Error('processState is required');
        }

        if (!documentPath || typeof documentPath !== 'string') {
            throw new Error('DELETE DOCUMENT: documentPath parameter must be a non-empty string');
        }

        // Resolve absolute path
        const absolutePath = path.resolve(documentPath);

        // Initialize delete statistics
        if (!processState.deleteDocumentStats) {
            processState.deleteDocumentStats = {
                totalDeleted: 0,
                totalFailed: 0,
                totalBytesDeleted: 0,
                lastDeleted: null,
                recentOperations: [],
                deletedDocuments: []
            };
        }

        // Check if file exists
        if (!fs.existsSync(absolutePath)) {
            throw new Error(`DELETE DOCUMENT: Document '${absolutePath}' does not exist`);
        }

        // Check if it's a file (not a directory)
        const fileStats = fs.statSync(absolutePath);
        if (!fileStats.isFile()) {
            throw new Error(`DELETE DOCUMENT: Path '${absolutePath}' is not a file`);
        }

        // Check if file is writable (can be deleted)
        try {
            fs.accessSync(absolutePath, fs.constants.W_OK);
        } catch (err) {
            throw new Error(`DELETE DOCUMENT: Document '${absolutePath}' is not writable or locked`);
        }

        // Store file information before deletion
        const fileInfo = {
            path: absolutePath,
            name: path.basename(absolutePath),
            size: fileStats.size,
            created: fileStats.birthtime,
            modified: fileStats.mtime,
            permissions: fileStats.mode
        };

        // Delete the file
        fs.unlinkSync(absolutePath);

        // Update statistics
        processState.deleteDocumentStats.totalDeleted++;
        processState.deleteDocumentStats.totalBytesDeleted += fileStats.size;
        processState.deleteDocumentStats.lastDeleted = new Date();

        processState.deleteDocumentStats.recentOperations.push({
            timestamp: new Date(),
            operation: 'DELETE_DOCUMENT',
            path: absolutePath,
            fileSize: fileStats.size,
            success: true
        });

        processState.deleteDocumentStats.deletedDocuments.push({
            timestamp: new Date(),
            path: absolutePath,
            fileInfo: fileInfo,
            reason: 'DELETE DOCUMENT command'
        });

        // Limit recent operations history
        if (processState.deleteDocumentStats.recentOperations.length > 100) {
            processState.deleteDocumentStats.recentOperations.shift();
        }

        // Limit deleted documents history
        if (processState.deleteDocumentStats.deletedDocuments.length > 200) {
            processState.deleteDocumentStats.deletedDocuments.shift();
        }

        // Log the operation
        if (!processState.logs) {
            processState.logs = [];
        }

        processState.logs.push({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: `Document deleted: ${absolutePath}`,
            command: 'DELETE DOCUMENT',
            documentPath: absolutePath,
            fileName: path.basename(absolutePath),
            fileSize: fileStats.size,
            totalDeleted: processState.deleteDocumentStats.totalDeleted,
            totalBytesDeleted: processState.deleteDocumentStats.totalBytesDeleted
        });

        return fileInfo;

    } catch (error) {
        // Update failure statistics
        if (processState && processState.deleteDocumentStats) {
            processState.deleteDocumentStats.totalFailed++;
            processState.deleteDocumentStats.recentOperations.push({
                timestamp: new Date(),
                operation: 'DELETE_DOCUMENT',
                path: documentPath,
                success: false,
                error: error.message
            });
        }

        if (processState && processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                message: `DELETE DOCUMENT command error: ${error.message}`,
                command: 'DELETE DOCUMENT',
                documentPath: documentPath,
                error: error.stack
            });
        }

        throw new Error(`DELETE DOCUMENT command failed: ${error.message}`);
    }
}
