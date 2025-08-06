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

// Test system information
LOG EVENT:C667(0; "System info: "+String:C10(System info:C667))

// Test application info
LOG EVENT:C667(0; "Application info: "+String:C10(Application info:C667))

// Test current machine
LOG EVENT:C667(0; "Current machine: "+String:C10(Current machine:C667))

// Test data file
LOG EVENT:C667(0; "Data file: "+String:C10(Data file:C667))

// Test timestamp and milliseconds
LOG EVENT:C667(0; "Timestamp: "+String:C10(Timestamp:C667))
LOG EVENT:C667(0; "Milliseconds: "+String:C10(Milliseconds:C667))

// Test UUID generation
LOG EVENT:C667(0; "Generated UUID: "+String:C10(Generate UUID:C667))

// Test password hashing
LOG EVENT:C667(0; "Password hash: "+String:C10(Generate password hash:C667("testpassword")))

// Test array operations
ARRAY TEXT:C222(testArray; 5)
testArray{1}:="Hello"
testArray{2}:="World"
LOG EVENT:C667(0; "Array size: "+String:C10(Size of array:C667(testArray)))

// Test array copying
ARRAY TEXT:C222(testArray2; 5)
COPY ARRAY:C667(testArray; testArray2)
LOG EVENT:C667(0; "Copied array size: "+String:C10(Size of array:C667(testArray2)))

// Test set operations
ADD TO SET:C667("testSet"; "value1")
ADD TO SET:C667("testSet"; "value2")
ADD TO SET:C667("testSet"; "value1") // Should not add duplicate
LOG EVENT:C667(0; "Set operations completed")

// Test array append operations
ARRAY TEXT:C222(testArray3; 0)
APPEND TO ARRAY:C667(testArray3; "appended1")
APPEND TO ARRAY:C667(testArray3; "appended2")
LOG EVENT:C667(0; "Array append operations completed")

// Test array to collection conversion
ARRAY TEXT:C222(testArray4; 3)
testArray4{1}:="item1"
testArray4{2}:="item2"
testArray4{3}:="item3"
ARRAY TO COLLECTION:C667(testArray4; "testCollection")
LOG EVENT:C667(0; "Array to collection conversion completed")

// Test date operations
LOG EVENT:C667(0; "Add to date: "+String:C10(Add to date:C667(Current date:C667; 1; 0; 0)))

// Project method without parameters
Project method without params

// Project method with parameters
Project Method With Parameter("Project Method With Parameter")

Test Math

Arrays For loops If Else End if

Test Case Else End Case

// Test web server operations
LOG EVENT:C667(0; "Is server running: "+String:C10(WEB Is server running:C667))

// Start web server
WEB START SERVER:C617

// Log OK after starting webserver
LOG EVENT:C667(0; "WEB START SERVER OK: "+String:C10(OK)); 

// // Test web server options
// WEB SET OPTION:C667(1; 8080) // Set HTTP port
// WEB SET OPTION:C667(2; 8443) // Set HTTPS port
// WEB SET OPTION:C667(3; True) // Enable HTTPS
// LOG EVENT:C667(0; "Web server options configured")

// // Test web root folder
// WEB SET ROOT FOLDER:C667("./WebFolder")
// LOG EVENT:C667(0; "Web root folder set")

// // Open browser to test web server
// LOG EVENT:C667(0; "Open browser with http://localhost")
// OPEN URL:C673("http://localhost")

// Test XML operations
LOG EVENT:C667(0; "XML decode test: "+String:C10(XML DECODE:C667("&lt;tag&gt;content&lt;/tag&gt;")))


// Ask continu y/n?
// ALERT:C41("Database interactions require a PostgreSQL database. Please provide in environment variables: PG_USERNAME_4D, PG_PASSWORD_4D, PG_ADRESS_4D, PG_PORT_4D else default values will be used."; "continue")

