// 4D command: WEB SEND FILE

import fs from 'fs';

/**
 * Description   
    The WEB SEND FILE command sends, to the Web browser, the HTML page or the Web file stored in the document whose pathname you pass in htmlFile.

    By default, 4D looks for the HTML document within the root folder, defined in the Database Settings.

    This command accepts as a parameter either pathnames in Posix syntax (names of directories or folders are separated with a slash "/") or in the system syntax.
    Specifying an invalid pathname generates an error related to file management for your operating system. You can intercept this error using a method installed by the ON ERR CALL command. If the method displays a warning or message dialog box, it will appear on the browser machine.

    Once WEB SEND FILE is executed, the OK system variable is updated: if the file to be sent exists and if the timeout has not run out, OK is equal to 1. Otherwise, it is equal to 0.

    Note: If you call WEB SEND FILE from within a process that is not a Web process, the command does nothing and returns no error; the call is simply ignored.

    The references to 4D variables and 4DSCRIPT type tags found on the page are parsed when the document type allows for it (document based on text).

    Example  
    The HTML root folder of the database is the WebDocs folder. It contains the following elements:

    ..\WebDocs\HTM\MyPage.HTM
    Sending the Web page "MyPage.HTM" must be carried out in the following manner :

    WEB SEND FILE("HTM/MyPage.HTM")
    System variables and sets  
    If the file to be sent exists and if the timeout has not run out, OK is set to 1. Otherwise, it is equal to 0.
 * 
 * 
 * @param {object} processState 
 * @param {string} $1 HTML Pathname to HTML file or empty string for terminating SEND HTML FILE	
 */
export default function WEB_SEND_FILE (processState,$1) {

    if ( fs.existsSync($1) ) {
        processState.OK = 1;

        let file = fs.readFileSync($1);
        processState.res.sendFile(file);

    } else {
        processState.OK = 0;
    }

}