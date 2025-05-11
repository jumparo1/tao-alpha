const fetch = require('node-fetch');

/**
 * Fetches subnet information from TAO API
 * @param {string} apiKey - TAO API key
 * @returns {Promise<Array>} Array of subnet information
 */
async function fetchSubnetsInfo(apiKey) {
    const response = await fetch('https://tao.app/api/beta/analytics/subnets/info', {
        headers: {
            'X-API-Key': apiKey
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch subnet info: ${response.status} ${response.statusText}`);
    }

    if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Non-JSON response received from subnet info endpoint');
    }

    return response.json();
}

module.exports = fetchSubnetsInfo; 