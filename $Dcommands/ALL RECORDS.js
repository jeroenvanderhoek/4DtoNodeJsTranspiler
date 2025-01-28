// $D command: ALL RECORDS
// ALL RECORDS {( aTable )}
// Parameter	Type		Description
// aTable	Table	→	Table for which to select all records, or Default table, if omitted FIXME WHATS THE DEFAULT TABLE???
Begin SQL
    SELECT * FROM $1; // FIXME This is not the correct implementation. FIXME this will select all fields?
End SQL