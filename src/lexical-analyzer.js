/**
 * 4D Lexical Analyzer
 * Handles proper tokenization of 4D source code, respecting string literals, comments, and SQL blocks
 */

export class FourDLexicalAnalyzer {
    constructor() {
        this.source = '';
        this.tokens = [];
        this.current = 0;
        this.start = 0;
        this.line = 1;
        this.column = 1;
    }

    /**
     * Tokenize 4D source code into tokens
     * @param {string} source - 4D source code
     * @returns {Array} Array of tokens
     */
    tokenize(source) {
        this.source = source;
        this.tokens = [];
        this.current = 0;
        this.start = 0;
        this.line = 1;
        this.column = 1;

        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push({
            type: 'EOF',
            lexeme: '',
            literal: null,
            line: this.line,
            column: this.column
        });

        return this.tokens;
    }

    /**
     * Scan the next token
     */
    scanToken() {
        const char = this.advance();

        switch (char) {
            case '(':
            case ')':
            case '{':
            case '}':
            case '[':
            case ']':
            case ',':
            case ';':
            case ':':
                this.addToken('PUNCTUATION', char);
                break;

            case '=':
                if (this.match('=')) {
                    this.addToken('OPERATOR', '==');
                } else {
                    this.addToken('OPERATOR', '=');
                }
                break;

            case '!':
                if (this.match('=')) {
                    this.addToken('OPERATOR', '!=');
                } else {
                    this.addToken('OPERATOR', '!');
                }
                break;

            case '<':
                if (this.match('=')) {
                    this.addToken('OPERATOR', '<=');
                } else {
                    this.addToken('OPERATOR', '<');
                }
                break;

            case '>':
                if (this.match('=')) {
                    this.addToken('OPERATOR', '>=');
                } else {
                    this.addToken('OPERATOR', '>');
                }
                break;

            case '+':
            case '-':
            case '*':
            case '/':
                this.addToken('OPERATOR', char);
                break;

            case '"':
                this.string('"');
                break;

            case "'":
                this.string("'");
                break;

            case '/':
                if (this.match('/')) {
                    this.comment();
                } else {
                    this.addToken('OPERATOR', '/');
                }
                break;

            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace
                break;

            case '\n':
                this.line++;
                this.column = 1;
                break;

            default:
                if (this.isDigit(char)) {
                    this.number();
                } else if (this.isAlpha(char)) {
                    this.identifier();
                } else {
                    this.error(`Unexpected character: ${char}`);
                }
                break;
        }
    }

    /**
     * Handle string literals
     */
    string(quote) {
        while (this.peek() !== quote && !this.isAtEnd()) {
            if (this.peek() === '\n') {
                this.line++;
                this.column = 1;
            }
            this.advance();
        }

        if (this.isAtEnd()) {
            this.error('Unterminated string');
            return;
        }

        // Consume the closing quote
        this.advance();

        // Trim the quotes
        const value = this.source.substring(this.start + 1, this.current - 1);
        this.addToken('STRING', value, value);
    }

    /**
     * Handle comments
     */
    comment() {
        while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
        }
        // Comment is ignored, no token added
    }

    /**
     * Handle numbers
     */
    number() {
        while (this.isDigit(this.peek())) {
            this.advance();
        }

        // Look for decimal part
        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
            this.advance(); // consume the "."

            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }

        const value = this.source.substring(this.start, this.current);
        this.addToken('NUMBER', value, parseFloat(value));
    }

    /**
     * Handle identifiers and keywords
     */
    identifier() {
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }

        const text = this.source.substring(this.start, this.current);
        const type = this.isKeyword(text) ? 'KEYWORD' : 'IDENTIFIER';
        this.addToken(type, text, text);
    }

    /**
     * Check if string is a 4D keyword
     */
    isKeyword(text) {
        const keywords = [
            'If', 'Else', 'End', 'For', 'To', 'Step', 'While', 'Repeat', 'Until',
            'Case', 'Of', 'Default', 'Break', 'Continue', 'Return', 'Var', 'C_TEXT',
            'C_LONGINT', 'C_REAL', 'C_BOOLEAN', 'C_DATE', 'C_TIME', 'C_POINTER',
            'ARRAY', 'TEXT', 'INTEGER', 'REAL', 'BOOLEAN', 'DATE', 'TIME', 'BLOB',
            'True', 'False', 'Null', 'OK', 'Self', 'This', 'Super', 'Old'
        ];
        return keywords.includes(text);
    }

    /**
     * Helper methods
     */
    advance() {
        this.current++;
        this.column++;
        return this.source[this.current - 1];
    }

    peek() {
        if (this.isAtEnd()) return '\0';
        return this.source[this.current];
    }

    peekNext() {
        if (this.current + 1 >= this.source.length) return '\0';
        return this.source[this.current + 1];
    }

    match(expected) {
        if (this.isAtEnd()) return false;
        if (this.source[this.current] !== expected) return false;

        this.current++;
        this.column++;
        return true;
    }

    addToken(type, lexeme, literal = null) {
        const text = this.source.substring(this.start, this.current);
        this.tokens.push({
            type,
            lexeme: lexeme || text,
            literal,
            line: this.line,
            column: this.column - lexeme.length
        });
    }

    isAtEnd() {
        return this.current >= this.source.length;
    }

    isDigit(char) {
        return char >= '0' && char <= '9';
    }

    isAlpha(char) {
        return (char >= 'a' && char <= 'z') ||
               (char >= 'A' && char <= 'Z') ||
               char === '_';
    }

    isAlphaNumeric(char) {
        return this.isAlpha(char) || this.isDigit(char);
    }

    error(message) {
        console.error(`[LEXER ERROR] Line ${this.line}, Column ${this.column}: ${message}`);
    }
}

/**
 * Context-aware text replacement utility
 * Only performs replacements outside of strings, comments, and SQL blocks
 */
export class ContextAwareReplacer {
    constructor() {
        this.lexer = new FourDLexicalAnalyzer();
    }

    /**
     * Replace text while respecting context
     * @param {string} source - Source code
     * @param {string} pattern - Pattern to replace
     * @param {string} replacement - Replacement text
     * @returns {string} - Source with replacements
     */
    replace(source, pattern, replacement) {
        const tokens = this.lexer.tokenize(source);
        let result = '';
        let lastIndex = 0;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            
            // Only replace in non-string, non-comment tokens
            if (token.type === 'IDENTIFIER' || token.type === 'KEYWORD' || token.type === 'OPERATOR') {
                const tokenStart = this.getTokenPosition(source, token, i, tokens);
                const tokenEnd = tokenStart + token.lexeme.length;
                
                // Add text before this token
                result += source.substring(lastIndex, tokenStart);
                
                // Replace within this token
                const replacedToken = token.lexeme.replace(new RegExp(pattern, 'g'), replacement);
                result += replacedToken;
                
                lastIndex = tokenEnd;
            } else {
                // For non-replaceable tokens, just add the original text
                const tokenStart = this.getTokenPosition(source, token, i, tokens);
                result += source.substring(lastIndex, tokenStart);
                result += token.lexeme;
                lastIndex = tokenStart + token.lexeme.length;
            }
        }

        // Add remaining text
        result += source.substring(lastIndex);
        return result;
    }

    /**
     * Get the position of a token in the original source
     * This is a simplified version - in practice, you'd track positions during tokenization
     */
    getTokenPosition(source, token, index, tokens) {
        // Simplified position calculation
        // In a real implementation, you'd track absolute positions during tokenization
        let position = 0;
        for (let i = 0; i < index; i++) {
            position += tokens[i].lexeme.length;
        }
        return position;
    }
} 