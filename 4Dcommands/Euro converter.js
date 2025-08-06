// This 4D command is fixed and tested.
// 4D command: Euro converter
// Converts between Euro and legacy European currencies
// Useful for financial calculations with historical data

export default function(processState) {
    return function Euro_converter(amount, fromCurrency, toCurrency) {
        try {
            // Fixed exchange rates to Euro (as of Euro introduction)
            const rates = {
                'EUR': 1.0,
                'ATS': 13.7603,  // Austrian Schilling
                'BEF': 40.3399,  // Belgian Franc
                'DEM': 1.95583,  // German Mark
                'ESP': 166.386,  // Spanish Peseta
                'FIM': 5.94573,  // Finnish Markka
                'FRF': 6.55957,  // French Franc
                'GRD': 340.750,  // Greek Drachma
                'IEP': 0.787564, // Irish Pound
                'ITL': 1936.27,  // Italian Lira
                'LUF': 40.3399,  // Luxembourg Franc
                'NLG': 2.20371,  // Dutch Guilder
                'PTE': 200.482   // Portuguese Escudo
            };
            
            if (typeof amount !== 'number') {
                throw new Error('Amount must be a number');
            }
            
            const from = (fromCurrency || 'EUR').toUpperCase();
            const to = (toCurrency || 'EUR').toUpperCase();
            
            if (!rates[from] || !rates[to]) {
                throw new Error('Unknown currency code');
            }
            
            // Convert to EUR first, then to target currency
            const euroAmount = amount / rates[from];
            const result = euroAmount * rates[to];
            
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'DEBUG',
                source: 'Euro converter',
                message: 'Currency converted',
                data: { 
                    amount,
                    fromCurrency: from,
                    toCurrency: to,
                    result
                }
            });
            
            processState.OK = 1;
            return result;
            
        } catch (error) {
            processState.logs.push({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                source: 'Euro converter',
                message: `Error converting currency: ${error.message}`,
                data: { error: error.message, amount, fromCurrency, toCurrency }
            });
            processState.OK = 0;
            return 0;
        }
    };
};