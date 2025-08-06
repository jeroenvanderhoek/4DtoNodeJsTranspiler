#!/usr/bin/env node

import onServerStartup from './Project/Sources/DatabaseMethods/onServerStartup.js';

console.log("RUNNING TRANSPILED PROJECT:");
console.log("");
// The processState-object is passed to all functions and contains the state of the process like:
// selections, active record, webservers, OK, etc.
let processState = {
    webservers: [],
    OK: 1
};

// Install PostgreSQL and create your db https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
import pg from 'pg'
const { Pool } = pg;

let dbUsername = process.env.PG_USERNAME_4D || 'postgres';
let dbPassword = process.env.DB_PASSWORD_4D || 'your-password';
let dbDatabase = process.env.DB_DATABASE_4D || 'postgres';
let dbHost = process.env.DB_HOST_4D || 'localhost';
let dbPort = process.env.DB_PORT_4D || 5432;

processState.pool = new Pool({  
  user: dbUsername, 
  password: dbPassword,   
  host: dbHost,  
  database: dbDatabase,  
  port: dbPort,  
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});  

// Debug: Check if pool is set correctly
console.log('Database pool created:', !!processState.pool);
console.log('Database configuration:', { dbUsername, dbHost, dbPort, dbDatabase });

// Optional: Handle pool errors  
processState.pool.on('error', (err, client) => {  
  console.error('Could not connect to database: X', err);  
  process.exit(-1);  
});  

// Call the transpiled function
onServerStartup(processState); 