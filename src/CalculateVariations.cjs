/**
 * Classe utilitaire pour le calcul des variations McGinley
 */
class CalculateVariations {
  /**
   * Calcule les variations McGinley pour différents intervalles de temps
   * @param {Array} mcginleyValues - Valeurs McGinley
   * @param {Object} intervals - Intervalles de temps à calculer (ex: {'5m': 5, '10m': 10})
   * @returns {Object} - Variations calculées pour chaque intervalle
   */
  static calculateMcGinleyVariations(mcginleyValues, intervals = {
    '5m': 5,    
    '10m': 10,    
    '15m': 15,    
    '20m': 20,    
    '25m': 25   
  }) {
    if (!mcginleyValues || mcginleyValues.length === 0) {
      return {};
    }
    
    const currentValue = mcginleyValues[mcginleyValues.length - 1];
    const variations = {};

    Object.entries(intervals).forEach(([period, minutes]) => {
      const index = mcginleyValues.length - 1 - minutes;
      if (index >= 0) {
        const pastValue = mcginleyValues[index];
        variations[period] = this.calculateVariation(pastValue, currentValue);
      }
    });

    return variations;
  }

  /**
   * Calcule l'index de variation McGinley pour différents intervalles de temps
   * @param {Array} mcginleyValues - Valeurs McGinley
   * @param {Object} intervals - Intervalles de temps à calculer (ex: {'5m': 5, '10m': 10})
   * @returns {Object} - index global de variation
   */  
  static calculateVariationIndex(mcginleyValues, intervals = {
    '5m': 5,    
    '10m': 10,    
    '15m': 15,    
    '20m': 20,    
    '25m': 25   
  }) {
    const variations = this.calculateMcGinleyVariations(mcginleyValues, intervals);
    
    let sum = 0;
    for (const period in variations) {
      sum += parseFloat(variations[period]);
    }

    return sum.toFixed(2);
  }

  /**
   * Calcule la variation entre deux valeurs
   * @param {number} pastValue - Valeur passée
   * @param {number} currentValue - Valeur actuelle
   * @returns {number} - Variation calculée
   */
  static calculateVariation(pastValue, currentValue) {
    return ((currentValue - pastValue) / pastValue * 100).toFixed(2);
  }
}

// Exporter la classe pour une utilisation dans Node.js
module.exports = CalculateVariations;
