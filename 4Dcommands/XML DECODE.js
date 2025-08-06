// 4D command: XML DECODE
// Decodes XML-encoded text back to regular text format
// Based on 4D v20 documentation: Converts XML entity references back to their original characters
// Essential for backend XML processing, data parsing, and text processing operations
// XML DECODE ( xmlValue {; entityRef} ) -> decodedText
// xmlValue     Text     -> XML-encoded text to decode
// entityRef    Text     -> Optional entity reference type
// Returns:     Text     -> Decoded text with XML entities converted

export default function XML_DECODE(processState, xmlValue, entityRef = '') {
    try {
        // Validate input
        if (typeof xmlValue !== 'string') {
            console.warn('XML DECODE: Input must be a string');
            return '';
        }
        
        if (xmlValue === '') {
            return '';
        }
        
        let decodedText = xmlValue;
        
        // Initialize XML decode statistics
        if (!processState.xmlDecodeStats) {
            processState.xmlDecodeStats = {
                totalDecodes: 0,
                lastDecoded: null,
                recentDecodes: []
            };
        }
        
        // Standard XML entity decoding
        const xmlEntities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&apos;': "'",
            '&#39;': "'",
            '&#x27;': "'",
            '&#x2F;': '/',
            '&#x3A;': ':',
            '&#x40;': '@'
        };
        
        // Additional HTML entities if needed
        const htmlEntities = {
            '&nbsp;': ' ',
            '&copy;': '©',
            '&reg;': '®',
            '&trade;': '™',
            '&euro;': '€',
            '&pound;': '£',
            '&yen;': '¥',
            '&sect;': '§',
            '&para;': '¶',
            '&middot;': '·',
            '&laquo;': '«',
            '&raquo;': '»',
            '&ndash;': '–',
            '&mdash;': '—',
            '&hellip;': '…',
            '&prime;': '′',
            '&Prime;': '″'
        };
        
        // Decode based on entity reference type
        switch (entityRef.toLowerCase()) {
            case 'html':
            case 'html_entities':
                // Decode both XML and HTML entities
                Object.entries({ ...xmlEntities, ...htmlEntities }).forEach(([entity, char]) => {
                    decodedText = decodedText.replace(new RegExp(entity, 'g'), char);
                });
                break;
                
            case 'xml':
            case 'xml_entities':
            case '':
            default:
                // Decode only XML entities (default)
                Object.entries(xmlEntities).forEach(([entity, char]) => {
                    decodedText = decodedText.replace(new RegExp(entity, 'g'), char);
                });
                break;
        }
        
        // Decode numeric character references (&#123; and &#xAB;)
        decodedText = decodedText.replace(/&#(\d+);/g, (match, num) => {
            return String.fromCharCode(parseInt(num, 10));
        });
        
        decodedText = decodedText.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
            return String.fromCharCode(parseInt(hex, 16));
        });
        
        // Update statistics
        processState.xmlDecodeStats.totalDecodes++;
        processState.xmlDecodeStats.lastDecoded = new Date();
        processState.xmlDecodeStats.recentDecodes.push({
            timestamp: new Date(),
            originalLength: xmlValue.length,
            decodedLength: decodedText.length,
            entityRef: entityRef,
            requestId: processState.xmlDecodeStats.totalDecodes
        });
        
        // Limit recent history
        if (processState.xmlDecodeStats.recentDecodes.length > 50) {
            processState.xmlDecodeStats.recentDecodes.shift();
        }
        
        // Log the operation
        if (processState.logs) {
            const entitiesFound = xmlValue.match(/&[a-zA-Z0-9#]+;/g);
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                source: 'XML DECODE',
                message: `XML decoded text with ${entitiesFound ? entitiesFound.length : 0} entities`,
                data: {
                    originalLength: xmlValue.length,
                    decodedLength: decodedText.length,
                    entityRef: entityRef || 'xml',
                    entitiesFound: entitiesFound ? entitiesFound.length : 0,
                    totalDecodes: processState.xmlDecodeStats.totalDecodes
                }
            });
        }
        
        return decodedText;
        
    } catch (error) {
        console.error('XML DECODE error:', error);
        
        if (processState.logs) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'XML DECODE',
                message: `Error decoding XML: ${error.message}`,
                data: {
                    input: xmlValue,
                    entityRef: entityRef,
                    error: error.message
                }
            });
        }
        
        // Return original text on error
        return xmlValue || '';
    }
}
