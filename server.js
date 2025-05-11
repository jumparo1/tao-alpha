require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/*', async (req, res) => {
    const apiUrl = `https://tao.app${req.path.replace('/api', '')}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data from TAO API' });
    }
});

app.get('/api/subnets', async (req, res) => {
    const headers = {
        'X-API-Key': process.env.TAO_API_KEY
    };

    try {
        const [infoResponse, holdersResponse, valuationResponse, macroResponse] = await Promise.all([
            fetch('https://api.tao.app/api/beta/analytics/subnets/info', { headers }),
            fetch('https://api.tao.app/api/beta/analytics/subnets/holders', { headers }),
            fetch('https://api.tao.app/api/beta/analytics/subnets/valuation', { headers }),
            fetch('https://api.tao.app/api/beta/analytics/macro/fear_greed/current', { headers })
        ]);

        const responses = [infoResponse, holdersResponse, valuationResponse, macroResponse];
        for (const response of responses) {
            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Error fetching data:', errorBody.substring(0, 200));
                return res.status(response.status).json({ error: `Failed to fetch data from TAO API. Status: ${response.status}` });
            }
            if (!response.headers.get('content-type').includes('application/json')) {
                console.error('Non-JSON response received');
                return res.status(500).json({ error: 'Non-JSON response received from TAO API' });
            }
        }

        const [infoData, holdersData, valuationData, macroData] = await Promise.all(responses.map(r => r.json()));

        // Merge data into a single JSON object
        const mergedData = infoData.map(info => {
            const holders = holdersData.find(h => h.subnet_name === info.subnet_name);
            const valuation = valuationData.find(v => v.subnet_name === info.subnet_name);
            return {
                ...info,
                ...holders,
                ...valuation,
                macro: macroData // Include macro data
            };
        });

        res.json(mergedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data from TAO API' });
    }
});

app.get('/api/subnets', (req, res) => {
    res.json([{
        rank: 1,
        subnet: 'Chutes',
        emissionsPerDay: 972.76,
        gammaPrice: 0.271,
        // other mock data fields
    }]);
});

app.listen(PORT, (err) => {
    if (err) {
        return console.error(`Failed to start server: ${err.message}`);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
}); 