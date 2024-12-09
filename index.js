// Import Node.js modules
import fs from 'fs';
import {lstatSync} from 'fs';
import { glob } from 'node:fs/promises'; console.log('Requires node 22.0.0 or higher');

// Import our custom modules
import fourDCommands from './$Dcommands.js';
import transpile from './transpile.js';

// $D to Node.js Transpiler
let app = {
    databaseMethodsFolderPath: '',
    projectRoot: '',
    DATABASEMETHODFOLDERPATH: "/Sources/DatabaseMethods/"
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
        console.log(entry + 'was copied');
    });
}

// Copy all input files to output dir except 4dm files
console.log("Copying input/**/*...");
for await (const entry of glob("input/**/*")){

    console.log("Copying " + entry);
    const stat = lstatSync(entry);

    let newEntry = entry.replace('input/','output/');

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

        fs.copyFile(entry, newEntry, (err) => {
            if (err) throw err;
            console.log('Copied ' + entry);
        });

    }
}

// Copy template files to output dir (package.json, nodules_modules, etc.)
console.log('Copying $Dcommands...');
fs.mkdirSync(app.projectRoot+"/$Dcommands");
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
    let transpiledCode = transpile(app,code,entry);
    // Write to js file in output dir
    let newFileName = entry.replace('input','output').replace('.4dm','.js');
    // console.log("Write ", newFileName,transpiledCode);
    fs.appendFileSync( newFileName, transpiledCode, {encoding: "utf8"});

}