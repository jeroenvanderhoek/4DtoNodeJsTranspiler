// Import Node.js modules
import fs, { copyFile } from 'fs';
import {lstatSync} from 'fs';
import { glob } from 'node:fs/promises'; console.log('Requires node 22.0.0 or higher');
import path from 'path';

// Import our custom modules
import fourDCommands from './$Dcommands.js';
import transpile from './transpile.js';
import reservedWordsInJs from './reservedWordsInJs.js';

// $D to Node.js Transpiler
let app = {
    databaseMethodsFolderPath: '',
    projectRoot: '',
    DATABASEMETHODFOLDERPATH: path.sep + "Sources" + path.sep + "DatabaseMethods" + path.sep
};

// Clean output dir
console.log("Cleaning output dir...");
if (fs.existsSync("./output")) {
    fs.rmSync("./output", { recursive: true });
}
fs.mkdirSync("./output");

// Copy template files to output dir (package.json, nodules_modules, etc.)
console.log('Copying output_template...');
for await (const entry of glob("output_template/**/*")){
    fs.copyFile(entry, entry.replace('output_template','output'), (err) => {
        if (err) throw err;
        console.log(entry + ' was copied');
    });
}

// Copy all input files to output dir except 4dm files
console.log("Copying input/**/*...");
for await (const entry of glob("input/**/*")){

    console.log("Copying " + entry);
    const stat = lstatSync(entry);

    let newEntry = entry.replace('input' + path.sep,'output' + path.sep);

    if ( newEntry.indexOf(app.DATABASEMETHODFOLDERPATH) > 0 ) {
        app.projectRoot = newEntry.split(app.DATABASEMETHODFOLDERPATH,1)[0];
        console.log('projectRoot set ' + app.projectRoot);
    }

    if ( 
        stat.isDirectory() 
        && !fs.existsSync(newEntry) 
    ) {
        if ( entry.endsWith(app.DATABASEMETHODFOLDERPATH) ) {
            console.log('databaseMethodsFolderPath: ' + newEntry);
            app.databaseMethodsFolderPath = newEntry;
        }
        fs.mkdirSync(newEntry);
    } else if ( !entry.endsWith('.4dm') ) {

        console.log('Copying ' + entry + ' to ' + newEntry);
        fs.copyFile(entry, newEntry, (err) => {
            if (err) throw err;
            console.log('Copied ' + entry);
        });

    }

}

// Replace reserved words in JavaScript
console.log('Replacing reserved words in JavaScript... FIXME');
reservedWordsInJs.forEach((word) => {
   // console.log('Replacing ' + word);
   // Replace in all method-name & /$Dcommands/
});

// Copy template files to output dir (package.json, nodules_modules, etc.)
console.log('Copying $Dcommands...');
fs.mkdirSync(app.projectRoot + path.sep+"$Dcommands");
for await (const entry of glob("\$Dcommands/**/*")){
    console.log("Copying " + entry);
    fs.copyFile(entry, app.projectRoot + "/" + entry, (err) => {
        if (err) throw err;
    });
}

// // Transpile all 4dm files to JavaScript
// Copy all input files to output dir except 4dm files (should copy directory structure)
console.log("Transpiling 4dm files...");
for await (const entry of glob("input/**/*.4dm")){

    let code = fs.readFileSync(entry, 'utf8');
    
    transpile(app,code,entry).then((transpiledCode)=>{

        // Write to js file in output dir
        let newFileName = entry.replace('input','output').replace('.4dm','.js');
        // console.log("Write ", newFileName,transpiledCode);
        fs.appendFileSync( newFileName, transpiledCode, {encoding: "utf8"});

    });

}