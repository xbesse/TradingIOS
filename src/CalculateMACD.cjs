/**
 * Classe utilitaire pour le calcul du MACD (Moving Average Convergence Divergence)
 */
class CalculateMACD {
  /**
   * Calcule l'EMA (Exponential Moving Average)
   * @param {Array} data - Données
   * @param {number} period - Période
   * @returns {Array} - Valeurs EMA
   */
  static calculateEMA(data, period) {
    // Vérification des données insuffisantes
    if (!data || data.length < period) {
      return [];
    }

    const multiplier = 2 / (period + 1);
    
    // Initialisation avec la moyenne simple des 'period' premières valeurs
    const firstSMA = data.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
    const ema = [firstSMA];
    
    // Calcul de l'EMA
    for (let i = period; i < data.length; i++) {
      const nextEMA = (data[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
      ema.push(nextEMA);
    }
    
    return ema;
  }
}

// Exporter la classe pour une utilisation dans Node.js
module.exports = CalculateMACD;
