import TimeStamp from './Database.js';

class KrakenAPI {
    constructor() {
        this.baseUrl = 'https://api.kraken.com/0/public';
        this.intervals = {
            1: 1,      // 1 minute
            5: 5,      // 5 minutes
            15: 15,    // 15 minutes
            30: 30,    // 30 minutes
            60: 60,    // 1 hour
            240: 240,  // 4 hours
            1440: 1440,// 1 day
            10080: 10080, // 1 week
            21600: 21600  // 2 weeks
        };
    }

    // Convert our symbol format to Kraken's format
    formatSymbol(symbol) {
        if (!symbol) {
            throw new Error('Invalid symbol');
        }

        // Example: BTC/USD -> XBTUSD
        const symbolMap = {
            'BTC': 'XBT',
            'ETH': 'ETH',
            'USD': 'USD',
            'EUR': 'EUR',
            '/': ''
        };

        return symbol
            .split('')
            .map(char => symbolMap[char] || char)
            .join('');
    }

    // Convert Kraken timestamp to our TimeStamp format
    convertTimestamp(unixTimestamp, roundK = this.intervals[1]) {
        const date = new Date(unixTimestamp * 1000);

        // Round minutes to nearest 5-minute interval
        const minutes = date.getMinutes();
        const roundedMinutes = Math.round(minutes / roundK) * roundK;
        date.setMinutes(roundedMinutes);

        return new TimeStamp(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            roundedMinutes
        );
    }

    // Fetch OHLC data from Kraken API
    async fetchOHLCData(symbol, interval = 1, since = null) {
        if (!symbol) {
            throw new Error('Invalid symbol');
        }

        const krakenSymbol = this.formatSymbol(symbol);
        const url = `${this.baseUrl}/OHLC?pair=${krakenSymbol}&interval=${interval}${since ? `&since=${since}` : ''}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error && data.error.length) {
            throw new Error(data.error.join(', '));
        }

        const result = data.result[Object.keys(data.result)[0]];
        return result.map(candle => ({
            time: this.convertTimestamp(candle[0]),
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            vwap: parseFloat(candle[5]),
            volume: parseFloat(candle[6]),
            count: parseInt(candle[7], 10)
        }));
    }
}

export default new KrakenAPI();
