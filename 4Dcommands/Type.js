// 4D command: Type
// Returns the data type of an expression
// Type ( expression ) -> Function result
// Parameter		Type		Description
// expression		Variant		Expression to check the type of
// Function result		Longint		Type code (1=Real, 2=Longint, 3=Text, 4=Boolean, 5=Date, 6=Time, 7=Picture, 8=BLOB, 9=Pointer, 10=Collection, 11=Object, 12=Undefined, 13=Null)

export default function Type(processState, expression) {
    // Handle null/undefined
    if (expression === null) {
        return 13; // Null
    }
    
    if (expression === undefined) {
        return 12; // Undefined
    }
    
    // Check type
    const type = typeof expression;
    
    switch (type) {
        case 'number':
            // Check if it's an integer
            if (Number.isInteger(expression)) {
                return 2; // Longint
            } else {
                return 1; // Real
            }
        case 'string':
            return 3; // Text
        case 'boolean':
            return 4; // Boolean
        case 'object':
            if (expression instanceof Date) {
                // Check if it has time component (hours, minutes, seconds, milliseconds)
                const hours = expression.getHours();
                const minutes = expression.getMinutes();
                const seconds = expression.getSeconds();
                const milliseconds = expression.getMilliseconds();
                
                if (hours === 0 && minutes === 0 && seconds === 0 && milliseconds === 0) {
                    return 5; // Date
                } else {
                    return 6; // Time
                }
            }
            if (Array.isArray(expression)) {
                return 10; // Collection
            }
            return 11; // Object
        default:
            return 12; // Undefined
    }
}
