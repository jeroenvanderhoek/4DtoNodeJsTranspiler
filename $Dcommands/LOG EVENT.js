// $D command: LOG EVENT
/**
 * 
 * @param {object} processState 
 * @param {number} eventType 
 * @param {string} eventMessage 
 */
export default function (processState, eventType, eventMessage) {

    console.log(eventMessage);

    // FIXME this should log to Windows Events or log-files based on the eventType
    // // Windwos Event Log:
    // const winston = require('winston');
    // const EventLog = require('winston-eventlog');

    // const logger = winston.createLogger({
    // level: 'info',
    // transports: [
    //     new EventLog({
    //     logDirectory: 'C:\\logs', // Optional: Specify the log directory
    //     sourceName: 'MyNodeApp', // Name of the event source
    //     }),
    // ],
    // });

}