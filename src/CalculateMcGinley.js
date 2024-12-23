/**
 * Classe utilitaire pour le calcul du McGinley Dynamic
 */
export default class CalculateMcGinley {
  /**
   * Calcule le McGinley Dynamic
   * @param {Array} data - Données OHLCV
   * @param {number} period - Période (par défaut 14)
   * @param {number} constant - Constante (par défaut 4)
   * @returns {Object} - Valeurs McGinley Dynamic et analyse
   */
  static calculateMcGinley(data, period = 14, constant = 4) {
    if (!data || data.length < period) {
      return {
        values: [],
        analysis: {
          trend: 'neutral',
          strength: 0,
          signals: []
        }
      };
    }

    const closes = data.map(candle => Number.parseFloat(candle.close.toFixed(8)));
    let md = [closes[0]]; // Initialisation avec le premier prix

    // Calcul du McGinley Dynamic
    for (let i = 1; i < closes.length; i++) {
      const prevMD = md[md.length - 1];
      const currentPrice = closes[i];

      // Formule du McGinley Dynamic avec précision contrôlée
      const mdValue = Number.parseFloat((
        prevMD + ((currentPrice - prevMD) / (constant * Math.pow(period, 4/period)))
      ).toFixed(8));

      md.push(mdValue);
    }

    // Analyse de la tendance
    const analysis = this.analyzeTrend(closes, md);

    return {
      values: md,
      analysis: analysis
    };
  }

  /**
   * Analyse la tendance du McGinley Dynamic
   * @param {Array} prices - Prix de clôture
   * @param {Array} md - Valeurs McGinley Dynamic
   * @returns {Object} - Résultat de l'analyse
   */
  static analyzeTrend(prices, md) {
    if (!prices || !md || prices.length < 2 || md.length < 2) {
      return {
        trend: 'neutral',
        strength: 0,
        signals: []
      };
    }

    let trend = 'neutral';
    let strength = 0;
    const signals = [];

    // Analyse de la tendance
    for (let i = 1; i < md.length; i++) {
      if (md[i] > md[i - 1]) {
        trend = 'up';
        strength++;
        signals.push('buy');
      } else if (md[i] < md[i - 1]) {
        trend = 'down';
        strength++;
        signals.push('sell');
      } else {
        signals.push('hold');
      }
    }

    return {
      trend: trend,
      strength: strength,
      signals: signals
    };
  }
}
