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
    oldDeclarations: [
        {name: "C_REAL:C285", value: "0.00"},
        {name: "C_BOOLEAN:C305", value: "false"},
        {name: 'C_LONGINT:C283', value: "0"},
        {name: "C_TEXT:C284", value: "\"\""},
        {name: "C_TIME:C306", value: "\"00:00:00\""},
        {name: "C_DATE:C307", value: "new Date(0,0,0)"},
        {name: "C_OBJECT:C1216", value: "{}"}, 
        {name: "C_POINTER:C301", value: "{}"}, 
        {name: "C_VARIANT:C1683", value: "undefined"}, 
        {name: "C_BLOB:C604", value: "undefined"}, 
        {name: "C_PICTURE:C286", value: "undefined"},
        {name: "C_COLLECTION:C1488", value: "{}"},
        {name: "ARRAY REAL:C219", value: "[]"},
        {name: "ARRAY TIME:C1223", value: "[]"},
        {name: "ARRAY INTEGER:C220", value: "[]"},
        {name: "ARRAY PICTURE:C279", value: "[]"},
        {name: "ARRAY POINTER:C280", value: "[]"},
        {name: "ARRAY OBJECT:C1221", value: "[]"},
        {name: "ARRAY LONGINT:C221", value: "[]"},
        {name: "ARRAY TEXT:C222", value: "[]"},
        {name: "ARRAY BOOLEAN:C223", value: "[]"},
        {name: "ARRAY BLOB:C1222", value: "[]"},
    ],
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