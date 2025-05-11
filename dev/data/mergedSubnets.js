const fetchSubnetsInfo = require('../api/fetchSubnetsInfo');
const fetchValuation = require('../api/fetchValuation');
const fetchHolders = require('../api/fetchHolders');
const fetchFearGreed = require('../api/fetchFearGreed');
const { calculateMetrics } = require('../utils/calculateScore');

/**
 * Fetches and merges all subnet data from various API endpoints
 * @param {string} apiKey - TAO API key
 * @returns {Promise<Array>} Array of merged subnet data with calculated metrics
 */
async function getMergedSubnets(apiKey) {
    try {
        // Fetch all data in parallel
        const [infoData, valuationData, holdersData, macroData] = await Promise.all([
            fetchSubnetsInfo(apiKey),
            fetchValuation(apiKey),
            fetchHolders(apiKey),
            fetchFearGreed(apiKey)
        ]);

        // Merge data into a single array of subnet objects
        const mergedData = infoData.map(info => {
            // Find matching data from other endpoints
            const valuation = valuationData.find(v => v.subnet_name === info.subnet_name);
            const holders = holdersData.find(h => h.subnet_name === info.subnet_name);

            // Create merged subnet object
            const subnet = {
                ...info,
                ...valuation,
                ...holders,
                macro: macroData
            };

            // Calculate additional metrics
            return calculateMetrics(subnet);
        });

        // Sort by rank if available
        return mergedData.sort((a, b) => (a.rank || 0) - (b.rank || 0));
    } catch (error) {
        console.error('Error merging subnet data:', error);
        throw new Error(`Failed to merge subnet data: ${error.message}`);
    }
}

module.exports = getMergedSubnets; 