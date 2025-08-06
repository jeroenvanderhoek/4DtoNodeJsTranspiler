#!/usr/bin/env node

import { SimpleTranspiler } from './src/simple-transpiler.js';

async function main() {
    try {
        const transpiler = new SimpleTranspiler();
        await transpiler.transpileProject('input', 'output');
        
        console.log('\n🎉 Ready to run the transpiled application!');
        console.log('   cd output && npm start');
        
    } catch (error) {
        console.error('Transpilation failed:', error.message);
        process.exit(1);
    }
}

main(); 