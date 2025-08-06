// 4D command: ZIP Read archive
// Extracts and reads contents from a ZIP archive file
// Based on 4D patterns: Essential for backend file extraction, archive processing, and data recovery operations
// Enables server-side extraction of ZIP archives for file processing, backup restoration, and data access
// ZIP Read archive ( archivePath ; extractPath {; filterPattern} ) -> Function result
// archivePath       String    ->    Path to the ZIP archive file to read
// extractPath       String    ->    Path where files will be extracted (optional, if empty only lists contents)
// filterPattern     String    ->    Optional filter pattern for specific files (*.txt, *.js, etc.)
// Function result   Object    <-    Object containing archive info and extracted files list

import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

export default function ZIP_Read_archive(processState, archivePath, extractPath = '', filterPattern = '') {
    try {
        // Validate archive path
        if (typeof archivePath !== 'string' || !archivePath) {
            console.error('ZIP Read archive: Archive path is required and must be a string');
            return null;
        }

        // Convert to absolute path if needed
        const absoluteArchivePath = path.isAbsolute(archivePath) ? archivePath : path.resolve(process.cwd(), archivePath);

        // Check if archive file exists
        if (!fs.existsSync(absoluteArchivePath)) {
            console.error(`ZIP Read archive: Archive file does not exist: ${absoluteArchivePath}`);
            return null;
        }

        // Check if file is actually a file
        const archiveStats = fs.statSync(absoluteArchivePath);
        if (!archiveStats.isFile()) {
            console.error(`ZIP Read archive: Path is not a file: ${absoluteArchivePath}`);
            return null;
        }

        // Create AdmZip instance
        const zip = new AdmZip(absoluteArchivePath);
        const zipEntries = zip.getEntries();

        // Prepare result object
        const result = {
            archivePath: absoluteArchivePath,
            extractPath: extractPath || null,
            totalFiles: 0,
            totalSize: 0,
            extractedFiles: [],
            filteredFiles: [],
            errors: [],
            success: true
        };

        // Apply filter pattern if provided
        let filesToProcess = zipEntries;
        if (filterPattern && filterPattern.trim() !== '') {
            const pattern = filterPattern.replace(/\*/g, '.*').replace(/\?/g, '.');
            const regex = new RegExp(pattern, 'i');
            filesToProcess = zipEntries.filter(entry => regex.test(entry.entryName));
            result.filterPattern = filterPattern;
        }

        // Process entries
        for (const entry of zipEntries) {
            if (!entry.isDirectory) {
                result.totalFiles++;
                result.totalSize += entry.header.size;

                const fileInfo = {
                    name: entry.entryName,
                    size: entry.header.size,
                    compressedSize: entry.header.compressedSize,
                    date: entry.header.time,
                    crc: entry.header.crc,
                    method: entry.header.method
                };

                // Check if file matches filter
                if (filterPattern && filterPattern.trim() !== '') {
                    const pattern = filterPattern.replace(/\*/g, '.*').replace(/\?/g, '.');
                    const regex = new RegExp(pattern, 'i');
                    if (regex.test(entry.entryName)) {
                        result.filteredFiles.push(fileInfo);
                    }
                } else {
                    result.filteredFiles.push(fileInfo);
                }
            }
        }

        // Extract files if extraction path is provided
        if (extractPath && extractPath.trim() !== '') {
            const absoluteExtractPath = path.isAbsolute(extractPath) ? extractPath : path.resolve(process.cwd(), extractPath);

            // Create extraction directory if it doesn't exist
            if (!fs.existsSync(absoluteExtractPath)) {
                fs.mkdirSync(absoluteExtractPath, { recursive: true });
            }

            // Extract files
            for (const entry of filesToProcess) {
                if (!entry.isDirectory) {
                    try {
                        const extractedPath = path.join(absoluteExtractPath, entry.entryName);
                        
                        // Ensure directory exists
                        const extractedDir = path.dirname(extractedPath);
                        if (!fs.existsSync(extractedDir)) {
                            fs.mkdirSync(extractedDir, { recursive: true });
                        }

                        // Extract file
                        const fileData = zip.readFile(entry);
                        fs.writeFileSync(extractedPath, fileData);

                        result.extractedFiles.push({
                            name: entry.entryName,
                            extractedPath: extractedPath,
                            size: entry.header.size
                        });

                    } catch (extractError) {
                        const errorInfo = {
                            file: entry.entryName,
                            error: extractError.message
                        };
                        result.errors.push(errorInfo);
                        console.error(`ZIP Read archive: Error extracting ${entry.entryName}: ${extractError.message}`);
                    }
                }
            }

            result.extractPath = absoluteExtractPath;
        }

        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'ZIP Read archive',
                message: `Archive processed: ${result.totalFiles} files, ${result.extractedFiles.length} extracted`,
                data: {
                    archivePath: absoluteArchivePath,
                    extractPath: result.extractPath,
                    totalFiles: result.totalFiles,
                    extractedFiles: result.extractedFiles.length,
                    hasErrors: result.errors.length > 0,
                    filterUsed: !!filterPattern
                }
            });
        }

        return result;

    } catch (error) {
        console.error(`ZIP Read archive: An error occurred - ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'ZIP Read archive',
                message: `Error reading archive: ${error.message}`,
                data: { error: error.message, archivePath: archivePath }
            });
        }
        return {
            success: false,
            error: error.message,
            archivePath: archivePath
        };
    }
}
