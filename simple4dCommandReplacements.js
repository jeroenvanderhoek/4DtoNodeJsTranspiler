// Contains an 2D array with easy replacements.
// 4Dcommands which can be replaced with a simple string can also be added here.

export default {
    "True:C214":"true",
    "False:C215":"false", // not so simple
    "Abs:C99":"Math.abs",
    "Arctan:C20":"Math.atan",
    "Sin:C17":"Math.sin",
    "Tan:C19":"Math.tan",
    "Cos:C18":"Math.cos",
    ":=":"=",
    "Is Windows:C1573":"(process.platform === 'win32')",
    "Is macOS:C1572":"(process.platform === 'darwin')",
    "TRACE:C157":"debugger",
    "New collection:C1472":"[]",
    "New shared collection:C1527":"[]",
    "Null:C1517": "null"
}

// Replace OK with processState.OK