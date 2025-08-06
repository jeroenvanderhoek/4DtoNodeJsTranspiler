// 4D command: File
// Creates a file object from a path
// File ( path {; pathType} ) -> Function result
// Parameter		Type		Description
// path		String		File path
// pathType		Longint		Path type (optional)
// Function result		Object		File object with properties and methods

import fs from 'fs';
import path from 'path';

export default function File(processState, filePath, pathType = 0) {
    if (!filePath || typeof filePath !== 'string') {
        return null;
    }
    
    // Resolve the path
    const resolvedPath = path.resolve(filePath);
    
    // Create file object with 4D-like properties
    const fileObject = {
        path: resolvedPath,
        name: path.basename(resolvedPath),
        extension: path.extname(resolvedPath),
        exists: false,
        isFolder: false,
        size: 0,
        creationDate: null,
        modificationDate: null,
        
        // Methods
        getText: function() {
            try {
                return fs.readFileSync(resolvedPath, 'utf8');
            } catch (error) {
                return '';
            }
        },
        
        setText: function(text) {
            try {
                fs.writeFileSync(resolvedPath, text, 'utf8');
                return true;
            } catch (error) {
                return false;
            }
        },
        
        delete: function() {
            try {
                fs.unlinkSync(resolvedPath);
                return true;
            } catch (error) {
                return false;
            }
        },
        
        copyTo: function(destination) {
            try {
                fs.copyFileSync(resolvedPath, destination);
                return true;
            } catch (error) {
                return false;
            }
        }
    };
    
    // Check if file exists and get stats
    try {
        const stats = fs.statSync(resolvedPath);
        fileObject.exists = true;
        fileObject.isFolder = stats.isDirectory();
        fileObject.size = stats.size;
        fileObject.creationDate = stats.birthtime;
        fileObject.modificationDate = stats.mtime;
    } catch (error) {
        // File doesn't exist, keep default values
    }
    
    return fileObject;
}