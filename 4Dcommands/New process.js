// 4D command: New process
// Creates a new process and returns its process ID
// Based on 4D v20 documentation: Starts a new process and returns its process number
// New process ( method ; stack ; name ; param ; param2 ; ... ; paramN ; * ) -> Function result
// Parameter		Type		Description
// method		String		Method to execute in the new process
// stack		Longint		Stack size in bytes (use 0 for default)
// name			String		Name of the new process
// param		Variant		Parameters to pass to the method (optional)
// *			Operator	Unique process flag (optional)
// Function result	Longint		Process ID of the newly created process

import { Worker } from 'worker_threads';
import path from 'path';

export default function New_process(processState, method, stack = 0, name = '', ...params) {
    if (!method || typeof method !== 'string') {
        console.warn('New process: Method parameter is required');
        return 0;
    }
    
    try {
        // Initialize process manager if not exists
        if (!processState.processManager) {
            processState.processManager = {
                processes: [],
                nextProcessId: 1000
            };
        }
        
        const processId = processState.processManager.nextProcessId++;
        const processName = name || `Process_${processId}`;
        
        // Check for unique process flag (last parameter is *)
        const uniqueProcess = params.length > 0 && params[params.length - 1] === '*';
        if (uniqueProcess) {
            params.pop(); // Remove the * flag from parameters
            
            // Check if a process with this name already exists
            const existingProcess = processState.processManager.processes.find(
                p => p.name === processName && !p.terminated
            );
            if (existingProcess) {
                console.log(`Unique process '${processName}' already exists with ID ${existingProcess.id}`);
                return existingProcess.id;
            }
        }
        
        // Create process object
        const newProcess = {
            id: processId,
            name: processName,
            method: method,
            parameters: params,
            createdAt: new Date().toISOString(),
            terminated: false,
            aborted: false,
            delayed: false,
            stack: stack || 65536 // Default stack size 64KB
        };
        
        // For backend server context, we simulate process creation
        // In a real implementation, this might create a Worker thread or child process
        if (typeof Worker !== 'undefined') {
            try {
                // This is a simplified example - in practice you'd need a worker script
                // that can execute 4D methods
                newProcess.simulated = true;
                console.log(`Simulated process '${processName}' (ID: ${processId}) for method '${method}'`);
            } catch (error) {
                console.warn('Could not create worker thread, using simulation mode');
                newProcess.simulated = true;
            }
        } else {
            newProcess.simulated = true;
            console.log(`Simulated process '${processName}' (ID: ${processId}) for method '${method}'`);
        }
        
        // Add to process list
        processState.processManager.processes.push(newProcess);
        
        // Log the process creation
        if (processState.logEvents) {
            processState.logEvents.push({
                timestamp: new Date().toISOString(),
                type: 1, // Info level
                typeName: 'INFO',
                message: `New process created: '${processName}' (ID: ${processId}) executing method '${method}'`
            });
        }
        
        return processId;
        
    } catch (error) {
        console.error('New process error:', error.message);
        return 0;
    }
}
