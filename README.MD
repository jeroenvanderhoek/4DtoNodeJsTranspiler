# Introduction  
Basic example of how a $D to NodeJS transpiler could work. 

It's hard to oversee all the use cases, and if it will perform well, also could maybe be 
improved by parsing to an Abstract Syntax Tree. 
An SQL database still needs to be implemented. It could work for $D projects which dont use $D 
clients ($D clients probably would need to be replaced with webapps which is very complex).

This approach uses Node.JS this has some advantages to $D, because you can:
- use a Javascript IDE
- also contribute if you dont have a $D developer license
- use a lot of shared packages, see: https://www.npmjs.com/

Basic operation:
- read all *.$dm files and replace some basic things with using simpleReplacements.js
- then find all $Dcommands (with $Dcommands.js) to replace the more complex commands with their javascript-modules in /$Dcommands/

/$Dcommands/ contains folder with javascript definitions of the $D commands, if used they will be included in compilation.   

# Getting Started 
Usage:
- put your $D project in /input/ folder
- in CMD run: npm start (this runs: node index.js)
- result: /output/
    - install node packages run: /output/npm install 
    - run with: npm start // this runs: node ./Project/Sources/DatabaseMethods/onServerStartup.js

Prerequisites
- this will only work for $D projects that use serverside code. So this is usefull for webserver back ends, that dont use $D clients.
- install Node v22
- $D project must be in project mode
- $D 20v7 BETA commands used
- skip $D client, $dmobile, QR, PASTE TO CLIPBOARD

# Contribute 
Feel free to contribute / fork / take it away! 

FIXME 
- fix a few hundred more /$Dcommand/-modules ( skip the $D client / UI stuff in the beginning / skip QR )
- replace interproces variable-names starting with <>
- $D objects 
- basic webserver
- Start new processes with cluster.fork() Get current process name etc? Process ID? process.ppid / worker.id
- How does this perform with 30.000 $D methods imported in each process?
- implement SQL. SQL 92 like $D? Or MySQL / PostgreSQL? 
- how to support different versions of $D?
- simple example with webserver, database SQL engine? MySQL / SQL92?, website, http-server in nodejs


General idea of transpiling:
1. Lexical Analysis
Tokenization: Break down the 4D source code into tokens. Tokens are the smallest units of meaning, such as 
keywords, operators, identifiers, and literals.
2. Parsing
Abstract Syntax Tree (AST): Convert the tokens into an AST, which represents the hierarchical structure of 
the source code. This step involves defining the grammar of 4D and using a parser generator to create the AST.
3. Transformation
AST Transformation: Traverse and transform the AST from 4D syntax to Node.js syntax. This involves mapping 
4D constructs to their equivalent in Node.js.
4. Code Generation
Generate Node.js Code: Convert the transformed AST into Node.js code. This step involves walking through 
the AST and generating the corresponding Node.js code.

This project is for educational purposes only. No warranties, expressed or implied, are provided. Use at your own risk.

