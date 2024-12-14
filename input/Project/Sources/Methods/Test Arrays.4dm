//%attributes = {}
// Array

// FIXME 2D array test 

ARRAY TEXT:C222($asValues; 50)

// For loop
For ($vlElem; 1; 50)
	$asValues{$vlElem}:=String:C10($vlElem)+" Text in Array."
End for 

LOG EVENT:C667(0; $asValues{4})

LOG EVENT:C667(0; "Arrays valid: "+String:C10($asValues{4}="4 Text in Array."))