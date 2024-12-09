C_LONGINT:C283(x,y)
C_REAL:C285(z)

x:=1
y:=3
z:=Arctan:C20(x/y)

LOG EVENT:C667(Into Windows log events:K38:4; "Arctan calculated: "+z)

ALERT:C41("Hello World!")