// 4D command: Document to text
// Reads the entire contents of a text document and returns it as a string
// Based on 4D v20 documentation: Loads a complete text file into memory for processing
// Essential for backend file processing, configuration loading, and data import operations
// Document to text ( docRef {; charSet} ) -> textContent
// docRef      Text/DocRef  -> Document reference or file path
// charSet     Text         -> Character set for text encoding (optional)
// Returns:    Text         -> Complete content of the document

import fs from 'fs';
import path from 'path';

export default function Document_to_text(processState, docRef, charSet = 'utf8') {
    try {
        // Validate inputs
        if (!docRef) {
            console.warn('Document to text: Document reference is required');
            return '';
        }
        
        // Initialize file operations statistics
        if (!processState.fileOperations) {
            processState.fileOperations = {
                totalReads: 0,
                successfulReads: 0,
                failedReads: 0,
                recentOperations: [],
                lastOperation: null,
                totalBytesRead: 0
            };
        }
        
        let filePath;
        
        // Handle different types of document references
        if (typeof docRef === 'string') {
            filePath = docRef;
        } else if (typeof docRef === 'object' && docRef.path) {
            filePath = docRef.path;
        } else {
            console.warn('Document to text: Invalid document reference type');
            return '';
        }
        
        // Resolve to absolute path
        const absolutePath = path.resolve(filePath);
        
        // Validate character set
        const supportedCharsets = ['utf8', 'utf-8', 'ascii', 'latin1', 'binary', 'hex', 'base64'];
        const normalizedCharSet = charSet.toLowerCase();
        const encoding = supportedCharsets.includes(normalizedCharSet) ? normalizedCharSet : 'utf8';
        
        if (encoding !== normalizedCharSet) {
            console.warn(`Document to text: Unsupported charset '${charSet}', using 'utf8'`);
        }
        
        // Check if file exists
        if (!fs.existsSync(absolutePath)) {
            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'ERROR',
                    source: 'Document to text',
                    message: `File does not exist: ${absolutePath}`,
                    data: {
                        path: absolutePath,
                        error: 'FILE_NOT_FOUND'
                    }
                });
            }
            
            processState.fileOperations.totalReads++;
            processState.fileOperations.failedReads++;
            return '';
        }
        
        // Get file stats
        const stats = fs.statSync(absolutePath);
        
        if (!stats.isFile()) {
            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'ERROR',
                    source: 'Document to text',
                    message: `Path is not a file: ${absolutePath}`,
                    data: {
                        path: absolutePath,
                        error: 'NOT_A_FILE'
                    }
                });
            }
            
            processState.fileOperations.totalReads++;
            processState.fileOperations.failedReads++;
            return '';
        }
        
        const startTime = Date.now();
        
        // Read the file content
        const content = fs.readFileSync(absolutePath, encoding);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Update statistics
        processState.fileOperations.totalReads++;
        processState.fileOperations.successfulReads++;
        processState.fileOperations.lastOperation = new Date();
        processState.fileOperations.totalBytesRead += stats.size;
        
        processState.fileOperations.recentOperations.push({
            timestamp: new Date(),
            operation: 'READ',
            path: absolutePath,
            size: stats.size,
            encoding: encoding,
            duration: duration,
            success: true
        });
        
        // Limit recent operations history
        if (processState.fileOperations.recentOperations.length > 100) {
            processState.fileOperations.recentOperations.shift();
        }
        
        // Log the successful operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Document to text',
                message: `Successfully read file: ${path.basename(absolutePath)} (${stats.size} bytes, ${duration}ms)`,
                data: {
                    path: absolutePath,
                    size: stats.size,
                    encoding: encoding,
                    duration: duration,
                    contentLength: content.length,
                    totalReads: processState.fileOperations.totalReads
                }
            });
        }
        
        // Warn about large files
        if (stats.size > 10 * 1024 * 1024) { // 10MB
            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'WARN',
                    source: 'Document to text',
                    message: `Large file read: ${path.basename(absolutePath)} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`,
                    data: {
                        path: absolutePath,
                        sizeMB: (stats.size / 1024 / 1024).toFixed(2),
                        suggestion: 'Consider streaming for large files'
                    }
                });
            }
        }
        
        return content;
        
    } catch (error) {
        console.error('Document to text error:', error);
        
        // Update failed operations counter
        if (processState.fileOperations) {
            processState.fileOperations.totalReads++;
            processState.fileOperations.failedReads++;
            
            processState.fileOperations.recentOperations.push({
                timestamp: new Date(),
                operation: 'READ',
                path: docRef,
                error: error.message,
                success: false
            });
        }
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Document to text',
                message: `Failed to read document: ${error.message}`,
                data: {
                    docRef: docRef,
                    charSet: charSet,
                    error: error.message,
                    code: error.code || 'READ_ERROR'
                }
            });
        }
        
        return '';
    }
}
