/**
 * Transpiler Error Handling System
 * Provides comprehensive error reporting, validation, and debugging support
 */

export class TranspilationError extends Error {
    constructor(message, node, source, filename) {
        super(message);
        this.name = 'TranspilationError';
        this.node = node;
        this.source = source;
        this.filename = filename;
        this.line = node?.location?.start?.line || 0;
        this.column = node?.location?.start?.column || 0;
        this.severity = 'error';
    }
}

export class TranspilationWarning extends Error {
    constructor(message, node, source, filename) {
        super(message);
        this.name = 'TranspilationWarning';
        this.node = node;
        this.source = source;
        this.filename = filename;
        this.line = node?.location?.start?.line || 0;
        this.column = node?.location?.start?.column || 0;
        this.severity = 'warning';
    }
}

export class ErrorReporter {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.stats = {
            totalErrors: 0,
            totalWarnings: 0,
            filesWithErrors: 0,
            filesWithWarnings: 0
        };
    }

    /**
     * Report a transpilation error
     * @param {Error} error - Error object
     */
    reportError(error) {
        this.errors.push(error);
        this.stats.totalErrors++;
        
        const location = this.formatLocation(error);
        console.error(`[ERROR] ${location} - ${error.message}`);
        
        if (error.source && error.line > 0) {
            this.printErrorContext(error);
        }
    }

    /**
     * Report a transpilation warning
     * @param {Error} warning - Warning object
     */
    reportWarning(warning) {
        this.warnings.push(warning);
        this.stats.totalWarnings++;
        
        const location = this.formatLocation(warning);
        console.warn(`[WARNING] ${location} - ${warning.message}`);
    }

    /**
     * Check if there are any errors
     * @returns {boolean} True if there are errors
     */
    hasErrors() {
        return this.errors.length > 0;
    }

    /**
     * Check if there are any warnings
     * @returns {boolean} True if there are warnings
     */
    hasWarnings() {
        return this.warnings.length > 0;
    }

    /**
     * Get error statistics
     * @returns {object} Error statistics
     */
    getStats() {
        return { ...this.stats };
    }

    /**
     * Generate comprehensive error report
     * @returns {object} Detailed error report
     */
    generateReport() {
        const report = {
            summary: this.getStats(),
            errors: this.errors.map(error => this.formatError(error)),
            warnings: this.warnings.map(warning => this.formatError(warning)),
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    /**
     * Format error location
     * @param {Error} error - Error object
     * @returns {string} Formatted location
     */
    formatLocation(error) {
        if (error.filename && error.line > 0) {
            return `${error.filename}:${error.line}:${error.column}`;
        } else if (error.filename) {
            return error.filename;
        }
        return 'unknown location';
    }

    /**
     * Format error for report
     * @param {Error} error - Error object
     * @returns {object} Formatted error
     */
    formatError(error) {
        return {
            message: error.message,
            filename: error.filename,
            line: error.line,
            column: error.column,
            severity: error.severity || 'error',
            stack: error.stack
        };
    }

    /**
     * Print error context with source code
     * @param {Error} error - Error object
     */
    printErrorContext(error) {
        if (!error.source || error.line <= 0) return;

        const lines = error.source.split('\n');
        const errorLine = error.line - 1;
        const contextLines = 2;

        console.error('\nContext:');
        
        for (let i = Math.max(0, errorLine - contextLines); 
             i <= Math.min(lines.length - 1, errorLine + contextLines); 
             i++) {
            const lineNumber = i + 1;
            const prefix = i === errorLine ? '>>> ' : '    ';
            const lineContent = lines[i] || '';
            
            console.error(`${prefix}${lineNumber.toString().padStart(4)}: ${lineContent}`);
            
            if (i === errorLine && error.column > 0) {
                const indicator = ' '.repeat(6 + error.column - 1) + '^';
                console.error(indicator);
            }
        }
        console.error('');
    }

    /**
     * Generate recommendations based on errors
     * @returns {Array} List of recommendations
     */
    generateRecommendations() {
        const recommendations = [];

        if (this.stats.totalErrors > 0) {
            recommendations.push({
                type: 'error',
                message: `${this.stats.totalErrors} transpilation errors found. Review and fix before proceeding.`
            });
        }

        if (this.stats.totalWarnings > 10) {
            recommendations.push({
                type: 'warning',
                message: `High number of warnings (${this.stats.totalWarnings}). Consider addressing critical ones.`
            });
        }

        // Analyze common error patterns
        const errorPatterns = this.analyzeErrorPatterns();
        
        for (const [pattern, count] of Object.entries(errorPatterns)) {
            if (count > 3) {
                recommendations.push({
                    type: 'info',
                    message: `Multiple ${pattern} errors (${count}). Consider implementing a systematic fix.`
                });
            }
        }

        return recommendations;
    }

    /**
     * Analyze error patterns
     * @returns {object} Error pattern analysis
     */
    analyzeErrorPatterns() {
        const patterns = {};

        for (const error of this.errors) {
            const pattern = this.categorizeError(error);
            patterns[pattern] = (patterns[pattern] || 0) + 1;
        }

        return patterns;
    }

    /**
     * Categorize error by type
     * @param {Error} error - Error object
     * @returns {string} Error category
     */
    categorizeError(error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('unimplemented') || message.includes('not implemented')) {
            return 'unimplemented commands';
        }
        
        if (message.includes('syntax') || message.includes('parse')) {
            return 'syntax errors';
        }
        
        if (message.includes('import') || message.includes('module')) {
            return 'import/module errors';
        }
        
        if (message.includes('string') || message.includes('context')) {
            return 'string context violations';
        }
        
        return 'other errors';
    }
}

