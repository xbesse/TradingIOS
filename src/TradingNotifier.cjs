const fs = require('fs');
const path = require('path');
const fetchMarketData = require('./fetchMarketData.cjs');
const Scaler = require('./Scaler.cjs');
const CalculateMcGinley = require('./CalculateMcGinley.cjs');
const CalculateVariations = require('./CalculateVariations.cjs');

// Lire le fichier coins_export.json
const coinsFilePath = path.join(__dirname, 'coins_export.json');
const coinsData = JSON.parse(fs.readFileSync(coinsFilePath, 'utf8'));
// Extraire la liste des trading pairs
const tradingPairs = coinsData.map(coin => coin.pair);

// Passer la liste des trading pairs à la fonction fetchMarketData
fetchMarketData(tradingPairs).then(marketDataObj => {
  // Passer le résultat à la fonction calculateGlobalOHLCAverages
  const globalOHLCAverages = Scaler.calculateGlobalOHLCAverages(marketDataObj);

  // Passer le retour à la fonction calculateMcGinley
  const mcGinleyResult = CalculateMcGinley.calculateMcGinley(globalOHLCAverages);

  // Passer le retour à la fonction calculateMcGinleyVariations
  const mcGinleyVariations = CalculateVariations.calculateMcGinleyVariations(mcGinleyResult.values);


  // Calculer la somme des variations
  const sumOfVariations = Object.values(mcGinleyVariations).reduce((sum, variation) => sum + parseFloat(variation), 0);

  // Retourner le résultat
  console.log(sumOfVariations);
}).catch(error => {
  console.error('Error fetching market data:', error);
});