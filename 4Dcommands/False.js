// This 4D command is fixed and tested.
// 4D command: False
// Returns the boolean value false
// Essential for boolean logic in backend operations

export default function(processState) {
    return function False() {
        processState.OK = 1;
        return false;
    };
};