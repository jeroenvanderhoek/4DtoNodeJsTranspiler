import fs from 'fs';

// Generate all the empty 4D command files
// let commandNames = fs.readFileSync('commandnames.txt', 'utf8').split('\r\n');
// commandNames.forEach((item) => {
    // console.log("this will overwrite all files in the 4Dcommands folder");
    // return;
    // fs.writeFileSync('./4Dcommands/' + item + ".js", '// 4D command: ' + item + '\n');
// });


// Read the file with all the 4D commands and their source numbers
console.log("Read the file with all the 4D commands and their source numbers");
let txt = 'export default [';
let commandNames = fs.readFileSync('4DcommandsWithNumbers.txt', 'utf8').split('\r\n');

commandNames.forEach((item) => {
    txt += '"'+ item + '",\n'
});
txt += "]";
fs.writeFileSync("./getConstantsNamesAndValues.4dm", "export default [" + txt);