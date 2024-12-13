import simpleReplacements from './simple4dCommandReplacements.js';
import $Dcommands from './$Dcommands.js';
import declarations from './declarations.js';
import constants from './constants.js';
import { globSync } from 'glob';
import path from 'path';

/**
 * Transpile a 4dm file to JavaScript and keep track of used $Dcommands.js, 
 * so they can be imported later on using importStatements.
 * @param {object} app - app object
 * @param {string} code - content of the 4dm file
 * @param {string} filename - filename of the 4dm file
 * @returns {string} - file content transpiled to JS
 */
export function transpile (app, code, filename) {

    let transpiledCode = '';

    console.log("Transpiling " + filename);
    // FIXME this should not be replaced in strings / php / sql statements / comments

    // Replace curly braces with square brackets in array indexes
    code = replaceArrays(code);
    // Replace $D for loops with JS for loops
    code = replaceForLoops(code);

    console.log("Applying simpleReplacements...");
    // Replace $D commands that can directly be replaced by JS commands
    for ( let prop in simpleReplacements ) {
        if (  code.match(new RegExp(`${ prop }`)) ) {
            console.log("- " + prop + " -> " + simpleReplacements[prop]);
            code = code.replace(new RegExp(`${ prop }`, "g"), simpleReplacements[prop]);
        }
    }

    let arrayOfLines = [];
 
    code.split('\n').forEach((line) => {


        /**
         * Transpile declarations like:
         * C_TEXT:C284(x1;x2;x3) to let x1,x2,x3 = "";
         * C_REAL:C284(x1;x2;x3) to let x1,x2,x3 = 0;
         */
        const regexOld = /C_\w+:\w{4}\([^\)]+\)/;
        const matchOld = line.match(regexOld);

        if (matchOld) {

            let dataType = matchOld[0].split("(")[0];
            let variableNamesStr = matchOld[0].split("(")[1].split(")")[0];
            let tp = declarations.oldDeclarations.find(obj => (obj.name === dataType));

            if ( tp ) {
                const defaultValue = tp.value;
                let arrayOfVariableNames = variableNamesStr.split(';');
                arrayOfVariableNames = arrayOfVariableNames
                                        .filter(str => { return !str.match( new RegExp(/^\$[1-9]+/)) }) // dont declare parameters: starting with $### (e.g. $1, $2, $3)
                                        .map(param => param.trim()); // remove whitespace
                if ( arrayOfVariableNames.length > 0) {
                    arrayOfLines.push(`let ${arrayOfVariableNames.join(",")} = ${defaultValue};`);
                }
                return;
            } else {
                console.log(`Unsupported data type: ${dataType} ${filename}`);
                arrayOfLines.push(line);
                return;
            }

        }


        /**
         * Transpile declarations with assigned values like:
         * var $vl_start : Integer:=4; to let $vl_start = 4;
         * var $1, $vl_start, $vl_end : Integer = 5; to let $vl_start, $vl_end = 5;
         */
        const regexNew = /var (\$\w+) : (\w+):=(\w+)/; // FIXME this regex might not be correct
        const matchNew = line.match(regexNew);

        if (matchNew) {

            let variableNames = matchNew[1];
            let arrayOfVariableNames = variableNames.split(',');
            
            // Dont declare parameters: starting with $### (e.g. $1, $2, $3)
            variableNames = arrayOfVariableNames 
                .filter(str => { return !str.match( new RegExp(/^\$[1-9]+/)) }) 

            if ( variableNames > 0  ) {

                const dataType = matchNew[2];
                const value = matchNew[3];
                arrayOfLines.push(`let ${variableNames} = ${value};`);

            } else {
                // Skip type-casting parameters
            }
            return;

        }

        /**
         * Transpile declarations with default values like:
         * var $vl_start : Integer; to let $vl_start = 0;
         * var $vl_start, $vl_end: Integer; to let $vl_start, $vl_end = 0;
         */
        const regex3 = /var (\$\w+) : (\w+)/; 
        const match3 = line.match(regex3);

        if ( match3 ) {

            const variableNamesStr = match3[1];
            const dataType = match3[2];

            if ( dataType in declarations.newDeclarations ) {
                const defaultValue = declarations.newDeclarations[dataType];
                const variableNames = variableNamesStr.replace(new RegExp(`;`, "g"),', ');
                arrayOfLines.push(`let ${variableNames} = ${defaultValue};`);
                return;
            } else {
                console.log(`Unsupported data type: ${dataType} ${filename}`);
                arrayOfLines.push(line);
                return;
            }

        } 


        /**
        * Transpile declarations of parameters with #DECLARE like:
        * #DECLARE($vt_url : Text; $vt_http_header : Text; $vt_ip_adress_web_client : Text)
        */
        // const regexDeclare = /#DECLARE\(\$(vt_url)\s*:\s*Text;\s*\$(vt_http_header)\s*:\s*Text;\s*\$(vt_ip_adress_web_client)\s*:\s*Text\)/;
        const regexDeclare = /#DECLARE\((.*?)\)/;
        const matchDeclare = line.match(regexDeclare);

        if (matchDeclare) {

            const regexVars = /(\$\w+) : (\w+)/;
            let matchVars = matchDeclare[1].match(regexVars);

            if ( matchVars ) {
                for ( let i = 1; i < matchVars.length; i++ ) {
                    arrayOfLines.push(`let ${matchVars[i]};`);
                }
            }

            return;
        }

        // Handle other 4D constructs or return the original line
        arrayOfLines.push(line);
        return;

    });

    transpiledCode = arrayOfLines.join('\n');

    // FIXME varname can't start with a number or <>

    let importStatements = [];

    // Replace $D commands with JS functions
    // Example "ALERT:C41(msg)" -> "alert(msg)"
    console.log("Replace $D commands...");
    $Dcommands.forEach((sourceCmdWithNumber)=>{

        // Get commandname name from sourceCmdWithNumber
        let cmdName = sourceCmdWithNumber.split(':')[0];

        let occurencesInFile = transpiledCode.split(sourceCmdWithNumber).length - 1;

        for ( let i = 0; i < occurencesInFile; i++ ) {

            // Get the index of the next occurence of the $D command in the code
            let index = transpiledCode.indexOf(sourceCmdWithNumber);

            // Check if the $D command has parameters
            if ( transpiledCode[index + sourceCmdWithNumber.length] === '(' ) {

                let paramsStr = transpiledCode.substring(index + sourceCmdWithNumber.length + 1, transpiledCode.indexOf(')', index));
                let params = paramsStr.split(';').map(param => param.trim()); // FIXME dont split on ';' inside strings

                // Replace the $D command with the JS command and its parameters
                // Replace spaces in command names with underscores for javascript
                transpiledCode = transpiledCode.replace(sourceCmdWithNumber + "(" + paramsStr + ")", cmdName.replace(/ /g,"_") + "(" + params.join(",") + ")");

            } else {

                // Replace the $D command with the JS command
                // Replace spaces in command names with underscores for javascript
                transpiledCode = transpiledCode.replace(sourceCmdWithNumber,(cmdName+"()").replace(/ /g,"_"));

            }

        }

        // if command was found add an import statement once to importStatements which is used in onStartup.js
        if ( occurencesInFile > 0 ) {

            // Get the JS translation of the $D command
            // Replace spaces in command names with underscores for javascript
            let importStatement = 'import ' + (cmdName).replace(/ /g,"_") + ' from \"../../$Dcommands/' + cmdName + '.js\";';

            if ( !importStatements.includes(importStatement) ) {
                importStatements.push(importStatement);
            }

        }

    });

    // Replace constants with their values 
    // OPTIMIZE: replace with actual constant names instead of just the values (remove spaces from constantnames and add import statements)
    console.log("Replace constants with their values..."); 
    for ( let prop in constants ) {
        transpiledCode = transpiledCode.replace(new RegExp(`${ prop }`, "g"), constants[prop]);
    }

    // Replace methods-name with JS-compatible names and add import statements in all 4dm files which use them
    // Replace Project methods
    console.log("Replace Project methods...");  
    globSync("input/**/Methods/*.4dm").forEach(function(entry){ 
        transpiledCode = replaceMethod(entry,transpiledCode,importStatements);
    });
    // Replace Database methods
    console.log("Replace Database methods..."); 
    globSync("input/**/DatabaseMethods/*.4dm").forEach(function(entry){
        transpiledCode = replaceMethod(entry,transpiledCode,importStatements);
    });

    
    // Wrap all methods, except the starting point, in a function and export them by prepending export default
    if ( filename.indexOf(app.entryPointFileName) === -1 ) {

        // For clarity the filename is used as the function name, spaces are replaced by underscores
        let functionName = filename.split(path.sep).pop().replace('.4dm','').replace(/ /g,"_"); 

        // Add parameters to these functions calle $1, $2, $3, untill $15 
        transpiledCode = `export default function ${functionName}($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) {\n\n${ transpiledCode }\n\n}`;

    }

    // Prepend import statements to file
    if ( importStatements.length > 0 ) {
        console.log("Importing: \n- " + importStatements.join('\n- '));
        transpiledCode = importStatements.join('\n') + '\n\n' + transpiledCode;
    } 

    // onServerStartup is the starting point of the project prepend a log message
    if ( filename.indexOf(app.entryPointFileName) > 0 ) {
        transpiledCode = `
console.log("RUNNING TRANSPILED PROJECT:");
console.log("");
// processObject
let processObject = {};
` + transpiledCode;
    }

    return transpiledCode;

}


