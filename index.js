// Import Node.js modules
import fs from 'fs';
import { glob } from 'node:fs/promises'; console.log('Requires node 22.0.0 or higher');
import path from 'path';

import fse from 'fs-extra';

// Import our custom modules
import transpile from './transpile.js';
import reservedWordsInJs from './reservedWordsInJs.js';

let app = {
    projectRoot: "output" + path.sep + "Project",
};

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
   // Replace in all method-name & /$Dcommands/ & /$Dcommands/ filenames
   // FIXME
});

// Copy template files to output dir (package.json, nodules_modules, etc.)
console.log('Copying $Dcommands...');
fse.copySync("$Dcommands", app.projectRoot + path.sep + "$Dcommands", { overwrite: true });

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