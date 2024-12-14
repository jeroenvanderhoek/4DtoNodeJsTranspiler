C_LONGINT:C283(x,y)
C_REAL:C285(z)

// Math
x:=1
y:=3
z:=Arctan:C20(x/y)

// Log
LOG EVENT:C667(Into Windows log events:K38:4; "Arctan ("+String:C10(x)+"/"+String:C10(y)+") = "+String:C10(z))

// Ask continu y/n?
ALERT:C41("Warning, this might blow your mind!"; "Continue")

// Project method without parameters
Project Method Hello World

// Project method with parameters
Project Method With Parameter("Project Method With Parameter")

// Debugger
TRACE:C157

// Test operator: = 
LOG EVENT:C667(0; "= operator ok: "+String:C10(4=4))

// Test array
Test Arrays

// Start web server
WEB START SERVER:C617

// Log OK after starting webserver
LOG EVENT:C667(0; "OK: "+String:C10(OK)); 

// Open browser to test web server
OPEN URL:C673("http://localhost")



