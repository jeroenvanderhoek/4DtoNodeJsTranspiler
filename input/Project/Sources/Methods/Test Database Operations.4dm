//%attributes = {}

Begin SQL
	CREATE TABLE IF NOT EXISTS Inventory (  
	id SERIAL PRIMARY KEY,
	description VARCHAR(100)NOT NULL,
	count VARCHAR(100)NOT NULL
	); 
End SQL

LOG EVENT:C667(0; "Table Inventory created ✓")