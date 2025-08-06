/**
 * Improved 4D to Node.js Transpiler
 * Uses proper lexical analysis, error handling, and configuration management
 */

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import fse from 'fs-extra';

import { FourDLexicalAnalyzer, ContextAwareReplacer } from './lexical-analyzer.js';
import { CommandRegistryBuilder, CommandGenerator, CommandUsageAnalyzer } from './command-registry.js';
import { ErrorReporter, CodeValidator, SourceMapGenerator } from './error-handler.js';
import { TranspilerConfig, TemplateManager, EnvironmentManager } from './config-manager.js';

export class ImprovedTranspiler {
    constructor(config = {}) {
        this.config = new TranspilerConfig(config);
        this.errorReporter = new ErrorReporter();
        this.codeValidator = new CodeValidator();
        this.sourceMapGenerator = new SourceMapGenerator();
        this.lexer = new FourDLexicalAnalyzer();
        this.contextReplacer = new ContextAwareReplacer();
        
        this.commandRegistry = null;
        this.templateManager = new TemplateManager(this.config);
        this.environmentManager = new EnvironmentManager(this.config);
        
        this.stats = {
            filesProcessed: 0,
            filesWithErrors: 0,
            filesWithWarnings: 0,
            totalErrors: 0,
            totalWarnings: 0,
            transpilationTime: 0
        };
    }

    /**
     * Initialize the transpiler
     */
    async initialize() {
        console.log('Initializing improved transpiler...');
        
        // Validate configuration
        const validation = this.config.validate();
        if (!validation.valid) {
            console.error('Configuration validation failed:');
            validation.errors.forEach(error => console.error(`  - ${error}`));
            throw new Error('Invalid configuration');
        }
        
        if (validation.warnings.length > 0) {
            console.warn('Configuration warnings:');
            validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
        }

        // Build command registry
        console.log('Building command registry...');
        const registryBuilder = new CommandRegistryBuilder();
        this.commandRegistry = registryBuilder.build();
        
        const report = this.commandRegistry.generateReport();
        console.log(`Command registry built: ${report.summary.implemented} implemented, ${report.summary.placeholder} placeholder`);

        // Load environment
        this.environmentManager.loadEnvironment();

        console.log('Transpiler initialized successfully');
    }

    /**
     * Transpile a 4D project
     * @param {string} inputDir - Input directory
     * @param {string} outputDir - Output directory
     */
    async transpileProject(inputDir, outputDir) {
        const startTime = Date.now();
        
        try {
            console.log(`\nStarting transpilation from ${inputDir} to ${outputDir}`);
            
            // Clean output directory
            this.cleanOutputDirectory(outputDir);
            
            // Copy template files
            this.copyTemplateFiles(outputDir);
            
            // Copy non-4dm files
            this.copyNonTranspilableFiles(inputDir, outputDir);
            
            // Find all 4D method files
            const methodFiles = this.findMethodFiles(inputDir);
            console.log(`Found ${methodFiles.length} method files to transpile`);
            
            // Transpile files
            if (this.config.transpilation.parallelProcessing) {
                await this.transpileFilesParallel(methodFiles, outputDir);
            } else {
                await this.transpileFilesSequential(methodFiles, outputDir);
            }
            
            // Generate command stubs if enabled
            if (this.config.commands.generateStubs) {
                await this.generateCommandStubs(outputDir);
            }
            
            // Analyze command usage
            this.analyzeCommandUsage(methodFiles);
            
            // Generate reports
            this.generateReports(outputDir);
            
            const endTime = Date.now();
            this.stats.transpilationTime = endTime - startTime;
            
            console.log(`\nTranspilation completed in ${this.stats.transpilationTime}ms`);
            console.log(`Processed ${this.stats.filesProcessed} files`);
            console.log(`Errors: ${this.stats.totalErrors}, Warnings: ${this.stats.totalWarnings}`);
            
        } catch (error) {
            this.errorReporter.reportError(error);
            throw error;
        }
    }

