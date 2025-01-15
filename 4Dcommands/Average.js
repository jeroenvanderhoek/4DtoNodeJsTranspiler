// 4D command: Average
// ( series {; attributePath} ) : Real = () => { }

// Average ( series {; attributePath} ) : Real

// Parameter	Type		Description
// series	Field, Array	→	Data for which to return the average
// attributePath	Text	→	Path of attribute for which to return the average
// Function result	Real	←	Arithmetic mean (average) of series

    // Example 1:
    //  vAverage:=Average([Employees] Salary)

// Example 3: 
// 
// // full_Data contains all data of the Customer table
// var $vAvg : Real
//  ALL RECORDS([Customer])
//  $vAvg:=Average([Customer]full_Data;"age")
//   //$vAvg is 44,46
 
//  var $vTot : Integer
//  $vTot:=Average([Customer]full_Data;"Children[].age") // JSON array 
//   //$vTot is 105

/**
 * @param processState
 * @param {*} $1 - field instance OR array OR array with json-object array
 * @param {String} [path] - path to the attribute if the array is an array of json-objects
 * @returns 
 */
export default function (processState,$1,path) {

    let total = 0;

    if ( path ) {

        // Path to JSON attribute
        $1.forEach(element => {
            total += element[path];
        });

    } else {

        if ( typeof $1[0] === 'number' ) {

            // This is an array with numbers
            $1.forEach(element => {
                total += element;
            });

        } else {

            // $1 is a Field instance with a Table-name 
            // Active selection can be retrieved from the processState
            // processState $1.table;
            let fieldInstance = $1;
            let tableInstance = processState[fieldInstance.table_name];
            // tableInstance.activeSelection has an active selection
            if ( tableInstance.activeSelection ) {
                tableInstance.activeSelection.forEach(element => {
                    total += element[$1.name].value;
                });
            }

        }

    }

    return total / array.length;
}
