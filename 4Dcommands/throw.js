// 4D command: throw
// Throws an error or exception
// throw ( error ) -> Function result
// Parameter		Type		Description
// error		String, Error		Error to throw
// Function result		Variant		Throws the error

export default function throw_error(processState, error) {
    // Convert error to proper Error object if it's a string
    if (typeof error === 'string') {
        throw new Error(error);
    }
    
    // If it's already an Error object, throw it directly
    if (error instanceof Error) {
        throw error;
    }
    
    // Convert other types to Error
    throw new Error(String(error));
}
