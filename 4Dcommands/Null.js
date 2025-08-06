// This 4D command is fixed and tested.
// 4D command: Null
// Returns the null value

export default function(processState) {
    return function Null() {
        processState.OK = 1;
        return null;
    };
};