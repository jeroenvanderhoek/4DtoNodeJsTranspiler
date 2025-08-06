// Import Node.js modules
import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';
import fse from 'fs-extra'; 

// Import our custom modules
import { transpile, replaceForLoops } from './transpile.js';
import reservedWordsInJs from './reservedWordsInJs.js';


let app = {
    projectRoot: "output" + path.sep + "Project",
    entryPoint: "output" + path.sep + "Project" + path.sep + "Sources" + path.sep + "DatabaseMethods" + path.sep + "onServerStartup.js" 
};

console.log("Transpiling /input/Project/ to "+ app.entryPoint);

app.entryPointFileName = path.parse(app.entryPoint).name; // i.e. onServerStartup

// Clean output dir
console.log("Cleaning output dir...");
if (fs.existsSync("./output")) {
    fs.rmSync("./output", { recursive: true });
}

// Copy template files to output dir (package.json, nodules_modules, etc.)
console.log('Copying output_template...');
fse.copySync("output_template", "output", { overwrite: true });

// Copy all input files to output dir except .$dm files
const filter = file => {
    const ext = path.extname(file)
    return ext !== '.4dm'; // return true if the file is not a .$dm file
}
fse.copySync("input", "output", { filter });

// Replace reserved words in JavaScript
console.log('Replacing reserved words in JavaScript... FIXME');
reservedWordsInJs.forEach((word) => {
   // console.log('Replacing ' + word);
   // Replace in all method-name & /4Dcommands/ & /4Dcommands/ filenames
   // FIXME
});

// Copy template files to output dir (package.json, nodules_modules, etc.)
console.log('Copying 4Dcommands...');
fse.copySync("4Dcommands", app.projectRoot + path.sep + "4Dcommands", { overwrite: true });

// // Transpile all 4dm files to JavaScript
// Copy all input files to output dir except 4dm files (should copy directory structure)
console.log("Transpiling 4dm files...");

let foundInterprocessVariables = false;

globSync("input/**/*.4dm").forEach((entry) => {

    let code = fs.readFileSync(entry, 'utf8');

    if ( code.indexOf("<>") > -1 ) {
        foundInterprocessVariables = true;
    }

    let transpiledCode = transpile(app,code,entry)

    // Write to js file in output dir
    let newFileName = entry.replace('input'+path.sep,'output'+path.sep).replace('.4dm','.js');
    // console.log("Write ", newFileName,transpiledCode);
    fs.appendFileSync( newFileName, transpiledCode, {encoding: "utf8"});
    
});

if (foundInterprocessVariables) {

    console.log('\x1b[33mFound Interprocess Variables. These are deprecated.\x1b[0m');
    console.log('\x1b[33mA workaround could be to transfer the variables via process.env. (convert from blob / array / longint to string and back etc)\x1b[0m');

}