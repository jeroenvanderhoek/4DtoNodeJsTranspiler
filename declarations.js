// Contains an maps with definitions of variables and their default values

// Data Types	Database support(1)	Language support	var declaration	C_ or ARRAY declaration
// Alphanumeric	Yes	Converted to text	-	-
// Text	Yes	Yes	Text	C_TEXT, ARRAY TEXT
// Date	Yes	Yes	Date	C_DATE, ARRAY DATE
// Time	Yes	Yes	Time	C_TIME, ARRAY TIME
// Boolean	Yes	Yes	Boolean	C_BOOLEAN, ARRAY BOOLEAN
// Integer	Yes	Converted to longint	Integer	ARRAY INTEGER
// Longint	Yes	Yes	Integer	C_LONGINT, ARRAY LONGINT
// Longint 64 bits	Yes (SQL)	Converted to real	-	-
// Real	Yes	Yes	Real	C_REAL, ARRAY REAL
// Undefined	-	Yes	-	-
// Null	-	Yes	-	-
// Pointer	-	Yes	Pointer	C_POINTER, ARRAY POINTER
// Picture	Yes	Yes	Picture	C_PICTURE, ARRAY PICTURE
// BLOB	Yes	Yes	Blob, 4D.Blob	C_BLOB, ARRAY BLOB
// Object	Yes	Yes	Object	C_OBJECT, ARRAY OBJECT
// Collection	-	Yes	Collection	C_COLLECTION
// Variant(2)	-	Yes	Variant	C_VARIANT

// Type	Default value
// Boolean	False
// Date	00-00-00
// Integer	0
// Time	00:00:00
// Picture	picture size=0
// Real	0
// Pointer	Nil=true
// Text	""
// Blob	Blob size=0
// Object	null
// Collection	null
// Variant	undefined

// 4D Type    Declaration	Default value in JavaScript
export default {
    oldDeclarations: {
        "C_REAL:C285":  "0.00",
        "C_BOOLEAN:C305":   "false",
        "C_LONGINT:283":    "0",
        "C_TEXT:C284":  "\"\"",
        "C_TIME:C306":  "\"00:00:00\"",
        "C_DATE:C307":  "new Date(0,0,0)",
        "C_OBJECT:C1216":   "{}", 
        "C_POINTER:C301":   "{}", 
        "C_VARIANT:C1683":  "undefined", 
        "C_BLOB:C604":  "undefined", 
        "C_PICTURE:C286":   "undefined",
        "C_COLLECTION:C1488":   "{}",
        "ARRAY REAL:C219":  "[]",
        "ARRAY TIME:C1223": "[]",
        "ARRAY INTEGER:C220":   "[]",
        "ARRAY PICTURE:C279":   "[]",
        "ARRAY POINTER:C280":   "[]",
        "ARRAY OBJECT:C1221":   "[]",
        "ARRAY LONGINT:C221":   "[]",
        "ARRAY TEXT:C222":  "[]",
        "ARRAY BOOLEAN:C223":   "[]",
        "ARRAY BLOB:C1222": "[]",
    },
    newDeclarations: {
        "Integer": "0",
        "Boolean": "false",
        "Date": "new Date(0,0,0)",
        "Time": "\"00:00:00\"",
        "Picture": "undefined",
        "Real": "0",
        "Text": "\"\"",
        "Blob" : "undefined",
        "Object": "{}",	
        "Collection": "{}",
        "Variant": "undefined",
    }
};