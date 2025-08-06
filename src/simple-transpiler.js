/**
 * Simple 4D to Node.js Transpiler
 * Focuses on core functionality without complex lexical analysis
 */

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import fse from 'fs-extra';
import reservedWordsInJs from '../reservedWordsInJs.js';

export class SimpleTranspiler {
    constructor() {
        this.commands = new Map();
        this.reservedWords = new Set(reservedWordsInJs);
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
                    
                    // Also add the original command name with spaces for reverse lookup
                    // This helps when the 4D code uses "ARRAY TO COLLECTION" but the file is "ARRAY_TO_COLLECTION.js"
                    const originalCommandName = commandName.replace(/_/g, ' ');
                    this.commands.set(originalCommandName, {
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
        console.log(`\n🚀 4D to Node.js Transpiler`);
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
     * Handle JavaScript reserved words by prefixing them with underscore
     */
    handleReservedWords(code) {
        // Create a mapping of reserved words to their safe versions
        const reservedWordMap = new Map();
        
        // Find all variable names, function names, and method names that are reserved words
        const patterns = [
            // Variable declarations: let x, y = 0; or var x, y;
            /(?:let|var|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
            // Assignment: variableName = ...
            /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g,
            // Array access: arrayName[index]
            /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\[/g
        ];
        
        patterns.forEach(pattern => {
            code = code.replace(pattern, (match, word) => {
                if (this.reservedWords.has(word)) {
                    const safeWord = `_${word}`;
                    reservedWordMap.set(word, safeWord);
                    return match.replace(word, safeWord);
                }
                return match;
            });
        });
        
        // Also handle any remaining reserved words in the code, but be more selective
        this.reservedWords.forEach(word => {
            // Only replace if it's not part of a function call (which will be imported)
            const regex = new RegExp(`\\b${word}\\b(?!\\s*\\()`, 'g');
            if (regex.test(code)) {
                const safeWord = `_${word}`;
                reservedWordMap.set(word, safeWord);
                code = code.replace(regex, safeWord);
            }
        });
        
        return code;
    }

    /**
     * Transpile 4D code to JavaScript
     */
    transpileCode(source, filename) {
        let code = source;
        
        // STEP 1: Replace OK with processState.OK (must be first)
        code = code.replace(/\bOK\b/g, 'processState.OK');
        
        // STEP 2: Replace Begin SQL blocks (must be early to avoid interference)
        code = this.replaceBeginSql(code);
        
        // STEP 3: Transform method calls (before basic syntax changes method names)
        const methodResult = this.transformMethodCalls(code, filename);
        const methodImports = methodResult.imports;
        code = methodResult.code;
        
        // Debug: Check right after method transformation
        if (code.includes('TEST_DATABASE_OPERATIONS')) {
            const afterMethod = code.split('\n').find(line => line.includes('TEST_DATABASE_OPERATIONS'));
            console.log(`After method transformation: "${afterMethod}"`);
        }
        
        // STEP 4: Basic transformations (excluding Begin SQL which was done above)
        code = this.transformBasicSyntax(code);
        
        // Debug: Check for TEST_DATABASE_OPERATIONS
        if (code.includes('TEST_DATABASE_OPERATIONS')) {
            const lines = code.split('\n');
            lines.forEach((line, i) => {
                if (line.includes('TEST_DATABASE_OPERATIONS')) {
                    console.log(`Line ${i}: "${line}"`);
                }
            });
        }
        
        // STEP 5: Transform 4D command syntax to JavaScript function calls
        const syntaxResult = this.transformCommandSyntax(code);
        code = syntaxResult.code;
        const usedCommands = syntaxResult.usedCommands;
        
        // STEP 6: Transform commands and get import statements after syntax transformation
        const commandResult = this.transformCommands(code, filename);

        code = commandResult.code;
        
        // Generate command imports from usedCommands
        const commandImports = [];
        for (const sanitizedName of usedCommands) {
            const actualFileName = this.findActualCommandFileName(sanitizedName);
            const importPath = this.getImportPath(filename, actualFileName);
            commandImports.push(`import ${sanitizedName} from "${importPath}";`);
        }
        
        // STEP 7: Restore SQL blocks (convert markers back to Begin_SQL calls)
        code = code.replace(/__BEGIN_SQL_BLOCK__`(.*?)`__END_SQL_BLOCK__/gs, (match, sqlContent) => {
            usedCommands.add('Begin_SQL');
            return `Begin_SQL(processState, \`${sqlContent}\`)`;
        });
        
        // Add Begin_SQL import if it was used
        if (code.includes('Begin_SQL(')) {
            const actualFileName = this.findActualCommandFileName('Begin_SQL');
            const importPath = this.getImportPath(filename, actualFileName);
            commandImports.push(`import Begin_SQL from "${importPath}";`);
        }
        
        // STEP 8: Handle JavaScript reserved words (after all transformations)
        code = this.handleReservedWords(code);
        
        // Add semicolons to method/function calls that don't have them
        // This needs to run BEFORE wrapping in function to fix syntax
        code = code.split('\n').map(line => {
            // Check if line is a method/function call without semicolon
            if (/^\s*[A-Z_]+\(processState[^)]*\)\s*$/.test(line)) {
                console.log(`Adding semicolon to line: "${line.trim()}"`);
                return line.trim() + ';';
            }
            return line;
        }).join('\n');
        
        // STEP 9: Wrap in function
        code = this.wrapInFunction(code, filename);
        
        // STEP 10: Add import statements at the top of the file
        const allImports = [...methodImports, ...commandImports];
        if (allImports.length > 0) {
            // Use a Map to ensure unique imports by import name
            const uniqueImports = new Map();
            allImports.forEach(imp => {
                const importName = imp.match(/import\s+(\w+)/)[1];
                if (!uniqueImports.has(importName)) {
                    uniqueImports.set(importName, imp);
                }
            });
            code = `${Array.from(uniqueImports.values()).join('\n')}\n\n${code}`;
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
            // Mark the SQL content to prevent further transformation
            // Use a unique marker that won't be transformed
            return `__BEGIN_SQL_BLOCK__\`${cleanSql}\`__END_SQL_BLOCK__`;
        });
    }

    /**
     * Transform basic 4D syntax to JavaScript
     */
    transformBasicSyntax(code) {
        // Debug: Check at start
        if (code.includes('TEST_DATABASE_OPERATIONS')) {
            const lines = code.split('\n');
            const lineNum = lines.findIndex(line => line.includes('TEST_DATABASE_OPERATIONS'));
            if (lineNum >= 0) {
                console.log(`Start of transformBasicSyntax line ${lineNum}: "${lines[lineNum]}"`);
                if (lineNum + 1 < lines.length) {
                    console.log(`Next line: "${lines[lineNum + 1]}"`);
                }
            }
        }
        
        // Replace 4D operators (excluding OK which is handled in transpileCode)
        code = code.replace(/(?<!:)=(?!:)/g, '==');
        code = code.replace(/:=/g, '=');
        code = code.replace(/\bTrue\b/g, 'true');
        code = code.replace(/\bFalse\b/g, 'false');
        code = code.replace(/\bNull\b/g, 'null');
        
        // Transform 4D variable assignments ($var:=value to let $var = value)
        // But NOT for numbered parameters like $1, $2, etc.
        code = code.replace(/^(\s*)(\$[a-zA-Z]\w*)=(.+)$/gm, (match, indent, varName, value) => {
            // Check if this variable was already declared
            const varNameClean = varName.replace('$', '_');
            return `${indent}let ${varNameClean} = ${value}`;
        });
        
        // Replace $variable references with _variable (but keep $1, $2, etc as is)
        code = code.replace(/\$([a-zA-Z]\w*)/g, '_$1');
        
        // Transform 4D variable declarations like C_LONGINT:C283(x,y) to let x, y = 0;
        code = code.replace(/C_\w+:C\d+\(([^)]+)\)/g, (match, variables) => {
            const varList = variables.split(',').map(v => v.trim()).join(', ');
            return `let ${varList} = 0;`;
        });
        
        // Transform 4D ARRAY declarations like ARRAY TEXT:C222($asValues; 50) to let $asValues = new Array(50); // TEXT
        code = code.replace(/ARRAY\s+(\w+):C\d+\(([^)]+)\)/g, (match, arrayType, args) => {
            const parts = args.split(';').map(arg => arg.trim());
            if (parts.length === 2) {
                const varName = parts[0];
                const size = parts[1];
                return `let ${varName} = new Array(${size}); // ${arrayType}`;
            }
            return match; // Fallback if format doesn't match
        });
        
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
        
        // Transform control flow - handle If/End if blocks
        // This regex needs to be more careful to match properly paired If/End if
        code = code.replace(/\bIf\s*\((.*?)\)\s*{?\s*\n(.*?)\nEnd\s+if\b/gs, (match, condition, body) => {
            return `if (${condition}) {\n${body}\n}`;
        });
        
        // Transform For loops
        code = code.replace(/For\s*\(([^;]+);\s*([^;]+);\s*([^)]+)\)\s*\n(.*?)\nEnd\s+for/gs, (match, variable, start, end, body) => {
            return `for (let ${variable.trim()} = ${start.trim()}; ${variable.trim()} <= ${end.trim()}; ${variable.trim()}++) {\n${body}\n}`;
        });
        
        // Transform remaining If statements
        code = code.replace(/\bIf\b/g, 'if');
        
        // Debug: Check before End if replacement
        if (code.includes('TEST_DATABASE_OPERATIONS')) {
            const beforeEndIf = code.split('\n').find(line => line.includes('TEST_DATABASE_OPERATIONS'));
            console.log(`Before End if replacement: "${beforeEndIf}"`);
        }
        
        code = code.replace(/\bEnd\s+if\b/g, '}');
        
        // Debug: Check after End if replacement
        if (code.includes('TEST_DATABASE_OPERATIONS')) {
            const afterEndIf = code.split('\n').find(line => line.includes('TEST_DATABASE_OPERATIONS'));
            console.log(`After End if replacement: "${afterEndIf}"`);
        }
        
        // Debug: Check before Else replacement
        if (code.includes('TEST_DATABASE_OPERATIONS')) {
            const beforeElse = code.split('\n').find(line => line.includes('TEST_DATABASE_OPERATIONS'));
            console.log(`Before Else replacement: "${beforeElse}"`);
        }
        
        code = code.replace(/\bElse\b/g, '} else {');
        
        // Debug: Check after Else replacement
        if (code.includes('TEST_DATABASE_OPERATIONS')) {
            const afterElse = code.split('\n').find(line => line.includes('TEST_DATABASE_OPERATIONS'));
            console.log(`After Else replacement: "${afterElse}"`);
        }
        
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
        
        // Add missing semicolons to statements (but not to function calls or control structures)
        code = code.replace(/^(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^;]+)(\s*)$/gm, (match, spaces, statement, trailing) => {
            // Don't add semicolon if the statement already ends with one or is a control structure
            if (statement.trim().endsWith(';') || statement.includes('if') || statement.includes('for') || statement.includes('while')) {
                return match;
            }
            return `${spaces}${statement};${trailing}`;
        });
        
        // Add semicolons to simple assignments that are missing them
        code = code.replace(/^(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^;]+)(\s*)$/gm, (match, spaces, statement, trailing) => {
            const trimmed = statement.trim();
            if (!trimmed.endsWith(';') && !trimmed.includes('(') && !trimmed.includes('{')) {
                return `${spaces}${trimmed};${trailing}`;
            }
            return match;
        });
        
