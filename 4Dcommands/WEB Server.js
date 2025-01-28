// 4D command: WEB Server list
export default function WEB_Server(processState) {

    // Web server database	1	
    // Current database Web server (default if omitted)
    
    // Web server host database	2	
    // Web server of the host database of a component
    


    // Web server receiving request	3	
    // Web server that received the request (target Web server)

    return processState.webservers && processState.webservers.length ? processState.webservers[0] : null;

}