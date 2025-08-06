#!/usr/bin/env node

import onServerStartup from './Project/Sources/DatabaseMethods/onServerStartup.js';

// Create a processState object to simulate the 4D environment
const processState = {
    OK: 1,
    // Add other 4D global variables as needed
};

// Call the transpiled function
onServerStartup(processState); 