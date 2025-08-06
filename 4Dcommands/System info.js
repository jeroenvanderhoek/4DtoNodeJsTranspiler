// 4D command: System info
// Returns comprehensive system information including hardware and software details
// Based on 4D v20 documentation: Provides detailed information about the operating system and hardware characteristics
// System info -> Function result  
// Function result\t\tObject\t\tObject containing system information

import os from 'os';

export default async function System_info(processState) {
    try {
        // Get basic system information synchronously
        const basicInfo = {
            accountName: os.userInfo().username,
            userName: os.userInfo().username,
            machineName: os.hostname(),
            osVersion: `${os.type()} ${os.release()}`,
            osLanguage: process.env.LANG ? process.env.LANG.split('.')[0].replace('_', '-') : 'en',
            processor: 'Unknown',
            cores: os.cpus().length,
            cpuThreads: os.cpus().length,
            physicalMemory: Math.round(os.totalmem() / 1024), // Convert to KB
            uptime: Math.round(os.uptime()),
            model: 'Unknown',
            macRosetta: false, // Will be detected for macOS
            networkInterfaces: [],
            volumes: []
        };

        try {
            // Try to load systeminformation module dynamically
            const si = await import('systeminformation');
            
            // Try to get more detailed system information with timeout
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('System info timeout')), 3000)
            );
            
            const systemPromise = Promise.all([
                si.cpu(),
                si.system(),
                si.mem(),
                si.fsSize(),
                si.networkInterfaces()
            ]);
            
            const [cpu, system, mem, fsSize, networkStats] = await Promise.race([
                systemPromise,
                timeoutPromise
            ]);

            // Enhanced CPU information
            if (cpu.brand) {
                basicInfo.processor = cpu.brand;
            }
            if (cpu.cores) {
                basicInfo.cores = cpu.cores;
            }
            if (cpu.processors) {
                basicInfo.cpuThreads = cpu.processors;
            }

            // System information
            if (system.manufacturer && system.model) {
                basicInfo.model = `${system.manufacturer} ${system.model}`;
            } else if (system.model) {
                basicInfo.model = system.model;
            }

            // Memory information (convert to KB)
            if (mem.total) {
                basicInfo.physicalMemory = Math.round(mem.total / 1024);
            }

            // Network interfaces
            if (networkStats && Array.isArray(networkStats)) {
                basicInfo.networkInterfaces = networkStats
                    .filter(iface => !iface.internal && iface.ip4)
                    .map(iface => ({
                        type: iface.type || 'ethernet',
                        name: iface.iface,
                        ipAddresses: [
                            {
                                type: 'ipV4',
                                ip: iface.ip4
                            },
                            ...(iface.ip6 ? [{
                                type: 'ipV6', 
                                ip: iface.ip6
                            }] : [])
                        ]
                    }));
            }

            // File system / volumes information
            if (fsSize && Array.isArray(fsSize)) {
                basicInfo.volumes = fsSize.map(vol => ({
                    mountPoint: vol.mount,
                    capacity: Math.round(vol.size / 1024), // Convert to KB
                    available: Math.round(vol.available / 1024), // Convert to KB
                    fileSystem: vol.type,
                    disk: {
                        identifier: vol.mount,
                        interface: 'Unknown',
                        size: Math.round(vol.size / 1024),
                        description: `${vol.type} Volume`
                    }
                }));
            }

        } catch (siError) {
            console.warn('System info: Could not get detailed system information:', siError.message);
            // Continue with basic information
        }

        // Detect Rosetta on macOS (simplified detection)
        if (os.platform() === 'darwin') {
            try {
                basicInfo.macRosetta = process.arch === 'x64' && os.arch() === 'arm64';
            } catch (error) {
                basicInfo.macRosetta = false;
            }
        }

        // Add fallback network interface if none detected
        if (basicInfo.networkInterfaces.length === 0) {
            const networkInterfaces = os.networkInterfaces();
            for (const [name, interfaces] of Object.entries(networkInterfaces)) {
                const activeInterface = interfaces?.find(iface => !iface.internal && iface.family === 'IPv4');
                if (activeInterface) {
                    basicInfo.networkInterfaces.push({
                        type: 'ethernet',
                        name: name,
                        ipAddresses: [{
                            type: 'ipV4',
                            ip: activeInterface.address
                        }]
                    });
                }
            }
        }

        // Store in processState for debugging
        if (processState.systemInfo) {
            processState.systemInfo.push({
                timestamp: new Date().toISOString(),
                info: basicInfo
            });
        } else {
            processState.systemInfo = [{
                timestamp: new Date().toISOString(),
                info: basicInfo
            }];
        }

        return basicInfo;

    } catch (error) {
        console.error('System info error:', error.message);
        
        // Return minimal fallback information
        return {
            accountName: os.userInfo().username || 'unknown',
            userName: os.userInfo().username || 'unknown',
            machineName: os.hostname() || 'unknown',
            osVersion: `${os.type()} ${os.release()}` || 'unknown',
            osLanguage: 'en',
            processor: 'Unknown',
            cores: os.cpus().length || 1,
            cpuThreads: os.cpus().length || 1,
            physicalMemory: Math.round(os.totalmem() / 1024) || 0,
            uptime: Math.round(os.uptime()) || 0,
            model: 'Unknown',
            macRosetta: false,
            networkInterfaces: [],
            volumes: []
        };
    }
}
