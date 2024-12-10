import fs from 'fs';

// Generate all the empty $D command files
// let commandNames = fs.readFileSync('commandnames.txt', 'utf8').split('\r\n');
// commandNames.forEach((item) => {
    // console.log("this will overwrite all files in the $Dcommands folder");
    // return;
    // fs.writeFileSync('./$Dcommands/' + item + ".js", '// $D command: ' + item + '\n');
// });


// Read the file with all the $D commands and their source numbers
console.log("Read the file with all the $D commands and their source numbers");
let txt = 'export default [';
let commandNames = fs.readFileSync('$DcommandsWithNumbers.txt', 'utf8').split('\r\n');

commandNames.forEach((item) => {
    txt += '"'+ item + '",\n'
});
txt += "]";
fs.writeFileSync("./getConstantsNamesAndValues.4dm", "export default [" + txt);