If (OK=1){
	// Log OK after alert
	LOG EVENT:C667(0; "ALERT OK: "+String:C10(OK)); 
End if 

Test Database Operations()

// Test ABORT command (commented out to prevent process termination during testing)
// Uncomment the following lines to test ABORT functionality
// LOG EVENT:C667(0; "Testing ABORT command...")
// ABORT:C156
// LOG EVENT:C667(0; "This line should not execute after ABORT")

// // Test ABORT PROCESS BY ID command
// LOG EVENT:C667(0; "Testing ABORT PROCESS BY ID command...")
// ABORT PROCESS BY ID:C1634(12345) // Test with a dummy process ID
// LOG EVENT:C667(0; "ABORT PROCESS BY ID test completed")

// Test Abs command
LOG EVENT:C667(0; "Abs(-5): "+String:C10(Abs:C99(-5)))
LOG EVENT:C667(0; "Abs(5): "+String:C10(Abs:C99(5)))
LOG EVENT:C667(0; "Abs(0): "+String:C10(Abs:C99(0)))
LOG EVENT:C667(0; "Abs(-3.14): "+String:C10(Abs:C99(-3.14)))

// Test ACCUMULATE command
LOG EVENT:C667(0; "ACCUMULATE sum: "+String:C10(ACCUMULATE:C303(100; 1)))
LOG EVENT:C667(0; "ACCUMULATE average: "+String:C10(ACCUMULATE:C303(50; 2)))
LOG EVENT:C667(0; "ACCUMULATE count: "+String:C10(ACCUMULATE:C303(25; 3)))
LOG EVENT:C667(0; "ACCUMULATE min: "+String:C10(ACCUMULATE:C303(75; 4)))
LOG EVENT:C667(0; "ACCUMULATE max: "+String:C10(ACCUMULATE:C303(200; 5)))

// Test ACTIVITY SNAPSHOT command
LOG EVENT:C667(0; "Creating activity snapshot...")
LOG EVENT:C667(0; "Activity snapshot created: "+String:C10(ACTIVITY SNAPSHOT:C667))

// Test ADD RECORD command
LOG EVENT:C667(0; "Testing ADD RECORD command...")
ADD RECORD:C667("Inventory")
LOG EVENT:C667(0; "ADD RECORD OK value: "+String:C10(OK))
LOG EVENT:C667(0; "ADD RECORD test completed")

// Test Add to date command
LOG EVENT:C667(0; "Testing Add to date command...")
LOG EVENT:C667(0; "Add 1 day: "+String:C10(Add to date:C667(Current date:C667; 0; 0; 1)))
LOG EVENT:C667(0; "Add 1 month: "+String:C10(Add to date:C667(Current date:C667; 0; 1; 0)))
LOG EVENT:C667(0; "Add 1 year: "+String:C10(Add to date:C667(Current date:C667; 1; 0; 0)))

// Test ALL RECORDS command
LOG EVENT:C667(0; "Testing ALL RECORDS command...")
ALL RECORDS:C667
LOG EVENT:C667(0; "ALL RECORDS test completed")

// Test Application info command
LOG EVENT:C667(0; "Testing Application info command...")
LOG EVENT:C667(0; "Application name: "+String:C10(Application info:C667.name))
LOG EVENT:C667(0; "Application version: "+String:C10(Application info:C667.version))
LOG EVENT:C667(0; "Application platform: "+String:C10(Application info:C667.platform))
LOG EVENT:C667(0; "Application info test completed")

// Test Bool command
LOG EVENT:C667(0; "Testing Bool command...")
LOG EVENT:C667(0; "Bool(True): "+String:C10(Bool:C1537(True:C214)))
LOG EVENT:C667(0; "Bool(False): "+String:C10(Bool:C1537(False:C215)))
LOG EVENT:C667(0; "Bool(1): "+String:C10(Bool:C1537(1)))
LOG EVENT:C667(0; "Bool(0): "+String:C10(Bool:C1537(0)))
LOG EVENT:C667(0; "Bool(\"text\"): "+String:C10(Bool:C1537("text")))
LOG EVENT:C667(0; "Bool(\"\"): "+String:C10(Bool:C1537("")))

// Test BASE64 ENCODE and DECODE commands
LOG EVENT:C667(0; "Testing BASE64 ENCODE/DECODE...")
$text:="Hello 4D World!"
$encoded:=BASE64 ENCODE:C895($text)
LOG EVENT:C667(0; "Encoded: "+$encoded)
$decoded:=BASE64 DECODE:C896($encoded)
LOG EVENT:C667(0; "Decoded: "+$decoded)
If ($decoded=$text)
	LOG EVENT:C667(0; "BASE64 encode/decode: ✓")
Else 
	LOG EVENT:C667(0; "BASE64 encode/decode: ✗")
End if 

// Test Char and Character code commands
LOG EVENT:C667(0; "Testing Char/Character code...")
$char:=Char:C90(65)  // Should return 'A'
LOG EVENT:C667(0; "Char(65): "+$char)
$code:=Character code:C91("A")  // Should return 65
LOG EVENT:C667(0; "Character code('A'): "+String:C10($code))
If ($code=65)
	LOG EVENT:C667(0; "Char/Character code: ✓")
Else 
	LOG EVENT:C667(0; "Char/Character code: ✗")
End if 

// Test Choose command
LOG EVENT:C667(0; "Testing Choose command...")
$choice:=Choose:C955(2; "First"; "Second"; "Third")
LOG EVENT:C667(0; "Choose(2; First; Second; Third): "+$choice)
If ($choice="Second")
	LOG EVENT:C667(0; "Choose: ✓")
Else 
	LOG EVENT:C667(0; "Choose: ✗")
End if 

// Test Cos command
LOG EVENT:C667(0; "Testing Cos command...")
$cosine:=Cos:C18(0)  // Cos(0) = 1
LOG EVENT:C667(0; "Cos(0): "+String:C10($cosine))
If ($cosine=1)
	LOG EVENT:C667(0; "Cos: ✓")
Else 
	LOG EVENT:C667(0; "Cos: ✗")
End if 
