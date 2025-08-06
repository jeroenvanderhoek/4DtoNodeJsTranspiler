// 4D command: START TRANSACTION
// Begins a new database transaction for atomic operations
// Based on 4D v20 documentation: Initiates a transaction that groups multiple operations
// Essential for backend data integrity and ACID compliance
// START TRANSACTION
// No parameters required

export default function START_TRANSACTION(processState) {
    try {
        if (!processState) {
            throw new Error('processState is required');
        }

        // Initialize transaction statistics
        if (!processState.transactionStats) {
            processState.transactionStats = {
                totalStarted: 0,
                totalCommitted: 0,
                totalRolledBack: 0,
                totalFailed: 0,
                activeTransactions: [],
                recentTransactions: [],
                lastTransaction: null
            };
        }

        // Check if there's already an active transaction
        if (processState.transactionStats.activeTransactions.length > 0) {
            const activeCount = processState.transactionStats.activeTransactions.length;
            console.warn(`START TRANSACTION: ${activeCount} active transaction(s) already exist - nested transaction started`);
        }

        // Create new transaction
        const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const transaction = {
            id: transactionId,
            startTime: new Date(),
            status: 'ACTIVE',
            operations: [],
            rollbackPoints: [],
            isolationLevel: 'READ_COMMITTED',
            timeout: 30000, // 30 seconds default timeout
            createdBy: processState.currentUser || 'system'
        };

        // Add to active transactions
        processState.transactionStats.activeTransactions.push(transaction);
        processState.transactionStats.totalStarted++;
        processState.transactionStats.lastTransaction = new Date();

        // Initialize database state if not exists
        if (!processState.database) {
            processState.database = {
                tables: {},
                currentSelection: {},
                schema: { tables: {} },
                defaultTable: null,
                recordHistory: [],
                transactionState: {
                    currentTransaction: transaction,
                    pendingChanges: {},
                    originalStates: {}
                }
            };
        } else {
            // Store original database state for rollback
            processState.database.transactionState = {
                currentTransaction: transaction,
                pendingChanges: {},
                originalStates: {}
            };
        }

        // Store in recent transactions
        processState.transactionStats.recentTransactions.push({
            timestamp: new Date(),
            transactionId: transactionId,
            action: 'START',
            status: 'ACTIVE'
        });

        // Limit recent transactions history
        if (processState.transactionStats.recentTransactions.length > 100) {
            processState.transactionStats.recentTransactions.shift();
        }

        // Log the operation
        if (!processState.logs) {
            processState.logs = [];
        }

        processState.logs.push({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: `Transaction started: ${transactionId}`,
            command: 'START TRANSACTION',
            transactionId: transactionId,
            activeTransactions: processState.transactionStats.activeTransactions.length,
            totalStarted: processState.transactionStats.totalStarted
        });

        return transaction;

    } catch (error) {
        // Update failure statistics
        if (processState && processState.transactionStats) {
            processState.transactionStats.totalFailed++;
            processState.transactionStats.recentTransactions.push({
                timestamp: new Date(),
                transactionId: null,
                action: 'START',
                status: 'FAILED',
                error: error.message
            });
        }

        if (processState && processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                message: `START TRANSACTION command error: ${error.message}`,
                command: 'START TRANSACTION',
                error: error.stack
            });
        }

        throw new Error(`START TRANSACTION command failed: ${error.message}`);
    }
}
