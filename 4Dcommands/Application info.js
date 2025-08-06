// 4D command: Application info  
// Returns information about the current 4D application instance
// Provides details about the application version, build, and environment settings
// Based on common 4D patterns - returns object with application metadata
// Application info -> Function result
// Function result\t\tObject\t\tObject containing application information

import fs from 'fs';
import path from 'path';

export default function Application_info(processState) {
    try {
        // Create basic application information object
        const appInfo = {
            name: '4D JavaScript Transpiler',
            version: '1.0.0',
            build: '1000',
            type: 'standalone', // standalone, server, or remote
            mode: 'development', // development or production
            language: 'en',
            platform: process.platform,
            architecture: process.arch,
            nodeVersion: process.version,
            startupTime: new Date().toISOString(),
            pid: process.pid,
            workingDirectory: process.cwd(),
            environment: process.env.NODE_ENV || 'development',
            features: {
                webServer: true,
                database: true,
                networking: true,
                fileSystem: true
            }
        };

        // Try to read package.json for more accurate version info
        try {
            const packagePath = path.join(process.cwd(), 'package.json');
            if (fs.existsSync(packagePath)) {
                const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                if (packageJson.name) appInfo.name = packageJson.name;
                if (packageJson.version) appInfo.version = packageJson.version;
                if (packageJson.description) appInfo.description = packageJson.description;
            }
        } catch (error) {
            // Ignore package.json read errors, use defaults
        }

        // Use application info from processState if available
        if (processState.applicationInfo) {
            Object.assign(appInfo, processState.applicationInfo);
        }

        // Store in processState for consistency
        if (!processState.applicationInfo) {
            processState.applicationInfo = appInfo;
        }

        // Log the application info request
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Application info',
                message: `Application info requested: ${appInfo.name} v${appInfo.version}`,
                data: { appInfo }
            });
        }

        return appInfo;

    } catch (error) {
        console.error('Application info error:', error.message);
        
        // Return minimal fallback information
        return {
            name: '4D JavaScript Transpiler',
            version: '1.0.0',
            build: '1000',
            type: 'standalone',
            mode: 'development',
            language: 'en',
            platform: process.platform || 'unknown',
            architecture: process.arch || 'unknown',
            nodeVersion: process.version || 'unknown',
            startupTime: new Date().toISOString(),
            pid: process.pid || 0,
            workingDirectory: process.cwd() || '',
            environment: 'development',
            features: {
                webServer: false,
                database: false,
                networking: false,
                fileSystem: false
            }
        };
    }
}
