C_LONGINT:C283(x,y)
C_REAL:C285(z)

x:=1
y:=3
z:=Arctan:C20(x/y)

ALERT:C41("Warning this might blow your mind!"; "Continue")

LOG EVENT:C667(Into Windows log events:K38:4; "Arctan ("+String:C10(x)+"/"+String:C10(y)+") = "+String:C10(z))

Say Hello World Project Method
Project Method With Parameter("Project Method With Parameter")

ARRAY TEXT:C222($asValues; 50)
For ($vlElem; 1; 50)
	$asValues{$vlElem}:=String:C10($vlElem)+" Text in Array."
End for 

LOG EVENT:C667(0; $asValues{4})

TRACE:C157

WEB START SERVER:C617

OPEN URL:C673("http://localhost")
