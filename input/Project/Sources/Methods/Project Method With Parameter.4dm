//%attributes = {}
#DECLARE($str : Text)

If ($str="")
	LOG EVENT:C667(Into system standard outputs:K38:9; "Project method with parameter: ✗")
Else 
	LOG EVENT:C667(Into system standard outputs:K38:9; $str+": ✓ ")
End if 

// FIXME test with multiple parameters

// FIXME If (Length($str)>0)