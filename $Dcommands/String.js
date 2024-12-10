// $D command: String

module.exports = function String(value,format,addTime) {    

    // FIXME apply format and addTime
    // String ( expression {; format {; addTime}} ) -> Function result 	
    // Parameter		Type		 		Description	
    // expression 		Expression		in		Expression for which to return the string form (can be Real, Integer, Long Integer, Date, Time String, Text, Boolean, Undefined, or Null)	
    // format 		String, Longint		in		Display format	
    // addTime 		Time		in		Time to add on if expression is a date	
    // Function result 		String		in		String form of the expression
    return value.toString();

};