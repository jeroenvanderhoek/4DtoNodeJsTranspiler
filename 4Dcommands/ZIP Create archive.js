// 4D command: ZIP Create archive
// Creates a ZIP archive containing files and folders
// Based on 4D v20 documentation: Creates a ZIP archive from specified files and folders
// ZIP Create archive ( archivePath ; filesToZip {; password {; compressionLevel}} )
// Parameter		Type		Description
// archivePath		Text		Path to the ZIP archive to create
// filesToZip		Text		Path to file or folder to add to archive, or array of paths
// password		Text		Optional: Password to protect the archive
// compressionLevel	Integer		Optional: Compression level (0-9, default: 6)

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

export default async function ZIP_Create_archive(processState, archivePath, filesToZip, password = null, compressionLevel = 6) {
    try {
        // Validate inputs
        if (!archivePath || typeof archivePath !== 'string') {
            console.warn('ZIP Create archive: Invalid archive path');
            return false;
        }

        if (!filesToZip) {
            console.warn('ZIP Create archive: No files specified to zip');
            return false;
        }

        // Validate compression level
        if (compressionLevel < 0 || compressionLevel > 9) {
            console.warn('ZIP Create archive: Invalid compression level, using default (6)');
            compressionLevel = 6;
        }

        // Initialize ZIP stats if not exists
        if (!processState.zipStats) {
            processState.zipStats = {
                totalArchives: 0,
                totalFiles: 0,
                totalSize: 0,
                lastArchive: null
            };
        }

        // Create output directory if it doesn't exist
        const archiveDir = path.dirname(archivePath);
        if (!fs.existsSync(archiveDir)) {
            fs.mkdirSync(archiveDir, { recursive: true });
        }

        // Create a write stream for the archive
        const output = fs.createWriteStream(archivePath);
        const archive = archiver('zip', {
            zlib: { level: compressionLevel }
        });

        // Set password if provided
        if (password) {
            archive.password(password);
        }

        // Handle promise rejection
        output.on('close', () => {
            const stats = fs.statSync(archivePath);
            processState.zipStats.totalArchives++;
            processState.zipStats.totalSize += stats.size;
            processState.zipStats.lastArchive = new Date().toISOString();

            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'INFO',
                    source: 'ZIP Create archive',
                    message: `ZIP archive created successfully: ${archivePath}`,
                    data: {
                        archivePath: archivePath,
                        size: stats.size,
                        compressionLevel: compressionLevel,
                        hasPassword: !!password
                    }
                });
            }
        });

        // Handle errors
        archive.on('error', (err) => {
            console.error('ZIP Create archive error:', err);
            if (processState.logs) {
                processState.logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'ERROR',
                    source: 'ZIP Create archive',
                    message: `Error creating ZIP archive: ${err.message}`,
                    data: { error: err.message, archivePath: archivePath }
                });
            }
        });

        // Pipe archive data to the file
        archive.pipe(output);

        // Add files to archive
        let fileCount = 0;
        const addToArchive = (source) => {
            if (fs.existsSync(source)) {
                const stats = fs.statSync(source);
                if (stats.isDirectory()) {
                    archive.directory(source, path.basename(source));
                    fileCount++;
                } else if (stats.isFile()) {
                    archive.file(source, { name: path.basename(source) });
                    fileCount++;
                }
            } else {
                console.warn(`ZIP Create archive: File/folder not found: ${source}`);
            }
        };

        // Handle single file/folder or array
        if (Array.isArray(filesToZip)) {
            filesToZip.forEach(addToArchive);
        } else {
            addToArchive(filesToZip);
        }

        // Update stats
        processState.zipStats.totalFiles += fileCount;

        // Finalize the archive
        await archive.finalize();

        return true;

    } catch (error) {
        console.error(`ZIP Create archive error: ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'ZIP Create archive',
                message: `Error creating ZIP archive: ${error.message}`,
                data: { error: error.message, stack: error.stack, archivePath: archivePath }
            });
        }
        return false;
    }
}
