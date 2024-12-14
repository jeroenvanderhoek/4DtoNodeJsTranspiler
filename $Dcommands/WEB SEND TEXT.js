// $D command: WEB SEND TEXT

/**
 * 
 * @param {object} processState 
 * @param {string} $1 htmlText 		Text		in		HTML text field or variable to be sent to the Web browser	
 * @param {string} [$2] type 		Text		in		MIME type
 */
export default function WEB_SEND_TEXT (processState,$1,$2) {

    if ( $2 !== undefined ) {
        processState.res.setHeader('content-type', $2);
    }   

    processState.res.send($1);

}