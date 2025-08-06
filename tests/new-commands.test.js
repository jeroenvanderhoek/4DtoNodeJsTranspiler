// Test file for newly implemented 4D commands
// This file tests the essential backend 4D commands we've implemented

import assert from 'assert';
import { describe, it } from 'mocha';
import fs from 'fs';
import path from 'path';

// Import our newly implemented commands
import Generate_UUID from '../4Dcommands/Generate UUID.js';
import Current_machine from '../4Dcommands/Current machine.js';
import Data_file from '../4Dcommands/Data file.js';
import WEB_SET_OPTION from '../4Dcommands/WEB SET OPTION.js';
import XML_DECODE from '../4Dcommands/XML DECODE.js';
import WEB_SET_ROOT_FOLDER from '../4Dcommands/WEB SET ROOT FOLDER.js';
import HTTP_Request from '../4Dcommands/HTTP Request.js';
import QUERY from '../4Dcommands/QUERY.js';
import Document_to_text from '../4Dcommands/Document to text.js';
import CREATE_RECORD from '../4Dcommands/CREATE RECORD.js';
import SAVE_RECORD from '../4Dcommands/SAVE RECORD.js';
import LOAD_RECORD from '../4Dcommands/LOAD RECORD.js';
import Replace_string from '../4Dcommands/Replace string.js';
import Insert_string from '../4Dcommands/Insert string.js';
import Create_document from '../4Dcommands/Create document.js';
import Num from '../4Dcommands/Num.js';
import Char from '../4Dcommands/Char.js';
import Random from '../4Dcommands/Random.js';
import FIRST_RECORD from '../4Dcommands/FIRST RECORD.js';
import NEXT_RECORD from '../4Dcommands/NEXT RECORD.js';
import Bool from '../4Dcommands/Bool.js';
import Field from '../4Dcommands/Field.js';

// Import new navigation and logic commands
import EOF from '../4Dcommands/EOF.js';
import BOF from '../4Dcommands/BOF.js';
import LAST_RECORD from '../4Dcommands/LAST RECORD.js';
import PREVIOUS_RECORD from '../4Dcommands/PREVIOUS RECORD.js';
import GOTO_RECORD from '../4Dcommands/GOTO RECORD.js';
import True from '../4Dcommands/True.js';
import False from '../4Dcommands/False.js';
import Choose from '../4Dcommands/Choose.js';
import Records_in_selection from '../4Dcommands/Records in selection.js';
import Records_in_table from '../4Dcommands/Records in table.js';

// Import new error handling and debugging commands
import ABORT from '../4Dcommands/ABORT.js';
import TRACE from '../4Dcommands/TRACE.js';
import ON_ERR_CALL from '../4Dcommands/ON ERR CALL.js';
import Last_errors from '../4Dcommands/Last errors.js';

// Import new database and file system commands
import DELETE_RECORD from '../4Dcommands/DELETE RECORD.js';
import MODIFY_RECORD from '../4Dcommands/MODIFY RECORD.js';
import CREATE_FOLDER from '../4Dcommands/CREATE FOLDER.js';
import COPY_DOCUMENT from '../4Dcommands/COPY DOCUMENT.js';
import DELETE_DOCUMENT from '../4Dcommands/DELETE DOCUMENT.js';
import START_TRANSACTION from '../4Dcommands/START TRANSACTION.js';