$D commands 
| 4DCommand                                    | Done    | Skip (4D client etc)|            |
| -------------------------------------------- | ------- | ------------------- | ---------- |
| ABORT                                        |         |                     |            |
| ABORT PROCESS BY ID                          |         |                     |            |
| Abs                                          |    X    |                     |            |
| ACCEPT                                       |         |          X          |            |
| ACCUMULATE                                   |         |                     |            |
| Action info                                  |         |                     |            |
| Activated                                    |         |                     |            |
| Active transaction                           |         |                     |            |
| ACTIVITY SNAPSHOT                            |         |                     |            |
| ADD RECORD                                   |         |                     |            |
| Add to date                                  |    X    |                     |            |
| ADD TO SET                                   |         |                     |            |
| ADJUST BLOBS CACHE PRIORITY                  |         |                     |            |
| ADJUST INDEX CACHE PRIORITY                  |         |                     |            |
| ADJUST TABLE CACHE PRIORITY                  |         |                     |            |
| After                                        |         |                     |            |
| ALERT                                        |         |                     |            |
| ALL RECORDS                                  |         |                     |            |
| APPEND DATA TO PASTEBOARD                    |         |                     |            |
| Append document                              |         |                     |            |
| APPEND MENU ITEM                             |         |                     |            |
| APPEND TO ARRAY                              |    X    |                     |            |
| APPEND TO LIST                               |         |                     |            |
| Application file                             |         |                     |            |
| Application info                             |         |                     |            |
| Application type                             |         |                     |            |
| Application version                          |         |                     |            |
| APPLY TO SELECTION                           |         |                     |            |
| Arctan                                       |    X    |                     |            |
| ARRAY BLOB                                   |         |                     |            |
| ARRAY BOOLEAN                                |         |                     |            |
| ARRAY DATE                                   |         |                     |            |
| ARRAY INTEGER                                |         |                     |            |
| ARRAY LONGINT                                |         |                     |            |
| ARRAY OBJECT                                 |         |                     |            |
| ARRAY PICTURE                                |         |                     |            |
| ARRAY POINTER                                |         |                     |            |
| ARRAY REAL                                   |         |                     |            |
| ARRAY TEXT                                   |         |                     |            |
| ARRAY TIME                                   |         |                     |            |
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
| BEEP                                         |         |                     |            |
| Before                                       |         |                     |            |
| Before selection                             |         |                     |            |
| Begin SQL                                    |         |                     |            |
| End SQL                                      |         |                     |            |
| BLOB PROPERTIES                              |         |                     |            |
| BLOB size                                    |         |                     |            |
| BLOB TO DOCUMENT                             |         |                     |            |
| BLOB to integer                              |         |                     |            |
| BLOB to list                                 |         |                     |            |
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
| CALL FORM                                    |         |                     |            |
| CALL SUBFORM CONTAINER                       |         |                     |            |
| CALL WORKER                                  |         |                     |            |
| CANCEL                                       |         |                     |            |
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
| CLEAR LIST                                   |         |                     |            |
| CLEAR NAMED SELECTION                        |         |                     |            |
| CLEAR PASTEBOARD                             |         |                     |            |
| CLEAR SEMAPHORE                              |         |                     |            |
| CLEAR SET                                    |         |                     |            |
| CLEAR VARIABLE                               |         |                     |            |
| Clickcount                                   |         |                     |            |
| CLOSE DOCUMENT                               |         |                     |            |
| CLOSE PRINTING JOB                           |         |                     |            |
| CLOSE RESOURCE FILE                          |         |                     |            |
| CLOSE WINDOW                                 |         |                     |            |
| COLLECTION TO ARRAY                          |         |                     |            |
| COMBINE PICTURES                             |         |                     |            |
| Command name                                 |         |                     |            |
| Compact data file                            |         |                     |            |
| Compare strings                              |         |                     |            |
| Compile project                              |         |         X           |            |
| COMPONENT LIST                               |         |                     |            |
| COMPRESS BLOB                                |         |                     |            |
| CONFIRM                                      |         |                     |            |
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
| Copy list                                    |         |                     |            |
| COPY NAMED SELECTION                         |         |                     |            |
| Copy parameters                              |         |                     |            |
| COPY SET                                     |         |                     |            |
| Cos                                          |         |                     |            |
| Count in array                               |         |                     |            |
| Count list items                             |         |                     |            |
| Count menu items                             |         |                     |            |
| Count menus                                  |         |                     |            |
| Count parameters                             |         |                     |            |
| Count screens                                |         |                     |            |
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
| Create menu                                  |         |                     |            |
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
| Current form name                            |         |                     |            |
| Current form table                           |         |                     |            |
| Current form window                          |         |                     |            |
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
| DELETE MENU ITEM                             |         |                     |            |
| DELETE RECORD                                |         |                     |            |
| DELETE SELECTION                             |         |                     |            |
| Delete string                                |         |                     |            |
| DELETE USER                                  |         |                     |            |
| DESCRIBE QUERY EXECUTION                     |         |                     |            |
| DIALOG                                       |         |                     |            |
| DIFFERENCE                                   |         |                     |            |
| DISABLE MENU ITEM                            |         |                     |            |
| Discover data key                            |         |                     |            |
| DISPLAY NOTIFICATION                         |         |                     |            |
| DISPLAY RECORD                               |         |                     |            |
| DISPLAY SELECTION                            |         |                     |            |
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
| DRAG WINDOW                                  |         |                     |            |
| Drop position                                |         |                     |            |
| DROP REMOTE USER                             |         |                     |            |
| ds                                           |         |                     |            |
| DUPLICATE RECORD                             |         |                     |            |
| Dynamic pop up menu                          |         |                     |            |
| EDIT ACCESS                                  |         |                     |            |
| EDIT FORMULA                                 |         |                     |            |
| EDIT ITEM                                    |         |                     |            |
| ENABLE MENU ITEM                             |         |                     |            |
| ENCRYPT BLOB                                 |         |                     |            |
| Encrypt data BLOB                            |         |                     |            |
| Encrypt data file                            |         |                     |            |
| End selection                                |         |                     |            |
| End SQL                                      |         |                     |            |
| Equal pictures                               |         |                     |            |
| ERASE WINDOW                                 |         |                     |            |
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
| False                                        |    X    |                     |            |
| Field                                        |         |                     |            |
| Field name                                   |         |                     |            |
| File                                         |         |                     |            |
| FILTER EVENT                                 |         |                     |            |
| FILTER KEYSTROKE                             |         |                     |            |
| Find in array                                |         |                     |            |
| Find in field                                |         |                     |            |
| Find in list                                 |         |                     |            |
| Find in sorted array                         |         |                     |            |
| Find window                                  |         |                     |            |
| FIRST RECORD                                 |         |                     |            |
| FLUSH CACHE                                  |         |                     |            |
| Focus object                                 |         |                     |            |
| Folder                                       |         |                     |            |
| FOLDER LIST                                  |         |                     |            |
| Font file                                    |         |                     |            |
| FONT LIST                                    |         |                     |            |
| FONT STYLE LIST                              |         |                     |            |
| Form                                         |         |                     |            |
| FORM Convert to dynamic                      |         |                     |            |
| FORM EDIT                                    |         |                     |            |
| FORM Event                                   |         |                     |            |
| Form event code                              |         |                     |            |
| FORM FIRST PAGE                              |         |                     |            |
| FORM Get color scheme                        |         |                     |            |
| FORM Get current page                        |         |                     |            |
| FORM GET ENTRY ORDER                         |         |                     |            |
| FORM GET HORIZONTAL RESIZING                 |         |                     |            |
| FORM GET NAMES                               |         |                     |            |
| FORM GET OBJECTS                             |         |                     |            |
| FORM GET PROPERTIES                          |         |                     |            |
| FORM GET VERTICAL RESIZING                   |         |                     |            |
| FORM GOTO PAGE                               |         |                     |            |
| FORM LAST PAGE                               |         |                     |            |
| FORM LOAD                                    |         |                     |            |
| FORM NEXT PAGE                               |         |                     |            |
| FORM PREVIOUS PAGE                           |         |                     |            |
| FORM SCREENSHOT                              |         |                     |            |
| FORM SET ENTRY ORDER                         |         |                     |            |
| FORM SET HORIZONTAL RESIZING                 |         |                     |            |
| FORM SET INPUT                               |         |                     |            |
| FORM SET OUTPUT                              |         |                     |            |
| FORM SET SIZE                                |         |                     |            |
| FORM SET VERTICAL RESIZING                   |         |                     |            |
| FORM UNLOAD                                  |         |                     |            |
| Formula                                      |         |                     |            |
| Formula from string                          |         |                     |            |
| Frontmost process                            |         |                     |            |
| Frontmost window                             |         |                     |            |
| GENERATE CERTIFICATE REQUEST                 |         |                     |            |
| Generate digest                              |         |                     |            |
| GENERATE ENCRYPTION KEYPAIR                  |         |                     |            |
| Generate password hash                       |         |                     |            |
| Generate UUID                                |         |                     |            |
| Get 4D file                                  |         |                     |            |
| Get 4D folder                                |         |                     |            |
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
| Get document position                        |         |                     |            |
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
| GET GROUP LIST                               |         |                     |            |
| GET GROUP PROPERTIES                         |         |                     |            |
| GET HIGHLIGHT                                |         |                     |            |
| GET HIGHLIGHTED RECORDS                      |         |                     |            |
| Get indexed string                           |         |                     |            |
| Get last update log path                     |         |                     |            |
| GET LIST ITEM                                |         |                     |            |
| Get list item font                           |         |                     |            |
| GET LIST ITEM ICON                           |         |                     |            |
| GET LIST ITEM PARAMETER                      |         |                     |            |
| GET LIST ITEM PARAMETER ARRAYS               |         |                     |            |
| GET LIST ITEM PROPERTIES                     |         |                     |            |
| GET LIST PROPERTIES                          |         |                     |            |
| GET MACRO PARAMETER                          |         |                     |            |
| Get menu bar reference                       |         |                     |            |
| Get menu item                                |         |                     |            |
| GET MENU ITEM ICON                           |         |                     |            |
| Get menu item key                            |         |                     |            |
| Get menu item mark                           |         |                     |            |
| Get menu item method                         |         |                     |            |
| Get menu item modifiers                      |         |                     |            |
| Get menu item parameter                      |         |                     |            |
| GET MENU ITEM PROPERTY                       |         |                     |            |
| Get menu item style                          |         |                     |            |
| GET MENU ITEMS                               |         |                     |            |
| Get menu title                               |         |                     |            |
| GET MISSING TABLE NAMES                      |         |                     |            |
| GET PASTEBOARD DATA                          |         |                     |            |
| GET PASTEBOARD DATA TYPE                     |         |                     |            |
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
| Get selected menu item parameter             |         |                     |            |
| GET SERIAL PORT MAPPING                      |         |                     |            |
| Get string resource                          |         |                     |            |
| GET STYLE SHEET INFO                         |         |                     |            |
| Get subrecord key                            |         |                     |            |
| GET SYSTEM FORMAT                            |         |                     |            |
| GET TABLE PROPERTIES                         |         |                     |            |
| GET TABLE TITLES                             |         |                     |            |
| Get text from pasteboard                     |         |                     |            |
| GET TEXT KEYWORDS                            |         |                     |            |
| Get text resource                            |         |                     |            |
| GET USER LIST                                |         |                     |            |
| GET USER PROPERTIES                          |         |                     |            |
| GET WINDOW RECT                              |         |                     |            |
| Get window title                             |         |                     |            |
| GOTO OBJECT                                  |         |                     |            |
| GOTO RECORD                                  |         |                     |            |
| GOTO SELECTED RECORD                         |         |                     |            |
| GOTO XY                                      |         |                     |            |
| GRAPH                                        |         |                     |            |
| GRAPH SETTINGS                               |         |                     |            |
| HIDE MENU BAR                                |         |                     |            |
| HIDE PROCESS                                 |         |                     |            |
| HIDE TOOL BAR                                |         |                     |            |
| HIDE WINDOW                                  |         |                     |            |
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
| INSERT IN LIST                               |         |                     |            |
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
| Is macOS                                     |    X    |                     |            |
| Is new record                                |         |                     |            |
| Is nil pointer                               |         |                     |            |
| Is picture file                              |         |                     |            |
| Is record loaded                             |         |                     |            |
| Is table number valid                        |         |                     |            |
| Is user deleted                              |         |                     |            |
| Is waiting mouse up                          |         |                     |            |
| Is window maximized                          |         |                     |            |
| Is window reduced                            |         |                     |            |
| Is Windows                                   |    X    |                     |            |
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
| LISTBOX COLLAPSE                             |         |                     |            |
| LISTBOX DELETE COLUMN                        |         |                     |            |
| LISTBOX DELETE ROWS                          |         |                     |            |
| LISTBOX DUPLICATE COLUMN                     |         |                     |            |
| LISTBOX EXPAND                               |         |                     |            |
| LISTBOX Get array                            |         |                     |            |
| LISTBOX GET ARRAYS                           |         |                     |            |
| LISTBOX Get auto row height                  |         |                     |            |
| LISTBOX GET CELL COORDINATES                 |         |                     |            |
| LISTBOX GET CELL POSITION                    |         |                     |            |
| LISTBOX Get column formula                   |         |                     |            |
| LISTBOX Get column width                     |         |                     |            |
| LISTBOX Get footer calculation               |         |                     |            |
| LISTBOX Get footers height                   |         |                     |            |
| LISTBOX GET GRID                             |         |                     |            |
| LISTBOX GET GRID COLORS                      |         |                     |            |
| LISTBOX Get headers height                   |         |                     |            |
| LISTBOX GET HIERARCHY                        |         |                     |            |
| LISTBOX Get locked columns                   |         |                     |            |
| LISTBOX Get number of columns                |         |                     |            |
| LISTBOX Get number of rows                   |         |                     |            |
| LISTBOX GET OBJECTS                          |         |                     |            |
| LISTBOX GET PRINT INFORMATION                |         |                     |            |
| LISTBOX Get property                         |         |                     |            |
| LISTBOX Get row color                        |         |                     |            |
| LISTBOX Get row color as number              |         |                     |            |
| LISTBOX Get row font style                   |         |                     |            |
| LISTBOX Get row height                       |         |                     |            |
| LISTBOX Get rows height                      |         |                     |            |
| LISTBOX Get static columns                   |         |                     |            |
| LISTBOX GET TABLE SOURCE                     |         |                     |            |
| LISTBOX INSERT COLUMN                        |         |                     |            |
| LISTBOX INSERT COLUMN FORMULA                |         |                     |            |
| LISTBOX INSERT ROWS                          |         |                     |            |
| LISTBOX MOVE COLUMN                          |         |                     |            |
| LISTBOX MOVED COLUMN NUMBER                  |         |                     |            |
| LISTBOX MOVED ROW NUMBER                     |         |                     |            |
| LISTBOX SELECT BREAK                         |         |                     |            |
| LISTBOX SELECT ROW                           |         |                     |            |
| LISTBOX SELECT ROWS                          |         |                     |            |
| LISTBOX SET ARRAY                            |         |                     |            |
| LISTBOX SET AUTO ROW HEIGHT                  |         |                     |            |
| LISTBOX SET COLUMN FORMULA                   |         |                     |            |
| LISTBOX SET COLUMN WIDTH                     |         |                     |            |
| LISTBOX SET FOOTER CALCULATION               |         |                     |            |
| LISTBOX SET FOOTERS HEIGHT                   |         |                     |            |
| LISTBOX SET GRID                             |         |                     |            |
| LISTBOX SET GRID COLOR                       |         |                     |            |
| LISTBOX SET HEADERS HEIGHT                   |         |                     |            |
| LISTBOX SET HIERARCHY                        |         |                     |            |
| LISTBOX SET LOCKED COLUMNS                   |         |                     |            |
| LISTBOX SET PROPERTY                         |         |                     |            |
| LISTBOX SET ROW COLOR                        |         |                     |            |
| LISTBOX SET ROW FONT STYLE                   |         |                     |            |
| LISTBOX SET ROW HEIGHT                       |         |                     |            |
| LISTBOX SET ROWS HEIGHT                      |         |                     |            |
| LISTBOX SET STATIC COLUMNS                   |         |                     |            |
| LISTBOX SET TABLE SOURCE                     |         |                     |            |
| LISTBOX SORT COLUMNS                         |         |                     |            |
| Load 4D View document                        |         |                     |            |
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
| Macintosh command down                       |         |                     |            |
| Macintosh control down                       |         |                     |            |
| Macintosh option down                        |         |                     |            |
| MAIL Convert from MIME                       |         |                     |            |
| MAIL Convert to MIME                         |         |                     |            |
| MAIL New attachment                          |         |                     |            |
| Match regex                                  |         |                     |            |
| Max                                          |         |                     |            |
| MAXIMIZE WINDOW                              |         |                     |            |
| MEMORY STATISTICS                            |         |                     |            |
| Menu bar height                              |         |                     |            |
| Menu bar screen                              |         |                     |            |
| Menu selected                                |         |                     |            |
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
| MINIMIZE WINDOW                              |         |                     |            |
| MOBILE APP REFRESH SESSIONS                  |         |                     |            |
| Mod                                          |         |                     |            |
| Modified                                     |         |                     |            |
| Modified record                              |         |                     |            |
| MODIFY RECORD                                |         |                     |            |
| MODIFY SELECTION                             |         |                     |            |
| Monitored activity                           |         |                     |            |
| Month of                                     |         |                     |            |
| MOUSE POSITION                               |         |                     |            |
| MOVE DOCUMENT                                |         |                     |            |
| MULTI SORT ARRAY                             |         |                     |            |
| New collection                               |         |                     |            |
| New data key                                 |         |                     |            |
| New list                                     |         |                     |            |
| New log file                                 |         |                     |            |
| New object                                   |         |                     |            |
| New process                                  |         |                     |            |
| New shared collection                        |         |                     |            |
| New shared object                            |         |                     |            |
| New signal                                   |         |                     |            |
| NEXT RECORD                                  |         |                     |            |
| Next window                                  |         |                     |            |
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
| On Server Startup database method            |         |                     |            |
| On SQL Authentication database method        |         |                     |            |
| On Startup database method                   |         |                     |            |
| On System Event database method              |         |                     |            |
| On Web Authentication database method        |         |                     |            |
| On Web Connection database method            |         |                     |            |
| On Web Legacy Close Session database method  |         |                     |            |
| ONE RECORD SELECT                            |         |                     |            |
| OPEN ADMINISTRATION WINDOW                   |         |                     |            |
| OPEN COLOR PICKER                            |         |                     |            |
| OPEN DATA FILE                               |         |                     |            |
| OPEN DATABASE                                |         |                     |            |
| Open datastore                               |         |                     |            |
| Open document                                |         |                     |            |
| OPEN FONT PICKER                             |         |                     |            |
| Open form window                             |         |                     |            |
| OPEN PRINTING JOB                            |         |                     |            |
| Open resource file                           |         |                     |            |
| OPEN RUNTIME EXPLORER                        |         |                     |            |
| OPEN SECURITY CENTER                         |         |                     |            |
| OPEN SETTINGS WINDOW                         |         |                     |            |
| OPEN URL                                     |         |                     |            |
| Open window                                  |         |                     |            |
| ORDER BY                                     |         |                     |            |
| ORDER BY ATTRIBUTE                           |         |                     |            |
| ORDER BY FORMULA                             |         |                     |            |
| Outside call                                 |         |                     |            |
| PAGE BREAK                                   |         |                     |            |
| Parse formula                                |         |                     |            |
| Pasteboard data size                         |         |                     |            |
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
| PROCESS 4D TAGS                              |         |                     |            |
| Process aborted                              |         |                     |            |
| Process activity-modified 4D 20 R7           |         |                     |            |
| Process info-new 4D 20 R7                    |         |                     |            |
| Process number                               |         |                     |            |
| Process state                                |         |                     |            |
| PUSH RECORD                                  |         |                     |            |
| QR BLOB TO REPORT                            |         |                     |            |
| QR Count columns                             |         |                     |            |
| QR DELETE COLUMN                             |         |                     |            |
| QR DELETE OFFSCREEN AREA                     |         |                     |            |
| QR EXECUTE COMMAND                           |         |                     |            |
| QR Find column                               |         |                     |            |
| QR Get area property                         |         |                     |            |
| QR GET BORDERS                               |         |                     |            |
| QR Get command status                        |         |                     |            |
| QR GET DESTINATION                           |         |                     |            |
| QR Get document property                     |         |                     |            |
| QR Get drop column                           |         |                     |            |
| QR GET HEADER AND FOOTER                     |         |                     |            |
| QR Get HTML template                         |         |                     |            |
| QR GET INFO COLUMN                           |         |                     |            |
| QR Get info row                              |         |                     |            |
| QR Get report kind                           |         |                     |            |
| QR Get report table                          |         |                     |            |
| QR GET SELECTION                             |         |                     |            |
| QR GET SORTS                                 |         |                     |            |
| QR Get text property                         |         |                     |            |
| QR GET TOTALS DATA                           |         |                     |            |
| QR GET TOTALS SPACING                        |         |                     |            |
| QR INSERT COLUMN                             |         |                     |            |
| QR MOVE COLUMN                               |         |                     |            |
| QR NEW AREA                                  |         |                     |            |
| QR New offscreen area                        |         |                     |            |
| QR ON COMMAND                                |         |                     |            |
| QR REPORT                                    |         |                     |            |
| QR REPORT TO BLOB                            |         |                     |            |
| QR RUN                                       |         |                     |            |
| QR SET AREA PROPERTY                         |         |                     |            |
| QR SET BORDERS                               |         |                     |            |
| QR SET DESTINATION                           |         |                     |            |
| QR SET DOCUMENT PROPERTY                     |         |                     |            |
| QR SET HEADER AND FOOTER                     |         |                     |            |
| QR SET HTML TEMPLATE                         |         |                     |            |
| QR SET INFO COLUMN                           |         |                     |            |
| QR SET INFO ROW                              |         |                     |            |
| QR SET REPORT KIND                           |         |                     |            |
| QR SET REPORT TABLE                          |         |                     |            |
| QR SET SELECTION                             |         |                     |            |
| QR SET SORTS                                 |         |                     |            |
| QR SET TEXT PROPERTY                         |         |                     |            |
| QR SET TOTALS DATA                           |         |                     |            |
| QR SET TOTALS SPACING                        |         |                     |            |
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
| QUIT 4D                                      |         |                     |            |
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
| REDRAW WINDOW                                |         |                     |            |
| REDUCE RESTORE WINDOW                        |         |                     |            |
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
| Request                                      |         |                     |            |
| RESIZE FORM WINDOW                           |         |                     |            |
| RESOLVE ALIAS                                |         |                     |            |
| RESOLVE POINTER                              |         |                     |            |
| RESOURCE LIST                                |         |                     |            |
| RESOURCE TYPE LIST                           |         |                     |            |
| RESTART 4D                                   |         |                     |            |
| RESTORE                                      |         |                     |            |
| RESTORE INFO                                 |         |                     |            |
| RESUME INDEXES                               |         |                     |            |
| RESUME PROCESS                               |         |                     |            |
| RESUME TRANSACTION                           |         |                     |            |
| Right click                                  |         |                     |            |
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
| SCREEN COORDINATES                           |         |                     |            |
| SCREEN DEPTH                                 |         |                     |            |
| Screen height                                |         |                     |            |
| Screen width                                 |         |                     |            |
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
| Session info-new 4D 20 R7                    |         |                     |            |
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
| SET CURSOR                                   |         |                     |            |
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
| SET HELP MENU                                |         |                     |            |
| SET INDEX                                    |         |                     |            |
| SET INDEX CACHE PRIORITY                     |         |                     |            |
| SET LIST ITEM                                |         |                     |            |
| SET LIST ITEM FONT                           |         |                     |            |
| SET LIST ITEM ICON                           |         |                     |            |
| SET LIST ITEM PARAMETER                      |         |                     |            |
| SET LIST ITEM PROPERTIES                     |         |                     |            |
| SET LIST PROPERTIES                          |         |                     |            |
| SET MACRO PARAMETER                          |         |                     |            |
| SET MENU BAR                                 |         |                     |            |
| SET MENU ITEM                                |         |                     |            |
| SET MENU ITEM ICON                           |         |                     |            |
| SET MENU ITEM MARK                           |         |                     |            |
| SET MENU ITEM METHOD                         |         |                     |            |
| SET MENU ITEM PARAMETER                      |         |                     |            |
| SET MENU ITEM PROPERTY                       |         |                     |            |
| SET MENU ITEM SHORTCUT                       |         |                     |            |
| SET MENU ITEM STYLE                          |         |                     |            |
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
| SET WINDOW DOCUMENT ICON-new 4D 20 R7        |         |                     |            |
| SET WINDOW RECT                              |         |                     |            |
| SET WINDOW TITLE                             |         |                     |            |
| Shift down                                   |         |                     |            |
| SHOW MENU BAR                                |         |                     |            |
| SHOW ON DISK                                 |         |                     |            |
| SHOW PROCESS                                 |         |                     |            |
| SHOW TOOL BAR                                |         |                     |            |
| SHOW WINDOW                                  |         |                     |            |
| Sin                                          |         |                     |            |
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
| Tan                                          |    X    |                     |            |
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
| TRACE                                        |    X    |                     |            |
| Transaction level                            |         |                     |            |
| TRANSFORM PICTURE                            |         |                     |            |
| Trigger event                                |         |                     |            |
| Trigger level                                |         |                     |            |
| TRIGGER PROPERTIES                           |         |                     |            |
| True                                         |    X    |                     |            |
| Trunc                                        |         |                     |            |
| TRUNCATE TABLE                               |         |                     |            |
| Type                                         |         |                     |            |
| Undefined                                    |    X    |                     |            |
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
| WA Back URL available                        |         |                     |            |
| WA Create URL history menu                   |         |                     |            |
| WA Evaluate JavaScript                       |         |                     |            |
| WA EXECUTE JAVASCRIPT FUNCTION               |         |                     |            |
| WA Forward URL available                     |         |                     |            |
| WA Get current URL                           |         |                     |            |
| WA GET EXTERNAL LINKS FILTERS                |         |                     |            |
| WA Get last filtered URL                     |         |                     |            |
| WA GET LAST URL ERROR                        |         |                     |            |
| WA Get page content                          |         |                     |            |
| WA Get page title                            |         |                     |            |
| WA GET PREFERENCE                            |         |                     |            |
| WA GET URL FILTERS                           |         |                     |            |
| WA GET URL HISTORY                           |         |                     |            |
| WA OPEN BACK URL                             |         |                     |            |
| WA OPEN FORWARD URL                          |         |                     |            |
| WA OPEN URL                                  |         |                     |            |
| WA OPEN WEB INSPECTOR                        |         |                     |            |
| WA REFRESH CURRENT URL                       |         |                     |            |
| WA Run offscreen area                        |         |                     |            |
| WA SET EXTERNAL LINKS FILTERS                |         |                     |            |
| WA SET PAGE CONTENT                          |         |                     |            |
| WA SET PREFERENCE                            |         |                     |            |
| WA SET URL FILTERS                           |         |                     |            |
| WA STOP LOADING URL                          |         |                     |            |
| WA ZOOM IN                                   |         |                     |            |
| WA ZOOM OUT                                  |         |                     |            |
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
| WEB START SERVER                             |         |                     |            |
| WEB STOP SERVER                              |         |                     |            |
| WEB Validate digest                          |         |                     |            |
| Window kind                                  |         |                     |            |
| WINDOW LIST                                  |         |                     |            |
| Window process                               |         |                     |            |
| Windows Alt down                             |         |                     |            |
| Windows Ctrl down                            |         |                     |            |
| WRITE PICTURE FILE                           |         |                     |            |
| XML DECODE                                   |         |                     |            |
| XML GET ERROR                                |         |                     |            |
| XML GET OPTIONS                              |         |                     |            |
| XML SET OPTIONS                              |         |                     |            |
| Year of                                      |         |                     |            |
| ZIP Create archive                           |         |                     |            |
| ZIP Read archive                             |         |                     |            |

