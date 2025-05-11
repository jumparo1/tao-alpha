require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const getMergedSubnets = require('./dev/data/mergedSubnets');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the project root
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Mock data for fallback
const mockData = [{
    rank: 1,
    subnet_name: 'Chutes',
    emissions_per_day: 972.76,
    gamma_price: 0.271,
    market_cap: 5000000,
    fdv: 10000000,
    volume_mc: 5,
    alpha_liquidity: 100000,
    root_prop: 50,
    sentiment_score: 'Neutral',
    top_holders_percent: 40,
    top_holder_7d_flow: 1000,
    whale_net_7d_flow: 500,
    top_validators: 'Validator A',
    validator_stake_7d: 10000,
    validator_uptime: 99,
    macro: { fear_greed_index: 55 }
}, {
    rank: 2,
    subnet_name: 'Test Subnet',
    emissions_per_day: 100,
    gamma_price: 0.2,
    market_cap: 3000000,
    fdv: 8000000,
    volume_mc: 3,
    alpha_liquidity: 50000,
    root_prop: 45,
    sentiment_score: 'Positive',
    top_holders_percent: 35,
    top_holder_7d_flow: 800,
    whale_net_7d_flow: 300,
    top_validators: 'Validator B',
    validator_stake_7d: 8000,
    validator_uptime: 98,
    macro: { fear_greed_index: 60 }
}];

// API route for subnets
app.get('/api/subnets', async (req, res) => {
    // Check if API key is configured
    if (!process.env.TAO_API_KEY) {
        console.warn('TAO_API_KEY not configured, using mock data');
        return res.json(mockData);
    }

    try {
        // Fetch and merge subnet data using the modular API
        const data = await getMergedSubnets(process.env.TAO_API_KEY);
        res.json(data);
    } catch (error) {
        console.error('Error fetching subnet data:', error);
        // Log the specific error for debugging
        if (error.response) {
            console.error('API Response:', {
                status: error.response.status,
                statusText: error.response.statusText,
                headers: error.response.headers
            });
        }
        // Fallback to mock data on error
        console.log('Falling back to mock data');
        res.json(mockData);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📊 Open http://localhost:${PORT} in your browser to view the dashboard`);
    
    // Log API key status
    if (!process.env.TAO_API_KEY) {
        console.warn('⚠️  TAO_API_KEY not configured - using mock data');
    } else {
        console.log('🔑 TAO API key is configured');
    }
}); 