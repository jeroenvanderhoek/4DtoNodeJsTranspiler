// Import Node.js modules
import fs from 'fs';
import {lstatSync} from 'fs';
import { glob } from 'node:fs/promises'; console.log('Requires node 22.0.0 or higher');

// Import our custom modules
import simpleReplacements from './simple4dCommandReplacements.js';
import fourDCommands from './$Dcommands.js';
import declarations from './declarations.js';


// $D to Node.js Transpiler
let app = {
    importStatements: [], // Array with import statements which are used in onServerStartup.js
};

// Clean output dir
console.log("Cleaning output dir...");
if (fs.existsSync("./output")) {
    fs.rmdirSync("./output", { recursive: true });

}
fs.mkdirSync("./output");

// Copy template files to output dir (package.json, nodules_modules, etc.)
console.log('Copying output_template...');
for await (const entry of glob("output_template/**/*")){
    fs.copyFile(entry, entry.replace('output_template','output'), (err) => {
        if (err) throw err;
        console.log(entry + 'was copied');
    });
}

// Copy template files to output dir (package.json, nodules_modules, etc.)
console.log('Copying $Dcommands...');
for await (const entry of glob("$Dcommands/**/*")){
    fs.copyFile(entry, entry.replace('./','./output/Project/Sources/Databasemethods/'), (err) => {
        if (err) throw err;

    });
}

// Copy all input files to output dir except 4dm files
console.log("Copying input/**/*...");
for await (const entry of glob("input/**/*")){

    console.log("Copying " + entry);
    const stat = lstatSync(entry);

    let newEntry = entry.replace('input/','output/');

    if ( stat.isDirectory() && !fs.existsSync(newEntry)){
        fs.mkdirSync(newEntry);
    } else if (!entry.endsWith('.4dm')) {

        fs.copyFile(entry, newEntry, (err) => {
            if (err) throw err;
            console.log(entry + ' was copied');

        });

    }
}

// // Transpile all 4dm files to JavaScript
// Copy all input files to output dir except 4dm files (should copy directory structure)
console.log("Transpiling 4dm files...");
for await (const entry of glob("input/**/*.4dm")){

    let code = fs.readFileSync(entry, 'utf8');
    let transpiledCode = transpileFile(code,entry);
    // Write to js file in output dir
    fs.writeFileSync('./output/' + entry + '.js', transpiledCode);

    // Add import statements to onServerStartup.js
    let startjs = fs.readFileSync('./output/Project/Sources/DatabaseMethods/onServerStartup.js');
    startjs = app.importStatements.join('\n\n') + startjs;

}


/**
 * Transpile a 4dm file to JavaScript and keep track of used fourDCommands.js, so they can be to be imported later on app.importStatements
 * @param {string} code - content of the 4dm file
 * @param {string} filename - filename of the 4dm file
 * @returns {string} - file content transpiled to JS
 */
function transpileFile (code, filename) {

    console.log("Transpiling " + filename);
    // FIXME this should not be replaced in strings / php / sql statements / comments

    console.log("simpleReplacements...");
    // Replace $D commands that can directly be replaced by JS commands
    for ( let prop in simpleReplacements ) {
        code = code.replaceAll(prop, simpleReplacements[prop]);
    }

    // Replace 4D declarations that can directly be replaced by JS commands
    for ( let prop in declarations.oldDeclarations ) {
        code = code.replaceAll(prop, simpleReplacements[prop]);
    }

    let arrayOfLines = code.split('\n').forEach((line) => {

        // Transpile declarations like:
        //  C_TEXT:C284(x1;x2;x3) to let x1,x2,x3 = "";
        const regexOld = /(\$\w+)\((\w+)\);/
        const matchOld = line.match(regexOld);

        if (matchOld) {

            const dataType = matchOld[1];
            const variableNamesStr = matchOld[2];

            if ( dataType in declarations.oldDeclarations ) {

                const defaultValue = declarations.oldDeclarations[dataType];

                let variableNames = variableNamesStr.split(';').map(param => param.trim());

                return `let ${variableNames.join(",")} = ${defaultValue};`;

            } else {

                console.log(`Unsupported data type: ${dataType} ${filename}`);
                return line;

            }

        }

        // Transpile declarations with assigned values like:
        // var $vl_start : Integer:=4; to let $vl_start = 4;
        // var $vl_start, $vl_end: Integer = 5; to let $vl_start, $vl_end = 5;
        const regex = /var (\$\w+) : (\w+):=(\w+)/;
        const match = line.match(regex);

        if (match) {
            const variableName = match[1];
            const dataType = match[2];
            const value = match[3];
            const defaultValue = declarations.newDeclarations[dataType];
            return `let ${variableName} = ${value};`;
        }

        // Transpile declarations with default values like:
        // var $vl_start : Integer; to let $vl_start = 0;
        // var $vl_start, $vl_end: Integer; to let $vl_start, $vl_end = 0;
        const regex3 = /var (\$\w+) : (\w+)/;
        const match3 = line.match(regex3);

        if (match3) {
            const variableNamesStr = match3[1];
            const dataType = match3[2];

            if ( dataType in declarations.newDeclarations ) {
                const defaultValue = declarations.newDeclarations[dataType];
                const variableNames = variableNamesStr.replaceAll(';',', ');
                return `let ${variableNames} = ${defaultValue};`;
            } else {
                console.log(`Unsupported data type: ${dataType} ${filename}`);
                return line;
            }

        } else {
            // Handle other 4D constructs or return the original line
            return line;
        }

    });

    debugger;

    code = arrayOfLines.join('\n');

    // FIXME varname can not start with a number or <>

    // Replace $D commands with JS commands
    // Example "ALERT:C41(msg)" -> "alert(msg)"
    console.log("Replace 4D commands...");
    fourDCommands.forEach((sourceCmdWithNumber)=>{

        // Get commandname name from sourceCmdWithNumber
        let cmdName = sourceCmdWithNumber.split(':')[0];

        let occurencesInFile = code.split(sourceCmdWithNumber).length - 1;

        for ( let i = 0; i < occurencesInFile; i++ ) {

            // Get the index of the next occurence of the $D command in the code
            let index = code.indexOf(sourceCmdWithNumber);

            // Check if the $D command has parameters
            if ( code[index + sourceCmdWithNumber.length] === '(' ) {

                let paramsStr = code.substring(index + sourceCmdWithNumber.length + 1, code.indexOf(')', index));
                let params = paramsStr.split(';').map(param => param.trim()); // FIXME dont split on ';' inside strings

                // Replace the $D command with the JS command and its parameters
                code.replace(sourceCmdWithNumber + paramsStr, cmdName + '(' + params.join(',') + ')');

            } else {

                // Replace the $D command with the JS command
                code.replace(sourceCmdWithNumber,cmdName);

            }

        }

        // if command was found add an import statement once to app.importStatements which is used in onStartup.js
        if ( occurencesInFile > 0 ) {

            // Get the JS translation of the $D command
            let importStatement = 'import ' + cmdName + ' from ' + cmdName + '.js';
            if ( !app.importStatements.includes(importStatement) ) {
                app.importStatements.push(importStatement);
            }

        }

    });

    console.log("Replace project methods...");

    return code;

}
