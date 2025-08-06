// 4D command: Generate UUID
// Creates a new universally unique identifier following RFC 4122 standard
// Based on 4D v20 documentation: Generates a UUID string for unique identification across systems
// Essential for backend operations requiring unique record identifiers, session tokens, and API keys
// Generate UUID {-> uuid}
// Returns:    Text    -> Generated UUID string in format XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

import { v4 as uuidv4 } from 'uuid';

export default function Generate_UUID(processState) {
    try {
        // Generate a new UUID using the crypto-strong v4 algorithm
        const uuid = uuidv4();
        
        // Initialize UUID statistics if not exists
        if (!processState.uuidStats) {
            processState.uuidStats = {
                generated: 0,
                lastGenerated: null,
                recent: [] // Keep last 20 UUIDs for debugging
            };
        }
        
        // Update statistics
        processState.uuidStats.generated++;
        processState.uuidStats.lastGenerated = new Date();
        processState.uuidStats.recent.push({
            uuid: uuid,
            timestamp: new Date(),
            requestId: processState.uuidStats.generated
        });
        
        // Limit recent history to prevent memory growth
        if (processState.uuidStats.recent.length > 20) {
            processState.uuidStats.recent = processState.uuidStats.recent.slice(-20);
        }
        
        // Log the operation
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'Generate UUID',
                message: `UUID generated: ${uuid}`,
                data: {
                    uuid: uuid,
                    totalGenerated: processState.uuidStats.generated
                }
            });
        }
        
        return uuid;
        
    } catch (error) {
        console.error('Generate UUID error:', error);
        
        // Fallback UUID generation using timestamp and random numbers
        const timestamp = Date.now().toString(16);
        const random = Math.random().toString(16).substr(2, 8);
        const fallbackUuid = `${timestamp}-0000-4000-8000-${random}00000000`.substr(0, 36);
        
        return fallbackUuid;
    }
}
