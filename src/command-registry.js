/**
 * 4D Command Registry
 * Centralized management of 4D commands and their JavaScript implementations
 */

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

export class CommandRegistry {
    constructor() {
        this.commands = new Map();
        this.implementations = new Map();
        this.categories = {
            'implemented': [],
            'placeholder': [],
            'client-only': [],
            'deprecated': [],
            'simple-replacement': []
        };
        this.stats = {
            total: 0,
            implemented: 0,
            placeholder: 0,
            clientOnly: 0,
            deprecated: 0,
            simpleReplacement: 0
        };
    }

    /**
     * Register a command with its implementation
     * @param {string} name - Command name
     * @param {string} implementation - Implementation file path or simple replacement
     * @param {string} category - Command category
     * @param {object} metadata - Additional metadata
     */
    register(name, implementation, category = 'implemented', metadata = {}) {
        const commandInfo = {
            name,
            implementation,
            category,
            metadata,
            registeredAt: new Date()
        };

        this.commands.set(name, commandInfo);
        this.categories[category].push(name);
        this.stats[category]++;
        this.stats.total++;

        if (category === 'simple-replacement') {
            this.implementations.set(name, implementation);
        }
    }

    /**
     * Get command implementation
     * @param {string} name - Command name
     * @returns {object|null} Command implementation info
     */
    getImplementation(name) {
        const command = this.commands.get(name);
        if (!command) return null;

        if (command.category === 'simple-replacement') {
            return {
                type: 'simple',
                value: command.implementation
            };
        }

        return {
            type: 'module',
            path: command.implementation,
            category: command.category
        };
    }

    /**
     * Check if command is implemented
     * @param {string} name - Command name
     * @returns {boolean} True if implemented
     */
    isImplemented(name) {
        const command = this.commands.get(name);
        return command && command.category === 'implemented';
    }

    /**
     * Get all unimplemented commands
     * @returns {Array} List of unimplemented command names
     */
    getUnimplementedCommands() {
        return [
            ...this.categories.placeholder,
            ...this.categories.clientOnly,
            ...this.categories.deprecated
        ];
    }

    /**
     * Get commands by category
     * @param {string} category - Category name
     * @returns {Array} List of commands in category
     */
    getCommandsByCategory(category) {
        return this.categories[category] || [];
    }

    /**
     * Get implementation statistics
     * @returns {object} Statistics object
     */
    getStats() {
        return { ...this.stats };
    }

    /**
     * Generate implementation report
     * @returns {object} Detailed implementation report
     */
    generateReport() {
        const report = {
            summary: this.getStats(),
            categories: {},
            recommendations: []
        };

        // Generate category reports
        for (const [category, commands] of Object.entries(this.categories)) {
            report.categories[category] = {
                count: commands.length,
                commands: commands.slice(0, 10), // Show first 10
                percentage: ((commands.length / this.stats.total) * 100).toFixed(1)
            };
        }

        // Generate recommendations
        if (this.stats.placeholder > this.stats.implemented * 0.5) {
            report.recommendations.push({
                type: 'warning',
                message: `High number of placeholder commands (${this.stats.placeholder}). Consider implementing critical ones.`
            });
        }

        if (this.stats.clientOnly > 0) {
            report.recommendations.push({
                type: 'info',
                message: `${this.stats.clientOnly} client-only commands detected. These won't be transpiled for server-side use.`
            });
        }

        return report;
    }
}

/**
 * Command Registry Builder
 * Automatically discovers and registers commands from the 4Dcommands directory
 */
export class CommandRegistryBuilder {
    constructor(commandsDir = '4Dcommands') {
        this.commandsDir = commandsDir;
        this.registry = new CommandRegistry();
    }

    /**
     * Build registry from commands directory
     * @returns {CommandRegistry} Populated command registry
     */
    build() {
        this.discoverCommands();
        this.categorizeCommands();
        this.registerSimpleReplacements();
        return this.registry;
    }

    /**
     * Discover all command files
     */
    discoverCommands() {
        const commandFiles = globSync(`${this.commandsDir}/**/*.js`);
        
        for (const file of commandFiles) {
            const commandName = this.extractCommandName(file);
            const content = fs.readFileSync(file, 'utf8');
            const category = this.determineCategory(content, commandName);
            
            this.registry.register(commandName, file, category, {
                filePath: file,
                fileSize: content.length,
                hasImplementation: this.hasImplementation(content)
            });
        }
    }

    /**
     * Extract command name from file path
     * @param {string} filePath - File path
     * @returns {string} Command name
     */
    extractCommandName(filePath) {
        const fileName = path.basename(filePath, '.js');
        return fileName;
    }

    /**
     * Determine command category based on content
     * @param {string} content - File content
     * @param {string} commandName - Command name
     * @returns {string} Category
     */
    determineCategory(content, commandName) {
        // Check for client-only indicators
        if (content.includes('client-only') || content.includes('CLIENT ONLY')) {
            return 'client-only';
        }

        // Check for deprecated indicators
        if (content.includes('deprecated') || content.includes('DEPRECATED')) {
            return 'deprecated';
        }

        // Check if it's a placeholder (very short files)
        if (content.length < 50) {
            return 'placeholder';
        }

        // Check if it has actual implementation
        if (this.hasImplementation(content)) {
            return 'implemented';
        }

        return 'placeholder';
    }

