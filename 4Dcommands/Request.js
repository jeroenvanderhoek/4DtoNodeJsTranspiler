// 4D command: Request
// Makes an HTTP request
// Request ( url {; method {; headers {; body}}} ) -> Function result
// Parameter		Type		Description
// url		String		URL to request
// method		String		HTTP method (GET, POST, etc.)
// headers		Object		HTTP headers
// body		String		Request body
// Function result		Object		Response object

import https from 'https';
import http from 'http';
import { URL } from 'url';

export default function Request(processState, url, method = 'GET', headers = {}, body = null) {
    return new Promise((resolve, reject) => {
        if (!url || typeof url !== 'string') {
            reject(new Error('Request: Invalid URL provided'));
            return;
        }
        
        try {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const client = isHttps ? https : http;
            
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: method.toUpperCase(),
                headers: {
                    'User-Agent': '4D-NodeJS-Transpiler/1.0',
                    ...headers
                }
            };
            
            if (body) {
                options.headers['Content-Length'] = Buffer.byteLength(body);
            }
            
            const req = client.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: data
                    });
                });
            });
            
            req.on('error', (error) => {
                reject(error);
            });
            
            if (body) {
                req.write(body);
            }
            
            req.end();
            
        } catch (error) {
            reject(error);
        }
    });
}