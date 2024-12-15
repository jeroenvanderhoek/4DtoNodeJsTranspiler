//%attributes = {}
// 0.3217505543966422
C_LONGINT:C283(x,y)
C_REAL:C285(z)

// Math
x:=1
y:=3
z:=Arctan:C20(x/y)

// Test
If (String:C10(z)="0.3217505543966422")
	LOG EVENT:C667(Into system standard outputs:K38:9; "Test Math: Arctan ("+String:C10(x)+"/"+String:C10(y)+") = "+String:C10(z)+": ✓ "+$1)
Else 
	LOG EVENT:C667(Into system standard outputs:K38:9; "Test Math: Arctan ("+String:C10(x)+"/"+String:C10(y)+") = "+String:C10(z)+": ✗ "+$1)
End if 



