import fetchMarketData from './fetchMarketData.js';
import Scaler from './Scaler.js';
import CalculateMcGinley from './CalculateMcGinley.js';
import CalculateVariations from './CalculateVariations.js';

// Import coins data directly since we can't use fs in JavaScriptCore
import coinsData from './coins_export.json' assert { type: 'json' };

// Extraire la liste des trading pairs
const tradingPairs = coinsData.map(coin => coin.pair);

// Fonction principale pour calculer les variations
const calculateTradingVariations = async () => {
  try {
    // Passer la liste des trading pairs à la fonction fetchMarketData
    const marketDataObj = await fetchMarketData(tradingPairs);

    // Passer le résultat à la fonction calculateGlobalOHLCAverages
    const globalOHLCAverages = Scaler.calculateGlobalOHLCAverages(marketDataObj);

    // Passer le retour à la fonction calculateMcGinley
    const mcGinleyResult = CalculateMcGinley.calculateMcGinley(globalOHLCAverages);

    // Passer le retour à la fonction calculateMcGinleyVariations
    const mcGinleyVariations = CalculateVariations.calculateMcGinleyVariations(mcGinleyResult.values);

    // Calculer la somme des variations
    const sumOfVariations = Object.values(mcGinleyVariations).reduce((sum, variation) => sum + parseFloat(variation), 0);

    return sumOfVariations;
  } catch (error) {
    console.error('Error calculating trading variations:', error);
    throw error;
  }
};

export default calculateTradingVariations;
