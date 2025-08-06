// 4D command: Folder
// Creates a folder object from a path
// Folder ( path {; pathType} ) -> Function result
// Parameter		Type		Description
// path		String		Folder path
// pathType		Longint		Path type (optional)
// Function result		Object		Folder object with properties and methods

import fs from 'fs';
import path from 'path';

export default function Folder(processState, folderPath, pathType = 0) {
    if (!folderPath || typeof folderPath !== 'string') {
        return null;
    }
    
    // Resolve the path
    const resolvedPath = path.resolve(folderPath);
    
    // Create folder object with 4D-like properties
    const folderObject = {
        path: resolvedPath,
        name: path.basename(resolvedPath),
        exists: false,
        creationDate: null,
        modificationDate: null,
        
        // Methods
        create: function() {
            try {
                fs.mkdirSync(resolvedPath, { recursive: true });
                return true;
            } catch (error) {
                return false;
            }
        },
        
        delete: function() {
            try {
                fs.rmSync(resolvedPath, { recursive: true, force: true });
                return true;
            } catch (error) {
                return false;
            }
        },
        
        files: function() {
            try {
                const entries = fs.readdirSync(resolvedPath, { withFileTypes: true });
                return entries
                    .filter(entry => entry.isFile())
                    .map(entry => File(processState, path.join(resolvedPath, entry.name)));
            } catch (error) {
                return [];
            }
        },
        
        folders: function() {
            try {
                const entries = fs.readdirSync(resolvedPath, { withFileTypes: true });
                return entries
                    .filter(entry => entry.isDirectory())
                    .map(entry => Folder(processState, path.join(resolvedPath, entry.name)));
            } catch (error) {
                return [];
            }
        },
        
        file: function(name) {
            return File(processState, path.join(resolvedPath, name));
        },
        
        folder: function(name) {
            return Folder(processState, path.join(resolvedPath, name));
        }
    };
    
    // Check if folder exists and get stats
    try {
        const stats = fs.statSync(resolvedPath);
        if (stats.isDirectory()) {
            folderObject.exists = true;
            folderObject.creationDate = stats.birthtime;
            folderObject.modificationDate = stats.mtime;
        }
    } catch (error) {
        // Folder doesn't exist, keep default values
    }
    
    return folderObject;
}