/**
 * replaceMethod Project methods and Database methods
 * - pass the parameters to the JS function
 * - replace spaces in method names with underscores
 * - add (); to the JS function name
 * - add import statements to importStatements
 * 
 * @param {string} entry - filename of the 4dm file
 * @param {string} transpiledCode - transpiledCode
 * @param {array string} importStatements - array with importstatements for the transpiled method
 * @returns {void}
 **/
function replaceMethod (entry,transpiledCode,importStatements) {
    
    let splitEntry = entry.split(path.sep);

    let methodName = splitEntry.pop().replace('.4dm','');
    let folderName = splitEntry.pop();

    // New JS methodname without spaces
    let jsMethodName = methodName.replace(/ /g,"_");

    let occurencesInFile = transpiledCode.split(methodName).length - 1; // FIXME dont match in string / php / sql / comments (Or rename project methods in your project to avoid this)

    for ( let i = 0; i < occurencesInFile; i++ ) {

        // Get the index of the next occurence of the Project Method in the code
        let index = transpiledCode.indexOf(methodName);

        // Check if the Project Method has parameters
        if ( 
            transpiledCode.length > (index + methodName.length + 1) && // check if there is a character after the method name
            transpiledCode[index + methodName.length] === '(' // check if it is a method call
        ) {

            let paramsStr = transpiledCode.substring(index + methodName.length + 1, transpiledCode.indexOf(')', index));
            let params = paramsStr.split(';').map(param => param.trim()); // FIXME dont split on ';' inside strings

            // Replace the Project Method with the JS command and its parameters
            // Replace spaces in command names with underscores for javascript
            transpiledCode = transpiledCode.replace(methodName + "(" + paramsStr + ")", jsMethodName.replace(/ /g,"_") + "(" + params.join(",") + ")");

        } else {

            // Replace the Project Method with the JS command
            // Replace spaces in command names with underscores for javascript

            debugger

            transpiledCode = transpiledCode.replace(methodName,(jsMethodName+"()").replace(/ /g,"_"));

        }

    }

    // if a command was used in this file add an import statement
    if ( occurencesInFile > 0 ) {

        
        if ( folderName === 'DatabaseMethods' ) {

            // $D renamed the filenames of the database methods: "On Web Connection database method" -> "onWebConnection"
            //     "On Backup Shutdown database method",
            //     "On Backup Startup database method",
            //     "On Drop database method",
            //     "On Exit database method",
            //     "On Host Database Event database method",
            //     "On Mobile App Action database method",
            //     "On Mobile App Authentication database method",
            //     "On REST Authentication database method",
            //     "On Server Close Connection database method",
            //     "On Server Open Connection database method",
            //     "On Server Shutdown database method",
            //     "On Server Startup database method",
            //     "On SQL Authentication database method",
            //     "On Startup database method",
            //     "On System Event database method",
            //     "On Web Authentication database method",
            //     "On Web Connection database method", -> onWebConnection
            //     "On Web Legacy Close Session database method"

            methodName = methodName.replace(' database method','');
            methodName = methodName.replace('On ','on');
            methodName = methodName.replace(' ','');
        
        }

        let importStatement = `import ${ jsMethodName } from \"../${ folderName }/${ methodName }.js\";`;

        if ( !importStatements.includes(importStatement) ) {
            importStatements.push(importStatement);
        }

    }

    return transpiledCode;

}

