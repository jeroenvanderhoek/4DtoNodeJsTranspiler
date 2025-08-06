// 4D command: Create document
// Creates a new document file and returns a document reference for writing
// Based on 4D v20 documentation: Opens a file for writing, creating it if it doesn't exist
// Essential for backend file generation, logging, and data export operations
// Create document ( fileName {; fileType} ) -> Function result
// fileName        Text      -> File name or path to create
// fileType        Text      -> File type/extension (optional)
// Function result DocRef    -> Document reference for the created file

import fs from 'fs';
import path from 'path';

export default function Create_document(processState, fileName, fileType = '') {
    try {
        // Validate inputs
        if (!fileName || typeof fileName !== 'string') {
            console.warn('Create document: File name must be a valid string');
            return null;
        }
        
        // Initialize file operations statistics
        if (!processState.fileOperations) {
            processState.fileOperations = {
                totalCreated: 0,
                totalDocuments: 0,
                openDocuments: [],
                lastOperation: null,
                recentOperations: []
            };
        }
        
        // Resolve the file path
        let fullPath = path.resolve(fileName);
        
        // Add file type if specified and not already present
        if (fileType && !path.extname(fullPath)) {
            if (!fileType.startsWith('.')) {
                fileType = '.' + fileType;
            }
            fullPath += fileType;
        }
        
        // Ensure directory exists
        const dirPath = path.dirname(fullPath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        
        // Create the document reference
        const docRef = {
            id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            path: fullPath,
            fileName: path.basename(fullPath),
            directory: dirPath,
            fileType: fileType || path.extname(fullPath),
            created: new Date(),
            lastAccessed: new Date(),
            isOpen: true,
            mode: 'write',
            size: 0,
            encoding: 'utf8'
        };
        
        // Create an empty file or truncate existing file
        fs.writeFileSync(fullPath, '', { encoding: docRef.encoding });
        
        // Add to open documents tracking
        processState.fileOperations.openDocuments.push(docRef);
        
        // Update statistics
        processState.fileOperations.totalCreated++;
        processState.fileOperations.totalDocuments++;
        processState.fileOperations.lastOperation = new Date();
        
        processState.fileOperations.recentOperations.push({
            timestamp: new Date(),
            operation: 'CREATE_DOCUMENT',
            path: fullPath,
            fileName: docRef.fileName,
            fileType: docRef.fileType,
            docRefId: docRef.id,
            success: true
        });
        
        // Limit recent operations history
        if (processState.fileOperations.recentOperations.length > 100) {
            processState.fileOperations.recentOperations.shift();
        }
        
        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Create document',
                message: `Document created: ${docRef.fileName} at ${dirPath}`,
                data: {
                    path: fullPath,
                    fileName: docRef.fileName,
                    fileType: docRef.fileType,
                    docRefId: docRef.id,
                    totalCreated: processState.fileOperations.totalCreated,
                    openDocuments: processState.fileOperations.openDocuments.length
                }
            });
        }
        
        return docRef;
        
    } catch (error) {
        console.error('Create document error:', error);
        
        if (processState.fileOperations) {
            processState.fileOperations.recentOperations.push({
                timestamp: new Date(),
                operation: 'CREATE_DOCUMENT',
                fileName: fileName,
                fileType: fileType,
                error: error.message,
                success: false
            });
        }
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Create document',
                message: `Failed to create document: ${error.message}`,
                data: {
                    fileName: fileName,
                    fileType: fileType,
                    error: error.message,
                    code: error.code || 'CREATE_ERROR'
                }
            });
        }
        
        return null;
    }
}
