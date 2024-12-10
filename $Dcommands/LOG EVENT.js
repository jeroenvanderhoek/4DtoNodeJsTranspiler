// $D command: LOG EVENT
export default function (eventType, eventMessage) {
    // FIXME this should log to Windows Events or log-files
    console.log(eventType + ': ' + eventMessage);
}