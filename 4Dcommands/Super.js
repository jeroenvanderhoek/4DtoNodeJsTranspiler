// 4D command: Super
// Returns the parent object context
// Super -> Function result
// Function result		Object		Parent object context

export default function Super(processState) {
    // In a backend context, return the parent processState or global context
    return processState.parent || globalThis;
}
