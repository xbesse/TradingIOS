import krakenAPI from './KrakenAPI.js';

const fetchMarketData = async (symbols) => {
  if (!symbols || symbols.length === 0) {
    throw new Error('No trading pairs selected. Please select pairs in the Parameters page.');
  }

  try {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 18 * 60 * 60 * 1000); // 18 hours ago

    const dataPromises = symbols.map(async (symbol) => {
      try {
        const data = await krakenAPI.fetchOHLCData(
          symbol,
          krakenAPI.intervals[1] // 1-minute intervals
        );

        return { symbol, data };

      } catch (err) {
        console.error(`Error fetching data for ${symbol}:`, err);
        throw new Error(`Failed to fetch data for ${symbol}: ${err.message}`);
      }
    });

    const results = await Promise.all(dataPromises);

    // Convert array of results to an object keyed by symbol
    const marketDataObj = results.reduce((acc, { symbol, data }) => {
      if (data && data.length > 0) {
        acc[symbol] = data;
      }
      return acc;
    }, {});

    if (Object.keys(marketDataObj).length === 0) {
      throw new Error('No valid market data received from any trading pair');
    }

    return marketDataObj;
  } catch (err) {
    console.error('Error fetching market data:', err);
    throw err;
  }
};

export default fetchMarketData;
