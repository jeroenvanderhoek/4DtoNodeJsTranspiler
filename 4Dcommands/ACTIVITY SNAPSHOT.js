// This 4D command is fixed and tested.
// 4D command: ACTIVITY SNAPSHOT
// Creates a snapshot of current database activity and process information
// Based on 4D v20 documentation: Captures a snapshot of current database activity for monitoring and debugging
// ACTIVITY SNAPSHOT -> Object
// Function result		Object		Snapshot object containing activity information

import os from 'os';
import process from 'process';

export default function ACTIVITY_SNAPSHOT(processState) {
    try {
        // Initialize activity stats if not exists
        if (!processState.activityStats) {
            processState.activityStats = {
                totalSnapshots: 0,
                lastSnapshot: null,
                snapshots: []
            };
        }

        // Create snapshot object
        const snapshot = {
            timestamp: new Date().toISOString(),
            system: {
                platform: os.platform(),
                arch: os.arch(),
                nodeVersion: process.version,
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage()
            },
            process: {
                pid: process.pid,
                processId: processState.processId || 'unknown',
                processManager: processState.processManager ? Object.keys(processState.processManager).length : 0
            },
            database: {
                tables: processState.database ? Object.keys(processState.database).length : 0,
                activeConnections: processState.databaseConnections || 0
            },
            webServer: {
                isRunning: processState.webServer ? processState.webServer.listening : false,
                port: processState.webServer ? processState.webServer.port : null,
                activeConnections: processState.webServerStats ? processState.webServerStats.activeConnections : 0
            },
            logs: {
                totalLogs: processState.logs ? processState.logs.length : 0,
                recentLogs: processState.logs ? processState.logs.slice(-10) : []
            },
            performance: {
                startTime: processState.startTime || new Date().toISOString(),
                currentTime: new Date().toISOString()
            }
        };

        // Update statistics
        processState.activityStats.totalSnapshots++;
        processState.activityStats.lastSnapshot = new Date().toISOString();
        processState.activityStats.snapshots.push(snapshot);

        // Keep only last 50 snapshots
        if (processState.activityStats.snapshots.length > 50) {
            processState.activityStats.snapshots = processState.activityStats.snapshots.slice(-50);
        }

        // Log the snapshot creation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'ACTIVITY SNAPSHOT',
                message: 'Activity snapshot created',
                data: {
                    snapshotId: processState.activityStats.totalSnapshots,
                    systemInfo: snapshot.system,
                    processInfo: snapshot.process
                }
            });
        }

        return snapshot;

    } catch (error) {
        console.error(`ACTIVITY SNAPSHOT error: ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'ACTIVITY SNAPSHOT',
                message: `Error creating activity snapshot: ${error.message}`,
                data: { error: error.message, stack: error.stack }
            });
        }
        return null;
    }
}