    /**
     * Clean output directory
     * @param {string} outputDir - Output directory
     */
    cleanOutputDirectory(outputDir) {
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true });
        }
        fs.mkdirSync(outputDir, { recursive: true });
    }

    /**
     * Copy template files to output
     * @param {string} outputDir - Output directory
     */
    copyTemplateFiles(outputDir) {
        console.log('Copying template files...');
        
        // Copy output_template
        if (fs.existsSync('output_template')) {
            fse.copySync('output_template', outputDir, { overwrite: true });
        }
        
        // Copy 4Dcommands as $Dcommands
        if (fs.existsSync('4Dcommands')) {
            const commandsOutputDir = path.join(outputDir, 'Project', '$Dcommands');
            fse.copySync('4Dcommands', commandsOutputDir, { overwrite: true });
        }
    }

    /**
     * Copy non-transpilable files
     * @param {string} inputDir - Input directory
     * @param {string} outputDir - Output directory
     */
    copyNonTranspilableFiles(inputDir, outputDir) {
        console.log('Copying non-transpilable files...');
        
        const filter = (file) => {
            const ext = path.extname(file);
            return ext !== '.4dm'; // Skip 4D method files
        };
        
        fse.copySync(inputDir, outputDir, { filter });
    }

    /**
     * Find all 4D method files
     * @param {string} inputDir - Input directory
     * @returns {Array} List of method file paths
     */
    findMethodFiles(inputDir) {
        return globSync(`${inputDir}/**/*.4dm`);
    }

    /**
     * Transpile files sequentially
     * @param {Array} files - List of files to transpile
     * @param {string} outputDir - Output directory
     */
    async transpileFilesSequential(files, outputDir) {
        for (const file of files) {
            await this.transpileFile(file, outputDir);
        }
    }

    /**
     * Transpile files in parallel
     * @param {Array} files - List of files to transpile
     * @param {string} outputDir - Output directory
     */
    async transpileFilesParallel(files, outputDir) {
        const { Worker } = await import('worker_threads');
        const os = await import('os');
        
        const maxWorkers = Math.min(this.config.transpilation.maxWorkers, os.cpus().length);
        const chunks = this.chunkArray(files, maxWorkers);
        
        const promises = chunks.map(chunk => this.transpileChunk(chunk, outputDir));
        await Promise.all(promises);
    }

    /**
     * Transpile a chunk of files
     * @param {Array} files - Files to transpile
     * @param {string} outputDir - Output directory
     */
    async transpileChunk(files, outputDir) {
        const promises = files.map(file => this.transpileFile(file, outputDir));
        return Promise.all(promises);
    }

    /**
     * Transpile a single file
     * @param {string} filePath - File path
     * @param {string} outputDir - Output directory
     */
    async transpileFile(filePath, outputDir) {
        try {
            console.log(`Transpiling ${filePath}`);
            
            const source = fs.readFileSync(filePath, 'utf8');
            const transpiledCode = await this.transpileCode(source, filePath);
            
            // Generate output file path
            const relativePath = path.relative('input', filePath);
            const outputPath = path.join(outputDir, relativePath.replace('.4dm', '.js'));
            
            // Ensure output directory exists
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            
            // Write transpiled code
            fs.writeFileSync(outputPath, transpiledCode);
            
            // Generate source map if enabled
            if (this.config.output.sourceMaps) {
                const sourceMapPath = outputPath + '.map';
                const sourceMap = this.sourceMapGenerator.generate(path.basename(outputPath));
                fs.writeFileSync(sourceMapPath, JSON.stringify(sourceMap, null, 2));
            }
            
            // Validate generated code
            const validationErrors = this.codeValidator.validateTranspiledCode(transpiledCode, filePath);
            for (const error of validationErrors) {
                this.errorReporter.reportWarning(new Error(error.message));
            }
            
            this.stats.filesProcessed++;
            
        } catch (error) {
            this.errorReporter.reportError(error);
            this.stats.filesWithErrors++;
            this.stats.totalErrors++;
        }
    }

    /**
     * Transpile 4D code to JavaScript
     * @param {string} source - 4D source code
     * @param {string} filename - Source filename
     * @returns {string} Transpiled JavaScript code
     */
    async transpileCode(source, filename) {
        let code = source;
        
        // Use context-aware replacement if enabled
        if (this.config.transpilation.contextAware) {
            code = this.performContextAwareReplacements(code);
        } else {
            code = this.performSimpleReplacements(code);
        }
        
        // Transform syntax structures
        code = this.transformSyntax(code);
        
        // Handle variable declarations
        code = this.transformVariableDeclarations(code);
        
        // Handle command calls
        code = await this.transformCommandCalls(code, filename);
        
        // Wrap in function
        code = this.wrapInFunction(code, filename);
        
        return code;
    }

    /**
     * Perform context-aware replacements
     * @param {string} code - Source code
     * @returns {string} Code with replacements
     */
    performContextAwareReplacements(code) {
        // Replace OK with processState.OK
        code = this.contextReplacer.replace(code, '\\bOK\\b', 'processState.OK');
        
        // Replace operators
        code = this.contextReplacer.replace(code, '(?<!:)=(?!:)', '==');
        
        // Replace simple constants
        const simpleReplacements = {
            'True': 'true',
            'False': 'false',
            'Null': 'null'
        };
        
        for (const [from, to] of Object.entries(simpleReplacements)) {
            code = this.contextReplacer.replace(code, `\\b${from}\\b`, to);
        }
        
        return code;
    }

    /**
     * Perform simple replacements (fallback)
     * @param {string} code - Source code
     * @returns {string} Code with replacements
     */
    performSimpleReplacements(code) {
        // Simple regex replacements (less safe)
        code = code.replace(/(?<!:)=(?!:)/g, '==');
        code = code.replace(/\bTrue\b/g, 'true');
        code = code.replace(/\bFalse\b/g, 'false');
        code = code.replace(/\bNull\b/g, 'null');
        code = code.replace(/\bOK\b/g, 'processState.OK');
        
        return code;
    }

    /**
     * Transform syntax structures
     * @param {string} code - Source code
     * @returns {string} Transformed code
     */
    transformSyntax(code) {
        // Transform arrays
        code = this.transformArrays(code);
        
        // Transform control flow
        code = this.transformControlFlow(code);
        
        // Transform SQL blocks
        code = this.transformSqlBlocks(code);
        
        return code;
    }

    /**
     * Transform array syntax
     * @param {string} code - Source code
     * @returns {string} Transformed code
     */
    transformArrays(code) {
        // Replace 4D array syntax {i} with JavaScript [i-1]
        return code.replace(/\{(\d+)\}/g, (match, index) => {
            const jsIndex = parseInt(index) - 1;
            return `[${jsIndex}]`;
        });
    }

    /**
     * Transform control flow
     * @param {string} code - Source code
     * @returns {string} Transformed code
     */
    transformControlFlow(code) {
        // Transform If/Else/End if
        code = code.replace(/If\s*\((.*?)\)\s*\n(.*?)\nEnd\s+if/gs, (match, condition, body) => {
            return `if (${condition}) {\n${body}\n}`;
        });
        
        // Transform For loops
        code = code.replace(/For\s*\((\w+)\s*:=\s*(\d+)\s*To\s*(\d+)\)\s*\n(.*?)\nEnd\s+for/gs, (match, var, start, end, body) => {
            return `for (let ${var} = ${start}; ${var} <= ${end}; ${var}++) {\n${body}\n}`;
        });
        
        return code;
    }

    /**
     * Transform SQL blocks
     * @param {string} code - Source code
     * @returns {string} Transformed code
     */
    transformSqlBlocks(code) {
        // Transform Begin SQL/End SQL blocks
        return code.replace(/Begin\s+SQL\s*\n(.*?)\nEnd\s+SQL/gs, (match, sql) => {
            return `await processState.pool.query(\`${sql.trim()}\`)`;
        });
    }

    /**
     * Transform variable declarations
     * @param {string} code - Source code
     * @returns {string} Transformed code
     */
    transformVariableDeclarations(code) {
        const lines = code.split('\n');
        const transformedLines = [];
        
        for (const line of lines) {
            // Handle C_LONGINT, C_TEXT, etc.
            const declarationMatch = line.match(/C_(\w+):\w+\(([^)]+)\)/);
            if (declarationMatch) {
                const type = declarationMatch[1];
                const variables = declarationMatch[2].split(';').map(v => v.trim());
                
                const defaultValue = this.getDefaultValue(type);
                transformedLines.push(`let ${variables.join(', ')} = ${defaultValue};`);
                continue;
            }
            
            // Handle var declarations
            const varMatch = line.match(/var\s+(\$\w+)\s*:\s*(\w+)/);
            if (varMatch) {
                const varName = varMatch[1];
                const type = varMatch[2];
                const defaultValue = this.getDefaultValue(type);
                transformedLines.push(`let ${varName} = ${defaultValue};`);
                continue;
            }
            
            transformedLines.push(line);
        }
        
        return transformedLines.join('\n');
    }

    /**
     * Get default value for type
     * @param {string} type - 4D type
     * @returns {string} Default value
     */
    getDefaultValue(type) {
        const defaults = {
            'TEXT': '""',
            'LONGINT': '0',
            'INTEGER': '0',
            'REAL': '0.0',
            'BOOLEAN': 'false',
            'DATE': 'new Date()',
            'TIME': 'new Date()',
            'POINTER': 'null'
        };
        
        return defaults[type.toUpperCase()] || 'null';
    }

    /**
     * Transform command calls
     * @param {string} code - Source code
     * @param {string} filename - Source filename
     * @returns {string} Transformed code
     */
    async transformCommandCalls(code, filename) {
        const importStatements = [];
        const transformedCode = code;
        
        // Find all command calls
        for (const [commandName, commandInfo] of this.commandRegistry.commands) {
            const pattern = new RegExp(`\\b${commandName}\\b`, 'g');
            if (pattern.test(code)) {
                const implementation = this.commandRegistry.getImplementation(commandName);
                
                if (implementation) {
                    if (implementation.type === 'simple') {
                        // Simple replacement
                        code = code.replace(pattern, implementation.value);
                    } else {
                        // Module import
                        const importPath = this.getImportPath(implementation.path, filename);
                        importStatements.push(`import ${this.sanitizeFunctionName(commandName)} from "${importPath}";`);
                        
                        // Replace command calls
                        code = code.replace(pattern, this.sanitizeFunctionName(commandName));
                    }
                } else {
                    // Command not implemented
                    this.errorReporter.reportWarning(new Error(`Command ${commandName} not implemented`));
                }
            }
        }
        
        // Add import statements at the top
        if (importStatements.length > 0) {
            const uniqueImports = [...new Set(importStatements)];
            code = uniqueImports.join('\n') + '\n\n' + code;
        }
        
        return code;
    }

    /**
     * Get import path for command
     * @param {string} commandPath - Command file path
     * @param {string} sourceFile - Source file path
     * @returns {string} Import path
     */
    getImportPath(commandPath, sourceFile) {
        const sourceDir = path.dirname(sourceFile);
        const commandDir = path.dirname(commandPath);
        
        const relativePath = path.relative(sourceDir, commandDir);
        return path.join(relativePath, path.basename(commandPath));
    }

    /**
     * Sanitize function name for JavaScript
     * @param {string} name - Original name
     * @returns {string} Sanitized name
     */
    sanitizeFunctionName(name) {
        return name
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/^(\d)/, '_$1')
            .toUpperCase();
    }

    /**
     * Wrap code in function
     * @param {string} code - Source code
     * @param {string} filename - Source filename
     * @returns {string} Wrapped code
     */
    wrapInFunction(code, filename) {
        const functionName = path.basename(filename, '.4dm').replace(/[^a-zA-Z0-9]/g, '_');
        
        return `
export default function ${functionName}(processState, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) {

${code}

}
`;
    }

    /**
     * Generate command stubs
     * @param {string} outputDir - Output directory
     */
    async generateCommandStubs(outputDir) {
        console.log('Generating command stubs...');
        
        const generator = new CommandGenerator(this.commandRegistry);
        const placeholderCommands = this.commandRegistry.getCommandsByCategory('placeholder');
        
        for (const commandName of placeholderCommands) {
            const stub = generator.generateStub(commandName);
            const stubPath = path.join(outputDir, 'Project', '$Dcommands', `${commandName}.js`);
            
            fs.writeFileSync(stubPath, stub);
        }
        
        console.log(`Generated ${placeholderCommands.length} command stubs`);
    }

    /**
     * Analyze command usage
     * @param {Array} files - Source files
     */
    analyzeCommandUsage(files) {
        console.log('Analyzing command usage...');
        
        const analyzer = new CommandUsageAnalyzer(this.commandRegistry);
        analyzer.analyzeUsage(files);
        
        const report = analyzer.getUsageReport();
        
        console.log(`Used commands: ${report.usedCommands.length}`);
        console.log(`Unused commands: ${report.unusedCommands.length}`);
        console.log(`Critical missing: ${report.criticalMissing.length}`);
        
        if (report.criticalMissing.length > 0) {
            console.warn('Critical missing implementations:');
            report.criticalMissing.forEach(cmd => {
                console.warn(`  - ${cmd.name} (used ${cmd.usageCount} times)`);
            });
        }
    }

    /**
     * Generate reports
     * @param {string} outputDir - Output directory
     */
    generateReports(outputDir) {
        console.log('Generating reports...');
        
        // Error report
        const errorReport = this.errorReporter.generateReport();
        fs.writeFileSync(path.join(outputDir, 'transpilation-report.json'), JSON.stringify(errorReport, null, 2));
        
        // Command registry report
        const commandReport = this.commandRegistry.generateReport();
        fs.writeFileSync(path.join(outputDir, 'command-report.json'), JSON.stringify(commandReport, null, 2));
        
        // Statistics report
        const statsReport = {
            transpilation: this.stats,
            errors: this.errorReporter.getStats(),
            commands: this.commandRegistry.getStats()
        };
        fs.writeFileSync(path.join(outputDir, 'stats-report.json'), JSON.stringify(statsReport, null, 2));
    }

    /**
     * Split array into chunks
     * @param {Array} array - Array to split
     * @param {number} chunkSize - Size of each chunk
     * @returns {Array} Array of chunks
     */
    chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }
} 