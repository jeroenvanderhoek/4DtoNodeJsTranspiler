import simpleReplacements from './simple4dCommandReplacements.js';
import $Dcommands from './$Dcommands.js';
import declarations from './declarations.js';

/**
 * Transpile a 4dm file to JavaScript and keep track of used $Dcommands.js, 
 * so they can be imported later on using importStatements.
 * @param {object} app - app object
 * @param {string} code - content of the 4dm file
 * @param {string} filename - filename of the 4dm file
 * @returns {string} - file content transpiled to JS
 */
function transpile (app, code, filename) {

    console.log("Transpiling " + filename);
    // FIXME this should not be replaced in strings / php / sql statements / comments

    let result = '';

    console.log("simpleReplacements...");
    // Replace $D commands that can directly be replaced by JS commands
    for ( let prop in simpleReplacements ) {
        console.log("replace " + prop + " with " + simpleReplacements[prop]);
        code = code.replace(new RegExp(`${ prop }`, "g"), simpleReplacements[prop]);
    }

    let arrayOfLines = code.split('\n');
debugger;
    arrayOfLines.forEach((line) => {

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
        const regexNew = /var (\$\w+) : (\w+):=(\w+)/;
        const matchNew = line.match(regexNew);

        if (matchNew) {
            const variableName = matchNew[1];
            const dataType = matchNew[2];
            const value = matchNew[3];
            return `let ${variableName} = ${value};`;
        }

        // Transpile declarations with default values like:
        // var $vl_start : Integer; to let $vl_start = 0;
        // var $vl_start, $vl_end: Integer; to let $vl_start, $vl_end = 0;
        const regex3 = /var (\$\w+) : (\w+)/;
        const match3 = line.match(regex3);

        if ( match3 ) {
            const variableNamesStr = match3[1];
            const dataType = match3[2];

            if ( dataType in declarations.newDeclarations ) {
                const defaultValue = declarations.newDeclarations[dataType];
                const variableNames = variableNamesStr.replace(new RegExp(`;`, "g"),', ');
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

    code = arrayOfLines.join('\n');

    // FIXME varname can't start with a number or <>

    let importStatements = [];

    result = code;

    // Replace $D commands with JS functions
    // Example "ALERT:C41(msg)" -> "alert(msg)"
    console.log("Replace $D commands...");
    $Dcommands.forEach((sourceCmdWithNumber)=>{

        // Get commandname name from sourceCmdWithNumber
        let cmdName = sourceCmdWithNumber.split(':')[0];

        let occurencesInFile = result.split(sourceCmdWithNumber).length - 1;

        for ( let i = 0; i < occurencesInFile; i++ ) {

            // Get the index of the next occurence of the $D command in the code
            let index = result.indexOf(sourceCmdWithNumber);

            // Check if the $D command has parameters
            if ( result[index + sourceCmdWithNumber.length] === '(' ) {

                let paramsStr = result.substring(index + sourceCmdWithNumber.length + 1, result.indexOf(')', index));
                let params = paramsStr.split(';').map(param => param.trim()); // FIXME dont split on ';' inside strings

                // Replace the $D command with the JS command and its parameters
                result = result.replace(sourceCmdWithNumber + paramsStr, cmdName + '(' + params.join(',') + ')');

            } else {

                // Replace the $D command with the JS command
                result = result.replace(sourceCmdWithNumber,cmdName);

            }

        }

        // if command was found add an import statement once to importStatements which is used in onStartup.js
        if ( occurencesInFile > 0 ) {

            // Get the JS translation of the $D command
            let importStatement = 'import ' + cmdName + ' from \"../../$Dcommands/' + cmdName + '.js\";';

            if ( !importStatements.includes(importStatement) ) {
                importStatements.push(importStatement);
            }

        }

    });

    // Prepend import statements to file
    result = importStatements.join('\n') + '\n\n' + result;

    console.log("Replace project methods... TODO"); 

    return result;

}

export default transpile;