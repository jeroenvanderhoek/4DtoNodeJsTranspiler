// 4D command: WRITE PICTURE FILE
// Saves a picture variable to a file on disk in the specified format
// Based on 4D v20 patterns: Writes picture data to filesystem with support for multiple image formats
// Essential for backend server operations requiring image processing, thumbnail generation, and file storage
// WRITE PICTURE FILE ( fileName ; picture {; codec} )
// fileName    String     ->    Path and name of the file to create
// picture     Picture    ->    Picture variable to save (in Node.js, this is image data)
// codec       String     ->    Optional image format codec (default: determined by file extension)

import fs from 'fs';
import path from 'path';

export default function WRITE_PICTURE_FILE(processState, fileName, picture, codec = '') {
    try {
        // Validate input parameters
        if (typeof fileName !== 'string' || !fileName.trim()) {
            console.error('WRITE PICTURE FILE: File name is required and must be a string');
            return;
        }
        if (!picture) {
            console.error('WRITE PICTURE FILE: Picture data is required');
            return;
        }
        if (typeof codec !== 'string') {
            console.error('WRITE PICTURE FILE: Codec must be a string');
            return;
        }

        const cleanFileName = fileName.trim();
        const cleanCodec = codec.trim();

        // Resolve file path (absolute or relative to current working directory)
        const absolutePath = path.isAbsolute(cleanFileName) ? cleanFileName : path.resolve(process.cwd(), cleanFileName);
        
        // Ensure directory exists
        const directory = path.dirname(absolutePath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        // Determine format from codec or file extension
        let format = '';
        if (cleanCodec) {
            // Use provided codec
            format = cleanCodec.startsWith('.') ? cleanCodec.substring(1) : cleanCodec;
            format = format.toLowerCase();
        } else {
            // Determine from file extension
            const ext = path.extname(absolutePath).toLowerCase();
            format = ext.startsWith('.') ? ext.substring(1) : ext;
        }

        // Map common formats
        const formatMap = {
            'jpg': 'jpeg',
            'jpeg': 'jpeg',
            'png': 'png',
            'gif': 'gif',
            'bmp': 'bmp',
            'tiff': 'tiff',
            'tif': 'tiff',
            'webp': 'webp',
            'svg': 'svg'
        };

        const normalizedFormat = formatMap[format] || 'png'; // Default to PNG

        // Handle different picture data types
        let imageBuffer;
        
        if (Buffer.isBuffer(picture)) {
            // Picture is already a buffer (binary image data)
            imageBuffer = picture;
        } else if (typeof picture === 'string') {
            if (picture.startsWith('data:image/')) {
                // Data URL format
                const base64Data = picture.split(',')[1];
                imageBuffer = Buffer.from(base64Data, 'base64');
            } else if (picture.startsWith('http')) {
                // URL - this would require HTTP request, not implemented here for security
                console.error('WRITE PICTURE FILE: HTTP URLs not supported for security reasons');
                return;
            } else {
                // Check if it might be SVG content or a file path
                if (normalizedFormat === 'svg' && picture.trim().startsWith('<')) {
                    // Looks like SVG content, treat as string data
                    imageBuffer = Buffer.from(picture, 'utf8');
                } else if (fs.existsSync(picture)) {
                    // It's a file path to copy from
                    imageBuffer = fs.readFileSync(picture);
                } else {
                    console.error(`WRITE PICTURE FILE: Source picture file not found: ${picture}`);
                    return;
                }
            }
        } else if (typeof picture === 'object' && picture.data) {
            // Object with data property (common in image processing libraries)
            imageBuffer = Buffer.from(picture.data);
        } else {
            console.error('WRITE PICTURE FILE: Unsupported picture data format');
            return;
        }

        // For Node.js backend, we'll write the raw image data
        // In a full implementation, you might want to use sharp or jimp for format conversion
        if (normalizedFormat === 'svg' && typeof picture === 'string' && !picture.startsWith('data:')) {
            // Special handling for SVG (text format) - only if it's not a data URL
            fs.writeFileSync(absolutePath, picture, 'utf8');
        } else {
            // Write binary image data
            fs.writeFileSync(absolutePath, imageBuffer);
        }

        // Track file operations in processState
        if (!processState.fileOperations) {
            processState.fileOperations = [];
        }

        processState.fileOperations.push({
            operation: 'WRITE_PICTURE_FILE',
            path: absolutePath,
            format: normalizedFormat,
            size: imageBuffer ? imageBuffer.length : 0,
            timestamp: new Date().toISOString()
        });

        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'WRITE PICTURE FILE',
                message: `Picture file written: ${absolutePath}`,
                data: {
                    filePath: absolutePath,
                    format: normalizedFormat,
                    fileSize: imageBuffer ? imageBuffer.length : 0,
                    directory: directory
                }
            });
        }

        console.log(`WRITE PICTURE FILE: Successfully wrote ${absolutePath} (${normalizedFormat} format)`);

    } catch (error) {
        console.error(`WRITE PICTURE FILE: An error occurred - ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'WRITE PICTURE FILE',
                message: `Error writing picture file: ${error.message}`,
                data: { 
                    error: error.message, 
                    fileName: fileName,
                    codec: codec
                }
            });
        }
    }
}
