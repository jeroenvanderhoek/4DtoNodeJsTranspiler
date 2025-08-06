// (DM) "On Web Connection"
#DECLARE($vt_url : Text; $vt_http_header : Text; $vt_ip_adress_web_client : Text; $vt_ip_adress_server : Text; $vt_username : Text; $vt_password : Text)

// Basic web response
WEB SEND TEXT:C677("Bonjour, webserver user!")

// Test web session
LOG EVENT:C667(0; "Session ID: "+String:C10(WEB Get Current Session ID:C667))

// Test HTTP headers
LOG EVENT:C667(0; "User-Agent: "+String:C10(WEB GET HTTP HEADER:C667("User-Agent")))

// Test HTTP body
LOG EVENT:C667(0; "HTTP Body: "+String:C10(WEB GET HTTP BODY:C667))

// Test HTTP variables
ARRAY TEXT:C222(headerNames; 0)
ARRAY TEXT:C222(headerValues; 0)
WEB GET VARIABLES:C667(headerNames; headerValues)
LOG EVENT:C667(0; "HTTP Variables count: "+String:C10(Size of array:C667(headerNames)))

// Test web server info
LOG EVENT:C667(0; "Is server running: "+String:C10(WEB Is server running:C667))

// Test web redirect
WEB SEND HTTP REDIRECT:C667("http://localhost/redirect")

// Test web blob response
WEB SEND BLOB:C667("Hello World"; "text/plain")

// Test web file response
WEB SEND FILE:C667("index.html")

// Test web raw data response
WEB SEND RAW DATA:C667("HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nRaw response")
