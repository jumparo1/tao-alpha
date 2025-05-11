// Mock data for TAO subnets
const subnets = [
    {
        rank: 1,
        subnet: 'Subnet A',
        emissionsPerDay: 1000,
        gammaPrice: 0.5,
        marketCap: 5000000,
        fdv: 10000000,
        volumeMC: 5,
        alphaLiquidity: 100000,
        rootProp: 50,
        sentiment: 'Neutral',
        top5Holders: 40,
        topHolderFlow: 1000,
        whaleNetFlow: 500,
        topValidators: 'Validator A',
        validatorStake: 10000,
        validatorUptime: 99
    },
    // Add more subnet objects as needed
];

// Function to calculate Gamma/Emissions ratio
function calculateGammaEmissions(subnet) {
    return subnet.gammaPrice / subnet.emissionsPerDay;
}

// Function to assign Asymmetric Score based on weighted formulas
function calculateAsymmetricScore(subnet) {
    let score = 0;
    // Example scoring logic
    score += (1 - subnet.gammaEmissions) * 3; // Up to 3 points
    score += subnet.sentiment_score === 'Positive' ? 2 : 0; // Up to 2 points
    score += subnet.validator_stake_7d > 5000 ? 2 : 0; // Up to 2 points
    score += subnet.alpha_liquidity > 50000 ? 2 : 0; // Up to 2 points
    score += subnet.top_holders_percent < 50 ? 1 : 0; // Up to 1 point
    // Optional macro data influence
    if (subnet.macro && subnet.macro.fear_greed_index) {
        score += subnet.macro.fear_greed_index > 50 ? 1 : -1; // Adjust based on macro data
    }
    return score;
}

// Function to render the table
function renderTable(subnets) {
    const tbody = document.getElementById('subnetTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear existing rows
    subnets.forEach(subnet => {
        const row = tbody.insertRow();
        row.insertCell().textContent = subnet.rank;
        row.insertCell().textContent = subnet.subnet_name;
        row.insertCell().textContent = subnet.emissions_per_day;
        row.insertCell().textContent = subnet.gamma_price;
        row.insertCell().textContent = subnet.gammaEmissions.toFixed(4);
        row.insertCell().textContent = subnet.market_cap;
        row.insertCell().textContent = subnet.fdv;
        row.insertCell().textContent = subnet.volume_mc;
        row.insertCell().textContent = subnet.alpha_liquidity;
        row.insertCell().textContent = subnet.root_prop;
        row.insertCell().textContent = subnet.sentiment_score;
        row.insertCell().textContent = subnet.top_holders_percent;
        row.insertCell().textContent = subnet.top_holder_7d_flow;
        row.insertCell().textContent = subnet.whale_net_7d_flow;
        row.insertCell().textContent = subnet.top_validators;
        row.insertCell().textContent = subnet.validator_stake_7d;
        row.insertCell().textContent = subnet.validator_uptime;
        row.insertCell().textContent = subnet.asymmetricScore.toFixed(2);
    });
}

// Initialize the table on page load
document.addEventListener('DOMContentLoaded', () => {
    const port = window.location.port || 3000;
    fetch(`http://localhost:${port}/api/subnets`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Calculate additional metrics and render table
            const subnets = data.map(item => {
                const gammaEmissions = item.gamma_price / item.emissions_per_day;
                const topHolderConcentration = item.top_holders_percent;
                const asymmetricScore = calculateAsymmetricScore(item);
                return {
                    ...item,
                    gammaEmissions,
                    topHolderConcentration,
                    asymmetricScore
                };
            });
            renderTable(subnets);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('evaluation-summary').textContent = '⚠ Failed to load data. Please check API access or CORS settings.';
        });
});

function filterSubnet() {
    const input = document.getElementById('subnetInput').value.trim();
    const summaryDiv = document.getElementById('evaluation-summary');
    const subnet = subnets.find(s => s.subnet.toLowerCase() === input.toLowerCase() || s.rank.toString() === input);
    if (subnet) {
        const gammaEmissions = calculateGammaEmissions(subnet).toFixed(5);
        const asymmetricScore = calculateAsymmetricScore(subnet).toFixed(2);
        summaryDiv.textContent = `🚀 ${subnet.subnet} (Rank ${subnet.rank}) → Asymmetric Score: ${asymmetricScore}, Gamma/Emissions: ${gammaEmissions}, Sentiment: ${subnet.sentiment}, Top Holder Flow: ${subnet.topHolderFlow}`;
        summaryDiv.style.color = 'green';
    } else {
        summaryDiv.textContent = 'No matching subnet found. Please try again.';
        summaryDiv.style.color = 'red';
    }
}

// Placeholder for future integration of fear/greed and OHLC data
// function integrateAdditionalData() {
//     // Code to integrate fear/greed and OHLC data
// }
