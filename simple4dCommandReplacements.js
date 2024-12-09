// Contains an 2D array with easy replacements.
// $Dcommands which can be replaced with a simple string can also be added here.

export default [
    "True:C214","true",
    "False:C215","false",
    "Abs:C99","Math.abs",
    "Arctan:C20","Math.atan",
    "Tan:C19","Math.tan",
    ":=","=",
    "Is Windows:C1573","(process.platform === 'win32')",
    "Is macOS:C1572","(process.platform === 'darwin')",
    "TRACE:C157","debugger",
]