// 4D command: XML GET OPTIONS
// Retrieves current XML processing option values
// Based on 4D patterns: Gets XML parser configuration options for backend XML processing
// Essential for backend server XML handling to check current validation, encoding, and error handling settings
// XML GET OPTIONS ( option ) -> Function result
// option              Integer    ->    XML option selector
// Function result     Any        <-    Current value of the option

export default function XML_GET_OPTIONS(processState, option) {
    try {
        // Initialize XML processing options if not exists
        if (!processState.xmlOptions) {
            processState.xmlOptions = {
                // Default XML processing options
                validation: false,
                encoding: 'UTF-8',
                preserveWhitespace: false,
                resolveEntities: true,
                validateDTD: false,
                validateSchema: false,
                errorHandling: 'strict',
                maxParseDepth: 1000,
                maxEntityExpansion: 100000,
                timeout: 30000,
                caseSensitive: true,
                namespaceAware: true,
                lastModified: new Date()
            };
        }

        // Define option constants (must match XML SET OPTIONS)
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

        let optionName = 'unknown';
        let optionValue;

        // Get the option value based on selector
        switch (option) {
            case XML_VALIDATION:
                optionName = 'validation';
                optionValue = processState.xmlOptions.validation;
                break;

            case XML_ENCODING:
                optionName = 'encoding';
                optionValue = processState.xmlOptions.encoding;
                break;

            case XML_PRESERVE_WHITESPACE:
                optionName = 'preserveWhitespace';
                optionValue = processState.xmlOptions.preserveWhitespace;
                break;

            case XML_RESOLVE_ENTITIES:
                optionName = 'resolveEntities';
                optionValue = processState.xmlOptions.resolveEntities;
                break;

            case XML_VALIDATE_DTD:
                optionName = 'validateDTD';
                optionValue = processState.xmlOptions.validateDTD;
                break;

            case XML_VALIDATE_SCHEMA:
                optionName = 'validateSchema';
                optionValue = processState.xmlOptions.validateSchema;
                break;

            case XML_ERROR_HANDLING:
                optionName = 'errorHandling';
                optionValue = processState.xmlOptions.errorHandling;
                break;

            case XML_MAX_PARSE_DEPTH:
                optionName = 'maxParseDepth';
                optionValue = processState.xmlOptions.maxParseDepth;
                break;

            case XML_MAX_ENTITY_EXPANSION:
                optionName = 'maxEntityExpansion';
                optionValue = processState.xmlOptions.maxEntityExpansion;
                break;

            case XML_TIMEOUT:
                optionName = 'timeout';
                optionValue = processState.xmlOptions.timeout;
                break;

            case XML_CASE_SENSITIVE:
                optionName = 'caseSensitive';
                optionValue = processState.xmlOptions.caseSensitive;
                break;

            case XML_NAMESPACE_AWARE:
                optionName = 'namespaceAware';
                optionValue = processState.xmlOptions.namespaceAware;
                break;

            default:
                console.error(`XML GET OPTIONS: Unknown option selector ${option}`);
                return null;
        }

        // Log the option retrieval (only occasionally to avoid spam)
        if (processState.logs && Math.random() < 0.1) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'XML GET OPTIONS',
                message: `Retrieved XML option '${optionName}': ${optionValue}`,
                data: {
                    option: optionName,
                    value: optionValue,
                    optionSelector: option
                }
            });
        }

        return optionValue;

    } catch (error) {
        console.error(`XML GET OPTIONS: An error occurred - ${error.message}`);
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'XML GET OPTIONS',
                message: `Error getting XML option: ${error.message}`,
                data: { error: error.message, option: option }
            });
        }
        return null;
    }
}