export function replaceArrays ( code ) {

    // Replace curly braces with square brackets in array indexes
    const regexBrackets = /(\w+)\{([^}]+)\}/g;
    const replacementForBrackets = '$1[($2)-1]'; // index in 4D is 1-based, in JS it is 0-based, so -1
    code = code.replace(regexBrackets, replacementForBrackets);

    // Replace ARRAY TEXT($x,40) and ARRAY BOOLEAN, ARRAY INTEGER, ARRAY REAL, ARRAY BLOB etc. with let array = new Array(size);
    const regex2 = /ARRAY\s([A-Z]+):C(\d+)\((\$?)(\w+);\s*(\d+)\)/g
    const replacement2 = 'let $3$4 = new Array($5); // $1'; 
    code = code.replace(regex2, replacement2);

    // Replace ARRAY TEXT($x) with let $x = [];
    const regex3 = /ARRAY\s([A-Z]+):C\d+\(\$(\w+)\)/g;
    const replacement3 = 'let $2 = []; // $1';
    code = code.replace(regex3, replacement3);

    return code;

}


export function replaceForLoops ( code ) {

    // const code = `
    // For ($i; 1; 10)
    // // Do something
    // End for

    // For (j; 5; 20)
    // // Do something else
    // End for
    // `;

    // Replace 4D for loops with JS for loops
    // const regex = /For\s*\(\$([a-zA-Z0-9]+);\s*(\d+);\s*(\d+)\)\s*(.*?)(End for)/gms;
    const regex = /For\s*\((\$?\w+);\s*(\d+);\s*(\d+)\)\s*([\s\S]*?)\s*End\s*for/g;
    const replacement = 'for (let $1 = $2; $1 <= $3; $1++) { \n $4 \n}';

    code = code.replace(regex, replacement);

    return code;

}