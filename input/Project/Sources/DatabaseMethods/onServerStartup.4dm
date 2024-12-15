LOG EVENT:C667(0; "Bonjour world!")

// Debugger
TRACE:C157

// Test operators and If End if
If (4=4)
	LOG EVENT:C667(0; "if and = operator: ✓")
End if 

// Test length and If Else End if
If (4=Length:C16("abcd"))
	LOG EVENT:C667(0; "if else, Length: ✓")
Else 
	LOG EVENT:C667(0; "if else, Length: ✗")
End if 

// Project method without parameters
Project method without params

// Project method with parameters
Project Method With Parameter("Project Method With Parameter")

Test Math

Arrays For loops If Else End if

Test Case Else End Case

// Start web server
WEB START SERVER:C617

// Log OK after starting webserver
LOG EVENT:C667(0; "WEB START SERVER OK: "+String:C10(OK)); 

// Open browser to test web server
LOG EVENT:C667(0; "Open browser with http://localhost")
OPEN URL:C673("http://localhost")

// Ask continu y/n?
ALERT:C41("Database interactions require a PostgreSQL database. Please provide in environment variables: PG_USERNAME_4D, PG_PASSWORD_4D, PG_ADRESS_4D, PG_PORT_4D else default values will be used."; "continue")

If (OK=1){
	// Log OK after alert
	LOG EVENT:C667(0; "ALERT OK: "+String:C10(OK)); 
End if 

Test Database Operations
