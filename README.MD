# Introduction  
Basic example of how a $D to NodeJS transpiler could work. 

It's hard to oversee all the use cases, and if it will perform well. 
It could work for $D projects which dont use $D clients ($D clients probably would need to 
be replaced with webapps which is very complex and different).

The basic included $D project is succesfully transpiled to NodeJS. It contains basic math 
and "hello world"-functionality, ALERT, project method call and WEB START SERVER. 
For other functionality a lot of work needs to be done on
$Dcommands, such as a running a webserver and integrating an SQL database.

Basic operation:
- get $D project from /input/-folder
- transpile methods (*.$dm files) 
    - convert variable declarations to JS
    - replace constants with constants.js
    - read all *.$dm files and replace some basic things with using simpleReplacements.js
    - import more complex $Dcommands from their javascript-modules in /$Dcommands/
    - the entrypoint is: ./Project/Sources/DatabaseMethods/onServerStartup.js
    - import Project Methods when used
    - wrap all methods, so they can be exported
- result in /outpot/-folder

This transpiler uses Node.JS instead of $D, because you can:
- use a JavaScript IDE (for instance Visual Code which also has $D syntax support)
- contribute if you dont have a $D developer license and dont know $D language
- use a lot of shared packages, see: https://www.npmjs.com/
- JavaScript has better support from Gemini / Copilot

# Getting Started 
Usage:
- run: npm install
- run: cd output_template | npm install 
- put your $D project in the /input/-folder (there is allready an example project in there)
- To transpile start: npm start 
    - this will start the transpiled project when ready
- result goes to /output/
- To run the result: npm test
(or run "npm run starttest" to transpile and test the transpiled code)

Prerequisites
- this will only work for $D projects that use serverside code. So this is usefull for webserver back ends, that dont use $D clients.
- install Node v22 https://nodejs.org/en/download/package-manager
- $D project must be as "Project Mode"
- tested with 4D 20v6
- $D 20v7 BETA commands imported + 20.6 constants

# Contribute 
Feel free to contribute / fork! 
Contact @ jeroenvanderhoek97@gmail.com

TODO 
- How to make ARRAYS work? Make a new type of Array class that replaces 4D arrays, because 4D arrays have the last selected element active
    + replace brackets in $atArray{$vlElem}:=$vlElem
    - test 4D arrays start at i , in Javascript at i-1
    - fix 2D arrays
        - brackets: atArray{8}{5}
    - maybe create new JS class
- Pass processState to each function ( Or how else to pass res from On web connetion to WEB SEND TEXT, and how will this work for multiple webrequests?)
- Start new processes and Get current process name etc? Process ID? process.ppid / worker.id 
    - cluster.fork() 
    - or const childProcess = require('child_process').spawn('node', ['child_script.js', 'arg1', 'arg2']);