export class CodeValidator {
    constructor() {
        this.errors = [];
    }

    /**
     * Validate transpiled JavaScript code
     * @param {string} code - Generated JavaScript code
     * @param {string} filename - Source filename
     * @returns {Array} Validation errors
     */
    validateTranspiledCode(code, filename) {
        this.errors = [];

        // Syntax validation
        this.validateSyntax(code, filename);
        
        // Import validation
        this.validateImports(code, filename);
        
        // Common pattern validation
        this.validateCommonPatterns(code, filename);

        return this.errors;
    }

    /**
     * Validate JavaScript syntax
     * @param {string} code - JavaScript code
     * @param {string} filename - Filename
     */
    validateSyntax(code, filename) {
        try {
            // Basic syntax check
            new Function(code);
        } catch (error) {
            this.errors.push({
                type: 'syntax',
                message: `JavaScript syntax error: ${error.message}`,
                filename,
                severity: 'error'
            });
        }
    }

    /**
     * Validate import statements
     * @param {string} code - JavaScript code
     * @param {string} filename - Filename
     */
    validateImports(code, filename) {
        const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
        const imports = [];
        let match;

        while ((match = importRegex.exec(code)) !== null) {
            imports.push(match[1]);
        }

        for (const importPath of imports) {
            if (importPath.startsWith('../../$Dcommands/')) {
                const commandName = importPath.split('/').pop().replace('.js', '');
                // Check if command file exists
                // This would require file system access
            }
        }
    }

    /**
     * Validate common transpilation patterns
     * @param {string} code - JavaScript code
     * @param {string} filename - Filename
     */
    validateCommonPatterns(code, filename) {
        // Check for common issues
        
        // Unused variables
        const varRegex = /let\s+(\w+)\s*=/g;
        const variables = [];
        let match;
        
        while ((match = varRegex.exec(code)) !== null) {
            variables.push(match[1]);
        }

        for (const variable of variables) {
            const usageRegex = new RegExp(`\\b${variable}\\b`, 'g');
            const usages = code.match(usageRegex);
            
            if (usages && usages.length === 1) {
                this.errors.push({
                    type: 'warning',
                    message: `Potentially unused variable: ${variable}`,
                    filename,
                    severity: 'warning'
                });
            }
        }

        // Check for hardcoded processState.OK
        if (code.includes('processState.OK') && !code.includes('processState.OK =')) {
            this.errors.push({
                type: 'warning',
                message: 'processState.OK is read but never set',
                filename,
                severity: 'warning'
            });
        }
    }
}

