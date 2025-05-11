const fetch = require('node-fetch');

/**
 * Fetches fear/greed sentiment data from TAO API
 * @param {string} apiKey - TAO API key
 * @returns {Promise<Object>} Fear/greed sentiment data
 */
async function fetchFearGreed(apiKey) {
    const response = await fetch('https://tao.app/api/beta/analytics/macro/fear_greed/current', {
        headers: {
            'X-API-Key': apiKey
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch fear/greed data: ${response.status} ${response.statusText}`);
    }

    if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Non-JSON response received from fear/greed endpoint');
    }

    return response.json();
}

module.exports = fetchFearGreed; 