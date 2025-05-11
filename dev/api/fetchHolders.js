const fetch = require('node-fetch');

/**
 * Fetches subnet holders data from TAO API
 * @param {string} apiKey - TAO API key
 * @returns {Promise<Array>} Array of subnet holders data
 */
async function fetchHolders(apiKey) {
    const response = await fetch('https://tao.app/api/beta/analytics/subnets/holders', {
        headers: {
            'X-API-Key': apiKey
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch holders data: ${response.status} ${response.statusText}`);
    }

    if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Non-JSON response received from holders endpoint');
    }

    return response.json();
}

module.exports = fetchHolders; 