// $D command: Request

/*
Request ( message {; defaultResponse {; OKButtonTitle {; CancelButtonTitle}}} ) : Text

Parameter	        Type		Description
message	            Text	→	Message to display in the request dialog box
defaultResponse	    Text	→	Default data for the enterable text area
OKButtonTitle	    Text	→	OK button title
CancelButtonTitle	Text	→	Cancel button title
Function result	Text	    ←	Value entered by user
*/

import readlineSync from 'readline-sync';

/**
 * @param {object} processState
 * @param {Text} $1   Message to display in the request dialog box
 * @param {Text} [$2] Default data for the enterable text area
 * @param {Text} [$3] OK button title
 * @param {Text} [$4] Cancel button title // FIXME
 * @returns {Text} Value entered by user
 */
export default function (processState,$1,$2,$3,$4,$5) {

    let answer = readlineSync.question(`${ $1 } ${ $3 !== undefined ? $3 + "?" : ""} ${ $2 !== undefined ? "[" + $2 + "]" : ""}`);

    // Return default value
    if (answer === "") {
        answer = $2;
    }

    // Prompt user with the question
    if (readlineSync.keyInYN(`${ answer } was entered. ${ $3 !== undefined ? "[y]" + $3 + "?" : "[y] Continue? "} ${ $4 !== undefined ? "n" + $4 + "?" : "" }`)) {
        // User answered "yes", continue the process
        return;
    } else {
        // Exit the process
        process.exit(0);
    }

    return answer;
    

};