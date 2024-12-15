//%attributes = {}
// Array

// FIXME 2D array test 
ARRAY TEXT:C222($asValues; 50)

// For loop
For ($vlElem; 1; 50)
	$asValues{$vlElem}:=String:C10($vlElem)+" Text in Array."
End for 

// Test
If (String:C10($asValues{4}="4 Text in Array."))
	LOG EVENT:C667(0; "Arrays, For loops, If Else End if: ✓")
Else 
	LOG EVENT:C667(0; "Arrays and For loops: ✗")
End if 