/**
 * Configuration Management System
 * Manages transpiler configuration and environment-specific settings
 */

import fs from 'fs';
import path from 'path';

export class TranspilerConfig {
    constructor(config = {}) {
        this.database = {
            type: config.database?.type || 'postgresql',
            connection: {
                host: config.database?.connection?.host || 'localhost',
                port: config.database?.connection?.port || 5432,
                database: config.database?.connection?.database || 'postgres',
                user: config.database?.connection?.user || 'postgres',
                password: config.database?.connection?.password || 'your-password'
            },
            pool: {
                max: config.database?.pool?.max || 20,
                idleTimeoutMillis: config.database?.pool?.idleTimeoutMillis || 30000,
                connectionTimeoutMillis: config.database?.pool?.connectionTimeoutMillis || 2000
            },
            environment: {
                hostVar: config.database?.environment?.hostVar || 'DB_HOST_4D',
                portVar: config.database?.environment?.portVar || 'DB_PORT_4D',
                databaseVar: config.database?.environment?.databaseVar || 'DB_DATABASE_4D',
                userVar: config.database?.environment?.userVar || 'PG_USERNAME_4D',
                passwordVar: config.database?.environment?.passwordVar || 'DB_PASSWORD_4D'
            }
        };

        this.output = {
            target: config.output?.target || 'nodejs',
            format: config.output?.format || 'es6',
            sourceMaps: config.output?.sourceMaps !== false,
            minify: config.output?.minify || false,
            generateTypes: config.output?.generateTypes || false
        };

        this.commands = {
            strict: config.commands?.strict !== false,
            generateStubs: config.commands?.generateStubs !== false,
            autoImplement: config.commands?.autoImplement || false,
            skipClientOnly: config.commands?.skipClientOnly !== false
        };

        this.transpilation = {
            preserveComments: config.transpilation?.preserveComments !== false,
            contextAware: config.transpilation?.contextAware !== false,
            errorRecovery: config.transpilation?.errorRecovery !== false,
            parallelProcessing: config.transpilation?.parallelProcessing || false,
            maxWorkers: config.transpilation?.maxWorkers || 4
        };

        this.web = {
            framework: config.web?.framework || 'express',
            port: config.web?.port || 80,
            staticPath: config.web?.staticPath || 'WebFolder',
            cors: config.web?.cors !== false,
            compression: config.web?.compression !== false
        };

        this.logging = {
            level: config.logging?.level || 'info',
            file: config.logging?.file || null,
            console: config.logging?.console !== false,
            detailed: config.logging?.detailed || false
        };
    }

    /**
     * Load configuration from file
     * @param {string} configPath - Path to configuration file
     * @returns {TranspilerConfig} Configuration instance
     */
    static loadFromFile(configPath) {
        try {
            const configData = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(configData);
            return new TranspilerConfig(config);
        } catch (error) {
            console.warn(`Could not load config from ${configPath}: ${error.message}`);
            return new TranspilerConfig();
        }
    }

    /**
     * Save configuration to file
     * @param {string} configPath - Path to save configuration
     */
    saveToFile(configPath) {
        const configData = JSON.stringify(this, null, 2);
        fs.writeFileSync(configPath, configData);
    }

    /**
     * Get database connection string
     * @returns {string} Database connection string
     */
    getDatabaseConnectionString() {
        const { connection } = this.database;
        return `postgresql://${connection.user}:${connection.password}@${connection.host}:${connection.port}/${connection.database}`;
    }

    /**
     * Get environment variable overrides
     * @returns {object} Environment variable mappings
     */
    getEnvironmentOverrides() {
        const { environment, connection } = this.database;
        return {
            [environment.hostVar]: connection.host,
            [environment.portVar]: connection.port.toString(),
            [environment.databaseVar]: connection.database,
            [environment.userVar]: connection.user,
            [environment.passwordVar]: connection.password
        };
    }

