const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    try {
        const [infoResponse, holdersResponse, valuationResponse] = await Promise.all([
            fetch('https://tao.app/api/beta/analytics/subnets/info'),
            fetch('https://tao.app/api/beta/analytics/subnets/holders'),
            fetch('https://tao.app/api/beta/analytics/subnets/valuation')
        ]);

        if (!infoResponse.ok || !holdersResponse.ok || !valuationResponse.ok) {
            throw new Error('Failed to fetch data from one or more endpoints');
        }

        const [infoData, holdersData, valuationData] = await Promise.all([
            infoResponse.json(),
            holdersResponse.json(),
            valuationResponse.json()
        ]);

        // Merge data into a single JSON object
        const mergedData = infoData.map(info => {
            const holders = holdersData.find(h => h.subnet_name === info.subnet_name);
            const valuation = valuationData.find(v => v.subnet_name === info.subnet_name);
            return {
                ...info,
                ...holders,
                ...valuation
            };
        });

        return {
            statusCode: 200,
            body: JSON.stringify(mergedData)
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to load data. Please try again later.' })
        };
    }
}; 