    /**
     * Check if file has actual implementation
     * @param {string} content - File content
     * @returns {boolean} True if has implementation
     */
    hasImplementation(content) {
        // Simple heuristics to detect actual implementation
        const hasExport = content.includes('export default');
        const hasFunction = content.includes('function') || content.includes('=>');
        const hasLogic = content.length > 100;
        const hasComments = content.includes('// TODO') || content.includes('FIXME');
        
        return hasExport && hasFunction && hasLogic && !hasComments;
    }

    /**
     * Categorize commands based on patterns
     */
    categorizeCommands() {
        // Move simple replacements to their own category
        const simpleReplacements = [
            'True', 'False', 'Null', 'Abs', 'Arctan', 'Sin', 'Cos', 'Tan'
        ];

        for (const command of simpleReplacements) {
            const existing = this.registry.commands.get(command);
            if (existing) {
                // Remove from current category
                const currentCategory = existing.category;
                const index = this.registry.categories[currentCategory].indexOf(command);
                if (index > -1) {
                    this.registry.categories[currentCategory].splice(index, 1);
                }
                
                // Add to simple-replacement category
                this.registry.register(command, existing.implementation, 'simple-replacement', existing.metadata);
            }
        }
    }

    /**
     * Register simple replacements from simple4dCommandReplacements.js
     */
    async registerSimpleReplacements() {
        try {
            const simpleReplacements = await import('./simple4dCommandReplacements.js');
            
            for (const [command, replacement] of Object.entries(simpleReplacements.default)) {
                if (!this.registry.commands.has(command)) {
                    this.registry.register(command, replacement, 'simple-replacement', {
                        type: 'simple-replacement',
                        replacement
                    });
                }
            }
        } catch (error) {
            console.warn('Could not load simple replacements:', error.message);
        }
    }
}

/**
 * Command Implementation Generator
 * Generates stub implementations for missing commands
 */
export class CommandGenerator {
    constructor(registry) {
        this.registry = registry;
    }

    /**
     * Generate stub for a command
     * @param {string} commandName - Command name
     * @param {object} signature - Command signature
     * @returns {string} Generated stub code
     */
    generateStub(commandName, signature = {}) {
        const functionName = this.sanitizeFunctionName(commandName);
        const params = signature.params || ['processState', '...args'];
        const returnType = signature.returnType || 'any';
        
        return `
// 4D command: ${commandName}
// TODO: Implement ${commandName}
// Signature: ${JSON.stringify(signature, null, 2)}

export default function ${functionName}(${params.join(', ')}) {
    console.warn('[WARNING] ${commandName} not implemented yet');
    
    // TODO: Implement actual functionality
    // Common patterns:
    // - Database operations: Use processState.pool
    // - Web operations: Use processState.req/res
    // - File operations: Use fs/path modules
    // - Math operations: Use Math.* functions
    
    return null;
}
`;
    }

    /**
     * Generate stubs for all placeholder commands
     * @param {string} outputDir - Output directory
     */
    async generateAllStubs(outputDir) {
        const placeholderCommands = this.registry.getCommandsByCategory('placeholder');
        
        for (const commandName of placeholderCommands) {
            const stub = this.generateStub(commandName);
            const filePath = path.join(outputDir, `${commandName}.js`);
            
            fs.writeFileSync(filePath, stub);
            console.log(`Generated stub for: ${commandName}`);
        }
    }

    /**
     * Sanitize function name for JavaScript
     * @param {string} commandName - Original command name
     * @returns {string} Sanitized function name
     */
    sanitizeFunctionName(commandName) {
        return commandName
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/^(\d)/, '_$1') // Handle leading numbers
            .toUpperCase();
    }
}

/**
 * Command Usage Analyzer
 * Analyzes which commands are actually used in the codebase
 */
export class CommandUsageAnalyzer {
    constructor(registry) {
        this.registry = registry;
        this.usage = new Map();
    }

    /**
     * Analyze command usage in source files
     * @param {Array} sourceFiles - List of source file paths
     */
    analyzeUsage(sourceFiles) {
        for (const file of sourceFiles) {
            const content = fs.readFileSync(file, 'utf8');
            this.analyzeFile(content, file);
        }
    }

    /**
     * Analyze single file for command usage
     * @param {string} content - File content
     * @param {string} filename - File name
     */
    analyzeFile(content, filename) {
        for (const [commandName, commandInfo] of this.registry.commands) {
            const pattern = new RegExp(`\\b${commandName}\\b`, 'g');
            const matches = content.match(pattern);
            
            if (matches) {
                if (!this.usage.has(commandName)) {
                    this.usage.set(commandName, []);
                }
                
                this.usage.get(commandName).push({
                    file: filename,
                    count: matches.length
                });
            }
        }
    }

    /**
     * Get usage report
     * @returns {object} Usage report
     */
    getUsageReport() {
        const report = {
            usedCommands: [],
            unusedCommands: [],
            criticalMissing: []
        };

        for (const [commandName, usages] of this.usage) {
            const commandInfo = this.registry.commands.get(commandName);
            const totalUsage = usages.reduce((sum, usage) => sum + usage.count, 0);
            
            report.usedCommands.push({
                name: commandName,
                category: commandInfo.category,
                usageCount: totalUsage,
                files: usages.map(u => u.file)
            });

            // Check for critical missing implementations
            if (commandInfo.category === 'placeholder' && totalUsage > 0) {
                report.criticalMissing.push({
                    name: commandName,
                    usageCount: totalUsage,
                    files: usages.map(u => u.file)
                });
            }
        }

        // Find unused commands
        for (const [commandName, commandInfo] of this.registry.commands) {
            if (!this.usage.has(commandName)) {
                report.unusedCommands.push({
                    name: commandName,
                    category: commandInfo.category
                });
            }
        }

        return report;
    }
} 