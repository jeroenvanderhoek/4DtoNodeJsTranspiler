// 4D command: Value type
// Returns the data type of a value
// Value type ( expression ) -> Function result
// Parameter		Type		Description
// expression		Variant		Expression to check the type of
// Function result		Longint		Type code (1=Real, 2=Longint, 3=Text, 4=Boolean, 5=Date, 6=Time, 7=Picture, 8=BLOB, 9=Pointer, 10=Collection, 11=Object, 12=Undefined, 13=Null)

// This is an alias for Type command
import Type from './Type.js';

export default function Value_type(processState, expression) {
    return Type(processState, expression);
}
