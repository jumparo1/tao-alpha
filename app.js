// Remove mock data array since we're using API data
let subnets = []; // Will store the fetched data

// Function to calculate Gamma/Emissions ratio
function calculateGammaEmissions(subnet) {
    return subnet.gamma_price / subnet.emissions_per_day;
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
        row.insertCell().textContent = subnet.emissions_per_day?.toFixed(2) || 'N/A';
        row.insertCell().textContent = subnet.gamma_price?.toFixed(4) || 'N/A';
        row.insertCell().textContent = subnet.gammaEmissions?.toFixed(4) || 'N/A';
        row.insertCell().textContent = subnet.market_cap?.toLocaleString() || 'N/A';
        row.insertCell().textContent = subnet.fdv?.toLocaleString() || 'N/A';
        row.insertCell().textContent = subnet.volume_mc?.toFixed(2) || 'N/A';
        row.insertCell().textContent = subnet.alpha_liquidity?.toLocaleString() || 'N/A';
        row.insertCell().textContent = subnet.root_prop?.toFixed(2) || 'N/A';
        row.insertCell().textContent = subnet.sentiment_score || 'N/A';
        row.insertCell().textContent = subnet.top_holders_percent?.toFixed(2) || 'N/A';
        row.insertCell().textContent = subnet.top_holder_7d_flow?.toLocaleString() || 'N/A';
        row.insertCell().textContent = subnet.whale_net_7d_flow?.toLocaleString() || 'N/A';
        row.insertCell().textContent = subnet.top_validators || 'N/A';
        row.insertCell().textContent = subnet.validator_stake_7d?.toLocaleString() || 'N/A';
        row.insertCell().textContent = subnet.validator_uptime?.toFixed(2) || 'N/A';
        row.insertCell().textContent = subnet.asymmetricScore?.toFixed(2) || 'N/A';
    });
}

// Initialize the table on page load
document.addEventListener('DOMContentLoaded', () => {
    // Use the current window location for the API URL
    const apiUrl = `${window.location.protocol}//${window.location.host}/api/subnets`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Calculate additional metrics and render table
            subnets = data.map(item => {
                const gammaEmissions = item.gamma_price / item.emissions_per_day;
                const asymmetricScore = calculateAsymmetricScore({
                    ...item,
                    gammaEmissions
                });
                return {
                    ...item,
                    gammaEmissions,
                    asymmetricScore
                };
            });
            renderTable(subnets);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('evaluation-summary').textContent = 
                `⚠ Failed to load data: ${error.message}. Please check if the server is running.`;
            document.getElementById('evaluation-summary').style.color = 'red';
        });
});

function filterSubnet() {
    const input = document.getElementById('subnetInput').value.trim();
    const summaryDiv = document.getElementById('evaluation-summary');
    const subnet = subnets.find(s => 
        s.subnet_name?.toLowerCase() === input.toLowerCase() || 
        s.rank?.toString() === input
    );
    
    if (subnet) {
        const gammaEmissions = subnet.gammaEmissions?.toFixed(5) || 'N/A';
        const asymmetricScore = subnet.asymmetricScore?.toFixed(2) || 'N/A';
        summaryDiv.textContent = 
            `🚀 ${subnet.subnet_name} (Rank ${subnet.rank}) → ` +
            `Asymmetric Score: ${asymmetricScore}, ` +
            `Gamma/Emissions: ${gammaEmissions}, ` +
            `Sentiment: ${subnet.sentiment_score}, ` +
            `Top Holder Flow: ${subnet.top_holder_7d_flow?.toLocaleString() || 'N/A'}`;
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