    /**
     * Validate configuration
     * @returns {object} Validation result
     */
    validate() {
        const errors = [];
        const warnings = [];

        // Validate database configuration
        if (!this.database.connection.host) {
            errors.push('Database host is required');
        }

        if (!this.database.connection.database) {
            errors.push('Database name is required');
        }

        if (this.database.pool.max < 1) {
            errors.push('Database pool max connections must be at least 1');
        }

        // Validate output configuration
        if (!['nodejs', 'browser', 'deno'].includes(this.output.target)) {
            errors.push('Invalid output target. Must be one of: nodejs, browser, deno');
        }

        if (!['es6', 'es5', 'commonjs'].includes(this.output.format)) {
            errors.push('Invalid output format. Must be one of: es6, es5, commonjs');
        }

        // Validate web configuration
        if (!['express', 'fastify', 'koa'].includes(this.web.framework)) {
            errors.push('Invalid web framework. Must be one of: express, fastify, koa');
        }

        if (this.web.port < 1 || this.web.port > 65535) {
            errors.push('Invalid web port. Must be between 1 and 65535');
        }

        // Warnings
        if (this.database.connection.password === 'your-password') {
            warnings.push('Using default database password. Consider setting a secure password.');
        }

        if (this.transpilation.maxWorkers > 8) {
            warnings.push('High number of workers may impact performance. Consider reducing maxWorkers.');
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Get configuration for specific environment
     * @param {string} environment - Environment name
     * @returns {TranspilerConfig} Environment-specific configuration
     */
    forEnvironment(environment) {
        const envConfig = { ...this };
        
        switch (environment) {
            case 'development':
                envConfig.logging.level = 'debug';
                envConfig.logging.detailed = true;
                envConfig.output.sourceMaps = true;
                envConfig.transpilation.preserveComments = true;
                break;
                
            case 'production':
                envConfig.logging.level = 'warn';
                envConfig.logging.detailed = false;
                envConfig.output.sourceMaps = false;
                envConfig.output.minify = true;
                envConfig.transpilation.preserveComments = false;
                break;
                
            case 'testing':
                envConfig.logging.level = 'error';
                envConfig.logging.console = false;
                envConfig.output.sourceMaps = true;
                envConfig.commands.strict = true;
                break;
        }
        
        return new TranspilerConfig(envConfig);
    }
}

export class TemplateManager {
    constructor(config) {
        this.config = config;
        this.templates = new Map();
        this.loadTemplates();
    }

    /**
     * Load built-in templates
     */
    loadTemplates() {
        this.templates.set('express-entry', this.getExpressEntryTemplate());
        this.templates.set('fastify-entry', this.getFastifyEntryTemplate());
        this.templates.set('basic-entry', this.getBasicEntryTemplate());
        this.templates.set('database-config', this.getDatabaseConfigTemplate());
        this.templates.set('package-json', this.getPackageJsonTemplate());
    }

    /**
     * Get entry point template for specified environment
     * @param {string} environment - Environment name
     * @returns {string} Template content
     */
    getEntryPointTemplate(environment) {
        switch (environment) {
            case 'express':
                return this.templates.get('express-entry');
            case 'fastify':
                return this.templates.get('fastify-entry');
            default:
                return this.templates.get('basic-entry');
        }
    }

    /**
     * Get Express.js entry point template
     * @returns {string} Template content
     */
    getExpressEntryTemplate() {
        return `
console.log("RUNNING TRANSPILED PROJECT:");
console.log("");

// Initialize process state
let processState = {
    webservers: [],
    database: null,
    config: ${JSON.stringify(this.config, null, 2)}
};

// Database configuration
${this.getDatabaseConfigTemplate()}

// Import transpiled methods
// ... imports will be added here ...

// Start web server
const express = require('express');
const app = express();
const port = ${this.config.web.port};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

${this.config.web.cors ? `
// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
` : ''}

// Static file serving
app.use(express.static('${this.config.web.staticPath}'));

// Routes
app.get('/', (req, res) => {
    res.send('4D Transpiled Application Running');
});

// Start server
app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
    processState.OK = true;
});

module.exports = { app, processState };
`;
    }

    /**
     * Get Fastify entry point template
     * @returns {string} Template content
     */
    getFastifyEntryTemplate() {
        return `
console.log("RUNNING TRANSPILED PROJECT:");
console.log("");

// Initialize process state
let processState = {
    webservers: [],
    database: null,
    config: ${JSON.stringify(this.config, null, 2)}
};

// Database configuration
${this.getDatabaseConfigTemplate()}

// Import transpiled methods
// ... imports will be added here ...

// Start web server
const fastify = require('fastify')({ logger: true });
const port = ${this.config.web.port};

// Register plugins
fastify.register(require('fastify-cors'), {
    origin: true
});

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '${this.config.web.staticPath}'),
    prefix: '/'
});

// Routes
fastify.get('/', async (request, reply) => {
    return { message: '4D Transpiled Application Running' };
});

// Start server
const start = async () => {
    try {
        await fastify.listen(port);
        console.log(\`Server running on port \${port}\`);
        processState.OK = true;
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();

module.exports = { fastify, processState };
`;
    }

    /**
     * Get basic entry point template
     * @returns {string} Template content
     */
    getBasicEntryTemplate() {
        return `
console.log("RUNNING TRANSPILED PROJECT:");
console.log("");

// Initialize process state
let processState = {
    webservers: [],
    database: null,
    config: ${JSON.stringify(this.config, null, 2)}
};

// Database configuration
${this.getDatabaseConfigTemplate()}

// Import transpiled methods
// ... imports will be added here ...

console.log("Application initialized successfully");
processState.OK = true;

module.exports = { processState };
`;
    }

    /**
     * Get database configuration template
     * @returns {string} Template content
     */
    getDatabaseConfigTemplate() {
        const { database } = this.config;
        const { environment, connection, pool } = database;
        
        return `
// Database configuration
const { Pool } = require('pg');

const dbConfig = {
    host: process.env.${environment.hostVar} || '${connection.host}',
    port: parseInt(process.env.${environment.portVar}) || ${connection.port},
    database: process.env.${environment.databaseVar} || '${connection.database}',
    user: process.env.${environment.userVar} || '${connection.user}',
    password: process.env.${environment.passwordVar} || '${connection.password}',
    max: ${pool.max},
    idleTimeoutMillis: ${pool.idleTimeoutMillis},
    connectionTimeoutMillis: ${pool.connectionTimeoutMillis}
};

processState.pool = new Pool(dbConfig);

// Handle pool errors
processState.pool.on('error', (err, client) => {
    console.error('Database pool error:', err);
    process.exit(-1);
});

console.log('Database connection configured');
`;
    }

    /**
     * Get package.json template
     * @returns {string} Template content
     */
    getPackageJsonTemplate() {
        const dependencies = {
            "express": "^4.18.2",
            "pg": "^8.11.3",
            "cors": "^2.8.5"
        };

        if (this.config.web.framework === 'fastify') {
            dependencies.fastify = "^4.24.3";
            dependencies['fastify-cors'] = "^8.4.0";
            dependencies['fastify-static'] = "^4.0.3";
        }

        if (this.config.web.compression) {
            dependencies.compression = "^1.7.4";
        }

        return JSON.stringify({
            name: "4d-transpiled-app",
            version: "1.0.0",
            description: "Transpiled 4D application",
            main: "index.js",
            scripts: {
                start: "node index.js",
                dev: "nodemon index.js",
                test: "echo \"Error: no test specified\" && exit 1"
            },
            dependencies,
            engines: {
                node: ">=18.0.0"
            }
        }, null, 2);
    }
}

export class EnvironmentManager {
    constructor(config) {
        this.config = config;
    }

    /**
     * Load environment variables
     * @param {string} envFile - Path to .env file
     */
    loadEnvironment(envFile = '.env') {
        try {
            if (fs.existsSync(envFile)) {
                const envContent = fs.readFileSync(envFile, 'utf8');
                const envVars = this.parseEnvFile(envContent);
                
                for (const [key, value] of Object.entries(envVars)) {
                    process.env[key] = value;
                }
                
                console.log(`Loaded environment from ${envFile}`);
            }
        } catch (error) {
            console.warn(`Could not load environment from ${envFile}: ${error.message}`);
        }
    }

    /**
     * Parse .env file content
     * @param {string} content - .env file content
     * @returns {object} Environment variables
     */
    parseEnvFile(content) {
        const envVars = {};
        const lines = content.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key && valueParts.length > 0) {
                    envVars[key.trim()] = valueParts.join('=').trim();
                }
            }
        }
        
        return envVars;
    }

    /**
     * Generate .env template
     * @returns {string} .env template content
     */
    generateEnvTemplate() {
        const { environment, connection } = this.config.database;
        
        return `# Database Configuration
${environment.hostVar}=${connection.host}
${environment.portVar}=${connection.port}
${environment.databaseVar}=${connection.database}
${environment.userVar}=${connection.user}
${environment.passwordVar}=${connection.password}

# Web Server Configuration
WEB_PORT=${this.config.web.port}
WEB_FRAMEWORK=${this.config.web.framework}

# Logging Configuration
LOG_LEVEL=${this.config.logging.level}
LOG_FILE=${this.config.logging.file || ''}

# Transpiler Configuration
TRANSPILER_STRICT=${this.config.commands.strict}
TRANSPILER_GENERATE_STUBS=${this.config.commands.generateStubs}
`;
    }
} 