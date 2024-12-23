import TimeStamp from './Database.js';
import CalculateMACD from './CalculateMACD.js';

/**
 * Class to scale values
 */
export default class Scaler {
    /**
     * Scales a value using the inverse tangent function, mapping the output to a range of [-1, 1].
     *
     * @param {number} y - The input value.
     * @param {number} [maxValue=100] - The maximum value of the input range.
     * @returns {number} The scaled value.
     */
    static scaleArctanY(y, maxValue = 100) {
        const scale = 2 / Math.PI; // Scale factor to map arctan to [-1, 1]

        if (y >= 0) {
            // For positive or zero values, use the positive arctan function
            return maxValue * scale * Math.atan(y / maxValue);
        } else {
            // For negative values, use the negative arctan function and negate the result
            return -maxValue * scale * Math.atan(-y / maxValue);
        }
    }

    /**
     * Scales a value using a custom mathematical function based on S-curves.
     *
     * @param {number} x - The input value.
     * @returns {number} The scaled value.
     */
    static scaleSPlus(x) {
        // This function scales the input value in a way that provides a smooth S-like curve.
        // It adds 50 to the input, then applies a correction factor based on the input and its squared value.
        // This results in a curve that starts relatively slowly, accelerates in the middle, and slows down again at the end.
        if(x >=0) {
            return 50 + (x - 50) * (1 - Math.pow(x, 2.1) / 10000);
        } else {
            return -(50 + (x - 50) * (1 - Math.pow(x, 2.1) / 10000));
        }
    }

    /**
     * Scales a value using a sigmoid transformation, which maps the input value to a range of [-1, 1].
     * The transformation is also known as the logistic function.
     *
     * @param {number} value - The input value.
     * @returns {number} The scaled value.
     */
    static sTransformation(value) {
        if (value >= 0) {
            // For positive values, use the sigmoid function
            return 1 / (1 + Math.exp(-value));
        } else {
            // For negative values, use the sigmoid function and negate the result
            return -1 / (1 + Math.exp(value));
        }
    }

    /**
     * Calculate global OHLC averages from multiple market data series
     * @param {Object} marketData - Record containing OHLC data series keyed by symbol
     * @returns {Array} List of averaged OHLC values sorted chronologically
     */
    static calculateGlobalOHLCAverages(marketData) {
        const scaledData = {};
        
        for (const symbolName in marketData) {
            const symbolData = marketData[symbolName];
            scaledData[symbolName] = this.minMaxScaleOHLC(symbolData);
        }

        const timestampMap = {};
        
        for (const symbolData of Object.values(scaledData)) {
            for (const candle of symbolData) {
                const timestamp = candle.timeStamp.toString();

                if (!timestampMap[timestamp]) {
                    timestampMap[timestamp] = {
                        open: { sum: 0, count: 0 },
                        high: { sum: 0, count: 0 },
                        low: { sum: 0, count: 0 },
                        close: { sum: 0, count: 0 },
                        timeStamp: candle.timeStamp
                    };
                }

                const entry = timestampMap[timestamp];
                entry.open.sum += candle.open;
                entry.open.count += 1;
                entry.high.sum += candle.high;
                entry.high.count += 1;
                entry.low.sum += candle.low;
                entry.low.count += 1;
                entry.close.sum += candle.close;
                entry.close.count += 1;
            }
        }

        const rawAverages = [];
        for (const timestamp in timestampMap) {
            const entry = timestampMap[timestamp];
            rawAverages.push({
                timeStamp: entry.timeStamp,
                open: entry.open.sum / entry.open.count,
                high: entry.high.sum / entry.high.count,
                low: entry.low.sum / entry.low.count,
                close: entry.close.sum / entry.close.count
            });
        }

        // Sort by timestamp
        rawAverages.sort((a, b) => TimeStamp.compare(a.timeStamp, b.timeStamp));

        return rawAverages;
    }

    /**
     * Min-Max scale OHLC data
     * @param {Array} data - OHLC data
     * @returns {Array} Scaled OHLC data
     */
    static minMaxScaleOHLC(data) {
        if (data.length === 0) return data;

        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;
        for (const candle of data) {
            min = Math.min(min, candle.open, candle.high, candle.low, candle.close);
            max = Math.max(max, candle.open, candle.high, candle.low, candle.close);
        }

        const scaledData = data.map(candle => ({
            open: (candle.open - min) / (max - min),
            high: (candle.high - min) / (max - min),
            low: (candle.low - min) / (max - min),
            close: (candle.close - min) / (max - min),
            timeStamp: candle.time
        }));

        return scaledData;
    }
}
