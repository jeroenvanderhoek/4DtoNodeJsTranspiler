// $D command: APPEND TO ARRAY
// APPEND TO ARRAY ( array ; value )
// Parameter	Type		Description
// array	Array	→	Array to which an element will be appended
// value	Expression	→	Value to append
function apppendToArray (processState,array, value) {
    return array.push(value);

}

export default apppendToArray;