- implement SQL. SQL 92 like $D? Or MySQL / PostgreSQL? How to store active table & selection.
- implement ORDA, php, database, pointers, [table]field 
- create an example with database
- fix a few more /$Dcommand/-modules, or generate starting points with AI 
- how to work in javascript: async / synchronous / callbacks
- rename reserverd words, see reservedWordsInJs.js
- How does this perform with 10.000 $D methods imported in each process?
- improve constants.js
- import /resources/constants.xlf if present
- replace cases like
    Case of
        :(vResult=1) ` Test if the number is 1
        ALERT("One.") ` If it is 1, display an alert
        :(vResult=2) ` Test if the number is 2
        ALERT("Two.") ` If it is 2, display an alert
        :(vResult=3) ` Test if the number is 3
        ALERT("Three.") ` If it is 3, display an alert
        Else ` If it is not 1, 2, or 3, display an alert
        ALERT("It was not one, two, or three.")
    End case
    
    Repeat...Until 
    While...End while


General idea of transpiling:
1. Lexical Analysis
Tokenization: Break down the $D source code into tokens. Tokens are the smallest units of meaning, such as 
keywords, operators, identifiers, and literals.
2. Parsing
Abstract Syntax Tree (AST): Convert the tokens into an AST, which represents the hierarchical structure of 
the source code. This step involves defining the grammar of $D and using a parser generator to create the AST.
3. Transformation
AST Transformation: Traverse and transform the AST from $D syntax to Node.js syntax. This involves mapping 
$D constructs to their equivalent in Node.js.
4. Code Generation
Generate Node.js Code: Convert the transformed AST into Node.js code. This step involves walking through 
the AST and generating the corresponding Node.js code.

This project is for educational purposes only. No warranties, expressed or implied, are provided. Use at your own risk.

$D commands 
| $DCommand                                    | Workable| Skip ($D client etc)|  Accepted  |
| -------------------------------------------- | ------- | ------------------- | ---------- |
| ABORT                                        |         |                     |            |
| ABORT PROCESS BY ID                          |         |                     |            |
| Abs                                          |    X    |                     |     X      |
| ACCEPT                                       |         |          X          |            |
| ACCUMULATE                                   |         |                     |            |
| Action info                                  |         |                     |            |
| Activated                                    |         |          X          |            |
| Active transaction                           |         |                     |            |
| ACTIVITY SNAPSHOT                            |         |                     |            |
| ADD RECORD                                   |         |                     |            |
| Add to date                                  |    X    |                     |            |
| ADD TO SET                                   |         |                     |            |
| ADJUST BLOBS CACHE PRIORITY                  |         |                     |            |
| ADJUST INDEX CACHE PRIORITY                  |         |                     |            |
| ADJUST TABLE CACHE PRIORITY                  |         |                     |            |
| After                                        |         |                     |            |
| ALERT                                        |         |          X          |            |
| ALL RECORDS                                  |         |                     |            |
| APPEND DATA TO PASTEBOARD                    |         |          X          |            |
| Append document                              |         |                     |            |
| APPEND MENU ITEM                             |         |                     |            |
| APPEND TO ARRAY                              |    X    |                     |     X      |
| APPEND TO LIST                               |         |                     |            |
| Application file                             |         |                     |            |
| Application info                             |         |                     |            |
| Application type                             |         |                     |            |
| Application version                          |         |                     |            |
| APPLY TO SELECTION                           |         |                     |            |
| Arctan                                       |    X    |                     |     X      |
| ARRAY BLOB                                   |    X    |                     |            |
| ARRAY BOOLEAN                                |    X    |                     |            |
| ARRAY DATE                                   |    X    |                     |            |
| ARRAY INTEGER                                |    X    |                     |            |
| ARRAY LONGINT                                |    X    |                     |            |
| ARRAY OBJECT                                 |    X    |                     |            |
| ARRAY PICTURE                                |    X    |                     |            |
| ARRAY POINTER                                |    X    |                     |            |
| ARRAY REAL                                   |    X    |                     |            |
| ARRAY TEXT                                   |    X    |                     |            |
| ARRAY TIME                                   |    X    |                     |            |
| ARRAY TO COLLECTION                          |         |                     |            |
| ARRAY TO LIST                                |         |                     |            |
| ARRAY TO SELECTION                           |         |                     |            |
| ASSERT                                       |         |                     |            |
| Asserted                                     |         |                     |            |
| Average                                      |         |                     |            |
| BACKUP                                       |         |                     |            |
| BACKUP INFO                                  |         |                     |            |
| BASE64 DECODE                                |         |                     |            |
| BASE64 ENCODE                                |         |                     |            |
| BEEP                                         |         |          X          |            |
| Before                                       |         |                     |            |
| Before selection                             |         |                     |            |
| Begin SQL                                    |         |                     |            |
| End SQL                                      |         |                     |            |
| BLOB PROPERTIES                              |         |                     |            |
| BLOB size                                    |         |                     |            |
| BLOB TO DOCUMENT                             |         |                     |            |
| BLOB to integer                              |         |                     |            |
| BLOB to list                                 |         |          X          |            |
| BLOB to longint                              |         |                     |            |
| BLOB TO PICTURE                              |         |                     |            |
| BLOB to print settings                       |         |                     |            |
| BLOB to real                                 |         |                     |            |
| BLOB to text                                 |         |                     |            |
| BLOB TO USERS                                |         |                     |            |
| BLOB TO VARIABLE                             |         |                     |            |
| Bool                                         |         |                     |            |
| BOOLEAN ARRAY FROM SET                       |         |                     |            |
| BREAK LEVEL                                  |         |                     |            |
| BRING TO FRONT                               |         |                     |            |
| BUILD APPLICATION                            |         |                     |            |
| Cache info                                   |         |                     |            |
| Call chain                                   |         |                     |            |
| CALL FORM                                    |         |          X          |            |
| CALL SUBFORM CONTAINER                       |         |          X          |            |
| CALL WORKER                                  |         |                     |            |
| CANCEL                                       |         |          X          |            |
| CANCEL TRANSACTION                           |         |                     |            |
| Caps lock down                               |         |                     |            |
| CHANGE CURRENT USER                          |         |                     |            |
| CHANGE LICENSES                              |         |                     |            |
| CHANGE PASSWORD                              |         |                     |            |
| Change string                                |         |                     |            |
| Char                                         |         |                     |            |
| Character code                               |         |                     |            |
| CHECK LOG FILE                               |         |                     |            |
| Choose                                       |         |                     |            |
| CLEAR LIST                                   |         |          X          |            |
| CLEAR NAMED SELECTION                        |         |                     |            |
| CLEAR PASTEBOARD                             |         |          X          |            |
| CLEAR SEMAPHORE                              |         |                     |            |
| CLEAR SET                                    |         |                     |            |
| CLEAR VARIABLE                               |         |                     |            |
| Clickcount                                   |         |                     |            |
| CLOSE DOCUMENT                               |         |                     |            |
| CLOSE PRINTING JOB                           |         |                     |            |
| CLOSE RESOURCE FILE                          |         |                     |            |
| CLOSE WINDOW                                 |         |          X          |            |
| COLLECTION TO ARRAY                          |         |                     |            |
| COMBINE PICTURES                             |         |                     |            |
| Command name                                 |         |                     |            |
| Compact data file                            |         |                     |            |
| Compare strings                              |         |                     |            |
| Compile project                              |         |          X          |            |
| COMPONENT LIST                               |         |                     |            |
| COMPRESS BLOB                                |         |                     |            |
| CONFIRM                                      |         |          X          |            |
| Contextual click                             |         |                     |            |
| CONVERT COORDINATES                          |         |                     |            |
| CONVERT FROM TEXT                            |         |                     |            |
| Convert path POSIX to system                 |         |                     |            |
| Convert path system to POSIX                 |         |                     |            |
| CONVERT PICTURE                              |         |                     |            |
| Convert to text                              |         |                     |            |
| COPY ARRAY                                   |         |                     |            |
| COPY BLOB                                    |         |                     |            |
| COPY DOCUMENT                                |         |                     |            |
| Copy list                                    |         |          X          |            |
| COPY NAMED SELECTION                         |         |                     |            |
| Copy parameters                              |         |                     |            |
| COPY SET                                     |         |                     |            |
| Cos                                          |    X    |                     |            |
| Count in array                               |         |                     |            |
| Count list items                             |         |          X          |            |
| Count menu items                             |         |          X          |            |
| Count menus                                  |         |          X          |            |
| Count parameters                             |         |                     |            |
| Count screens                                |         |          X          |            |
| Count tasks                                  |         |                     |            |
| Count user processes                         |         |                     |            |
| Count users                                  |         |                     |            |
| CREATE ALIAS                                 |         |                     |            |
| CREATE DATA FILE                             |         |                     |            |
| Create deployment license                    |         |                     |            |
| Create document                              |         |                     |            |
| CREATE EMPTY SET                             |         |                     |            |
| Create entity selection                      |         |                     |            |
| CREATE FOLDER                                |         |                     |            |
| CREATE INDEX                                 |         |                     |            |
| Create menu                                  |         |          X          |            |
| CREATE RECORD                                |         |                     |            |
| CREATE RELATED ONE                           |         |                     |            |
| CREATE SELECTION FROM ARRAY                  |         |                     |            |
| CREATE SET                                   |         |                     |            |
| CREATE SET FROM ARRAY                        |         |                     |            |
| CREATE THUMBNAIL                             |         |                     |            |
| cs                                           |         |                     |            |
| Current client authentication                |         |                     |            |
| Current date                                 |         |                     |            |
| Current default table                        |         |                     |            |
| Current form name                            |         |          X          |            |
| Current form table                           |         |          X          |            |
| Current form window                          |         |          X          |            |
| Current machine                              |         |                     |            |
| Current method name                          |         |                     |            |
| Current method path                          |         |                     |            |
| Current process                              |         |                     |            |
| Current process name                         |         |                     |            |
| Current system user                          |         |                     |            |
| Current time                                 |         |                     |            |
| Current user                                 |         |                     |            |
| CUT NAMED SELECTION                          |         |                     |            |
| Data file                                    |         |                     |            |
| Data file encryption status                  |         |                     |            |
| Database measures                            |         |                     |            |
| Date                                         |         |                     |            |
| Day number                                   |         |                     |            |
| Day of                                       |         |                     |            |
| Deactivated                                  |         |                     |            |
| Dec                                          |         |                     |            |
| DECRYPT BLOB                                 |         |                     |            |
| Decrypt data BLOB                            |         |                     |            |
| DEFAULT TABLE                                |         |                     |            |
| DELAY PROCESS                                |         |                     |            |
| DELETE DOCUMENT                              |         |                     |            |
| DELETE FOLDER                                |         |                     |            |
| DELETE FROM ARRAY                            |         |                     |            |
| DELETE FROM BLOB                             |         |                     |            |
| DELETE FROM LIST                             |         |                     |            |
| DELETE INDEX                                 |         |                     |            |
| DELETE MENU ITEM                             |         |          X          |            |
| DELETE RECORD                                |         |                     |            |
| DELETE SELECTION                             |         |                     |            |
| Delete string                                |         |                     |            |
| DELETE USER                                  |         |                     |            |
| DESCRIBE QUERY EXECUTION                     |         |                     |            |
| DIALOG                                       |         |                     |            |
| DIFFERENCE                                   |         |                     |            |
| DISABLE MENU ITEM                            |         |          X          |            |
| Discover data key                            |         |                     |            |
| DISPLAY NOTIFICATION                         |         |          X          |            |
| DISPLAY RECORD                               |         |          X          |            |
| DISPLAY SELECTION                            |         |          X          |            |
| Displayed line number                        |         |                     |            |
| DISTINCT ATTRIBUTE PATHS                     |         |                     |            |
| DISTINCT ATTRIBUTE VALUES                    |         |                     |            |
| DISTINCT VALUES                              |         |                     |            |
| DOCUMENT LIST                                |         |                     |            |
| DOCUMENT TO BLOB                             |         |                     |            |
| Document to text                             |         |                     |            |
| DOM Append XML child node                    |         |                     |            |
| DOM Append XML element                       |         |                     |            |
| DOM CLOSE XML                                |         |                     |            |
| DOM Count XML attributes                     |         |                     |            |
| DOM Count XML elements                       |         |                     |            |
| DOM Create XML element                       |         |                     |            |
| DOM Create XML element arrays                |         |                     |            |
| DOM Create XML Ref                           |         |                     |            |
| DOM EXPORT TO FILE                           |         |                     |            |
| DOM EXPORT TO VAR                            |         |                     |            |
| DOM Find XML element                         |         |                     |            |
| DOM Find XML element by ID                   |         |                     |            |
| DOM Get first child XML element              |         |                     |            |
| DOM Get last child XML element               |         |                     |            |
| DOM Get next sibling XML element             |         |                     |            |
| DOM Get parent XML element                   |         |                     |            |
| DOM Get previous sibling XML element         |         |                     |            |
| DOM Get root XML element                     |         |                     |            |
| DOM GET XML ATTRIBUTE BY INDEX               |         |                     |            |
| DOM GET XML ATTRIBUTE BY NAME                |         |                     |            |
| DOM GET XML CHILD NODES                      |         |                     |            |
| DOM Get XML document ref                     |         |                     |            |
| DOM Get XML element                          |         |                     |            |
| DOM GET XML ELEMENT NAME                     |         |                     |            |
| DOM GET XML ELEMENT VALUE                    |         |                     |            |
| DOM Get XML information                      |         |                     |            |
| DOM Insert XML element                       |         |                     |            |
| DOM Parse XML source                         |         |                     |            |
| DOM Parse XML variable                       |         |                     |            |
| DOM REMOVE XML ATTRIBUTE                     |         |                     |            |
| DOM REMOVE XML ELEMENT                       |         |                     |            |
| DOM SET XML ATTRIBUTE                        |         |                     |            |
| DOM SET XML DECLARATION                      |         |                     |            |
| DOM SET XML ELEMENT NAME                     |         |                     |            |
| DOM SET XML ELEMENT VALUE                    |         |                     |            |
| DRAG WINDOW                                  |         |          X          |            |
| Drop position                                |         |          X          |            |
| DROP REMOTE USER                             |         |                     |            |
| ds                                           |         |                     |            |
| DUPLICATE RECORD                             |         |                     |            |
| Dynamic pop up menu                          |         |                     |            |
| EDIT ACCESS                                  |         |                     |            |
| EDIT FORMULA                                 |         |                     |            |
| EDIT ITEM                                    |         |                     |            |
| ENABLE MENU ITEM                             |         |          X          |            |
| ENCRYPT BLOB                                 |         |                     |            |
| Encrypt data BLOB                            |         |                     |            |
| Encrypt data file                            |         |                     |            |
| End selection                                |         |                     |            |
| End SQL                                      |         |                     |            |
| Equal pictures                               |         |                     |            |
| ERASE WINDOW                                 |         |          X          |            |
| Euro converter                               |         |                     |            |
| EXECUTE FORMULA                              |         |                     |            |
| EXECUTE METHOD                               |         |                     |            |
| EXECUTE METHOD IN SUBFORM                    |         |                     |            |
| EXECUTE ON CLIENT                            |         |                     |            |
| Execute on server                            |         |                     |            |
| Exp                                          |         |                     |            |
| EXPAND BLOB                                  |         |                     |            |
| EXPORT DATA                                  |         |                     |            |
| EXPORT DIF                                   |         |                     |            |
| EXPORT STRUCTURE                             |         |                     |            |
| Export structure file                        |         |                     |            |
| EXPORT SYLK                                  |         |                     |            |
| EXPORT TEXT                                  |         |                     |            |
| False                                        |    X    |                     |     X      |
| Field                                        |         |                     |            |
| Field name                                   |         |                     |            |
| File                                         |         |                     |            |
| FILTER EVENT                                 |         |          ?          |            |
| FILTER KEYSTROKE                             |         |          X          |            |
| Find in array                                |         |                     |            |
| Find in field                                |         |          ?          |            |
| Find in list                                 |         |          X          |            |
| Find in sorted array                         |         |                     |            |
| Find window                                  |         |          X          |            |
| FIRST RECORD                                 |         |                     |            |
| FLUSH CACHE                                  |         |                     |            |
| Focus object                                 |         |          X          |            |
| Folder                                       |         |                     |            |
| FOLDER LIST                                  |         |                     |            |
| Font file                                    |         |                     |            |
| FONT LIST                                    |         |                     |            |
| FONT STYLE LIST                              |         |                     |            |
| Form                                         |         |          X          |            |
| FORM Convert to dynamic                      |         |          X          |            |
| FORM EDIT                                    |         |          X          |            |
| FORM Event                                   |         |          X          |            |
| Form event code                              |         |          X          |            |
| FORM FIRST PAGE                              |         |          X          |            |
| FORM Get color scheme                        |         |          X          |            |
| FORM Get current page                        |         |          X          |            |
| FORM GET ENTRY ORDER                         |         |          X          |            |
| FORM GET HORIZONTAL RESIZING                 |         |          X          |            |
| FORM GET NAMES                               |         |          X          |            |
| FORM GET OBJECTS                             |         |          X          |            |
| FORM GET PROPERTIES                          |         |          X          |            |
| FORM GET VERTICAL RESIZING                   |         |          X          |            |
| FORM GOTO PAGE                               |         |          X          |            |
| FORM LAST PAGE                               |         |          X          |            |
| FORM LOAD                                    |         |          X          |            |
| FORM NEXT PAGE                               |         |          X          |            |
| FORM PREVIOUS PAGE                           |         |          X          |            |
| FORM SCREENSHOT                              |         |          X          |            |
| FORM SET ENTRY ORDER                         |         |          X          |            |
| FORM SET HORIZONTAL RESIZING                 |         |          X          |            |
| FORM SET INPUT                               |         |          X          |            |
| FORM SET OUTPUT                              |         |          X          |            |
| FORM SET SIZE                                |         |          X          |            |
| FORM SET VERTICAL RESIZING                   |         |          X          |            |
| FORM UNLOAD                                  |         |          X          |            |
| Formula                                      |         |                     |            |
| Formula from string                          |         |                     |            |
| Frontmost process                            |         |          X          |            |
| Frontmost window                             |         |          X          |            |
| GENERATE CERTIFICATE REQUEST                 |         |                     |            |
| Generate digest                              |         |                     |            |
| GENERATE ENCRYPTION KEYPAIR                  |         |                     |            |
| Generate password hash                       |         |                     |            |
| Generate UUID                                |         |                     |            |
| Get $D file                                  |         |                     |            |
| Get $D folder                                |         |                     |            |
| Get adjusted blobs cache priority            |         |                     |            |
| Get adjusted index cache priority            |         |                     |            |
| Get adjusted table cache priority            |         |                     |            |
| GET ALLOWED METHODS                          |         |                     |            |
| Get Application color scheme                 |         |                     |            |
| Get assert enabled                           |         |                     |            |
| GET AUTOMATIC RELATIONS                      |         |                     |            |
| Get cache size                               |         |                     |            |
| Get current printer                          |         |                     |            |
| Get database localization                    |         |                     |            |
| Get database parameter                       |         |                     |            |
| Get default user                             |         |                     |            |
| GET DOCUMENT ICON                            |         |                     |            |
| Get document position                        |         |          X          |            |
| GET DOCUMENT PROPERTIES                      |         |                     |            |
| Get document size                            |         |                     |            |
| Get edited text                              |         |                     |            |
| Get external data path                       |         |                     |            |
| GET FIELD ENTRY PROPERTIES                   |         |                     |            |
| GET FIELD PROPERTIES                         |         |                     |            |
| GET FIELD RELATION                           |         |                     |            |
| GET FIELD TITLES                             |         |                     |            |
| Get file from pasteboard                     |         |                     |            |
| Get group access                             |         |                     |            |
| GET GROUP LIST                               |         |          X          |            |
| GET GROUP PROPERTIES                         |         |          X          |            |
| GET HIGHLIGHT                                |         |          X          |            |
| GET HIGHLIGHTED RECORDS                      |         |          X          |            |
| Get indexed string                           |         |                     |            |
| Get last update log path                     |         |                     |            |
| GET LIST ITEM                                |         |          X          |            |
| Get list item font                           |         |          X          |            |
| GET LIST ITEM ICON                           |         |          X          |            |
| GET LIST ITEM PARAMETER                      |         |          X          |            |
| GET LIST ITEM PARAMETER ARRAYS               |         |          X          |            |
| GET LIST ITEM PROPERTIES                     |         |          X          |            |
| GET LIST PROPERTIES                          |         |          X          |            |
| GET MACRO PARAMETER                          |         |                     |            |
| Get menu bar reference                       |         |          X          |            |
| Get menu item                                |         |          X          |            |
| GET MENU ITEM ICON                           |         |          X          |            |
| Get menu item key                            |         |          X          |            |
| Get menu item mark                           |         |          X          |            |
| Get menu item method                         |         |          X          |            |
| Get menu item modifiers                      |         |          X          |            |
| Get menu item parameter                      |         |          X          |            |
| GET MENU ITEM PROPERTY                       |         |          X          |            |
| Get menu item style                          |         |          X          |            |
| GET MENU ITEMS                               |         |          X          |            |
| Get menu title                               |         |          X          |            |
| GET MISSING TABLE NAMES                      |         |                     |            |
| GET PASTEBOARD DATA                          |         |          X          |            |
| GET PASTEBOARD DATA TYPE                     |         |          X          |            |
| Get picture file name                        |         |                     |            |
| GET PICTURE FORMATS                          |         |                     |            |
| GET PICTURE FROM LIBRARY                     |         |                     |            |
| GET PICTURE FROM PASTEBOARD                  |         |                     |            |
| GET PICTURE KEYWORDS                         |         |                     |            |
| GET PICTURE METADATA                         |         |                     |            |
| GET PICTURE RESOURCE                         |         |                     |            |
| Get plugin access                            |         |                     |            |
| Get pointer                                  |         |                     |            |
| Get print marker                             |         |                     |            |
| GET PRINT OPTION                             |         |                     |            |
| Get print preview                            |         |                     |            |
| GET PRINTABLE AREA                           |         |                     |            |
| GET PRINTABLE MARGIN                         |         |                     |            |
| Get printed height                           |         |                     |            |
| GET PROCESS VARIABLE                         |         |                     |            |
| GET QUERY DESTINATION                        |         |                     |            |
| Get query limit                              |         |                     |            |
| GET REGISTERED CLIENTS                       |         |                     |            |
| GET RELATION PROPERTIES                      |         |                     |            |
| GET RESOURCE                                 |         |                     |            |
| Get resource name                            |         |                     |            |
| Get resource properties                      |         |                     |            |
| Get selected menu item parameter             |         |          X          |            |
| GET SERIAL PORT MAPPING                      |         |                     |            |
| Get string resource                          |         |                     |            |
| GET STYLE SHEET INFO                         |         |                     |            |
| Get subrecord key                            |         |                     |            |
| GET SYSTEM FORMAT                            |         |                     |            |
| GET TABLE PROPERTIES                         |         |                     |            |
| GET TABLE TITLES                             |         |                     |            |
| Get text from pasteboard                     |         |          X          |            |
| GET TEXT KEYWORDS                            |         |                     |            |
| Get text resource                            |         |                     |            |
| GET USER LIST                                |         |                     |            |
| GET USER PROPERTIES                          |         |                     |            |
| GET WINDOW RECT                              |         |          X          |            |
| Get window title                             |         |          X          |            |
| GOTO OBJECT                                  |         |                     |            |
| GOTO RECORD                                  |         |                     |            |
| GOTO SELECTED RECORD                         |         |                     |            |
| GOTO XY                                      |         |          X          |            |
| GRAPH                                        |         |          X          |            |
| GRAPH SETTINGS                               |         |          X          |            |
| HIDE MENU BAR                                |         |          X          |            |
| HIDE PROCESS                                 |         |          X          |            |
| HIDE TOOL BAR                                |         |          X          |            |
| HIDE WINDOW                                  |         |          X          |            |
| HIGHLIGHT RECORDS                            |         |                     |            |
| HIGHLIGHT TEXT                               |         |                     |            |
| HTTP AUTHENTICATE                            |         |                     |            |
| HTTP Get                                     |         |                     |            |
| HTTP Get certificates folder                 |         |                     |            |
| HTTP GET OPTION                              |         |                     |            |
| HTTP Parse message                           |         |                     |            |
| HTTP Request                                 |         |                     |            |
| HTTP SET CERTIFICATES FOLDER                 |         |                     |            |
| HTTP SET OPTION                              |         |                     |            |
| IDLE                                         |         |                     |            |
| IMAP New transporter                         |         |                     |            |
| IMPORT DATA                                  |         |                     |            |
| IMPORT DIF                                   |         |                     |            |
| IMPORT STRUCTURE                             |         |                     |            |
| IMPORT SYLK                                  |         |                     |            |
| IMPORT TEXT                                  |         |                     |            |
| In break                                     |         |                     |            |
| In footer                                    |         |                     |            |
| In header                                    |         |                     |            |
| In transaction                               |         |                     |            |
| INSERT IN ARRAY                              |         |                     |            |
| INSERT IN BLOB                               |         |                     |            |
| INSERT IN LIST                               |         |          X          |            |
| INSERT MENU ITEM                             |         |                     |            |
| Insert string                                |         |                     |            |
| Int                                          |         |                     |            |
| INTEGER TO BLOB                              |         |                     |            |
| INTEGRATE MIRROR LOG FILE                    |         |                     |            |
| INTERSECTION                                 |         |                     |            |
| INVOKE ACTION                                |         |                     |            |
| Is a list                                    |         |                     |            |
| Is a variable                                |         |                     |            |
| Is compiled mode                             |         |                     |            |
| Is data file locked                          |         |                     |            |
| Is editing text                              |         |                     |            |
| Is field number valid                        |         |                     |            |
| Is field value Null                          |         |                     |            |
| Is in print preview                          |         |                     |            |
| Is in set                                    |         |                     |            |
| Is license available                         |         |                     |            |
| Is macOS                                     |    X    |                     |     X      |
| Is new record                                |         |                     |            |
| Is nil pointer                               |         |                     |            |
| Is picture file                              |         |                     |            |
| Is record loaded                             |         |                     |            |
| Is table number valid                        |         |                     |            |
| Is user deleted                              |         |                     |            |
| Is waiting mouse up                          |         |          X          |            |
| Is window maximized                          |         |          X          |            |
| Is window reduced                            |         |          X          |            |
| Is Windows                                   |    X    |                     |     X      |
| JSON Parse                                   |         |                     |            |
| JSON PARSE ARRAY                             |         |                     |            |
| JSON Resolve pointers                        |         |                     |            |
| JSON Stringify                               |         |                     |            |
| JSON Stringify array                         |         |                     |            |
| JSON TO SELECTION                            |         |                     |            |
| JSON Validate                                |         |                     |            |
| Keystroke                                    |         |                     |            |
| KILL WORKER                                  |         |                     |            |
| Last errors                                  |         |                     |            |
| Last field number                            |         |                     |            |
| Last query path                              |         |                     |            |
| Last query plan                              |         |                     |            |
| LAST RECORD                                  |         |                     |            |
| Last table number                            |         |                     |            |
| LAUNCH EXTERNAL PROCESS                      |         |                     |            |
| LDAP LOGIN                                   |         |                     |            |
| LDAP LOGOUT                                  |         |                     |            |
| LDAP Search                                  |         |                     |            |
| LDAP SEARCH ALL                              |         |                     |            |
| Length                                       |         |                     |            |
| Level                                        |         |                     |            |
| License info                                 |         |                     |            |
| License usage                                |         |                     |            |
| List item parent                             |         |                     |            |
| List item position                           |         |                     |            |
| LIST OF CHOICE LISTS                         |         |                     |            |
| LIST OF STYLE SHEETS                         |         |                     |            |
| LIST TO ARRAY                                |         |                     |            |
| LIST TO BLOB                                 |         |                     |            |
| LISTBOX COLLAPSE                             |         |          X          |            |
| LISTBOX DELETE COLUMN                        |         |          X          |            |
| LISTBOX DELETE ROWS                          |         |          X          |            |
| LISTBOX DUPLICATE COLUMN                     |         |          X          |            |
| LISTBOX EXPAND                               |         |          X          |            |
| LISTBOX Get array                            |         |          X          |            |
| LISTBOX GET ARRAYS                           |         |          X          |            |
| LISTBOX Get auto row height                  |         |          X          |            |
| LISTBOX GET CELL COORDINATES                 |         |          X          |            |
| LISTBOX GET CELL POSITION                    |         |          X          |            |
| LISTBOX Get column formula                   |         |          X          |            |
| LISTBOX Get column width                     |         |          X          |            |
| LISTBOX Get footer calculation               |         |          X          |            |
| LISTBOX Get footers height                   |         |          X          |            |
| LISTBOX GET GRID                             |         |          X          |            |
| LISTBOX GET GRID COLORS                      |         |          X          |            |
| LISTBOX Get headers height                   |         |          X          |            |
| LISTBOX GET HIERARCHY                        |         |          X          |            |
| LISTBOX Get locked columns                   |         |          X          |            |
| LISTBOX Get number of columns                |         |          X          |            |
| LISTBOX Get number of rows                   |         |          X          |            |
| LISTBOX GET OBJECTS                          |         |          X          |            |
| LISTBOX GET PRINT INFORMATION                |         |          X          |            |
| LISTBOX Get property                         |         |          X          |            |
| LISTBOX Get row color                        |         |          X          |            |
| LISTBOX Get row color as number              |         |          X          |            |
| LISTBOX Get row font style                   |         |          X          |            |
| LISTBOX Get row height                       |         |          X          |            |
| LISTBOX Get rows height                      |         |          X          |            |
| LISTBOX Get static columns                   |         |          X          |            |
| LISTBOX GET TABLE SOURCE                     |         |          X          |            |
| LISTBOX INSERT COLUMN                        |         |          X          |            |
| LISTBOX INSERT COLUMN FORMULA                |         |          X          |            |
| LISTBOX INSERT ROWS                          |         |          X          |            |
| LISTBOX MOVE COLUMN                          |         |          X          |            |
| LISTBOX MOVED COLUMN NUMBER                  |         |          X          |            |
| LISTBOX MOVED ROW NUMBER                     |         |          X          |            |
| LISTBOX SELECT BREAK                         |         |          X          |            |
| LISTBOX SELECT ROW                           |         |          X          |            |
| LISTBOX SELECT ROWS                          |         |          X          |            |
| LISTBOX SET ARRAY                            |         |          X          |            |
| LISTBOX SET AUTO ROW HEIGHT                  |         |          X          |            |
| LISTBOX SET COLUMN FORMULA                   |         |          X          |            |
| LISTBOX SET COLUMN WIDTH                     |         |          X          |            |
| LISTBOX SET FOOTER CALCULATION               |         |          X          |            |
| LISTBOX SET FOOTERS HEIGHT                   |         |          X          |            |
| LISTBOX SET GRID                             |         |          X          |            |
| LISTBOX SET GRID COLOR                       |         |          X          |            |
| LISTBOX SET HEADERS HEIGHT                   |         |          X          |            |
| LISTBOX SET HIERARCHY                        |         |          X          |            |
| LISTBOX SET LOCKED COLUMNS                   |         |          X          |            |
| LISTBOX SET PROPERTY                         |         |          X          |            |
| LISTBOX SET ROW COLOR                        |         |          X          |            |
| LISTBOX SET ROW FONT STYLE                   |         |          X          |            |
| LISTBOX SET ROW HEIGHT                       |         |          X          |            |
| LISTBOX SET ROWS HEIGHT                      |         |          X          |            |
| LISTBOX SET STATIC COLUMNS                   |         |          X          |            |
| LISTBOX SET TABLE SOURCE                     |         |          X          |            |
| LISTBOX SORT COLUMNS                         |         |          X          |            |
| Load $D View document                        |         |                     |            |
| Load list                                    |         |                     |            |
| LOAD RECORD                                  |         |                     |            |
| LOAD SET                                     |         |                     |            |
| LOAD VARIABLES                               |         |                     |            |
| Localized document path                      |         |                     |            |
| Localized string                             |         |                     |            |
| Locked                                       |         |                     |            |
| LOCKED BY                                    |         |                     |            |
| Locked records info                          |         |                     |            |
| Log                                          |         |                     |            |
| LOG EVENT                                    |         |                     |            |
| Log file                                     |         |                     |            |
| LOG FILE TO JSON                             |         |                     |            |
| LONGINT ARRAY FROM SELECTION                 |         |                     |            |
| LONGINT TO BLOB                              |         |                     |            |
| Lowercase                                    |         |                     |            |
| Macintosh command down                       |         |          X          |            |
| Macintosh control down                       |         |          X          |            |
| Macintosh option down                        |         |          X          |            |
| MAIL Convert from MIME                       |         |                     |            |
| MAIL Convert to MIME                         |         |                     |            |
| MAIL New attachment                          |         |                     |            |
| Match regex                                  |         |                     |            |
| Max                                          |         |                     |            |
| MAXIMIZE WINDOW                              |         |          X          |            |
| MEMORY STATISTICS                            |         |                     |            |
| Menu bar height                              |         |          X          |            |
| Menu bar screen                              |         |          X          |            |
| Menu selected                                |         |          X          |            |
| MESSAGE                                      |         |                     |            |
| MESSAGES OFF                                 |         |                     |            |
| MESSAGES ON                                  |         |                     |            |
| Method called on error                       |         |                     |            |
| Method called on event                       |         |                     |            |
| METHOD Get attribute                         |         |                     |            |
| METHOD GET ATTRIBUTES                        |         |                     |            |
| METHOD GET CODE                              |         |                     |            |
| METHOD GET COMMENTS                          |         |                     |            |
| METHOD GET FOLDERS                           |         |                     |            |
| METHOD GET MODIFICATION DATE                 |         |                     |            |
| METHOD GET NAMES                             |         |                     |            |
| METHOD Get path                              |         |                     |            |
| METHOD GET PATHS                             |         |                     |            |
| METHOD GET PATHS FORM                        |         |                     |            |
| METHOD OPEN PATH                             |         |                     |            |
| METHOD RESOLVE PATH                          |         |                     |            |
| METHOD SET ACCESS MODE                       |         |                     |            |
| METHOD SET ATTRIBUTE                         |         |                     |            |
| METHOD SET ATTRIBUTES                        |         |                     |            |
| METHOD SET CODE                              |         |                     |            |
| METHOD SET COMMENTS                          |         |                     |            |
| Milliseconds                                 |         |                     |            |
| Min                                          |         |                     |            |
| MINIMIZE WINDOW                              |         |          X          |            |
| MOBILE APP REFRESH SESSIONS                  |         |                     |            |
| Mod                                          |         |                     |            |
| Modified                                     |         |                     |            |
| Modified record                              |         |                     |            |
| MODIFY RECORD                                |         |                     |            |
| MODIFY SELECTION                             |         |                     |            |
| Monitored activity                           |         |                     |            |
| Month of                                     |         |                     |            |
| MOUSE POSITION                               |         |          X          |            |
| MOVE DOCUMENT                                |         |                     |            |
| MULTI SORT ARRAY                             |         |                     |            |
| New collection                               |         |                     |            |
| New data key                                 |         |                     |            |
| New list                                     |         |          X          |            |
| New log file                                 |         |                     |            |
| New object                                   |         |                     |            |
| New process                                  |         |                     |            |
| New shared collection                        |         |                     |            |
| New shared object                            |         |                     |            |
| New signal                                   |         |                     |            |
| NEXT RECORD                                  |         |                     |            |
| Next window                                  |         |          X          |            |
| NO DEFAULT TABLE                             |         |                     |            |
| Not                                          |         |                     |            |
| NOTIFY RESOURCES FOLDER MODIFICATION         |         |                     |            |
| Null                                         |         |                     |            |
| Num                                          |         |                     |            |
| OB Class                                     |         |                     |            |
| OB Copy                                      |         |                     |            |
| OB Entries                                   |         |                     |            |
| OB Get                                       |         |                     |            |
| OB GET ARRAY                                 |         |                     |            |
| OB GET PROPERTY NAMES                        |         |                     |            |
| OB Get type                                  |         |                     |            |
| OB Instance of                               |         |                     |            |
| OB Is defined                                |         |                     |            |
| OB Is empty                                  |         |                     |            |
| OB Is shared                                 |         |                     |            |
| OB Keys                                      |         |                     |            |
| OB REMOVE                                    |         |                     |            |
| OB SET                                       |         |                     |            |
| OB SET ARRAY                                 |         |                     |            |
| OB SET NULL                                  |         |                     |            |
| OB Values                                    |         |                     |            |
| OBJECT DUPLICATE                             |         |                     |            |
| OBJECT Get action                            |         |                     |            |
| OBJECT Get auto spellcheck                   |         |                     |            |
| OBJECT GET BEST SIZE                         |         |                     |            |
| OBJECT Get border style                      |         |                     |            |
| OBJECT Get context menu                      |         |                     |            |
| OBJECT GET COORDINATES                       |         |                     |            |
| OBJECT Get corner radius                     |         |                     |            |
| OBJECT Get data source                       |         |                     |            |
| OBJECT GET DRAG AND DROP OPTIONS             |         |                     |            |
| OBJECT Get enabled                           |         |                     |            |
| OBJECT Get enterable                         |         |                     |            |
| OBJECT GET EVENTS                            |         |                     |            |
| OBJECT Get filter                            |         |                     |            |
| OBJECT Get focus rectangle invisible         |         |                     |            |
| OBJECT Get font                              |         |                     |            |
| OBJECT Get font size                         |         |                     |            |
| OBJECT Get font style                        |         |                     |            |
| OBJECT Get format                            |         |                     |            |
| OBJECT Get help tip                          |         |                     |            |
| OBJECT Get horizontal alignment              |         |                     |            |
| OBJECT Get indicator type                    |         |                     |            |
| OBJECT Get keyboard layout                   |         |                     |            |
| OBJECT Get list name                         |         |                     |            |
| OBJECT Get list reference                    |         |                     |            |
| OBJECT GET MAXIMUM VALUE                     |         |                     |            |
| OBJECT GET MINIMUM VALUE                     |         |                     |            |
| OBJECT Get multiline                         |         |                     |            |
| OBJECT Get name                              |         |                     |            |
| OBJECT Get placeholder                       |         |                     |            |
| OBJECT Get pointer                           |         |                     |            |
| OBJECT GET PRINT VARIABLE FRAME              |         |                     |            |
| OBJECT GET RESIZING OPTIONS                  |         |                     |            |
| OBJECT GET RGB COLORS                        |         |                     |            |
| OBJECT GET SCROLL POSITION                   |         |                     |            |
| OBJECT GET SCROLLBAR                         |         |                     |            |
| OBJECT GET SHORTCUT                          |         |                     |            |
| OBJECT Get style sheet                       |         |                     |            |
| OBJECT GET SUBFORM                           |         |                     |            |
| OBJECT GET SUBFORM CONTAINER SIZE            |         |                     |            |
| OBJECT Get subform container value           |         |                     |            |
| OBJECT Get text orientation                  |         |                     |            |
| OBJECT Get three states checkbox             |         |                     |            |
| OBJECT Get title                             |         |                     |            |
| OBJECT Get type                              |         |                     |            |
| OBJECT Get value                             |         |                     |            |
| OBJECT Get vertical alignment                |         |                     |            |
| OBJECT Get visible                           |         |                     |            |
| OBJECT Is styled text                        |         |                     |            |
| OBJECT MOVE                                  |         |                     |            |
| OBJECT SET ACTION                            |         |                     |            |
| OBJECT SET AUTO SPELLCHECK                   |         |                     |            |
| OBJECT SET BORDER STYLE                      |         |                     |            |
| OBJECT SET CONTEXT MENU                      |         |                     |            |
| OBJECT SET COORDINATES                       |         |                     |            |
| OBJECT SET CORNER RADIUS                     |         |                     |            |
| OBJECT SET DATA SOURCE                       |         |                     |            |
| OBJECT SET DRAG AND DROP OPTIONS             |         |                     |            |
| OBJECT SET ENABLED                           |         |                     |            |
| OBJECT SET ENTERABLE                         |         |                     |            |
| OBJECT SET EVENTS                            |         |                     |            |
| OBJECT SET FILTER                            |         |                     |            |
| OBJECT SET FOCUS RECTANGLE INVISIBLE         |         |                     |            |
| OBJECT SET FONT                              |         |                     |            |
| OBJECT SET FONT SIZE                         |         |                     |            |
| OBJECT SET FONT STYLE                        |         |                     |            |
| OBJECT SET FORMAT                            |         |                     |            |
| OBJECT SET HELP TIP                          |         |                     |            |
| OBJECT SET HORIZONTAL ALIGNMENT              |         |                     |            |
| OBJECT SET INDICATOR TYPE                    |         |                     |            |
| OBJECT SET KEYBOARD LAYOUT                   |         |                     |            |
| OBJECT SET LIST BY NAME                      |         |                     |            |
| OBJECT SET LIST BY REFERENCE                 |         |                     |            |
| OBJECT SET MAXIMUM VALUE                     |         |                     |            |
| OBJECT SET MINIMUM VALUE                     |         |                     |            |
| OBJECT SET MULTILINE                         |         |                     |            |
| OBJECT SET PLACEHOLDER                       |         |                     |            |
| OBJECT SET PRINT VARIABLE FRAME              |         |                     |            |
| OBJECT SET RESIZING OPTIONS                  |         |                     |            |
| OBJECT SET RGB COLORS                        |         |                     |            |
| OBJECT SET SCROLL POSITION                   |         |                     |            |
| OBJECT SET SCROLLBAR                         |         |                     |            |
| OBJECT SET SHORTCUT                          |         |                     |            |
| OBJECT SET STYLE SHEET                       |         |                     |            |
| OBJECT SET SUBFORM                           |         |                     |            |
| OBJECT SET SUBFORM CONTAINER VALUE           |         |                     |            |
| OBJECT SET TEXT ORIENTATION                  |         |                     |            |
| OBJECT SET THREE STATES CHECKBOX             |         |                     |            |
| OBJECT SET TITLE                             |         |                     |            |
| OBJECT SET VALUE                             |         |                     |            |
| OBJECT SET VERTICAL ALIGNMENT                |         |                     |            |
| OBJECT SET VISIBLE                           |         |                     |            |
| Object to path                               |         |                     |            |
| Old                                          |         |                     |            |
| OLD RELATED MANY                             |         |                     |            |
| OLD RELATED ONE                              |         |                     |            |
| On Backup Shutdown database method           |         |                     |            |
| On Backup Startup database method            |         |                     |            |
| On Drop database method                      |         |                     |            |
| ON ERR CALL                                  |         |                     |            |
| ON EVENT CALL                                |         |                     |            |
| On Exit database method                      |         |                     |            |
| On Host Database Event database method       |         |                     |            |
| On Mobile App Action database method         |         |                     |            |
| On Mobile App Authentication database method |         |                     |            |
| On REST Authentication database method       |         |                     |            |
| On Server Close Connection database method   |         |                     |            |
| On Server Open Connection database method    |         |                     |            |
| On Server Shutdown database method           |         |                     |            |
| On Server Startup database method            |    X    |                     |            |
| On SQL Authentication database method        |         |                     |            |
| On Startup database method                   |         |          X          |            |
| On System Event database method              |         |                     |            |
| On Web Authentication database method        |         |                     |            |
| On Web Connection database method            |    X    |                     |            |
| On Web Legacy Close Session database method  |         |                     |            |
| ONE RECORD SELECT                            |         |                     |            |
| OPEN ADMINISTRATION WINDOW                   |         |          X          |            |
| OPEN COLOR PICKER                            |         |          X          |            |
| OPEN DATA FILE                               |         |                     |            |
| OPEN DATABASE                                |         |                     |            |
| Open datastore                               |         |                     |            |
| Open document                                |         |                     |            |
| OPEN FONT PICKER                             |         |                     |            |
| Open form window                             |         |          X          |            |
| OPEN PRINTING JOB                            |         |                     |            |
| Open resource file                           |         |                     |            |
| OPEN RUNTIME EXPLORER                        |         |          X          |            |
| OPEN SECURITY CENTER                         |         |          X          |            |
| OPEN SETTINGS WINDOW                         |         |          X          |            |
| OPEN URL                                     |    X    |                     |            |
| Open window                                  |         |          X          |            |
| ORDER BY                                     |         |                     |            |
| ORDER BY ATTRIBUTE                           |         |                     |            |
| ORDER BY FORMULA                             |         |                     |            |
| Outside call                                 |         |                     |            |
| PAGE BREAK                                   |         |                     |            |
| Parse formula                                |         |                     |            |
| Pasteboard data size                         |         |          X          |            |
| Path to object                               |         |                     |            |
| PAUSE INDEXES                                |         |                     |            |
| PAUSE PROCESS                                |         |                     |            |
| PHP Execute                                  |         |                     |            |
| PHP GET FULL RESPONSE                        |         |                     |            |
| PHP GET OPTION                               |         |                     |            |
| PHP SET OPTION                               |         |                     |            |
| PICTURE CODEC LIST                           |         |                     |            |
| PICTURE LIBRARY LIST                         |         |                     |            |
| PICTURE PROPERTIES                           |         |                     |            |
| Picture size                                 |         |                     |            |
| PICTURE TO BLOB                              |         |                     |            |
| PLAY                                         |         |                     |            |
| PLUGIN LIST                                  |         |                     |            |
| POP RECORD                                   |         |                     |            |
| Pop up menu                                  |         |                     |            |
| POP3 New transporter                         |         |                     |            |
| Position                                     |         |                     |            |
| POST CLICK                                   |         |                     |            |
| POST EVENT                                   |         |                     |            |
| POST KEY                                     |         |                     |            |
| POST OUTSIDE CALL                            |         |                     |            |
| PREVIOUS RECORD                              |         |                     |            |
| Print form                                   |         |                     |            |
| PRINT LABEL                                  |         |                     |            |
| Print object                                 |         |                     |            |
| PRINT OPTION VALUES                          |         |                     |            |
| PRINT RECORD                                 |         |                     |            |
| PRINT SELECTION                              |         |                     |            |
| PRINT SETTINGS                               |         |                     |            |
| Print settings to BLOB                       |         |                     |            |
| PRINTERS LIST                                |         |                     |            |
| Printing page                                |         |                     |            |
| PROCESS $D TAGS                              |         |                     |            |
| Process aborted                              |         |                     |            |
| Process activity-modified $D 20 R7           |         |                     |            |
| Process info-new $D 20 R7                    |         |                     |            |
| Process number                               |         |                     |            |
| Process state                                |         |                     |            |
| PUSH RECORD                                  |         |                     |            |
| QR BLOB TO REPORT                            |         |          X          |            |
| QR Count columns                             |         |          X          |            |
| QR DELETE COLUMN                             |         |          X          |            |
| QR DELETE OFFSCREEN AREA                     |         |          X          |            |
| QR EXECUTE COMMAND                           |         |          X          |            |
| QR Find column                               |         |          X          |            |
| QR Get area property                         |         |          X          |            |
| QR GET BORDERS                               |         |          X          |            |
| QR Get command status                        |         |          X          |            |
| QR GET DESTINATION                           |         |          X          |            |
| QR Get document property                     |         |          X          |            |
| QR Get drop column                           |         |          X          |            |
| QR GET HEADER AND FOOTER                     |         |          X          |            |
| QR Get HTML template                         |         |          X          |            |
| QR GET INFO COLUMN                           |         |          X          |            |
| QR Get info row                              |         |          X          |            |
| QR Get report kind                           |         |          X          |            |
| QR Get report table                          |         |          X          |            |
| QR GET SELECTION                             |         |          X          |            |
| QR GET SORTS                                 |         |          X          |            |
| QR Get text property                         |         |          X          |            |
| QR GET TOTALS DATA                           |         |          X          |            |
| QR GET TOTALS SPACING                        |         |          X          |            |
| QR INSERT COLUMN                             |         |          X          |            |
| QR MOVE COLUMN                               |         |          X          |            |
| QR NEW AREA                                  |         |          X          |            |
| QR New offscreen area                        |         |          X          |            |
| QR ON COMMAND                                |         |          X          |            |
| QR REPORT                                    |         |          X          |            |
| QR REPORT TO BLOB                            |         |          X          |            |
| QR RUN                                       |         |          X          |            |
| QR SET AREA PROPERTY                         |         |          X          |            |
| QR SET BORDERS                               |         |          X          |            |
| QR SET DESTINATION                           |         |          X          |            |
| QR SET DOCUMENT PROPERTY                     |         |          X          |            |
| QR SET HEADER AND FOOTER                     |         |          X          |            |
| QR SET HTML TEMPLATE                         |         |          X          |            |
| QR SET INFO COLUMN                           |         |          X          |            |
| QR SET INFO ROW                              |         |          X          |            |
| QR SET REPORT KIND                           |         |          X          |            |
| QR SET REPORT TABLE                          |         |          X          |            |
| QR SET SELECTION                             |         |          X          |            |
| QR SET SORTS                                 |         |          X          |            |
| QR SET TEXT PROPERTY                         |         |          X          |            |
| QR SET TOTALS DATA                           |         |          X          |            |
| QR SET TOTALS SPACING                        |         |          X          |            |
| QUERY                                        |         |                     |            |
| QUERY BY ATTRIBUTE                           |         |                     |            |
| QUERY BY EXAMPLE                             |         |                     |            |
| QUERY BY FORMULA                             |         |                     |            |
| QUERY BY SQL                                 |         |                     |            |
| QUERY SELECTION                              |         |                     |            |
| QUERY SELECTION BY ATTRIBUTE                 |         |                     |            |
| QUERY SELECTION BY FORMULA                   |         |                     |            |
| QUERY SELECTION WITH ARRAY                   |         |                     |            |
| QUERY WITH ARRAY                             |         |                     |            |
| QUIT $D                                      |         |                     |            |
| Random                                       |         |                     |            |
| READ ONLY                                    |         |                     |            |
| Read only state                              |         |                     |            |
| READ PICTURE FILE                            |         |                     |            |
| READ WRITE                                   |         |                     |            |
| REAL TO BLOB                                 |         |                     |            |
| RECEIVE BUFFER                               |         |                     |            |
| RECEIVE PACKET                               |         |                     |            |
| RECEIVE RECORD                               |         |                     |            |
| RECEIVE VARIABLE                             |         |                     |            |
| Record number                                |         |                     |            |
| Records in selection                         |         |                     |            |
| Records in set                               |         |                     |            |
| Records in table                             |         |                     |            |
| REDRAW                                       |         |                     |            |
| REDRAW WINDOW                                |         |          X          |            |
| REDUCE RESTORE WINDOW                        |         |          X          |            |
| REDUCE SELECTION                             |         |                     |            |
| Refresh license                              |         |                     |            |
| REGENERATE MISSING TABLE                     |         |                     |            |
| REGISTER CLIENT                              |         |                     |            |
| Register data key                            |         |                     |            |
| REJECT                                       |         |                     |            |
| REJECT NEW REMOTE CONNECTIONS                |         |                     |            |
| RELATE MANY                                  |         |                     |            |
| RELATE MANY SELECTION                        |         |                     |            |
| RELATE ONE                                   |         |                     |            |
| RELATE ONE SELECTION                         |         |                     |            |
| RELEASE MENU                                 |         |                     |            |
| RELOAD EXTERNAL DATA                         |         |                     |            |
| RELOAD PROJECT                               |         |                     |            |
| REMOVE FROM SET                              |         |                     |            |
| REMOVE PICTURE FROM LIBRARY                  |         |                     |            |
| Replace string                               |         |                     |            |
| Request                                      |    X    |                     |            |
| RESIZE FORM WINDOW                           |         |          X          |            |
| RESOLVE ALIAS                                |         |                     |            |
| RESOLVE POINTER                              |         |                     |            |
| RESOURCE LIST                                |         |                     |            |
| RESOURCE TYPE LIST                           |         |                     |            |
| RESTART $D                                   |         |                     |            |
| RESTORE                                      |         |                     |            |
| RESTORE INFO                                 |         |                     |            |
| RESUME INDEXES                               |         |                     |            |
| RESUME PROCESS                               |         |                     |            |
| RESUME TRANSACTION                           |         |                     |            |
| Right click                                  |         |          X          |            |
| Round                                        |         |                     |            |
| SAVE LIST                                    |         |                     |            |
| SAVE RECORD                                  |         |                     |            |
| SAVE RELATED ONE                             |         |                     |            |
| SAVE SET                                     |         |                     |            |
| SAVE VARIABLES                               |         |                     |            |
| SAX ADD PROCESSING INSTRUCTION               |         |                     |            |
| SAX ADD XML CDATA                            |         |                     |            |
| SAX ADD XML COMMENT                          |         |                     |            |
| SAX ADD XML DOCTYPE                          |         |                     |            |
| SAX ADD XML ELEMENT VALUE                    |         |                     |            |
| SAX CLOSE XML ELEMENT                        |         |                     |            |
| SAX GET XML CDATA                            |         |                     |            |
| SAX GET XML COMMENT                          |         |                     |            |
| SAX GET XML DOCUMENT VALUES                  |         |                     |            |
| SAX GET XML ELEMENT                          |         |                     |            |
| SAX GET XML ELEMENT VALUE                    |         |                     |            |
| SAX GET XML ENTITY                           |         |                     |            |
| SAX Get XML node                             |         |                     |            |
| SAX GET XML PROCESSING INSTRUCTION           |         |                     |            |
| SAX OPEN XML ELEMENT                         |         |                     |            |
| SAX OPEN XML ELEMENT ARRAYS                  |         |                     |            |
| SAX SET XML DECLARATION                      |         |                     |            |
| SCAN INDEX                                   |         |                     |            |
| SCREEN COORDINATES                           |         |         X           |            |
| SCREEN DEPTH                                 |         |         X           |            |
| Screen height                                |         |         X           |            |
| Screen width                                 |         |         X           |            |
| Select document                              |         |                     |            |
| Select folder                                |         |                     |            |
| SELECT LIST ITEMS BY POSITION                |         |                     |            |
| SELECT LIST ITEMS BY REFERENCE               |         |                     |            |
| SELECT LOG FILE                              |         |                     |            |
| Select RGB color                             |         |                     |            |
| Selected list items                          |         |                     |            |
| Selected record number                       |         |                     |            |
| SELECTION RANGE TO ARRAY                     |         |                     |            |
| SELECTION TO ARRAY                           |         |                     |            |
| Selection to JSON                            |         |                     |            |
| Self                                         |         |                     |            |
| Semaphore                                    |         |                     |            |
| SEND MESSAGE TO REMOTE USER                  |         |                     |            |
| SEND PACKET                                  |         |                     |            |
| SEND RECORD                                  |         |                     |            |
| SEND VARIABLE                                |         |                     |            |
| Sequence number                              |         |                     |            |
| Session                                      |         |                     |            |
| Session info-new $D 20 R7                    |         |                     |            |
| Session storage                              |         |                     |            |
| SET ABOUT                                    |         |                     |            |
| SET ALLOWED METHODS                          |         |                     |            |
| SET APPLICATION COLOR SCHEME                 |         |                     |            |
| SET ASSERT ENABLED                           |         |                     |            |
| SET AUTOMATIC RELATIONS                      |         |                     |            |
| SET BLOB SIZE                                |         |                     |            |
| SET BLOBS CACHE PRIORITY                     |         |                     |            |
| SET CACHE SIZE                               |         |                     |            |
| SET CHANNEL                                  |         |                     |            |
| SET CURRENT PRINTER                          |         |                     |            |
| SET CURSOR                                   |         |         X           |            |
| SET DATABASE LOCALIZATION                    |         |                     |            |
| SET DATABASE PARAMETER                       |         |                     |            |
| SET DEFAULT CENTURY                          |         |                     |            |
| SET DOCUMENT POSITION                        |         |                     |            |
| SET DOCUMENT PROPERTIES                      |         |                     |            |
| SET DOCUMENT SIZE                            |         |                     |            |
| SET DRAG ICON                                |         |                     |            |
| SET ENVIRONMENT VARIABLE                     |         |                     |            |
| SET EXTERNAL DATA PATH                       |         |                     |            |
| SET FIELD RELATION                           |         |                     |            |
| SET FIELD TITLES                             |         |                     |            |
| SET FIELD VALUE NULL                         |         |                     |            |
| SET FILE TO PASTEBOARD                       |         |                     |            |
| SET GROUP ACCESS                             |         |                     |            |
| Set group properties                         |         |                     |            |
| SET HELP MENU                                |         |         X           |            |
| SET INDEX                                    |         |                     |            |
| SET INDEX CACHE PRIORITY                     |         |                     |            |
| SET LIST ITEM                                |         |         X           |            |
| SET LIST ITEM FONT                           |         |         X           |            |
| SET LIST ITEM ICON                           |         |         X           |            |
| SET LIST ITEM PARAMETER                      |         |         X           |            |
| SET LIST ITEM PROPERTIES                     |         |         X           |            |
| SET LIST PROPERTIES                          |         |         X           |            |
| SET MACRO PARAMETER                          |         |                     |            |
| SET MENU BAR                                 |         |         X           |            |
| SET MENU ITEM                                |         |         X           |            |
| SET MENU ITEM ICON                           |         |         X           |            |
| SET MENU ITEM MARK                           |         |         X           |            |
| SET MENU ITEM METHOD                         |         |         X           |            |
| SET MENU ITEM PARAMETER                      |         |         X           |            |
| SET MENU ITEM PROPERTY                       |         |         X           |            |
| SET MENU ITEM SHORTCUT                       |         |         X           |            |
| SET MENU ITEM STYLE                          |         |         X           |            |
| SET PICTURE FILE NAME                        |         |                     |            |
| SET PICTURE METADATA                         |         |                     |            |
| SET PICTURE TO LIBRARY                       |         |                     |            |
| SET PICTURE TO PASTEBOARD                    |         |                     |            |
| SET PLUGIN ACCESS                            |         |                     |            |
| SET PRINT MARKER                             |         |                     |            |
| SET PRINT OPTION                             |         |                     |            |
| SET PRINT PREVIEW                            |         |                     |            |
| SET PRINTABLE MARGIN                         |         |                     |            |
| SET PROCESS VARIABLE                         |         |                     |            |
| SET QUERY AND LOCK                           |         |                     |            |
| SET QUERY DESTINATION                        |         |                     |            |
| SET QUERY LIMIT                              |         |                     |            |
| SET REAL COMPARISON LEVEL                    |         |                     |            |
| SET RECENT FONTS                             |         |                     |            |
| SET TABLE CACHE PRIORITY                     |         |                     |            |
| SET TABLE TITLES                             |         |                     |            |
| SET TEXT TO PASTEBOARD                       |         |                     |            |
| SET TIMEOUT                                  |         |                     |            |
| SET TIMER                                    |         |                     |            |
| SET UPDATE FOLDER                            |         |                     |            |
| SET USER ALIAS                               |         |                     |            |
| Set user properties                          |         |                     |            |
| SET WINDOW DOCUMENT ICON-new $D 20 R7        |         |          X          |            |
| SET WINDOW RECT                              |         |          X          |            |
| SET WINDOW TITLE                             |         |          X          |            |
| Shift down                                   |         |          X          |            |
| SHOW MENU BAR                                |         |          X          |            |
| SHOW ON DISK                                 |         |          X          |            |
| SHOW PROCESS                                 |         |          X          |            |
| SHOW TOOL BAR                                |         |          X          |            |
| SHOW WINDOW                                  |         |          X          |            |
| Sin                                          |    X    |                     |            |
| Size of array                                |         |                     |            |
| SMTP New transporter                         |         |                     |            |
| SOAP DECLARATION                             |         |                     |            |
| SOAP Get info                                |         |                     |            |
| SOAP REJECT NEW REQUESTS                     |         |                     |            |
| SOAP Request                                 |         |                     |            |
| SOAP SEND FAULT                              |         |                     |            |
| SORT ARRAY                                   |         |                     |            |
| SORT LIST                                    |         |                     |            |
| SPELL ADD TO USER DICTIONARY                 |         |                     |            |
| SPELL CHECK TEXT                             |         |                     |            |
| SPELL CHECKING                               |         |                     |            |
| SPELL Get current dictionary                 |         |                     |            |
| SPELL GET DICTIONARY LIST                    |         |                     |            |
| SPELL SET CURRENT DICTIONARY                 |         |                     |            |
| Split string                                 |         |                     |            |
| SQL CANCEL LOAD                              |         |                     |            |
| SQL End selection                            |         |                     |            |
| SQL EXECUTE                                  |         |                     |            |
| SQL EXECUTE SCRIPT                           |         |                     |            |
| SQL EXPORT DATABASE                          |         |                     |            |
| SQL EXPORT SELECTION                         |         |                     |            |
| SQL Get current data source                  |         |                     |            |
| SQL GET DATA SOURCE LIST                     |         |                     |            |
| SQL GET LAST ERROR                           |         |                     |            |
| SQL GET OPTION                               |         |                     |            |
| SQL LOAD RECORD                              |         |                     |            |
| SQL LOGIN                                    |         |                     |            |
| SQL LOGOUT                                   |         |                     |            |
| SQL SET OPTION                               |         |                     |            |
| SQL SET PARAMETER                            |         |                     |            |
| Square root                                  |         |                     |            |
| ST COMPUTE EXPRESSIONS                       |         |                     |            |
| ST FREEZE EXPRESSIONS                        |         |                     |            |
| ST GET ATTRIBUTES                            |         |                     |            |
| ST Get content type                          |         |                     |            |
| ST Get expression                            |         |                     |            |
| ST GET OPTIONS                               |         |                     |            |
| ST Get plain text                            |         |                     |            |
| ST Get text                                  |         |                     |            |
| ST GET URL                                   |         |                     |            |
| ST INSERT EXPRESSION                         |         |                     |            |
| ST INSERT URL                                |         |                     |            |
| ST SET ATTRIBUTES                            |         |                     |            |
| ST SET OPTIONS                               |         |                     |            |
| ST SET PLAIN TEXT                            |         |                     |            |
| ST SET TEXT                                  |         |                     |            |
| START MONITORING ACTIVITY                    |         |                     |            |
| START SQL SERVER                             |         |                     |            |
| START TRANSACTION                            |         |                     |            |
| Std deviation                                |         |                     |            |
| STOP MONITORING ACTIVITY                     |         |                     |            |
| STOP SQL SERVER                              |         |                     |            |
| Storage                                      |         |                     |            |
| String                                       |         |                     |            |
| STRING LIST TO ARRAY                         |         |                     |            |
| Structure file                               |         |                     |            |
| Substring                                    |         |                     |            |
| Subtotal                                     |         |                     |            |
| Sum                                          |         |                     |            |
| Sum squares                                  |         |                     |            |
| Super                                        |         |                     |            |
| SUSPEND TRANSACTION                          |         |                     |            |
| SVG EXPORT TO PICTURE                        |         |                     |            |
| SVG Find element ID by coordinates           |         |                     |            |
| SVG Find element IDs by rect                 |         |                     |            |
| SVG GET ATTRIBUTE                            |         |                     |            |
| SVG SET ATTRIBUTE                            |         |                     |            |
| SVG SHOW ELEMENT                             |         |                     |            |
| System folder                                |         |                     |            |
| System info                                  |         |                     |            |
| Table                                        |         |                     |            |
| Table fragmentation                          |         |                     |            |
| Table name                                   |         |                     |            |
| Tan                                          |    X    |                     |     X      |
| Temporary folder                             |         |                     |            |
| Test path name                               |         |                     |            |
| Test semaphore                               |         |                     |            |
| TEXT TO ARRAY                                |         |                     |            |
| TEXT TO BLOB                                 |         |                     |            |
| TEXT TO DOCUMENT                             |         |                     |            |
| This                                         |         |                     |            |
| throw                                        |         |                     |            |
| Tickcount                                    |         |                     |            |
| Time                                         |         |                     |            |
| Time string                                  |         |                     |            |
| Timestamp                                    |         |                     |            |
| Tool bar height                              |         |                     |            |
| TRACE                                        |    X    |                     |     X      |
| Transaction level                            |         |                     |            |
| TRANSFORM PICTURE                            |         |                     |            |
| Trigger event                                |         |                     |            |
| Trigger level                                |         |                     |            |
| TRIGGER PROPERTIES                           |         |                     |            |
| True                                         |    X    |                     |     X      |
| Trunc                                        |         |                     |            |
| TRUNCATE TABLE                               |         |                     |            |
| Type                                         |         |                     |            |
| Undefined                                    |    X    |                     |     X      |
| UNION                                        |         |                     |            |
| UNLOAD RECORD                                |         |                     |            |
| UNREGISTER CLIENT                            |         |                     |            |
| Uppercase                                    |         |                     |            |
| USE CHARACTER SET                            |         |                     |            |
| USE ENTITY SELECTION                         |         |                     |            |
| USE NAMED SELECTION                          |         |                     |            |
| USE SET                                      |         |                     |            |
| User in group                                |         |                     |            |
| USERS TO BLOB                                |         |                     |            |
| Validate password                            |         |                     |            |
| VALIDATE TRANSACTION                         |         |                     |            |
| Value type                                   |         |                     |            |
| VARIABLE TO BLOB                             |         |                     |            |
| VARIABLE TO VARIABLE                         |         |                     |            |
| Variance                                     |         |                     |            |
| VERIFY CURRENT DATA FILE                     |         |                     |            |
| VERIFY DATA FILE                             |         |                     |            |
| Verify password hash                         |         |                     |            |
| Version type                                 |         |                     |            |
| VOLUME ATTRIBUTES                            |         |                     |            |
| VOLUME LIST                                  |         |                     |            |
| WA Back URL available                        |         |          X          |            |
| WA Create URL history menu                   |         |          X          |            |
| WA Evaluate JavaScript                       |         |          X          |            |
| WA EXECUTE JAVASCRIPT FUNCTION               |         |          X          |            |
| WA Forward URL available                     |         |          X          |            |
| WA Get current URL                           |         |          X          |            |
| WA GET EXTERNAL LINKS FILTERS                |         |         	X          |            |
| WA Get last filtered URL                     |         |          X          |            |
| WA GET LAST URL ERROR                        |         |          X          |            |
| WA Get page content                          |         |          X          |            |
| WA Get page title                            |         |          X          |            |
| WA GET PREFERENCE                            |         |          X          |            |
| WA GET URL FILTERS                           |         |          X          |            |
| WA GET URL HISTORY                           |         |          X          |            |
| WA OPEN BACK URL                             |         |          X          |            |
| WA OPEN FORWARD URL                          |         |          X          |            |
| WA OPEN URL                                  |         |          X          |            |
| WA OPEN WEB INSPECTOR                        |         |          X          |            |
| WA REFRESH CURRENT URL                       |         |          X          |            |
| WA Run offscreen area                        |         |          X          |            |
| WA SET EXTERNAL LINKS FILTERS                |         |          X          |            |
| WA SET PAGE CONTENT                          |         |          X          |            |
| WA SET PREFERENCE                            |         |          X          |            |
| WA SET URL FILTERS                           |         |          X          |            |
| WA STOP LOADING URL                          |         |          X          |            |
| WA ZOOM IN                                   |         |          X          |            |
| WA ZOOM OUT                                  |         |          X          |            |
| WEB GET BODY PART                            |         |                     |            |
| WEB Get body part count                      |         |                     |            |
| WEB Get current session ID                   |         |                     |            |
| WEB GET HTTP BODY                            |         |                     |            |
| WEB GET HTTP HEADER                          |         |                     |            |
| WEB GET OPTION                               |         |                     |            |
| WEB Get server info                          |         |                     |            |
| WEB GET STATISTICS                           |         |                     |            |
| WEB GET VARIABLES                            |         |                     |            |
| WEB Is secured connection                    |         |                     |            |
| WEB Is server running                        |         |                     |            |
| WEB LEGACY CLOSE SESSION                     |         |                     |            |
| WEB LEGACY GET SESSION EXPIRATION            |         |                     |            |
| WEB SEND BLOB                                |         |                     |            |
| WEB SEND FILE                                |         |                     |            |
| WEB SEND HTTP REDIRECT                       |         |                     |            |
| WEB SEND RAW DATA                            |         |                     |            |
| WEB SEND TEXT                                |         |                     |            |
| WEB Server                                   |         |                     |            |
| WEB Server list                              |         |                     |            |
| WEB SERVICE AUTHENTICATE                     |         |                     |            |
| WEB SERVICE CALL                             |         |                     |            |
| WEB SERVICE Get info                         |         |                     |            |
| WEB SERVICE GET RESULT                       |         |                     |            |
| WEB SERVICE SET OPTION                       |         |                     |            |
| WEB SERVICE SET PARAMETER                    |         |                     |            |
| WEB SET HOME PAGE                            |         |                     |            |
| WEB SET HTTP HEADER                          |         |                     |            |
| WEB SET OPTION                               |         |                     |            |
| WEB SET ROOT FOLDER                          |         |                     |            |
| WEB START SERVER                             |    X    |                     |            |
| WEB STOP SERVER                              |         |                     |            |
| WEB Validate digest                          |         |                     |            |
| Window kind                                  |         |          X          |            |
| WINDOW LIST                                  |         |          X          |            |
| Window process                               |         |          X          |            |
| Windows Alt down                             |         |          X          |            |
| Windows Ctrl down                            |         |          X          |            |
| WRITE PICTURE FILE                           |         |                     |            |
| XML DECODE                                   |         |                     |            |
| XML GET ERROR                                |         |                     |            |
| XML GET OPTIONS                              |         |                     |            |
| XML SET OPTIONS                              |         |                     |            |
| Year of                                      |         |                     |            |
| ZIP Create archive                           |         |                     |            |
| ZIP Read archive                             |         |                     |            |
| -------------------------------------------- | ------- | ------------------- | ---------- |
|                   1269                       |         |         418         |            |