// This 4D command is fixed and tested.
// 4D command: True
// Returns the boolean value true
// Essential for boolean logic

export default function(processState) {
    return function True() {
        processState.OK = 1;
        return true;
    };
};