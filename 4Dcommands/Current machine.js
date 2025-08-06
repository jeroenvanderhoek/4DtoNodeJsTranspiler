// 4D command: Current machine
// Returns comprehensive information about the current machine and system environment
// Based on 4D v20 documentation: Provides machine identification and system characteristics
// Essential for backend logging, system monitoring, and environment-specific configurations
// Current machine {-> machineInfo}
// Returns:    Object    -> Machine information including hostname, OS, hardware specs

import os from 'os';
import { networkInterfaces } from 'os';

export default function Current_machine(processState) {
    try {
        // Get comprehensive machine information
        const machineInfo = {
            // Basic machine identification
            hostname: os.hostname(),
            platform: os.platform(),
            architecture: os.arch(),
            type: os.type(),
            release: os.release(),
            
            // Hardware information
            cpus: os.cpus().length,
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            
            // Process information
            nodeVersion: process.version,
            pid: process.pid,
            
            // User information
            userInfo: {
                username: os.userInfo().username,
                homedir: os.homedir(),
                uid: os.userInfo().uid || null,
                gid: os.userInfo().gid || null
            },
            
            // System timing
            uptime: os.uptime(),
            loadavg: os.loadavg(),
            
            // Network interfaces
            networkInterfaces: Object.entries(networkInterfaces()).map(([name, interfaces]) => ({
                name,
                type: 'ethernet', // Default type
                addresses: interfaces.map(iface => ({
                    address: iface.address,
                    netmask: iface.netmask,
                    family: iface.family,
                    mac: iface.mac,
                    internal: iface.internal
                }))
            })),
            
            // Environment
            environment: process.env.NODE_ENV || 'development',
            workingDirectory: process.cwd(),
            
            // Timestamp
            timestamp: new Date().toISOString()
        };
        
        // Cache machine information in processState
        if (!processState.machineInfo) {
            processState.machineInfo = {
                requestCount: 0,
                firstRequested: new Date(),
                lastUpdated: null
            };
        }
        
        processState.machineInfo.requestCount++;
        processState.machineInfo.lastUpdated = new Date();
        processState.machineInfo.current = machineInfo;
        
        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Current machine',
                message: `Machine info retrieved for ${machineInfo.hostname} (${machineInfo.platform})`,
                data: {
                    hostname: machineInfo.hostname,
                    platform: machineInfo.platform,
                    cpus: machineInfo.cpus,
                    totalMemory: Math.round(machineInfo.totalMemory / 1024 / 1024 / 1024 * 100) / 100 + ' GB'
                }
            });
        }
        
        return machineInfo;
        
    } catch (error) {
        console.error('Current machine error:', error);
        
        // Return minimal machine info on error
        return {
            hostname: 'unknown',
            platform: os.platform(),
            architecture: os.arch(),
            cpus: 1,
            totalMemory: 0,
            userInfo: {
                username: 'unknown',
                homedir: os.homedir()
            },
            timestamp: new Date().toISOString(),
            error: error.message
        };
    }
}
