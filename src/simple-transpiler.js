/**
 * Simple 4D to Node.js Transpiler
 * Focuses on core functionality without complex lexical analysis
 */

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import fse from 'fs-extra';

export class SimpleTranspiler {
    constructor() {
        this.commands = new Map();
        this.loadCommands();
    }

    /**
     * Load 4D commands from the 4Dcommands directory
     */
    loadCommands() {
        const commandsDir = '4Dcommands';
        if (fs.existsSync(commandsDir)) {
            const files = fs.readdirSync(commandsDir);
            console.log(`Loading ${files.length} commands from 4Dcommands directory`);
            for (const file of files) {
                if (file.endsWith('.js')) {
                    const commandName = path.basename(file, '.js');
                    this.commands.set(commandName, {
                        path: path.join(commandsDir, file),
                        name: commandName
                    });
                    
                    // Also add the sanitized version for matching
                    const sanitizedName = this.sanitizeFunctionName(commandName);
                    this.commands.set(sanitizedName, {
                        path: path.join(commandsDir, file),
                        name: commandName
                    });
                }
            }
            console.log(`Loaded ${this.commands.size} command entries`);
        }
    }

    /**
     * Transpile a 4D project
     */
    async transpileProject(inputDir, outputDir) {
        console.log(`\n🚀 Simple 4D to Node.js Transpiler`);
        console.log(`=====================================\n`);

        // Clean output directory
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true });
        }
        fs.mkdirSync(outputDir, { recursive: true });

        // Copy template files
        this.copyTemplateFiles(outputDir);

        // Find all 4D method files
        const methodFiles = globSync(`${inputDir}/**/*.4dm`);
        console.log(`Found ${methodFiles.length} method files to transpile`);

        // Transpile each file
        for (const file of methodFiles) {
            await this.transpileFile(file, outputDir);
        }

        console.log(`\n✅ Transpilation completed successfully!`);
    }

    /**
     * Copy template files to output
     */
    copyTemplateFiles(outputDir) {
        console.log('Copying template files...');
        
        // Copy output_template
        if (fs.existsSync('output_template')) {
            fse.copySync('output_template', outputDir, { overwrite: true });
        }
        
        // Copy 4Dcommands as 4Dcommands
        if (fs.existsSync('4Dcommands')) {
            const commandsOutputDir = path.join(outputDir, 'Project', '4Dcommands');
            fse.copySync('4Dcommands', commandsOutputDir, { overwrite: true });
        }
    }

    /**
     * Transpile a single file
     */
    async transpileFile(filePath, outputDir) {
        try {
            console.log(`Transpiling ${filePath}`);
            
            const source = fs.readFileSync(filePath, 'utf8');
            const transpiledCode = this.transpileCode(source, filePath);
            
            // Generate output file path with sanitized name
            const relativePath = path.relative('input', filePath);
            const dirName = path.dirname(relativePath);
            const baseName = path.basename(filePath, '.4dm');
            const sanitizedBaseName = this.sanitizeFunctionName(baseName);
            const outputPath = path.join(outputDir, dirName, `${sanitizedBaseName}.js`);
            
            // Ensure output directory exists
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            
            // Write transpiled code
            fs.writeFileSync(outputPath, transpiledCode);
            
        } catch (error) {
            console.error(`Error transpiling ${filePath}:`, error.message);
        }
    }

    /**
     * Transpile 4D code to JavaScript
     */
    transpileCode(source, filename) {
        let code = source;
        
        // Transform method calls FIRST (before basic syntax changes method names)
        const methodResult = this.transformMethodCalls(code, filename);
        const methodImports = methodResult.imports;
        code = methodResult.code;
        
        // Basic transformations
        code = this.transformBasicSyntax(code);
        
        // Transform commands and get import statements
        const commandResult = this.transformCommands(code, filename);
        const commandImports = commandResult.imports;
        code = commandResult.code;
        
        // Transform 4D command syntax to JavaScript function calls after command replacement
        code = this.transformCommandSyntax(code);
        
        // Wrap in function
        code = this.wrapInFunction(code, filename);
        
        // Add import statements at the top of the file
        const allImports = [...methodImports, ...commandImports];
        if (allImports.length > 0) {
            // Use a Map to ensure unique imports by import name
            const uniqueImportsMap = new Map();
            for (const importStatement of allImports) {
                const match = importStatement.match(/import (\w+) from "([^"]+)"/);
                if (match) {
                    const [, importName, importPath] = match;
                    // Only add if the import name is actually used in the code
                    if (code.includes(importName)) {
                        uniqueImportsMap.set(importName, importStatement);
                    }
                }
            }
            const uniqueImports = Array.from(uniqueImportsMap.values());
            code = uniqueImports.join('\n') + '\n\n' + code;
        }
        
        return code;
    }

    /**
     * Replace Begin SQL and End SQL blocks with proper function calls
     */
    replaceBeginSql(code) {
        // Transform SQL blocks - match Begin SQL...End SQL and extract the SQL content
        return code.replace(/Begin\s+SQL\s*\n(.*?)\nEnd\s+SQL/gs, (match, sqlContent) => {
            // Clean up the SQL content (remove leading/trailing whitespace and normalize)
            const cleanSql = sqlContent.trim().replace(/\n\s*/g, '\n');
            // Return the Begin SQL command call with the SQL content as a template literal
            return `Begin_SQL(processState, \`${cleanSql}\`)`;
        });
    }

    /**
     * Transform basic 4D syntax to JavaScript
     */
    transformBasicSyntax(code) {
        // Replace 4D operators
        code = code.replace(/\bOK\b/g, 'processState.OK');
        code = code.replace(/(?<!:)=(?!:)/g, '==');
        code = code.replace(/:=/g, '=');
        code = code.replace(/\bTrue\b/g, 'true');
        code = code.replace(/\bFalse\b/g, 'false');
        code = code.replace(/\bNull\b/g, 'null');
        
        // Transform arrays - handle both numeric and variable indices
        code = code.replace(/(\w+)\{([^}]+)\}/g, (match, arrayName, index) => {
            if (/^\d+$/.test(index)) {
                // Numeric index - convert to 0-based
                const jsIndex = parseInt(index) - 1;
                return `${arrayName}[${jsIndex}]`;
            } else {
                // Variable index - keep as is
                return `${arrayName}[${index}]`;
            }
        });
        
        // Transform control flow
        code = code.replace(/If\s*\((.*?)\)\s*\n(.*?)\nEnd\s+if/gs, (match, condition, body) => {
            return `if (${condition}) {\n${body}\n}`;
        });
        
        // Transform For loops
        code = code.replace(/For\s*\(([^;]+);\s*([^;]+);\s*([^)]+)\)\s*\n(.*?)\nEnd\s+for/gs, (match, variable, start, end, body) => {
            return `for (let ${variable.trim()} = ${start.trim()}; ${variable.trim()} <= ${end.trim()}; ${variable.trim()}++) {\n${body}\n}`;
        });
        
        // Transform remaining If statements
        code = code.replace(/\bIf\b/g, 'if');
        code = code.replace(/\bEnd\s+if\b/g, '}');
        code = code.replace(/\bElse\b/g, '} else {');
        
        // Transform 4D variable declarations
        code = code.replace(/#DECLARE\s*\(([^)]+)\)/g, (match, declarations) => {
            const vars = declarations.split(';').map(decl => {
                const parts = decl.trim().split(':');
                if (parts.length === 2) {
                    const varName = parts[0].trim();
                    const varType = parts[1].trim();
                    return `let ${varName} = ${this.getDefaultValue(varType)}`;
                }
                return `let ${decl.trim()} = null`;
            });
            return vars.join(';\n') + '\n\n';
        });
        
        // Transform SQL blocks using the replaceBeginSql function
        code = this.replaceBeginSql(code);
        
        return code;
    }

    /**
     * Transform 4D commands to JavaScript imports and calls
     */
    transformCommands(code, filename) {
        const importStatements = [];
        
        // Find all command calls (basic pattern matching)
        // Sort commands by length (longest first) to avoid partial matches
        const sortedCommands = Array.from(this.commands.entries()).sort((a, b) => b[0].length - a[0].length);
        
        for (const [commandName, commandInfo] of sortedCommands) {
            // Only process original command names (not sanitized ones)
            if (commandName === this.sanitizeFunctionName(commandName)) {
                continue;
            }
            
            const pattern = new RegExp(`\\b${commandName}\\b`, 'g');
            if (pattern.test(code)) {
                const importPath = this.getImportPath(filename, commandName);
                importStatements.push(`import ${this.sanitizeFunctionName(commandName)} from "${importPath}";`);
                
                // Replace command calls with proper function calls, but only if they don't have :C syntax
                // Commands with :C syntax will be handled by transformCommandSyntax
                code = code.replace(pattern, (match, offset) => {
                    // Check if this command is followed by :C syntax
                    const afterMatch = code.substring(offset + match.length);
                    if (afterMatch.trim().startsWith(':C')) {
                        // Don't replace, let transformCommandSyntax handle it
                        return match;
                    } else {
                        // Replace with function call
                        return `${this.sanitizeFunctionName(commandName)}(processState)`;
                    }
                });
            }
        }
        
        // Handle Begin_SQL import specifically since it's created by replaceBeginSql
        if (code.includes('Begin_SQL(')) {
            const importPath = this.getImportPath(filename, 'Begin SQL');
            importStatements.push(`import Begin_SQL from "${importPath}";`);
        }
        
        return {
            imports: importStatements,
            code: code
        };
    }

    /**
     * Transform 4D command syntax to JavaScript function calls
     */
    transformCommandSyntax(code) {
        // First, apply simple replacements (like TRACE:C157 -> debugger)
        code = this.applySimpleReplacements(code);
        
        // Transform 4D command calls like LOG EVENT:C667(0; "text") to LOG_EVENT(processState, 0, "text")
        code = code.replace(/([A-Za-z\s]+):C\d+\(([^)]+)\)/g, (match, command, args) => {
            // Trim whitespace from command name
            const trimmedCommand = command.trim();
            // Split arguments by semicolon and clean them up
            const argList = args.split(';').map(arg => arg.trim());
            // Use sanitized function name
            const sanitizedName = this.sanitizeFunctionName(trimmedCommand);
            // Preserve the whitespace before the command
            const beforeCommand = match.substring(0, match.indexOf(command.trim()));
            return `${beforeCommand}${sanitizedName}(processState, ${argList.join(', ')})`;
        });
        
        // Transform 4D command calls that have already been partially transformed
        // Like LOG_EVENT(processState):C667(0; "text") to LOG_EVENT(processState, 0, "text")
        code = code.replace(/(\w+)\(processState\):C\d+\(([^)]+)\)/g, (match, command, args) => {
            // Split arguments by semicolon and clean them up
            const argList = args.split(';').map(arg => arg.trim());
            // Use sanitized function name
            const sanitizedName = this.sanitizeFunctionName(command);
            return `${sanitizedName}(processState, ${argList.join(', ')})`;
        });
        
        // Transform 4D command calls with nested parentheses like STRING:C10(processState.OK) to STRING(processState, processState.OK)
        code = code.replace(/([A-Za-z\s]+):C(\d+)\(([^)]+)\)/g, (match, command, number, args) => {
            // Trim whitespace from command name
            const trimmedCommand = command.trim();
            // Use sanitized function name
            const sanitizedName = this.sanitizeFunctionName(trimmedCommand);
            // For STRING command, just pass the argument directly
            if (trimmedCommand === 'STRING') {
                return `${sanitizedName}(processState, ${args})`;
            }
            return `${sanitizedName}(processState, ${number}, ${args})`;
        });
        
        // Transform simple command calls like TRACE:C157 to TRACE(processState, 157)
        code = code.replace(/([A-Za-z\s]+):C(\d+)/g, (match, command, number) => {
            // Trim whitespace from command name
            const trimmedCommand = command.trim();
            // Use sanitized function name
            const sanitizedName = this.sanitizeFunctionName(trimmedCommand);
            return `${sanitizedName}(processState, ${number})`;
        });
        
        // Transform variable declarations
        code = code.replace(/let\(([^)]+)\)/g, (match, variables) => {
            const varList = variables.split(',').map(v => v.trim()).join(', ');
            return `let ${varList}`;
        });
        
        return code;
    }

    /**
     * Apply simple replacements for 4D commands
     */
    applySimpleReplacements(code) {
        const simpleReplacements = {
            "TRACE:C157": "debugger",
            "True:C214": "true",
            "False:C215": "false",
            "Abs:C99": "Math.abs",
            "Arctan:C20": "Math.atan",
            "Sin:C17": "Math.sin",
            "Tan:C19": "Math.tan",
            "Cos:C18": "Math.cos",
            "Is Windows:C1573": "(process.platform === 'win32')",
            "Is macOS:C1572": "(process.platform === 'darwin')",
            "New collection:C1472": "[]",
            "New shared collection:C1527": "[]",
            "Null:C1517": "null",
            "Into system standard outputs:K38:9": "6",
            "C_LONGINT:C283": "let",
            "C_REAL:C285": "let"
        };
        
        for (const [from, to] of Object.entries(simpleReplacements)) {
            code = code.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
        }
        
        return code;
    }

    /**
     * Transform method calls to JavaScript function calls
     */
    transformMethodCalls(code, filename) {
        const methodImports = [];
        
        // Discover all available 4D method files dynamically
        const methodsDir = path.join('input', 'Project', 'Sources', 'Methods');
        const methodTransformations = [];
        
        if (fs.existsSync(methodsDir)) {
            const methodFiles = fs.readdirSync(methodsDir);
            for (const file of methodFiles) {
                if (file.endsWith('.4dm')) {
                    const methodName = path.basename(file, '.4dm');
                    const sanitizedMethodName = this.sanitizeFunctionName(methodName);
                    methodTransformations.push({
                        from: methodName,
                        to: sanitizedMethodName
                    });
                }
            }
        }
        
        console.log(`Discovered ${methodTransformations.length} method files for transformation`);
        
        for (const transformation of methodTransformations) {
            // Escape special regex characters and handle spaces
            const escapedFrom = transformation.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
            
            // First, handle method calls with parameters
            const regexWithParams = new RegExp(`${escapedFrom}\\(([^)]*)\\)`, 'g');
            if (regexWithParams.test(code)) {
                console.log(`Applying method transformation with params: "${transformation.from}" -> "${transformation.to}"`);
                
                // Check if this is the current file (self-import)
                const currentFileName = path.basename(filename, '.4dm');
                if (transformation.from === currentFileName) {
                    // Don't create import for self, just transform the call
                    code = code.replace(regexWithParams, `${transformation.to}($1)`);
                } else {
                    // Generate import statement for the method
                    const methodImportPath = this.getMethodImportPath(filename, transformation.to);
                    methodImports.push(`import ${transformation.to} from "${methodImportPath}";`);
                    
                    // Transform the method call with parameters - preserve the original parameter content
                    code = code.replace(regexWithParams, (match, params) => {
                        return `${transformation.to}(${params})`;
                    });
                }
            }
            
            // Then, handle method calls without parameters
            const regex = new RegExp(`\\b${escapedFrom}\\b`, 'g');
            if (regex.test(code)) {
                console.log(`Applying method transformation: "${transformation.from}" -> "${transformation.to}"`);
                
                // Check if this is the current file (self-import)
                const currentFileName = path.basename(filename, '.4dm');
                if (transformation.from === currentFileName) {
                    // Don't create import for self, just transform the call
                    code = code.replace(regex, `${transformation.to}()`);
                } else {
                    // Generate import statement for the method
                    const methodImportPath = this.getMethodImportPath(filename, transformation.to);
                    methodImports.push(`import ${transformation.to} from "${methodImportPath}";`);
                    
                    // Transform the method call without parameters
                    code = code.replace(regex, `${transformation.to}()`);
                }
            }
        }
        
        return {
            code: code,
            imports: methodImports
        };
    }

    /**
     * Get default value for type
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
     * Get import path for command
     */
    getImportPath(sourceFile, commandName) {
        // Calculate the output file path from source file path
        const relativePath = path.relative('input', sourceFile);
        const outputFilePath = relativePath.replace('.4dm', '.js');
        
        // The output file will be in output/Project/Sources/DatabaseMethods/onServerStartup.js
        // The command will be in output/Project/4Dcommands/String.js
        const outputFileDir = path.dirname(outputFilePath);
        
        // Find the actual command file name (handle spaces in filenames)
        const actualCommandName = this.findActualCommandFileName(commandName);
        const commandPath = path.join('Project', '4Dcommands', `${actualCommandName}.js`);
        
        // Calculate relative path from output file directory to command
        const relativeCommandPath = path.relative(outputFileDir, commandPath);
        
        // Use forward slashes for ES modules, regardless of platform
        return relativeCommandPath.replace(/\\/g, '/');
    }

    /**
     * Find the actual command file name (handle spaces in filenames)
     */
    findActualCommandFileName(commandName) {
        const commandsDir = '4Dcommands';
        if (fs.existsSync(commandsDir)) {
            const files = fs.readdirSync(commandsDir);
            for (const file of files) {
                if (file.endsWith('.js')) {
                    const fileCommandName = path.basename(file, '.js');
                    // Check if the sanitized version matches
                    if (this.sanitizeFunctionName(fileCommandName) === commandName) {
                        return fileCommandName;
                    }
                }
            }
        }
        // Fallback to the original command name
        return commandName;
    }

    /**
     * Get import path for method
     */
    getMethodImportPath(sourceFile, methodName) {
        // Calculate the output file path from source file path
        const relativePath = path.relative('input', sourceFile);
        const outputFilePath = relativePath.replace('.4dm', '.js');
        
        // The output file will be in output/Project/Sources/DatabaseMethods/onServerStartup.js
        // The method will be in output/Project/Sources/Methods/methodName.js
        const outputFileDir = path.dirname(outputFilePath);
        
        // Use the sanitized method name for the import path to avoid spaces in URLs
        const sanitizedMethodName = this.sanitizeFunctionName(methodName);
        const methodPath = path.join('Project', 'Sources', 'Methods', `${sanitizedMethodName}.js`);
        
        // Calculate relative path from output file directory to method
        const relativeMethodPath = path.relative(outputFileDir, methodPath);
        
        // Use forward slashes for ES modules, regardless of platform
        return relativeMethodPath.replace(/\\/g, '/');
    }

    /**
     * Find the actual method file name (handle spaces in filenames)
     */
    findActualMethodFileName(methodName) {
        const methodsDir = path.join('input', 'Project', 'Sources', 'Methods');
        if (fs.existsSync(methodsDir)) {
            const files = fs.readdirSync(methodsDir);
            for (const file of files) {
                if (file.endsWith('.4dm')) {
                    const fileMethodName = path.basename(file, '.4dm');
                    // Check if the sanitized version matches
                    if (this.sanitizeFunctionName(fileMethodName) === methodName) {
                        return fileMethodName;
                    }
                }
            }
        }
        // Fallback to the original method name
        return methodName;
    }

    /**
     * Sanitize function name for JavaScript
     */
    sanitizeFunctionName(name) {
        return name
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/^(\d)/, '_$1')
            .toUpperCase();
    }

    /**
     * Wrap code in function
     */
    wrapInFunction(code, filename) {
        const functionName = path.basename(filename, '.4dm').replace(/[^a-zA-Z0-9]/g, '_');
        
        return `export default function ${functionName}(processState, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) {

${code}

}`;
    }
} 