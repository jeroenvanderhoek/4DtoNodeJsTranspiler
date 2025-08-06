// 4D command: XML SET OPTIONS
// Configures XML processing options for parsing and validation
// Based on 4D patterns: Sets various XML parser configuration options for backend XML processing
// Essential for backend server XML handling with configurable validation, encoding, and error handling
// XML SET OPTIONS ( option ; value )
// option    Integer    ->    XML option selector
// value     Any        ->    New value for the option

export default function XML_SET_OPTIONS(processState, option, value) {
    try {
        // Initialize XML processing options if not exists
        if (!processState.xmlOptions) {
            processState.xmlOptions = {
                // Default XML processing options
                validation: false,               // Enable/disable XML validation
                encoding: 'UTF-8',              // Default encoding
                preserveWhitespace: false,      // Preserve whitespace in text nodes
                resolveEntities: true,          // Resolve XML entities
                validateDTD: false,             // Validate against DTD
                validateSchema: false,          // Validate against XML Schema
                errorHandling: 'strict',        // Error handling mode: 'strict', 'lenient', 'ignore'
                maxParseDepth: 1000,           // Maximum parsing depth
                maxEntityExpansion: 100000,    // Maximum entity expansion limit
                timeout: 30000,                // Parsing timeout in milliseconds
                caseSensitive: true,           // Case sensitive element/attribute names
                namespaceAware: true,          // Namespace aware parsing
                lastModified: new Date()
            };
        }

        // Define option constants (similar to 4D patterns)
        const XML_VALIDATION = 1;
        const XML_ENCODING = 2;
        const XML_PRESERVE_WHITESPACE = 3;
        const XML_RESOLVE_ENTITIES = 4;
        const XML_VALIDATE_DTD = 5;
        const XML_VALIDATE_SCHEMA = 6;
        const XML_ERROR_HANDLING = 7;
        const XML_MAX_PARSE_DEPTH = 8;
        const XML_MAX_ENTITY_EXPANSION = 9;
        const XML_TIMEOUT = 10;
        const XML_CASE_SENSITIVE = 11;
        const XML_NAMESPACE_AWARE = 12;

        // Store old value for logging
        let oldValue;
        let optionName = 'unknown';

        // Set the option based on selector
        switch (option) {
            case XML_VALIDATION:
                optionName = 'validation';
                oldValue = processState.xmlOptions.validation;
                processState.xmlOptions.validation = Boolean(value);
                break;

            case XML_ENCODING:
                optionName = 'encoding';
                oldValue = processState.xmlOptions.encoding;
                if (typeof value === 'string' && value.trim() !== '') {
                    processState.xmlOptions.encoding = value.trim();
                } else {
                    console.error('XML SET OPTIONS: Encoding must be a non-empty string');
                    return;
                }
                break;

            case XML_PRESERVE_WHITESPACE:
                optionName = 'preserveWhitespace';
                oldValue = processState.xmlOptions.preserveWhitespace;
                processState.xmlOptions.preserveWhitespace = Boolean(value);
                break;

            case XML_RESOLVE_ENTITIES:
                optionName = 'resolveEntities';
                oldValue = processState.xmlOptions.resolveEntities;
                processState.xmlOptions.resolveEntities = Boolean(value);
                break;

            case XML_VALIDATE_DTD:
                optionName = 'validateDTD';
                oldValue = processState.xmlOptions.validateDTD;
                processState.xmlOptions.validateDTD = Boolean(value);
                break;

            case XML_VALIDATE_SCHEMA:
                optionName = 'validateSchema';
                oldValue = processState.xmlOptions.validateSchema;
                processState.xmlOptions.validateSchema = Boolean(value);
                break;

            case XML_ERROR_HANDLING:
                optionName = 'errorHandling';
                oldValue = processState.xmlOptions.errorHandling;
                const validModes = ['strict', 'lenient', 'ignore'];
                if (typeof value === 'string' && validModes.includes(value.toLowerCase())) {
                    processState.xmlOptions.errorHandling = value.toLowerCase();
                } else {
                    console.error('XML SET OPTIONS: Error handling mode must be "strict", "lenient", or "ignore"');
                    return;
                }
                break;

            case XML_MAX_PARSE_DEPTH:
                optionName = 'maxParseDepth';
                oldValue = processState.xmlOptions.maxParseDepth;
                const depth = parseInt(value, 10);
                if (isNaN(depth) || depth < 1) {
                    console.error('XML SET OPTIONS: Max parse depth must be a positive integer');
                    return;
                }
                processState.xmlOptions.maxParseDepth = depth;
                break;

            case XML_MAX_ENTITY_EXPANSION:
                optionName = 'maxEntityExpansion';
                oldValue = processState.xmlOptions.maxEntityExpansion;
                const expansion = parseInt(value, 10);
                if (isNaN(expansion) || expansion < 1) {
                    console.error('XML SET OPTIONS: Max entity expansion must be a positive integer');
                    return;
                }
                processState.xmlOptions.maxEntityExpansion = expansion;
                break;

            case XML_TIMEOUT:
                optionName = 'timeout';
                oldValue = processState.xmlOptions.timeout;
                const timeout = parseInt(value, 10);
                if (isNaN(timeout) || timeout < 0) {
                    console.error('XML SET OPTIONS: Timeout must be a non-negative integer');
                    return;
                }
                processState.xmlOptions.timeout = timeout;
                break;

            case XML_CASE_SENSITIVE:
                optionName = 'caseSensitive';
                oldValue = processState.xmlOptions.caseSensitive;
                processState.xmlOptions.caseSensitive = Boolean(value);
                break;

            case XML_NAMESPACE_AWARE:
                optionName = 'namespaceAware';
                oldValue = processState.xmlOptions.namespaceAware;
                processState.xmlOptions.namespaceAware = Boolean(value);
                break;

            default:
                console.error(`XML SET OPTIONS: Unknown option selector ${option}`);
                return;
        }

        // Update last modified timestamp
        processState.xmlOptions.lastModified = new Date();

        // Track option change history
        if (!processState.xmlOptionHistory) {
            processState.xmlOptionHistory = [];
        }
        processState.xmlOptionHistory.push({
            option: optionName,
            oldValue: oldValue,
            newValue: processState.xmlOptions[optionName],
            timestamp: new Date().toISOString()
        });

        // Log the option change
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'XML SET OPTIONS',
                message: `XML option '${optionName}' changed from ${oldValue} to ${processState.xmlOptions[optionName]}`,
                data: {
                    option: optionName,
                    oldValue: oldValue,
                    newValue: processState.xmlOptions[optionName],
                    optionSelector: option
                }
            });
        }

    } catch (error) {
        console.error(`XML SET OPTIONS: An error occurred - ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'XML SET OPTIONS',
                message: `Error setting XML option: ${error.message}`,
                data: { error: error.message, option: option, value: value }
            });
        }
    }
}
