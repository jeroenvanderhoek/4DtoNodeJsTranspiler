// 4D command: ALERT // OPTIMIZE $2 contains an optional OK-button message: create custom dialog with OK-button and message
// module.exports = console.info;

// Alert is not recommended on a back end. Log to console instead.
// Could do a prompt interrupt
// export default console.info;

import readlineSync from 'readline-sync';

export default function (processState,$1,$2) {
    
    // Prompt user with the question
    if (readlineSync.keyInYN(`${ $1 } ${ $2 !== undefined ? $2 + "?" : ""}`)) {
        // User answered "yes", continue the process

        processState.OK = true;
    } else {
        processState.OK = false;
        // Exit the process
        // process.exit(0);
    }
    
};