export class SourceMapGenerator {
    constructor() {
        this.mappings = [];
        this.sources = [];
        this.names = [];
        this.sourceIndex = 0;
        this.nameIndex = 0;
    }

    /**
     * Add a mapping between original and generated code
     * @param {object} original - Original position
     * @param {object} generated - Generated position
     */
    addMapping(original, generated) {
        this.mappings.push({
            original: {
                line: original.line,
                column: original.column
            },
            generated: {
                line: generated.line,
                column: generated.column
            }
        });
    }

    /**
     * Add source file
     * @param {string} source - Source file path
     * @returns {number} Source index
     */
    addSource(source) {
        this.sources.push(source);
        return this.sourceIndex++;
    }

    /**
     * Add name
     * @param {string} name - Name
     * @returns {number} Name index
     */
    addName(name) {
        this.names.push(name);
        return this.nameIndex++;
    }

    /**
     * Generate source map
     * @param {string} file - Generated file name
     * @returns {object} Source map object
     */
    generate(file) {
        return {
            version: 3,
            file: file,
            sourceRoot: '',
            sources: this.sources,
            names: this.names,
            mappings: this.encodeMappings()
        };
    }

    /**
     * Encode mappings in VLQ format
     * @returns {string} Encoded mappings
     */
    encodeMappings() {
        // Simplified VLQ encoding
        // In a real implementation, you'd use proper VLQ encoding
        return this.mappings.map(mapping => {
            const { original, generated } = mapping;
            return `${generated.line},${generated.column},${original.line},${original.column}`;
        }).join(';');
    }
}

export class ErrorRecovery {
    constructor() {
        this.recoveryStrategies = new Map();
        this.registerDefaultStrategies();
    }

    /**
     * Register default recovery strategies
     */
    registerDefaultStrategies() {
        // Unimplemented command recovery
        this.recoveryStrategies.set('unimplemented_command', (error, context) => {
            const commandName = this.extractCommandName(error.message);
            return `console.warn('${commandName} not implemented'); // TODO: Implement ${commandName}`;
        });

        // Syntax error recovery
        this.recoveryStrategies.set('syntax_error', (error, context) => {
            return `// FIXME: Syntax error - ${error.message}`;
        });

        // Import error recovery
        this.recoveryStrategies.set('import_error', (error, context) => {
            return `// FIXME: Import error - ${error.message}`;
        });
    }

    /**
     * Attempt to recover from an error
     * @param {Error} error - Error object
     * @param {object} context - Context information
     * @returns {string|null} Recovery code or null
     */
    attemptRecovery(error, context) {
        const errorType = this.categorizeError(error);
        const strategy = this.recoveryStrategies.get(errorType);
        
        if (strategy) {
            return strategy(error, context);
        }
        
        return null;
    }

    /**
     * Categorize error for recovery
     * @param {Error} error - Error object
     * @returns {string} Error category
     */
    categorizeError(error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('unimplemented') || message.includes('not implemented')) {
            return 'unimplemented_command';
        }
        
        if (message.includes('syntax')) {
            return 'syntax_error';
        }
        
        if (message.includes('import') || message.includes('module')) {
            return 'import_error';
        }
        
        return 'unknown_error';
    }

    /**
     * Extract command name from error message
     * @param {string} message - Error message
     * @returns {string} Command name
     */
    extractCommandName(message) {
        const match = message.match(/command\s+(\w+)/i);
        return match ? match[1] : 'unknown';
    }
} 