        // Add semicolons to assignment statements that are missing them (more specific)
        code = code.replace(/^(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^;{}\n]+)(\s*)$/gm, (match, spaces, statement, trailing) => {
            const trimmed = statement.trim();
            // Only add semicolon if it's a simple assignment and doesn't already have one
            if (!trimmed.endsWith(';') && !trimmed.includes('(') && !trimmed.includes('{') && !trimmed.includes('}')) {
                return `${spaces}${trimmed};${trailing}`;
            }
            return match;
        });
        
        // Add semicolons to function assignments that are missing them
        code = code.replace(/^(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[A-Z_]+\([^)]+\))(\s*)$/gm, (match, spaces, statement, trailing) => {
            const trimmed = statement.trim();
            if (!trimmed.endsWith(';')) {
                return `${spaces}${trimmed};${trailing}`;
            }
            return match;
        });
        
        return code;
    }

    /**
     * Transform 4D commands to JavaScript imports and calls
     */
    transformCommands(code, filename) {
        const importStatements = new Set();
        
        // Temporarily remove SQL blocks to prevent transformation
        const sqlBlocks = [];
        let sqlBlockIndex = 0;
        code = code.replace(/__BEGIN_SQL_BLOCK__`(.*?)`__END_SQL_BLOCK__/gs, (match, sqlContent) => {
            sqlBlocks.push(sqlContent);
            return `__SQL_BLOCK_PLACEHOLDER_${sqlBlockIndex++}__`;
        });
        
        // Find all command calls (basic pattern matching)
        // Sort commands by length (longest first) to avoid partial matches
        const sortedCommands = Array.from(this.commands.entries()).sort((a, b) => b[0].length - a[0].length);
        
        for (const [commandName, commandInfo] of sortedCommands) {
            const pattern = new RegExp(`\\b${commandName}\\b(?=\\s*\\()`, 'g'); // Lookahead for '(' to match function calls
            let match;
            while ((match = pattern.exec(code)) !== null) {
                const offset = match.index;
                const afterMatch = code.substring(offset + match[0].length);
                
                // Skip if already transformed (followed by (processState)
                if (afterMatch.startsWith('(processState')) {
                    continue;
                }
                
                // Add import if not already added
                const sanitizedName = this.sanitizeFunctionName(commandName);
                const importPath = this.getImportPath(filename, commandName);
                importStatements.add(`import ${sanitizedName} from "${importPath}";`);
                
                // Replace with function call only if not already a function call
                // But since we're after syntax transform, most should be handled
            }
        }
        
        // Restore SQL blocks
        code = code.replace(/__SQL_BLOCK_PLACEHOLDER_(\d+)__/g, (match, index) => {
            return `__BEGIN_SQL_BLOCK__\`${sqlBlocks[parseInt(index)]}\`__END_SQL_BLOCK__`;
        });
        
        // Handle Begin_SQL import specifically
        if (code.includes('Begin_SQL(') || code.includes('__BEGIN_SQL_BLOCK__')) {
            const importPath = this.getImportPath(filename, 'Begin SQL');
            importStatements.add(`import Begin_SQL from "${importPath}";`);
        }
        
        return {
            imports: Array.from(importStatements),
            code: code // No replacement needed here since syntax is already transformed
        };
    }

    /**
     * Transform 4D command syntax to JavaScript function calls
     */
    transformCommandSyntax(code) {
        const usedCommands = new Set();
        
        // Temporarily remove SQL blocks to prevent transformation
        const sqlBlocks = [];
        let sqlBlockIndex = 0;
        code = code.replace(/__BEGIN_SQL_BLOCK__`(.*?)`__END_SQL_BLOCK__/gs, (match, sqlContent) => {
            sqlBlocks.push(sqlContent);
            return `__SQL_BLOCK_PLACEHOLDER_${sqlBlockIndex++}__`;
        });
        
        // First, apply simple replacements (like TRACE:C157 -> debugger)
        code = this.applySimpleReplacements(code);
        
        // Transform 4D command calls like LOG EVENT:C667(0; "text") to LOG_EVENT(processState, 0, "text")
        // Use [^ ] instead of \s to avoid matching newlines
        code = code.replace(/([A-Za-z][A-Za-z0-9 ]*?):C\d+\(([^)]+)\)/gm, (match, command, args) => {
            const trimmedCommand = command.trim();
            const sanitizedName = this.sanitizeFunctionName(trimmedCommand);
            usedCommands.add(sanitizedName);
            const argList = args.split(';').map(arg => arg.trim());
            const beforeCommand = match.substring(0, match.indexOf(command.trim()));
            return `${beforeCommand}${sanitizedName}(processState, ${argList.join(', ')})`;
        });
        
        // Transform 4D command calls that have already been partially transformed
        // Like LOG_EVENT(processState):C667(0; "text") to LOG_EVENT(processState, 0, "text")
        code = code.replace(/(\w+)\(processState\):C\d+\(([^)]+)\)/g, (match, command, args) => {
            const sanitizedName = this.sanitizeFunctionName(command);
            usedCommands.add(sanitizedName);
            const argList = args.split(';').map(arg => arg.trim());
            return `${sanitizedName}(processState, ${argList.join(', ')})`;
        });
        
        // Transform 4D command calls with nested parentheses like STRING:C10(processState.OK) to STRING(processState, processState.OK)
        // Process line by line to avoid matching across line boundaries
        const lines = code.split('\n');
        code = lines.map(line => {
            // First handle commands with parentheses
            line = line.replace(/([A-Za-z][A-Za-z0-9 ]*?):C(\d+)\(([^)]+)\)/g, (match, command, number, args) => {
                const trimmedCommand = command.trim();
                const sanitizedName = this.sanitizeFunctionName(trimmedCommand);
                usedCommands.add(sanitizedName);
                if (trimmedCommand === 'STRING') {
                    return `${sanitizedName}(processState, ${args})`;
                }
                return `${sanitizedName}(processState, ${number}, ${args})`;
            });
            
            // Then handle simple command calls like TRACE:C157
            line = line.replace(/([A-Za-z][A-Za-z0-9 ]*?):C(\d+)/g, (match, command, number) => {
                const trimmedCommand = command.trim();
                const sanitizedName = this.sanitizeFunctionName(trimmedCommand);
                usedCommands.add(sanitizedName);
                return `${sanitizedName}(processState, ${number})`;
            });
            
            return line;
        }).join('\n');
        
        // Transform function calls that are missing processState parameter
        // Like ARCTAN(x/y) to ARCTAN(processState, x/y)
        code = code.replace(/\b(ARCTAN|STRING|LOG_EVENT)\(([^)]+)\)/g, (match, funcName, args) => {
            // Check if processState is already the first argument
            if (args.trim().startsWith('processState')) {
                return match; // Already has processState
            }
            // Add to usedCommands so it gets imported
            usedCommands.add(funcName);
            return `${funcName}(processState, ${args})`;
        });
        
        // Transform variable declarations
        code = code.replace(/let\(([^)]+)\)/g, (match, variables) => {
            const varList = variables.split(',').map(v => v.trim()).join(', ');
            return `let ${varList}`;
        });
        
        // New: Handle plain command names without :C that are in commands map
        // Sort by length longest first
        const sortedCommands = Array.from(this.commands.keys()).sort((a, b) => b.length - a.length);
        for (const commandName of sortedCommands) {
            // Don't match if already followed by parentheses (already transformed)
            const pattern = new RegExp(`\\b${commandName}\\b(?!\\s*:C)(?!\\s*\\()`, 'g');
            code = code.replace(pattern, (match) => {
                const sanitizedName = this.sanitizeFunctionName(match);
                usedCommands.add(sanitizedName);
                return `${sanitizedName}(processState)`;
            });
        }
        
        // Restore SQL blocks
        code = code.replace(/__SQL_BLOCK_PLACEHOLDER_(\d+)__/g, (match, index) => {
            return `__BEGIN_SQL_BLOCK__\`${sqlBlocks[parseInt(index)]}\`__END_SQL_BLOCK__`;
        });
        
        return { code, usedCommands };
    }

    /**
     * Apply simple replacements for 4D commands
     */
    applySimpleReplacements(code) {
        const simpleReplacements = {
            "TRACE:C157": "debugger",
            "True:C214": "true",
            "False:C215": "false",
            "Arctan:C20": "ARCTAN",
            "Sin:C17": "SIN",
            "Tan:C19": "TAN",
            "Cos:C18": "COS",
            "Is Windows:C1573": "(process.platform === 'win32')",
            "Is macOS:C1572": "(process.platform === 'darwin')",
            "New collection:C1472": "[]",
            "New shared collection:C1527": "[]",
            "Null:C1517": "null",
            "Into system standard outputs:K38:9": "6",
            "C_LONGINT:C283": "let",
            "C_REAL:C285": "let",
            "String:C10": "STRING"
        };
        
        for (const [from, to] of Object.entries(simpleReplacements)) {
            code = code.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
        }
        
        // Fix CHOOSE function calls - convert semicolons to commas within CHOOSE calls
        code = code.replace(/CHOOSE\(([^)]+)\)/g, (match, params) => {
            const fixedParams = params.replace(/;/g, ',');
            return `CHOOSE(${fixedParams})`;
        });
        
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
                    code = code.replace(regexWithParams, (match, params) => {
                        const trimmedParams = params.trim();
                        if (trimmedParams) {
                            return `${transformation.to}(processState, ${params})`;
                        } else {
                            return `${transformation.to}(processState)`;
                        }
                    });
                } else {
                    // Generate import statement for the method
                    const methodImportPath = this.getMethodImportPath(filename, transformation.to);
                    methodImports.push(`import ${transformation.to} from "${methodImportPath}";`);
                    
                    // Transform the method call with parameters - preserve the original parameter content
                    code = code.replace(regexWithParams, (match, params) => {
                        // If params is empty or just whitespace, don't add the comma
                        const trimmedParams = params.trim();
                        if (trimmedParams) {
                            return `${transformation.to}(processState, ${params})`;
                        } else {
                            return `${transformation.to}(processState)`;
                        }
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
                    code = code.replace(regex, `${transformation.to}(processState)`);
                } else {
                    // Generate import statement for the method
                    const methodImportPath = this.getMethodImportPath(filename, transformation.to);
                    methodImports.push(`import ${transformation.to} from "${methodImportPath}";`);
                    
                    // Transform the method call without parameters
                    code = code.replace(regex, `${transformation.to}(processState)`);
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
                    // Also check if the sanitized version of the command name matches the file name
                    if (this.sanitizeFunctionName(commandName) === fileCommandName) {
                        return fileCommandName;
                    }
                    // Also check if the command name with spaces matches the file name with underscores
                    if (commandName.replace(/ /g, '_') === fileCommandName) {
                        return fileCommandName;
                    }
                    // Special case: Begin_SQL -> Begin SQL
                    if (commandName === 'Begin_SQL' && fileCommandName === 'Begin SQL') {
                        return fileCommandName;
                    }
                    // Check if underscore version matches space version
                    if (commandName.replace(/_/g, ' ') === fileCommandName) {
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