describe('Newly Implemented 4D Commands', () => {
    // Mock processState for testing
    const mockProcessState = {
        logs: [],
        uuidStats: null,
        machineInfo: null,
        dataFileInfo: null,
        webServerOptions: null,
        webServerOptionHistory: null,
        xmlDecodeStats: null,
        webServerConfigHistory: null,
        httpRequests: null,
        queryStats: null,
        fileOperations: null,
        database: null,
        recordStats: null,
        arrayOperations: null,
        stringOperations: null,
        conversionStats: null,
        characterOperations: null,
        randomOperations: null,
        navigationStats: null,
        booleanOperations: null,
        fieldOperations: null
    };

    describe('Generate UUID', () => {
        it('should return a valid UUID string', () => {
            const state = { ...mockProcessState, logs: [] };
            const uuid = Generate_UUID(state);
            
            assert(uuid);
            assert(typeof uuid === 'string');
            
            // Check UUID format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            assert(uuidRegex.test(uuid), `UUID should match standard format, got: ${uuid}`);
        });

        it('should generate unique UUIDs', () => {
            const state = { ...mockProcessState, logs: [] };
            const uuid1 = Generate_UUID(state);
            const uuid2 = Generate_UUID(state);
            
            assert.notStrictEqual(uuid1, uuid2, 'UUIDs should be unique');
        });

        it('should update UUID statistics', () => {
            const state = { ...mockProcessState, uuidStats: null };
            Generate_UUID(state);
            Generate_UUID(state);
            
            assert(state.uuidStats, 'Should create UUID stats');
            assert.strictEqual(state.uuidStats.generated, 2);
            assert.strictEqual(state.uuidStats.recent.length, 2);
            assert(state.uuidStats.lastGenerated instanceof Date);
        });

        it('should limit recent UUID history', () => {
            const state = { 
                ...mockProcessState,
                uuidStats: {
                    generated: 25,
                    lastGenerated: new Date(),
                    recent: new Array(25).fill(null).map(() => ({ uuid: 'test', timestamp: new Date() }))
                }
            };
            
            Generate_UUID(state);
            
            // Should limit to 20 entries (adds one then trims to 20)
            assert.strictEqual(state.uuidStats.recent.length, 20);
        });
    });

    describe('Current machine', () => {
        it('should return machine information object', () => {
            const state = { ...mockProcessState, logs: [] };
            const machineInfo = Current_machine(state);
            
            assert(machineInfo);
            assert(typeof machineInfo === 'object');
            
            // Check required properties
            assert(typeof machineInfo.hostname === 'string');
            assert(typeof machineInfo.platform === 'string');
            assert(typeof machineInfo.architecture === 'string');
            assert(typeof machineInfo.cpus === 'number');
            assert(typeof machineInfo.totalMemory === 'number');
            assert(typeof machineInfo.nodeVersion === 'string');
            assert(typeof machineInfo.pid === 'number');
        });

        it('should include user information', () => {
            const state = { ...mockProcessState, logs: [] };
            const machineInfo = Current_machine(state);
            
            assert(machineInfo.userInfo);
            assert(typeof machineInfo.userInfo.username === 'string');
            assert(typeof machineInfo.userInfo.homedir === 'string');
        });

        it('should cache machine information', () => {
            const state = { ...mockProcessState, machineInfo: null };
            Current_machine(state);
            Current_machine(state);
            
            assert(state.machineInfo, 'Should create machine info cache');
            assert.strictEqual(state.machineInfo.requestCount, 2);
            assert(state.machineInfo.lastUpdated instanceof Date);
        });

        it('should include network interfaces', () => {
            const state = { ...mockProcessState, logs: [] };
            const machineInfo = Current_machine(state);
            
            assert(Array.isArray(machineInfo.networkInterfaces));
            assert(machineInfo.networkInterfaces.length > 0, 'Should have at least one network interface');
        });
    });

    describe('Data file', () => {
        it('should return a data file path', () => {
            const state = { ...mockProcessState, logs: [] };
            const dataFilePath = Data_file(state);
            
            assert(dataFilePath);
            assert(typeof dataFilePath === 'string');
            assert(dataFilePath.length > 0);
        });

        it('should use database configuration if available', () => {
            const state = { 
                ...mockProcessState, 
                logs: [],
                database: {
                    dataFile: '/custom/path/to/database.4DD'
                }
            };
            const dataFilePath = Data_file(state);
            
            assert(dataFilePath.includes('database.4DD'));
        });

        it('should cache data file information', () => {
            const state = { ...mockProcessState, dataFileInfo: null };
            Data_file(state);
            Data_file(state);
            
            assert(state.dataFileInfo, 'Should create data file info cache');
            assert.strictEqual(state.dataFileInfo.accessCount, 2);
            assert(state.dataFileInfo.lastChecked instanceof Date);
        });
    });

    describe('WEB SET OPTION', () => {
        it('should set HTTP port option correctly', () => {
            const state = { ...mockProcessState, logs: [] };
            
            WEB_SET_OPTION(state, 1, 8080);
            
            assert(state.webServerOptions);
            assert.strictEqual(state.webServerOptions.httpPort, 8080);
            assert.strictEqual(state.logs.length, 1);
            assert.strictEqual(state.logs[0].source, 'WEB SET OPTION');
            assert.strictEqual(state.logs[0].level, 'INFO');
        });

        it('should set HTTPS port option correctly', () => {
            const state = { ...mockProcessState, logs: [] };
            
            WEB_SET_OPTION(state, 2, 8443);
            
            assert(state.webServerOptions);
            assert.strictEqual(state.webServerOptions.httpsPort, 8443);
        });

        it('should set boolean options correctly', () => {
            const state = { ...mockProcessState, logs: [] };
            
            WEB_SET_OPTION(state, 3, true); // Enable HTTPS
            WEB_SET_OPTION(state, 7, false); // Disable cache
            
            assert(state.webServerOptions);
            assert.strictEqual(state.webServerOptions.enableHttps, true);
            assert.strictEqual(state.webServerOptions.serverCache, false);
        });

        it('should validate port ranges', () => {
            const state = { ...mockProcessState, logs: [] };
            
            WEB_SET_OPTION(state, 1, 99999); // Invalid port
            
            // Should create webServerOptions but not set the invalid value
            // The function returns early on validation error but still logs
            assert(state.logs.some(log => log.level === 'WARN'));
        });

        it('should track option change history', () => {
            const state = { ...mockProcessState, logs: [] };
            
            WEB_SET_OPTION(state, 1, 80);
            WEB_SET_OPTION(state, 1, 8080);
            
            assert(state.webServerOptionHistory);
            assert.strictEqual(state.webServerOptionHistory.length, 2);
            assert.strictEqual(state.webServerOptionHistory[1].newValue, 8080);
            assert.strictEqual(state.webServerOptionHistory[1].oldValue, 80);
        });
    });

    describe('XML DECODE', () => {
        it('should decode basic XML entities', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const encoded = '&lt;tag&gt;content&amp;more&lt;/tag&gt;';
            const decoded = XML_DECODE(state, encoded);
            
            assert.strictEqual(decoded, '<tag>content&more</tag>');
            assert(state.xmlDecodeStats);
            assert.strictEqual(state.xmlDecodeStats.totalDecodes, 1);
        });

        it('should decode quotes and apostrophes', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const encoded = '&quot;Hello&quot; &apos;World&apos;';
            const decoded = XML_DECODE(state, encoded);
            
            assert.strictEqual(decoded, '"Hello" \'World\'');
        });

        it('should decode numeric character references', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const encoded = '&#65;&#66;&#67; &#x41;&#x42;&#x43;';
            const decoded = XML_DECODE(state, encoded);
            
            assert.strictEqual(decoded, 'ABC ABC');
        });

        it('should handle HTML entities when specified', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const encoded = '&nbsp;&copy;&reg;&trade;';
            const decoded = XML_DECODE(state, encoded, 'html');
            
            assert.strictEqual(decoded, ' ©®™');
        });

        it('should handle empty input', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(XML_DECODE(state, ''), '');
            assert.strictEqual(XML_DECODE(state, null), '');
        });

        it('should track decode statistics', () => {
            const state = { ...mockProcessState, logs: [] };
            
            XML_DECODE(state, '&lt;test&gt;');
            XML_DECODE(state, '&amp;data&amp;');
            
            assert(state.xmlDecodeStats);
            assert.strictEqual(state.xmlDecodeStats.totalDecodes, 2);
            assert.strictEqual(state.xmlDecodeStats.recentDecodes.length, 2);
            assert(state.xmlDecodeStats.lastDecoded instanceof Date);
        });
    });

    describe('WEB SET ROOT FOLDER', () => {
        it('should set HTML root folder correctly', () => {
            const state = { ...mockProcessState, logs: [] };
            
            WEB_SET_ROOT_FOLDER(state, './test-folder');
            
            assert(state.webServerOptions);
            assert(state.webServerOptions.htmlRootFolder.includes('test-folder'));
            assert(state.webServerConfigHistory);
            assert.strictEqual(state.webServerConfigHistory.length, 1);
        });

        it('should validate input parameters', () => {
            const state = { ...mockProcessState, logs: [] };
            
            WEB_SET_ROOT_FOLDER(state, ''); // Empty string
            WEB_SET_ROOT_FOLDER(state, null); // Null
            
            // Should not modify options for invalid input
            assert(!state.webServerOptions || state.webServerOptions.htmlRootFolder === './WebFolder');
        });

        it('should track configuration history', () => {
            const state = { ...mockProcessState, logs: [] };
            
            WEB_SET_ROOT_FOLDER(state, './folder1');
            WEB_SET_ROOT_FOLDER(state, './folder2');
            
            assert(state.webServerConfigHistory);
            assert.strictEqual(state.webServerConfigHistory.length, 2);
            assert.strictEqual(state.webServerConfigHistory[1].operation, 'SET_ROOT_FOLDER');
        });

        it('should warn about non-existent folders', () => {
            const state = { ...mockProcessState, logs: [] };
            
            WEB_SET_ROOT_FOLDER(state, './non-existent-folder-12345');
            
            assert(state.logs.some(log => log.level === 'WARN'));
        });
    });

    describe('HTTP Request', () => {
        it('should handle GET requests', async () => {
            const state = { ...mockProcessState, logs: [] };
            
            // Mock a simple response for testing
            // Note: In real tests, you'd mock axios or use a test server
            try {
                const response = await HTTP_Request(state, 'GET', 'https://httpbin.org/json');
                
                assert(state.httpRequests);
                assert.strictEqual(state.httpRequests.totalRequests, 1);
                assert(response.status > 0);
            } catch (error) {
                // Skip if network is unavailable
                console.log('Skipping HTTP test - network unavailable');
            }
        });

        it('should handle POST requests with content', async () => {
            const state = { ...mockProcessState, logs: [] };
            
            try {
                const response = await HTTP_Request(state, 'POST', 'https://httpbin.org/post', 
                    JSON.stringify({ test: 'data' }), null, ['Content-Type'], ['application/json']);
                
                assert(state.httpRequests);
                if (response.status > 0) {
                    assert(response.method === 'POST');
                    assert(response.data);
                }
            } catch (error) {
                console.log('Skipping HTTP POST test - network unavailable');
            }
        });

        it('should handle invalid URLs gracefully', async () => {
            const state = { ...mockProcessState, logs: [] };
            
            const response = await HTTP_Request(state, 'GET', 'invalid-url');
            
            assert.strictEqual(response.status, 0);
            assert(response.error);
            assert(state.httpRequests.failedRequests >= 1);
        });
    });

    describe('QUERY', () => {
        it('should query records with simple criteria', () => {
            const state = { 
                ...mockProcessState, 
                database: {
                    tables: {
                        'Users': {
                            name: 'Users',
                            records: [
                                { id: 1, name: 'John', age: 25 },
                                { id: 2, name: 'Jane', age: 30 },
                                { id: 3, name: 'Bob', age: 25 }
                            ],
                            fields: {},
                            currentRecord: null,
                            selection: [],
                            nextId: 4
                        }
                    }
                },
                defaultTable: 'Users',
                logs: []
            };
            
            const results = QUERY(state, 'Users', 'age', '=', 25);
            
            assert.strictEqual(results.length, 2);
            assert(state.queryStats);
            assert.strictEqual(state.queryStats.totalQueries, 1);
        });

        it('should handle no criteria (select all)', () => {
            const state = { 
                ...mockProcessState, 
                database: {
                    tables: {
                        'Users': {
                            name: 'Users',
                            records: [
                                { id: 1, name: 'John' },
                                { id: 2, name: 'Jane' }
                            ],
                            fields: {},
                            currentRecord: null,
                            selection: [],
                            nextId: 3
                        }
                    }
                },
                defaultTable: 'Users',
                logs: []
            };
            
            const results = QUERY(state, 'Users');
            
            assert.strictEqual(results.length, 2);
        });

        it('should handle string operations', () => {
            const state = { 
                ...mockProcessState, 
                database: {
                    tables: {
                        'Products': {
                            name: 'Products',
                            records: [
                                { id: 1, name: 'Apple iPhone', category: 'Electronics' },
                                { id: 2, name: 'Apple iPad', category: 'Electronics' },
                                { id: 3, name: 'Dell Laptop', category: 'Electronics' }
                            ],
                            fields: {},
                            currentRecord: null,
                            selection: [],
                            nextId: 4
                        }
                    }
                },
                defaultTable: 'Products',
                logs: []
            };
            
            const results = QUERY(state, 'Products', 'name', '@', 'Apple');
            
            assert.strictEqual(results.length, 2);
        });
    });

    describe('Document to text', () => {
        it('should read existing files', () => {
            const state = { ...mockProcessState, logs: [] };
            
            // Test reading package.json
            const content = Document_to_text(state, './package.json');
            
            assert(content.length > 0);
            assert(content.includes('4DtoNodeJsTranspiler'));
            assert(state.fileOperations);
            assert.strictEqual(state.fileOperations.successfulReads, 1);
        });

        it('should handle non-existent files', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const content = Document_to_text(state, './non-existent-file.txt');
            
            assert.strictEqual(content, '');
            assert(state.fileOperations);
            assert.strictEqual(state.fileOperations.failedReads, 1);
        });

        it('should handle different encodings', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const content = Document_to_text(state, './package.json', 'utf8');
            
            assert(content.length > 0);
            assert(content.includes('"name"'));
        });

        it('should track file operation statistics', () => {
            const state = { ...mockProcessState, logs: [] };
            
            Document_to_text(state, './package.json');
            Document_to_text(state, './README.md');
            
            assert(state.fileOperations);
            assert(state.fileOperations.totalReads >= 2);
            assert(state.fileOperations.recentOperations.length >= 1);
        });
    });

    describe('CREATE RECORD', () => {
        it('should create a new record in memory', () => {
            const state = { 
                ...mockProcessState, 
                defaultTable: 'Users',
                logs: [],
                database: {
                    tables: {},
                    schema: {
                        tables: {
                            'Users': {
                                fields: {
                                    name: { type: 'text', default: '' },
                                    age: { type: 'number', default: 0 }
                                }
                            }
                        }
                    }
                }
            };
            
            const newRecord = CREATE_RECORD(state, 'Users');
            
            assert(newRecord);
            assert.strictEqual(newRecord._isNew, true);
            assert.strictEqual(newRecord.name, '');
            assert.strictEqual(newRecord.age, 0);
            assert(state.recordStats);
            assert.strictEqual(state.recordStats.totalCreated, 1);
        });

        it('should initialize with default fields when no schema', () => {
            const state = { 
                ...mockProcessState, 
                defaultTable: 'Products',
                logs: []
            };
            
            const newRecord = CREATE_RECORD(state, 'Products');
            
            assert(newRecord);
            assert.strictEqual(newRecord._isNew, true);
            assert(newRecord.hasOwnProperty('name'));
            assert(newRecord.hasOwnProperty('description'));
        });

        it('should handle missing table gracefully', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = CREATE_RECORD(state);
            
            assert.strictEqual(result, null);
        });
    });

    describe('SAVE RECORD', () => {
        it('should save a new record to the table', () => {
            const state = { 
                ...mockProcessState, 
                defaultTable: 'Users',
                logs: [],
                database: {
                    tables: {
                        'Users': {
                            name: 'Users',
                            records: [],
                            fields: {},
                            currentRecord: {
                                _id: 1,
                                _isNew: true,
                                name: 'John Doe',
                                age: 30
                            },
                            selection: [],
                            nextId: 2,
                            newRecords: []
                        }
                    }
                }
            };
            
            const result = SAVE_RECORD(state, 'Users');
            
            assert.strictEqual(result, true);
            assert.strictEqual(state.database.tables['Users'].records.length, 1);
            assert.strictEqual(state.database.tables['Users'].records[0].name, 'John Doe');
            assert(state.recordStats);
            assert.strictEqual(state.recordStats.totalSaved, 1);
        });

        it('should update an existing record', () => {
            const existingRecord = { _id: 1, _isNew: false, name: 'Jane Doe', age: 25 };
            const state = { 
                ...mockProcessState, 
                defaultTable: 'Users',
                logs: [],
                database: {
                    tables: {
                        'Users': {
                            name: 'Users',
                            records: [existingRecord],
                            fields: {},
                            currentRecord: { ...existingRecord, age: 26 },
                            selection: [0],
                            nextId: 2,
                            newRecords: []
                        }
                    }
                }
            };
            
            const result = SAVE_RECORD(state, 'Users');
            
            assert.strictEqual(result, true);
            assert.strictEqual(state.database.tables['Users'].records[0].age, 26);
        });

        it('should handle no current record', () => {
            const state = { 
                ...mockProcessState, 
                defaultTable: 'Users',
                logs: [],
                database: {
                    tables: {
                        'Users': {
                            name: 'Users',
                            records: [],
                            currentRecord: null
                        }
                    }
                }
            };
            
            const result = SAVE_RECORD(state, 'Users');
            
            assert.strictEqual(result, false);
        });
    });

    describe('LOAD RECORD', () => {
        it('should load a record from current selection', () => {
            const testRecord = { _id: 1, name: 'John Doe', age: 30 };
            const state = { 
                ...mockProcessState, 
                defaultTable: 'Users',
                logs: [],
                database: {
                    tables: {
                        'Users': {
                            name: 'Users',
                            records: [testRecord],
                            selection: [0],
                            currentRecord: null
                        }
                    }
                }
            };
            
            const result = LOAD_RECORD(state, 'Users');
            
            assert.strictEqual(result, true);
            assert(state.database.tables['Users'].currentRecord);
            assert.strictEqual(state.database.tables['Users'].currentRecord.name, 'John Doe');
            assert(state.recordStats);
            assert.strictEqual(state.recordStats.totalLoaded, 1);
        });

        it('should handle empty selection', () => {
            const state = { 
                ...mockProcessState, 
                defaultTable: 'Users',
                logs: [],
                database: {
                    tables: {
                        'Users': {
                            name: 'Users',
                            records: [],
                            selection: [],
                            currentRecord: null
                        }
                    }
                }
            };
            
            const result = LOAD_RECORD(state, 'Users');
            
            assert.strictEqual(result, false);
        });

        it('should handle missing table', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = LOAD_RECORD(state, 'NonExistent');
            
            assert.strictEqual(result, false);
        });
    });

    describe('Replace string', () => {
        it('should replace all occurrences by default', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Replace_string(state, 'Hello world, Hello universe', 'Hello', 'Hi');
            
            assert.strictEqual(result, 'Hi world, Hi universe');
            assert(state.stringOperations);
            assert.strictEqual(state.stringOperations.totalOperations, 1);
        });

        it('should replace limited number of occurrences', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Replace_string(state, 'test test test test', 'test', 'exam', 2);
            
            assert.strictEqual(result, 'exam exam test test');
        });

        it('should handle special regex characters', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Replace_string(state, 'Price: $10.99', '$10.99', '$15.50');
            
            assert.strictEqual(result, 'Price: $15.50');
        });

        it('should handle empty old string gracefully', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Replace_string(state, 'Hello world', '', 'X');
            
            assert.strictEqual(result, 'Hello world');
        });

        it('should validate input types', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Replace_string(state, 123, 'old', 'new');
            
            assert.strictEqual(result, '');
        });
    });

    describe('Insert string', () => {
        it('should insert string at specified position', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Insert_string(state, 'Hello world', 'beautiful ', 7);
            
            assert.strictEqual(result, 'Hello beautiful world');
            assert(state.stringOperations);
            assert.strictEqual(state.stringOperations.totalOperations, 1);
        });

        it('should insert at beginning', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Insert_string(state, 'world', 'Hello ', 1);
            
            assert.strictEqual(result, 'Hello world');
        });

        it('should insert at end when position exceeds length', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Insert_string(state, 'Hello', ' world', 100);
            
            assert.strictEqual(result, 'Hello world');
        });

        it('should handle invalid position gracefully', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Insert_string(state, 'Hello', ' world', 0);
            
            assert.strictEqual(result, 'Hello');
        });

        it('should validate input types', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Insert_string(state, 123, 'text', 1);
            
            assert.strictEqual(result, '');
        });
    });

    describe('Create document', () => {
        it('should create a new document', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const docRef = Create_document(state, './test-file.txt');
            
            assert(docRef);
            assert(docRef.id);
            assert(docRef.path.endsWith('test-file.txt'));
            assert.strictEqual(docRef.isOpen, true);
            assert(state.fileOperations);
            assert.strictEqual(state.fileOperations.totalCreated, 1);
        });

        it('should add file extension when specified', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const docRef = Create_document(state, './test-file', 'log');
            
            assert(docRef);
            assert(docRef.path.endsWith('.log'));
            assert.strictEqual(docRef.fileType, '.log');
        });

        it('should handle invalid file name', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Create_document(state, '');
            
            assert.strictEqual(result, null);
        });

        it('should track open documents', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const docRef1 = Create_document(state, './file1.txt');
            const docRef2 = Create_document(state, './file2.log');
            
            assert.strictEqual(state.fileOperations.openDocuments.length, 2);
            assert.strictEqual(state.fileOperations.totalCreated, 2);
        });
    });

    describe('Num', () => {
        it('should convert string numbers to numeric values', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Num(state, '123'), 123);
            assert.strictEqual(Num(state, '45.67'), 45.67);
            assert.strictEqual(Num(state, '-89'), -89);
            assert(state.conversionStats);
            assert.strictEqual(state.conversionStats.totalConversions, 3);
        });

        it('should handle boolean values', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Num(state, 'true'), 1);
            assert.strictEqual(Num(state, 'false'), 0);
            assert.strictEqual(Num(state, 'TRUE'), 1);
        });

        it('should return 0 for invalid input', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Num(state, 'invalid'), 0);
            assert.strictEqual(Num(state, ''), 0);
            assert.strictEqual(Num(state, null), 0);
        });

        it('should return numbers as-is', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Num(state, 42), 42);
            assert.strictEqual(Num(state, 3.14), 3.14);
        });

        it('should clean non-numeric characters', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Num(state, '$123.45'), 123.45);
            assert.strictEqual(Num(state, '1,000.50'), 1000.50);
        });
    });

    describe('Char', () => {
        it('should convert character codes to characters', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Char(state, 65), 'A');
            assert.strictEqual(Char(state, 97), 'a');
            assert.strictEqual(Char(state, 48), '0');
            assert(state.characterOperations);
            assert.strictEqual(state.characterOperations.totalConversions, 3);
        });

        it('should handle special characters', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Char(state, 32), ' ');
            assert.strictEqual(Char(state, 10), '\n');
            assert.strictEqual(Char(state, 9), '\t');
        });

        it('should handle Unicode characters', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Char(state, 8364), '€');
            assert.strictEqual(Char(state, 169), '©');
        });

        it('should validate character code range', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Char(state, -1), '');
            assert.strictEqual(Char(state, 0x110000), '');
        });

        it('should handle invalid input types', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Char(state, 'invalid'), '');
        });
    });

    describe('Random', () => {
        it('should generate random numbers within range', () => {
            const state = { ...mockProcessState, logs: [] };
            
            for (let i = 0; i < 10; i++) {
                const result = Random(state, 100);
                assert(result >= 0 && result < 100);
                assert(Number.isInteger(result));
            }
            
            assert(state.randomOperations);
            assert.strictEqual(state.randomOperations.totalGenerations, 10);
        });

        it('should use default range when none specified', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Random(state);
            
            assert(result >= 0 && result < 32767);
            assert(Number.isInteger(result));
        });

        it('should handle invalid range values', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Random(state, -5);
            
            assert(result >= 0 && result < 32767);
        });

        it('should track range usage statistics', () => {
            const state = { ...mockProcessState, logs: [] };
            
            Random(state, 10);
            Random(state, 10);
            Random(state, 20);
            
            assert(state.randomOperations.rangeCounts);
            assert.strictEqual(state.randomOperations.rangeCounts[10], 2);
            assert.strictEqual(state.randomOperations.rangeCounts[20], 1);
        });

        it('should handle large ranges', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = Random(state, 2000000);
            
            assert(result >= 0 && result < 2000000);
            assert(Number.isInteger(result));
        });
    });

    describe('FIRST RECORD', () => {
        it('should move to first record in selection', () => {
            const testRecord = { _id: 1, name: 'John Doe', age: 30 };
            const state = { 
                ...mockProcessState, 
                defaultTable: 'Users',
                logs: [],
                database: {
                    tables: {
                        'Users': {
                            name: 'Users',
                            records: [testRecord, { _id: 2, name: 'Jane Doe', age: 25 }],
                            selection: [0, 1],
                            currentRecord: null,
                            currentRecordIndex: -1,
                            currentSelectionPosition: -1
                        }
                    }
                }
            };
            
            const result = FIRST_RECORD(state, 'Users');
            
            assert.strictEqual(result, true);
            assert(state.database.tables['Users'].currentRecord);
            assert.strictEqual(state.database.tables['Users'].currentRecord.name, 'John Doe');
            assert.strictEqual(state.database.tables['Users'].currentSelectionPosition, 0);
            assert(state.navigationStats);
            assert.strictEqual(state.navigationStats.firstRecordCalls, 1);
        });

        it('should handle empty selection', () => {
            const state = { 
                ...mockProcessState, 
                defaultTable: 'Users',
                logs: [],
                database: {
                    tables: {
                        'Users': {
                            name: 'Users',
                            records: [],
                            selection: [],
                            currentRecord: null
                        }
                    }
                }
            };
            
            const result = FIRST_RECORD(state, 'Users');
            
            assert.strictEqual(result, false);
            assert.strictEqual(state.database.tables['Users'].currentRecord, null);
        });

        it('should handle missing table', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const result = FIRST_RECORD(state, 'NonExistent');
            
            assert.strictEqual(result, false);
        });
    });

    describe('NEXT RECORD', () => {
        it('should move to next record in selection', () => {
            const records = [
                { _id: 1, name: 'John Doe', age: 30 },
                { _id: 2, name: 'Jane Doe', age: 25 },
                { _id: 3, name: 'Bob Smith', age: 35 }
            ];
            
            const state = { 
                ...mockProcessState, 
                defaultTable: 'Users',
                logs: [],
                database: {
                    tables: {
                        'Users': {
                            name: 'Users',
                            records: records,
                            selection: [0, 1, 2],
                            currentRecord: records[0],
                            currentRecordIndex: 0,
                            currentSelectionPosition: 0
                        }
                    }
                }
            };
            
            const result = NEXT_RECORD(state, 'Users');
            
            assert.strictEqual(result, true);
            assert(state.database.tables['Users'].currentRecord);
            assert.strictEqual(state.database.tables['Users'].currentRecord.name, 'Jane Doe');
            assert.strictEqual(state.database.tables['Users'].currentSelectionPosition, 1);
            assert(state.navigationStats);
            assert.strictEqual(state.navigationStats.nextRecordCalls, 1);
        });

        it('should handle end of selection', () => {
            const records = [{ _id: 1, name: 'John Doe', age: 30 }];
            
            const state = { 
                ...mockProcessState, 
                defaultTable: 'Users',
                logs: [],
                database: {
                    tables: {
                        'Users': {
                            name: 'Users',
                            records: records,
                            selection: [0],
                            currentRecord: records[0],
                            currentRecordIndex: 0,
                            currentSelectionPosition: 0
                        }
                    }
                }
            };
            
            const result = NEXT_RECORD(state, 'Users');
            
            assert.strictEqual(result, false);
            assert.strictEqual(state.database.tables['Users'].currentRecord, null);
            assert.strictEqual(state.database.tables['Users'].currentSelectionPosition, 1); // EOF position
        });

        it('should handle empty selection', () => {
            const state = { 
                ...mockProcessState, 
                defaultTable: 'Users',
                logs: [],
                database: {
                    tables: {
                        'Users': {
                            name: 'Users',
                            records: [],
                            selection: [],
                            currentRecord: null
                        }
                    }
                }
            };
            
            const result = NEXT_RECORD(state, 'Users');
            
            assert.strictEqual(result, false);
        });
    });

    describe('Bool', () => {
        it('should evaluate boolean values correctly', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Bool(state, true), true);
            assert.strictEqual(Bool(state, false), false);
            assert(state.booleanOperations);
            assert.strictEqual(state.booleanOperations.totalEvaluations, 2);
        });

        it('should evaluate numbers using 4D rules', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Bool(state, 0), false);
            assert.strictEqual(Bool(state, 1), true);
            assert.strictEqual(Bool(state, -1), true);
            assert.strictEqual(Bool(state, 3.14), true);
        });

        it('should evaluate strings using 4D rules', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Bool(state, ''), false);
            assert.strictEqual(Bool(state, 'hello'), true);
            assert.strictEqual(Bool(state, '0'), true); // Non-empty string is true
            assert.strictEqual(Bool(state, 'false'), true); // Non-empty string is true
        });

        it('should evaluate objects and arrays', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Bool(state, null), false);
            assert.strictEqual(Bool(state, []), false);
            assert.strictEqual(Bool(state, [1, 2, 3]), true);
            assert.strictEqual(Bool(state, {}), true);
            assert.strictEqual(Bool(state, { key: 'value' }), true);
        });

        it('should handle undefined and functions', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Bool(state, undefined), false);
            assert.strictEqual(Bool(state, function() {}), true);
        });
    });

    describe('Field', () => {
        it('should create field reference with valid parameters', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const fieldRef = Field(state, 1, 2);
            
            assert(fieldRef);
            assert.strictEqual(fieldRef.tableNumber, 1);
            assert.strictEqual(fieldRef.fieldNumber, 2);
            assert.strictEqual(fieldRef.tableName, 'Table_1');
            assert.strictEqual(fieldRef.fieldName, 'Field_2');
            assert.strictEqual(fieldRef.type, 'FieldReference');
            assert(state.fieldOperations);
            assert.strictEqual(state.fieldOperations.totalReferences, 1);
        });

        it('should provide field helper methods', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const fieldRef = Field(state, 1, 1);
            const testRecord = { Field_1: 'test value', _id: 1 };
            
            // Test getValue
            assert.strictEqual(fieldRef.getValue(testRecord), 'test value');
            
            // Test setValue
            const success = fieldRef.setValue(testRecord, 'new value');
            assert.strictEqual(success, true);
            assert.strictEqual(testRecord.Field_1, 'new value');
            assert.strictEqual(testRecord._modified, true);
            
            // Test exists
            assert.strictEqual(fieldRef.exists(testRecord), true);
            assert.strictEqual(fieldRef.exists({ other: 'field' }), false);
        });

        it('should validate input parameters', () => {
            const state = { ...mockProcessState, logs: [] };
            
            assert.strictEqual(Field(state, 0, 1), null);
            assert.strictEqual(Field(state, 1, 0), null);
            assert.strictEqual(Field(state, 'invalid', 1), null);
            assert.strictEqual(Field(state, 1, 'invalid'), null);
        });

        it('should create database schema automatically', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const fieldRef = Field(state, 5, 3);
            
            assert(state.database.schema.tables['Table_5']);
            assert.strictEqual(state.database.schema.tables['Table_5'].tableNumber, 5);
            assert(state.database.schema.tables['Table_5'].fields['Field_3']);
            assert.strictEqual(state.database.schema.tables['Table_5'].fields['Field_3'].fieldNumber, 3);
        });

        it('should handle field operations on records', () => {
            const state = { ...mockProcessState, logs: [] };
            
            const fieldRef = Field(state, 1, 1);
            
            // Test with null record
            assert.strictEqual(fieldRef.getValue(null), null);
            assert.strictEqual(fieldRef.setValue(null, 'value'), false);
            assert.strictEqual(fieldRef.exists(null), false);
        });
    });

    describe('Navigation Commands', () => {
        let state;

        beforeEach(() => {
            state = {
                logs: [],
                database: {
                    tables: {
                        'Users': {
                            records: [
                                { id: 1, name: 'Alice', email: 'alice@example.com' },
                                { id: 2, name: 'Bob', email: 'bob@example.com' },
                                { id: 3, name: 'Charlie', email: 'charlie@example.com' },
                                { id: 4, name: 'Diana', email: 'diana@example.com' }
                            ],
                            currentSelection: [
                                { id: 1, name: 'Alice', email: 'alice@example.com' },
                                { id: 2, name: 'Bob', email: 'bob@example.com' },
                                { id: 3, name: 'Charlie', email: 'charlie@example.com' }
                            ],
                            currentSelectionPosition: 0,
                            currentRecord: null
                        },
                        'EmptyTable': {
                            records: [],
                            currentSelection: [],
                            currentSelectionPosition: 0,
                            currentRecord: null
                        }
                    }
                }
            };
        });

        describe('EOF (End of File)', () => {
            it('should return true when at end of selection', () => {
                state.database.tables['Users'].currentSelectionPosition = 2; // Last position
                const result = EOF(state, 'Users');
                assert.strictEqual(result, true);
            });

            it('should return false when not at end of selection', () => {
                state.database.tables['Users'].currentSelectionPosition = 1; // Middle position
                const result = EOF(state, 'Users');
                assert.strictEqual(result, false);
            });

            it('should return true for empty selection', () => {
                const result = EOF(state, 'EmptyTable');
                assert.strictEqual(result, true);
            });

            it('should throw error for invalid table', () => {
                assert.throws(() => EOF(state, 'InvalidTable'), /Table 'InvalidTable' not found/);
            });

            it('should throw error for invalid tableName type', () => {
                assert.throws(() => EOF(state, 123), /tableName must be a valid string/);
            });
        });

        describe('BOF (Beginning of File)', () => {
            it('should return true when at beginning of selection', () => {
                state.database.tables['Users'].currentSelectionPosition = 0; // First position
                const result = BOF(state, 'Users');
                assert.strictEqual(result, true);
            });

            it('should return false when not at beginning of selection', () => {
                state.database.tables['Users'].currentSelectionPosition = 1; // Middle position
                const result = BOF(state, 'Users');
                assert.strictEqual(result, false);
            });

            it('should return true for empty selection', () => {
                const result = BOF(state, 'EmptyTable');
                assert.strictEqual(result, true);
            });

            it('should throw error for invalid table', () => {
                assert.throws(() => BOF(state, 'InvalidTable'), /Table 'InvalidTable' not found/);
            });
        });

        describe('LAST RECORD', () => {
            it('should move to last record in selection', () => {
                const result = LAST_RECORD(state, 'Users');
                assert.strictEqual(result, true);
                assert.strictEqual(state.database.tables['Users'].currentSelectionPosition, 2);
                assert.deepStrictEqual(state.database.tables['Users'].currentRecord, 
                    { id: 3, name: 'Charlie', email: 'charlie@example.com' });
            });

            it('should return false for empty selection', () => {
                const result = LAST_RECORD(state, 'EmptyTable');
                assert.strictEqual(result, false);
            });

            it('should throw error for invalid table', () => {
                assert.throws(() => LAST_RECORD(state, 'InvalidTable'), /Table 'InvalidTable' not found/);
            });
        });

        describe('PREVIOUS RECORD', () => {
            it('should move to previous record', () => {
                state.database.tables['Users'].currentSelectionPosition = 2; // Start at last position
                const result = PREVIOUS_RECORD(state, 'Users');
                assert.strictEqual(result, true);
                assert.strictEqual(state.database.tables['Users'].currentSelectionPosition, 1);
                assert.deepStrictEqual(state.database.tables['Users'].currentRecord, 
                    { id: 2, name: 'Bob', email: 'bob@example.com' });
            });

            it('should return false when at beginning', () => {
                state.database.tables['Users'].currentSelectionPosition = 0; // At beginning
                const result = PREVIOUS_RECORD(state, 'Users');
                assert.strictEqual(result, false);
            });

            it('should return false for empty selection', () => {
                const result = PREVIOUS_RECORD(state, 'EmptyTable');
                assert.strictEqual(result, false);
            });
        });

        describe('GOTO RECORD', () => {
            it('should move to specified record position', () => {
                const result = GOTO_RECORD(state, 'Users', 1);
                assert.strictEqual(result, true);
                assert.strictEqual(state.database.tables['Users'].currentSelectionPosition, 1);
                assert.deepStrictEqual(state.database.tables['Users'].currentRecord, 
                    { id: 2, name: 'Bob', email: 'bob@example.com' });
            });

            it('should return false for out of range position', () => {
                const result = GOTO_RECORD(state, 'Users', 5);
                assert.strictEqual(result, false);
            });

            it('should return false for empty selection', () => {
                const result = GOTO_RECORD(state, 'EmptyTable', 0);
                assert.strictEqual(result, false);
            });

            it('should throw error for negative position', () => {
                assert.throws(() => GOTO_RECORD(state, 'Users', -1), /recordNumber must be a non-negative number/);
            });
        });

        describe('Records in selection', () => {
            it('should return correct count for selection', () => {
                const result = Records_in_selection(state, 'Users');
                assert.strictEqual(result, 3);
            });

            it('should return 0 for empty selection', () => {
                const result = Records_in_selection(state, 'EmptyTable');
                assert.strictEqual(result, 0);
            });

            it('should throw error for invalid table', () => {
                assert.throws(() => Records_in_selection(state, 'InvalidTable'), /Table 'InvalidTable' not found/);
            });
        });

        describe('Records in table', () => {
            it('should return correct count for table', () => {
                const result = Records_in_table(state, 'Users');
                assert.strictEqual(result, 4);
            });

            it('should return 0 for empty table', () => {
                const result = Records_in_table(state, 'EmptyTable');
                assert.strictEqual(result, 0);
            });

            it('should throw error for invalid table', () => {
                assert.throws(() => Records_in_table(state, 'InvalidTable'), /Table 'InvalidTable' not found/);
            });
        });
    });

    describe('Boolean Logic Commands', () => {
        let state;

        beforeEach(() => {
            state = {
                logs: [],
                booleanOperations: {
                    totalEvaluations: 0,
                    trueResults: 0,
                    falseResults: 0,
                    lastEvaluation: null,
                    recentEvaluations: []
                }
            };
        });

        describe('True', () => {
            it('should return true', () => {
                const result = True(state);
                assert.strictEqual(result, true);
            });

            it('should update statistics', () => {
                True(state);
                assert.strictEqual(state.booleanOperations.totalEvaluations, 1);
                assert.strictEqual(state.booleanOperations.trueResults, 1);
                assert.strictEqual(state.booleanOperations.falseResults, 0);
            });

            it('should throw error for missing processState', () => {
                assert.throws(() => True(null), /processState is required/);
            });
        });

        describe('False', () => {
            it('should return false', () => {
                const result = False(state);
                assert.strictEqual(result, false);
            });

            it('should update statistics', () => {
                False(state);
                assert.strictEqual(state.booleanOperations.totalEvaluations, 1);
                assert.strictEqual(state.booleanOperations.trueResults, 0);
                assert.strictEqual(state.booleanOperations.falseResults, 1);
            });

            it('should throw error for missing processState', () => {
                assert.throws(() => False(null), /processState is required/);
            });
        });
    });

    describe('Choose Function', () => {
        let state;

        beforeEach(() => {
            state = {
                logs: [],
                chooseStats: {
                    totalChoices: 0,
                    validChoices: 0,
                    invalidChoices: 0,
                    lastChoice: null,
                    recentChoices: []
                }
            };
        });

        it('should return correct expression for valid index', () => {
            const result = Choose(state, 2, 'apple', 'banana', 'cherry');
            assert.strictEqual(result, 'banana');
        });

        it('should return null for out of range index', () => {
            const result = Choose(state, 5, 'apple', 'banana', 'cherry');
            assert.strictEqual(result, null);
        });

        it('should handle single expression', () => {
            const result = Choose(state, 1, 'apple');
            assert.strictEqual(result, 'apple');
        });

        it('should handle different data types', () => {
            const result = Choose(state, 3, 'string', 42, true, [1, 2, 3]);
            assert.strictEqual(result, true);
        });

        it('should throw error for invalid index type', () => {
            assert.throws(() => Choose(state, 'invalid', 'apple', 'banana'), /index must be a positive number/);
        });

        it('should throw error for negative index', () => {
            assert.throws(() => Choose(state, -1, 'apple', 'banana'), /index must be a positive number/);
        });

        it('should throw error for zero index', () => {
            assert.throws(() => Choose(state, 0, 'apple', 'banana'), /index must be a positive number/);
        });

        it('should throw error for no expressions', () => {
            assert.throws(() => Choose(state, 1), /at least one expression is required/);
        });

        it('should update statistics correctly', () => {
            Choose(state, 2, 'apple', 'banana', 'cherry'); // Valid choice
            Choose(state, 5, 'apple', 'banana', 'cherry'); // Invalid choice
            
            assert.strictEqual(state.chooseStats.totalChoices, 2);
            assert.strictEqual(state.chooseStats.validChoices, 1);
            assert.strictEqual(state.chooseStats.invalidChoices, 1);
        });
    });

    describe('Integration Tests', () => {
        it('should work together for complete backend setup', () => {
            const state = { ...mockProcessState, logs: [] };
            
            // Generate a UUID for session tracking
            const sessionId = Generate_UUID(state);
            assert(sessionId);
            
            // Get machine info for logging
            const machineInfo = Current_machine(state);
            assert(machineInfo.hostname);
            
            // Set up web server
            WEB_SET_OPTION(state, 1, 8080); // HTTP port
            WEB_SET_OPTION(state, 3, false); // Disable HTTPS
            WEB_SET_ROOT_FOLDER(state, './WebFolder');
            
            // Get data file path
            const dataPath = Data_file(state);
            assert(dataPath);
            
            // Process some XML content
            const xmlContent = '&lt;user id=&quot;' + sessionId + '&quot;&gt;Test User&lt;/user&gt;';
            const decodedXml = XML_DECODE(state, xmlContent);
            assert(decodedXml.includes(sessionId));
            
            // Verify all operations were logged
            assert(state.logs.length >= 5);
            assert(state.uuidStats.generated >= 1);
            assert(state.machineInfo.requestCount >= 1);
            assert(state.webServerOptions.httpPort === 8080);
            assert(state.xmlDecodeStats.totalDecodes >= 1);
        });
    });

    describe('Error Handling and Debugging Commands', () => {
        describe('ABORT Command', () => {
            let state;

            beforeEach(() => {
                state = {
                    logs: [],
                    processId: 'test-process-123',
                    abortStats: {
                        totalAborts: 0,
                        lastAbort: null,
                        abortedProcesses: []
                    }
                };
            });

            it('should throw abort error when called', () => {
                assert.throws(() => ABORT(state), /ABORT: Process terminated by ABORT command/);
            });

            it('should update abort statistics', () => {
                try {
                    ABORT(state);
                } catch (error) {
                    // Expected to throw
                }
                
                assert.strictEqual(state.abortStats.totalAborts, 1);
                assert(state.abortStats.lastAbort);
                assert.strictEqual(state.abortStats.abortedProcesses.length, 1);
            });

            it('should log abort event', () => {
                try {
                    ABORT(state);
                } catch (error) {
                    // Expected to throw
                }
                
                assert(state.logs.length > 0);
                const abortLog = state.logs.find(log => log.command === 'ABORT');
                assert(abortLog);
                assert.strictEqual(abortLog.level, 'WARN');
            });

            it('should throw error for null processState', () => {
                assert.throws(() => ABORT(null), /processState is required/);
            });
        });

        describe('TRACE Command', () => {
            let state;

            beforeEach(() => {
                state = {
                    logs: [],
                    traceStats: {
                        enabled: false,
                        totalTraces: 0,
                        lastTraceToggle: null,
                        traceHistory: []
                    }
                };
            });

            it('should enable trace mode', () => {
                TRACE(state, true);
                
                assert.strictEqual(state.traceStats.enabled, true);
                assert.strictEqual(state.traceStats.totalTraces, 1);
                assert(state.traceStats.lastTraceToggle);
            });

            it('should disable trace mode', () => {
                TRACE(state, true); // Enable first
                TRACE(state, false); // Then disable
                
                assert.strictEqual(state.traceStats.enabled, false);
                assert.strictEqual(state.traceStats.totalTraces, 2);
            });

            it('should maintain trace history', () => {
                TRACE(state, true);
                TRACE(state, false);
                TRACE(state, true);
                
                assert.strictEqual(state.traceStats.traceHistory.length, 3);
                assert.strictEqual(state.traceStats.traceHistory[0].action, 'ENABLED');
                assert.strictEqual(state.traceStats.traceHistory[1].action, 'DISABLED');
                assert.strictEqual(state.traceStats.traceHistory[2].action, 'ENABLED');
            });

            it('should throw error for invalid parameter type', () => {
                assert.throws(() => TRACE(state, 'invalid'), /enableTrace parameter must be a boolean/);
            });

            it('should throw error for null processState', () => {
                assert.throws(() => TRACE(null, true), /processState is required/);
            });
        });

        describe('ON ERR CALL Command', () => {
            let state;

            beforeEach(() => {
                state = {
                    logs: [],
                    errorHandlingStats: {
                        errorHandler: null,
                        totalErrors: 0,
                        lastError: null,
                        errorHistory: [],
                        handlerChanges: []
                    }
                };
            });

            it('should set error handler', () => {
                ON_ERR_CALL(state, 'handleError');
                
                assert.strictEqual(state.errorHandlingStats.errorHandler, 'handleError');
                assert.strictEqual(state.errorHandlingStats.handlerChanges.length, 1);
            });

            it('should update handler when changed', () => {
                ON_ERR_CALL(state, 'handleError1');
                ON_ERR_CALL(state, 'handleError2');
                
                assert.strictEqual(state.errorHandlingStats.errorHandler, 'handleError2');
                assert.strictEqual(state.errorHandlingStats.handlerChanges.length, 2);
                assert.strictEqual(state.errorHandlingStats.handlerChanges[0].newHandler, 'handleError1');
                assert.strictEqual(state.errorHandlingStats.handlerChanges[1].newHandler, 'handleError2');
            });

            it('should throw error for invalid method name', () => {
                assert.throws(() => ON_ERR_CALL(state, ''), /methodName parameter must be a non-empty string/);
                assert.throws(() => ON_ERR_CALL(state, null), /methodName parameter must be a non-empty string/);
                assert.throws(() => ON_ERR_CALL(state, 123), /methodName parameter must be a non-empty string/);
            });

            it('should throw error for null processState', () => {
                assert.throws(() => ON_ERR_CALL(null, 'handleError'), /processState is required/);
            });
        });

        describe('Last errors Command', () => {
            let state;

            beforeEach(() => {
                state = {
                    logs: [],
                    errorHandlingStats: {
                        errorHandler: null,
                        totalErrors: 0,
                        lastError: null,
                        errorHistory: [],
                        handlerChanges: []
                    }
                };
            });

            it('should return null when no errors occurred', () => {
                const result = Last_errors(state);
                assert.strictEqual(result, null);
            });

            it('should return error information when errors exist', () => {
                // Simulate an error
                state.errorHandlingStats.lastError = {
                    errorCode: 1001,
                    errorMessage: 'Test error',
                    errorMethod: 'testMethod',
                    errorLine: 42,
                    errorColumn: 10,
                    timestamp: '2023-01-01T00:00:00.000Z',
                    stack: 'Error: Test error\n    at testMethod'
                };
                state.errorHandlingStats.totalErrors = 5;

                const result = Last_errors(state);
                
                assert(result);
                assert.strictEqual(result.errorCode, 1001);
                assert.strictEqual(result.errorMessage, 'Test error');
                assert.strictEqual(result.errorMethod, 'testMethod');
                assert.strictEqual(result.errorLine, 42);
                assert.strictEqual(result.errorColumn, 10);
                assert.strictEqual(result.totalErrors, 5);
            });

            it('should handle missing error properties gracefully', () => {
                state.errorHandlingStats.lastError = {};

                const result = Last_errors(state);
                
                assert(result);
                assert.strictEqual(result.errorCode, 0);
                assert.strictEqual(result.errorMessage, '');
                assert.strictEqual(result.errorMethod, '');
                assert.strictEqual(result.errorLine, 0);
                assert.strictEqual(result.errorColumn, 0);
            });

            it('should throw error for null processState', () => {
                assert.throws(() => Last_errors(null), /processState is required/);
            });
        });

        describe('Error Handling Integration', () => {
            it('should work together for complete error handling setup', () => {
                const state = {
                    logs: [],
                    processId: 'test-process-456',
                    errorHandlingStats: {
                        errorHandler: null,
                        totalErrors: 0,
                        lastError: null,
                        errorHistory: [],
                        handlerChanges: []
                    },
                    traceStats: {
                        enabled: false,
                        totalTraces: 0,
                        lastTraceToggle: null,
                        traceHistory: []
                    },
                    abortStats: {
                        totalAborts: 0,
                        lastAbort: null,
                        abortedProcesses: []
                    }
                };

                // Set up error handling
                ON_ERR_CALL(state, 'globalErrorHandler');
                assert.strictEqual(state.errorHandlingStats.errorHandler, 'globalErrorHandler');

                // Enable trace mode
                TRACE(state, true);
                assert.strictEqual(state.traceStats.enabled, true);

                // Simulate an error
                state.errorHandlingStats.lastError = {
                    errorCode: 2001,
                    errorMessage: 'Integration test error',
                    errorMethod: 'integrationTest',
                    timestamp: new Date().toISOString()
                };
                state.errorHandlingStats.totalErrors = 1;

                // Get error information
                const errorInfo = Last_errors(state);
                assert.strictEqual(errorInfo.errorCode, 2001);
                assert.strictEqual(errorInfo.errorMessage, 'Integration test error');

                // Verify all operations were logged
                assert(state.logs.length >= 3);
                assert(state.errorHandlingStats.handlerChanges.length >= 1);
                assert(state.traceStats.traceHistory.length >= 1);
            });
        });
    });

    describe('Database Operations Commands', () => {
        let state;
        beforeEach(() => {
            state = {
                logs: [],
                database: {
                    tables: {
                        'users': {
                            name: 'users',
                            records: [
                                { _id: 1, name: 'John', email: 'john@example.com', _isNew: false, _modified: false },
                                { _id: 2, name: 'Jane', email: 'jane@example.com', _isNew: false, _modified: false },
                                { _id: 3, name: 'Bob', email: 'bob@example.com', _isNew: false, _modified: false }
                            ],
                            currentRecord: { _id: 1, name: 'John', email: 'john@example.com', _isNew: false, _modified: false },
                            selection: [
                                { _id: 1, name: 'John', email: 'john@example.com', _isNew: false, _modified: false },
                                { _id: 2, name: 'Jane', email: 'jane@example.com', _isNew: false, _modified: false },
                                { _id: 3, name: 'Bob', email: 'bob@example.com', _isNew: false, _modified: false }
                            ],
                            newRecords: [],
                            nextId: 4
                        }
                    },
                    currentSelection: {},
                    schema: { tables: {} },
                    defaultTable: 'users',
                    recordHistory: []
                },
                defaultTable: 'users',
                deleteStats: {
                    totalDeleted: 0,
                    totalFailed: 0,
                    lastDeleted: null,
                    recentOperations: [],
                    deletedRecords: []
                },
                modifyStats: {
                    totalModified: 0,
                    totalFailed: 0,
                    lastModified: null,
                    recentOperations: [],
                    modifiedRecords: []
                },
                transactionStats: {
                    totalStarted: 0,
                    totalCommitted: 0,
                    totalRolledBack: 0,
                    totalFailed: 0,
                    activeTransactions: [],
                    recentTransactions: [],
                    lastTransaction: null
                }
            };
        });

        describe('DELETE RECORD', () => {
            it('should delete the current record successfully', () => {
                const result = DELETE_RECORD(state, 'users');
                
                assert.strictEqual(result, true);
                assert.strictEqual(state.database.tables.users.records.length, 2);
                assert.strictEqual(state.deleteStats.totalDeleted, 1);
                assert(state.logs.length > 0);
            });

            it('should throw error when no current record exists', () => {
                state.database.tables.users.currentRecord = null;
                
                assert.throws(() => DELETE_RECORD(state, 'users'), /No current record in table 'users' to delete/);
                assert.strictEqual(state.deleteStats.totalFailed, 1);
            });

            it('should throw error when table does not exist', () => {
                assert.throws(() => DELETE_RECORD(state, 'nonexistent'), /Table 'nonexistent' does not exist/);
            });

            it('should throw error for null processState', () => {
                assert.throws(() => DELETE_RECORD(null, 'users'), /processState is required/);
            });

            it('should handle locked records', () => {
                state.database.tables.users.currentRecord._locked = true;
                
                assert.throws(() => DELETE_RECORD(state, 'users'), /Record 1 is locked and cannot be deleted/);
            });
        });

        describe('MODIFY RECORD', () => {
            it('should mark current record as modified successfully', () => {
                const result = MODIFY_RECORD(state, 'users');
                
                assert.strictEqual(result, true);
                assert.strictEqual(state.database.tables.users.currentRecord._modified, true);
                assert(state.database.tables.users.currentRecord._modifiedAt);
                assert.strictEqual(state.modifyStats.totalModified, 1);
                assert(state.logs.length > 0);
            });

            it('should throw error when no current record exists', () => {
                state.database.tables.users.currentRecord = null;
                
                assert.throws(() => MODIFY_RECORD(state, 'users'), /No current record in table 'users' to modify/);
                assert.strictEqual(state.modifyStats.totalFailed, 1);
            });

            it('should throw error when table does not exist', () => {
                assert.throws(() => MODIFY_RECORD(state, 'nonexistent'), /Table 'nonexistent' does not exist/);
            });

            it('should throw error for null processState', () => {
                assert.throws(() => MODIFY_RECORD(null, 'users'), /processState is required/);
            });

            it('should handle locked records', () => {
                state.database.tables.users.currentRecord._locked = true;
                
                assert.throws(() => MODIFY_RECORD(state, 'users'), /Record 1 is locked and cannot be modified/);
            });
        });

        describe('START TRANSACTION', () => {
            it('should start a new transaction successfully', () => {
                const result = START_TRANSACTION(state);
                
                assert(result);
                assert(result.id);
                assert.strictEqual(result.status, 'ACTIVE');
                assert.strictEqual(state.transactionStats.totalStarted, 1);
                assert.strictEqual(state.transactionStats.activeTransactions.length, 1);
                assert(state.logs.length > 0);
            });

            it('should handle nested transactions', () => {
                const tx1 = START_TRANSACTION(state);
                const tx2 = START_TRANSACTION(state);
                
                assert.strictEqual(state.transactionStats.activeTransactions.length, 2);
                assert.notStrictEqual(tx1.id, tx2.id);
            });

            it('should throw error for null processState', () => {
                assert.throws(() => START_TRANSACTION(null), /processState is required/);
            });

            it('should initialize transaction state in database', () => {
                START_TRANSACTION(state);
                
                assert(state.database.transactionState);
                assert(state.database.transactionState.currentTransaction);
                assert(state.database.transactionState.pendingChanges);
                assert(state.database.transactionState.originalStates);
            });
        });
    });

    describe('File System Commands', () => {
        let state;
        beforeEach(() => {
            state = {
                logs: [],
                folderStats: null,
                copyStats: null,
                deleteDocumentStats: null
            };
        });

        describe('CREATE FOLDER', () => {
            it('should create a new folder successfully', () => {
                const testPath = './test-folder-' + Date.now();
                
                try {
                    const result = CREATE_FOLDER(state, testPath);
                    
                    assert(result);
                    assert.strictEqual(result.path, path.resolve(testPath));
                    assert.strictEqual(result.name, path.basename(testPath));
                    assert.strictEqual(state.folderStats.totalCreated, 1);
                    assert(state.logs.length > 0);
                    
                    // Cleanup
                    fs.rmdirSync(testPath);
                } catch (error) {
                    // Cleanup if test failed
                    if (fs.existsSync(testPath)) {
                        fs.rmdirSync(testPath);
                    }
                    throw error;
                }
            });

            it('should throw error when folder already exists', () => {
                const testPath = './test-folder-' + Date.now();
                
                try {
                    CREATE_FOLDER(state, testPath);
                    assert.throws(() => CREATE_FOLDER(state, testPath), /already exists/);
                    
                    // Cleanup
                    fs.rmdirSync(testPath);
                } catch (error) {
                    // Cleanup if test failed
                    if (fs.existsSync(testPath)) {
                        fs.rmdirSync(testPath);
                    }
                    throw error;
                }
            });

            it('should throw error for invalid path', () => {
                assert.throws(() => CREATE_FOLDER(state, ''), /folderPath parameter must be a non-empty string/);
                assert.throws(() => CREATE_FOLDER(state, null), /folderPath parameter must be a non-empty string/);
            });

            it('should throw error for null processState', () => {
                assert.throws(() => CREATE_FOLDER(null, './test'), /processState is required/);
            });
        });

        describe('COPY DOCUMENT', () => {
            it('should copy a document successfully', () => {
                const sourcePath = './test-source-' + Date.now() + '.txt';
                const destPath = './test-dest-' + Date.now() + '.txt';
                
                try {
                    // Create test file
                    fs.writeFileSync(sourcePath, 'test content');
                    
                    const result = COPY_DOCUMENT(state, sourcePath, destPath);
                    
                    assert(result);
                    assert.strictEqual(result.sourcePath, path.resolve(sourcePath));
                    assert.strictEqual(result.destinationPath, path.resolve(destPath));
                    assert.strictEqual(state.copyStats.totalCopied, 1);
                    assert(state.logs.length > 0);
                    
                    // Cleanup
                    fs.unlinkSync(sourcePath);
                    fs.unlinkSync(destPath);
                } catch (error) {
                    // Cleanup if test failed
                    if (fs.existsSync(sourcePath)) fs.unlinkSync(sourcePath);
                    if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
                    throw error;
                }
            });

            it('should throw error when source file does not exist', () => {
                assert.throws(() => COPY_DOCUMENT(state, './nonexistent.txt', './dest.txt'), /does not exist/);
            });

            it('should throw error when source is not a file', () => {
                const testDir = './test-dir-' + Date.now();
                
                try {
                    fs.mkdirSync(testDir);
                    assert.throws(() => COPY_DOCUMENT(state, testDir, './dest.txt'), /is not a file/);
                    
                    // Cleanup
                    fs.rmdirSync(testDir);
                } catch (error) {
                    if (fs.existsSync(testDir)) fs.rmdirSync(testDir);
                    throw error;
                }
            });

            it('should throw error for invalid parameters', () => {
                assert.throws(() => COPY_DOCUMENT(state, '', './dest.txt'), /sourcePath parameter must be a non-empty string/);
                assert.throws(() => COPY_DOCUMENT(state, './source.txt', ''), /destinationPath parameter must be a non-empty string/);
            });

            it('should throw error for null processState', () => {
                assert.throws(() => COPY_DOCUMENT(null, './source.txt', './dest.txt'), /processState is required/);
            });
        });

        describe('DELETE DOCUMENT', () => {
            it('should delete a document successfully', () => {
                const testPath = './test-delete-' + Date.now() + '.txt';
                
                try {
                    // Create test file
                    fs.writeFileSync(testPath, 'test content');
                    
                    const result = DELETE_DOCUMENT(state, testPath);
                    
                    assert(result);
                    assert.strictEqual(result.path, path.resolve(testPath));
                    assert.strictEqual(result.name, path.basename(testPath));
                    assert.strictEqual(state.deleteDocumentStats.totalDeleted, 1);
                    assert(state.logs.length > 0);
                    assert(!fs.existsSync(testPath));
                } catch (error) {
                    // Cleanup if test failed
                    if (fs.existsSync(testPath)) fs.unlinkSync(testPath);
                    throw error;
                }
            });

            it('should throw error when file does not exist', () => {
                assert.throws(() => DELETE_DOCUMENT(state, './nonexistent.txt'), /does not exist/);
            });

            it('should throw error when path is not a file', () => {
                const testDir = './test-dir-' + Date.now();
                
                try {
                    fs.mkdirSync(testDir);
                    assert.throws(() => DELETE_DOCUMENT(state, testDir), /is not a file/);
                    
                    // Cleanup
                    fs.rmdirSync(testDir);
                } catch (error) {
                    if (fs.existsSync(testDir)) fs.rmdirSync(testDir);
                    throw error;
                }
            });

            it('should throw error for invalid parameters', () => {
                assert.throws(() => DELETE_DOCUMENT(state, ''), /documentPath parameter must be a non-empty string/);
                assert.throws(() => DELETE_DOCUMENT(state, null), /documentPath parameter must be a non-empty string/);
            });

            it('should throw error for null processState', () => {
                assert.throws(() => DELETE_DOCUMENT(null, './test.txt'), /processState is required/);
            });
        });
    });
});