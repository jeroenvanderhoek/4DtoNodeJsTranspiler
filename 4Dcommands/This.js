// 4D command: This
// Returns the current object context
// This -> Function result
// Function result		Object		Current object context

export default function This(processState) {
    // In a backend context, return the processState as the current context
    return processState;
}
