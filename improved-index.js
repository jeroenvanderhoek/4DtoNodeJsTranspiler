#!/usr/bin/env node

/**
 * Improved 4D to Node.js Transpiler Entry Point
 * Uses the new architectural components for better reliability and performance
 */

import { ImprovedTranspiler } from './src/improved-transpiler.js';
import { TranspilerConfig } from './src/config-manager.js';

async function main() {
    try {
        console.log('🚀 4D to Node.js Transpiler (Improved Version)');
        console.log('===============================================\n');

        // Load configuration
        const config = TranspilerConfig.loadFromFile('./transpiler.config.json');
        
        // Create transpiler instance
        const transpiler = new ImprovedTranspiler({
            transpilation: {
                contextAware: true,
                errorRecovery: true,
                parallelProcessing: true,
                maxWorkers: 4
            },
            output: {
                sourceMaps: true,
                format: 'es6'
            },
            commands: {
                generateStubs: true,
                strict: false
            },
            web: {
                framework: 'express',
                port: 80
            },
            logging: {
                level: 'info',
                detailed: true
            }
        });

        // Initialize transpiler
        await transpiler.initialize();

        // Transpile project
        await transpiler.transpileProject('input', 'output');

        console.log('\n✅ Transpilation completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Files processed: ${transpiler.stats.filesProcessed}`);
        console.log(`   Transpilation time: ${transpiler.stats.transpilationTime}ms`);
        console.log(`   Errors: ${transpiler.stats.totalErrors}`);
        console.log(`   Warnings: ${transpiler.stats.totalWarnings}`);

        if (transpiler.stats.totalErrors > 0) {
            console.log('\n⚠️  Transpilation completed with errors. Check the reports for details.');
            process.exit(1);
        }

        console.log('\n🎉 Ready to run the transpiled application!');
        console.log('   cd output && npm start');

    } catch (error) {
        console.error('\n❌ Transpilation failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
4D to Node.js Transpiler (Improved Version)

Usage:
  node improved-index.js [options]

Options:
  --config <file>     Configuration file path (default: transpiler.config.json)
  --input <dir>       Input directory (default: input)
  --output <dir>      Output directory (default: output)
  --parallel          Enable parallel processing
  --source-maps       Generate source maps
  --strict            Enable strict mode
  --help, -h          Show this help message

Examples:
  node improved-index.js --input my-4d-project --output my-node-app
  node improved-index.js --parallel --source-maps
`);
    process.exit(0);
}

// Parse command line arguments
const options = {};
for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    switch (arg) {
        case '--config':
            options.configFile = nextArg;
            i++;
            break;
        case '--input':
            options.inputDir = nextArg;
            i++;
            break;
        case '--output':
            options.outputDir = nextArg;
            i++;
            break;
        case '--parallel':
            options.parallel = true;
            break;
        case '--source-maps':
            options.sourceMaps = true;
            break;
        case '--strict':
            options.strict = true;
            break;
    }
}

// Override default configuration with command line options
if (Object.keys(options).length > 0) {
    const originalConfig = TranspilerConfig.loadFromFile(options.configFile || './transpiler.config.json');
    
    if (options.parallel) {
        originalConfig.transpilation.parallelProcessing = true;
    }
    
    if (options.sourceMaps) {
        originalConfig.output.sourceMaps = true;
    }
    
    if (options.strict) {
        originalConfig.commands.strict = true;
    }
    
    // Update the configuration
    Object.assign(originalConfig, options);
}

// Run the transpiler
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 