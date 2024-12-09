// $D command: LOG EVENT
module.exports = function (eventType, eventMessage) {
    // FIXME this should log to Windows Events or log-files
    console.log(eventType + ': ' + eventMessage);
}