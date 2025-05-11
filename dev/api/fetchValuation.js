const fetch = require('node-fetch');

/**
 * Fetches subnet valuation data from TAO API
 * @param {string} apiKey - TAO API key
 * @returns {Promise<Array>} Array of subnet valuation data
 */
async function fetchValuation(apiKey) {
    const response = await fetch('https://tao.app/api/beta/analytics/subnets/valuation', {
        headers: {
            'X-API-Key': apiKey
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch valuation data: ${response.status} ${response.statusText}`);
    }

    if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Non-JSON response received from valuation endpoint');
    }

    return response.json();
}

module.exports = fetchValuation; 