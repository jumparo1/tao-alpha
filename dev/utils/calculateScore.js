/**
 * Calculates the Gamma/Emissions ratio for a subnet
 * @param {Object} subnet - Subnet data object
 * @returns {number} Gamma/Emissions ratio
 */
function calculateGammaEmissions(subnet) {
    if (!subnet.gamma_price || !subnet.emissions_per_day) {
        return 0;
    }
    return subnet.gamma_price / subnet.emissions_per_day;
}

/**
 * Calculates the asymmetric score for a subnet based on various metrics
 * @param {Object} subnet - Subnet data object
 * @returns {number} Asymmetric score (0-10)
 */
function calculateAsymmetricScore(subnet) {
    let score = 0;
    const gammaEmissions = calculateGammaEmissions(subnet);

    // Gamma/Emissions ratio (up to 3 points)
    // Lower ratio is better (less emissions per gamma)
    score += Math.max(0, 3 * (1 - gammaEmissions));

    // Sentiment score (up to 2 points)
    if (subnet.sentiment_score === 'Positive') {
        score += 2;
    } else if (subnet.sentiment_score === 'Neutral') {
        score += 1;
    }

    // Validator stake (up to 2 points)
    // Higher stake indicates better network security
    if (subnet.validator_stake_7d > 10000) {
        score += 2;
    } else if (subnet.validator_stake_7d > 5000) {
        score += 1;
    }

    // Alpha liquidity (up to 2 points)
    // Higher liquidity indicates better market depth
    if (subnet.alpha_liquidity > 100000) {
        score += 2;
    } else if (subnet.alpha_liquidity > 50000) {
        score += 1;
    }

    // Top holders concentration (up to 1 point)
    // Lower concentration is better for decentralization
    if (subnet.top_holders_percent < 30) {
        score += 1;
    } else if (subnet.top_holders_percent < 50) {
        score += 0.5;
    }

    // Macro sentiment influence (up to 1 point)
    if (subnet.macro?.fear_greed_index) {
        // Adjust score based on market sentiment
        // Higher fear/greed index (50+) adds points, lower subtracts
        score += subnet.macro.fear_greed_index > 50 ? 1 : -1;
    }

    return Math.min(10, Math.max(0, score));
}

/**
 * Calculates additional metrics for a subnet
 * @param {Object} subnet - Subnet data object
 * @returns {Object} Subnet with additional calculated metrics
 */
function calculateMetrics(subnet) {
    const gammaEmissions = calculateGammaEmissions(subnet);
    const asymmetricScore = calculateAsymmetricScore({
        ...subnet,
        gammaEmissions
    });

    return {
        ...subnet,
        gammaEmissions,
        asymmetricScore,
        // Add any other calculated metrics here
    };
}

module.exports = {
    calculateGammaEmissions,
    calculateAsymmetricScore,
    calculateMetrics
}; 