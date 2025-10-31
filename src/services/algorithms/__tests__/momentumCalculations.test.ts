import { describe, it, expect } from 'vitest';
import {
  analyzeMomentum,
  formatGrowthRate,
  getConfidenceLevel,
  getTrendIndicator,
  type GrowthMetrics,
} from '../momentumCalculations';

describe('momentumCalculations', () => {
  describe('analyzeMomentum', () => {
    it('should detect accelerating trend when all rates are positive and increasing', () => {
      const metrics: GrowthMetrics = {
        total: 10000,
        new1Day: 100,
        new3Days: 250,
        new7Days: 500,
      };

      const result = analyzeMomentum(metrics);

      expect(result.trend).toBe('accelerating');
      expect(result.worsening).toBe(true);
      expect(result.improving).toBe(false);
    });

    it('should detect declining trend when rates are decreasing', () => {
      const metrics: GrowthMetrics = {
        total: 10000,
        new1Day: 20,
        new3Days: 80,
        new7Days: 300,
      };

      const result = analyzeMomentum(metrics);

      expect(result.trend).toBe('declining');
      expect(result.improving).toBe(true);
      expect(result.worsening).toBe(false);
    });

    it('should detect stable trend when growth is minimal', () => {
      const metrics: GrowthMetrics = {
        total: 100000,
        new1Day: 5,
        new3Days: 15,
        new7Days: 35,
      };

      const result = analyzeMomentum(metrics);

      expect(result.trend).toBe('stable');
      expect(result.improving).toBe(false);
      expect(result.worsening).toBe(false);
    });

    it('should handle zero total cases', () => {
      const metrics: GrowthMetrics = {
        total: 0,
        new1Day: 0,
        new3Days: 0,
        new7Days: 0,
      };

      const result = analyzeMomentum(metrics);

      expect(result.growthRates.rate1Day).toBe(0);
      expect(result.growthRates.rate3Day).toBe(0);
      expect(result.growthRates.rate7Day).toBe(0);
      expect(result.trend).toBe('stable');
    });

    it('should handle negative growth (recoveries)', () => {
      const metrics: GrowthMetrics = {
        total: 10000,
        new1Day: -50,
        new3Days: -120,
        new7Days: -300,
      };

      const result = analyzeMomentum(metrics);

      expect(result.growthRates.rate1Day).toBeLessThan(0);
      expect(result.improving).toBe(true);
      expect(result.trend).toBe('declining');
    });

    it('should calculate daily averages correctly', () => {
      const metrics: GrowthMetrics = {
        total: 10000,
        new1Day: 100,
        new3Days: 300,
        new7Days: 700,
      };

      const result = analyzeMomentum(metrics);

      expect(result.growthRates.avg3Day).toBeCloseTo(100, 1);
      expect(result.growthRates.avg7Day).toBeCloseTo(100, 1);
    });

    it('should detect increasing trend when growth accelerates', () => {
      const metrics: GrowthMetrics = {
        total: 10000,
        new1Day: 150,
        new3Days: 400,
        new7Days: 800,
      };

      const result = analyzeMomentum(metrics);

      expect(result.trend).toBe('increasing');
      expect(result.worsening).toBe(true);
    });

    it('should detect decreasing trend when growth decelerates', () => {
      const metrics: GrowthMetrics = {
        total: 10000,
        new1Day: 50,
        new3Days: 180,
        new7Days: 500,
      };

      const result = analyzeMomentum(metrics);

      expect(result.trend).toBe('decreasing');
      expect(result.improving).toBe(true);
    });

    it('should calculate confidence based on data consistency', () => {
      const consistentMetrics: GrowthMetrics = {
        total: 10000,
        new1Day: 100,
        new3Days: 300,
        new7Days: 700,
      };

      const inconsistentMetrics: GrowthMetrics = {
        total: 10000,
        new1Day: 500,
        new3Days: 100,
        new7Days: 800,
      };

      const consistent = analyzeMomentum(consistentMetrics);
      const inconsistent = analyzeMomentum(inconsistentMetrics);

      expect(consistent.confidence).toBeGreaterThan(inconsistent.confidence);
    });

    it('should handle edge case of very small total', () => {
      const metrics: GrowthMetrics = {
        total: 1,
        new1Day: 0,
        new3Days: 0,
        new7Days: 1,
      };

      const result = analyzeMomentum(metrics);

      expect(result.growthRates.rate7Day).toBe(1);
      expect(result.trend).toBe('increasing');
    });
  });

  describe('formatGrowthRate', () => {
    it('should format positive growth rates as percentages', () => {
      expect(formatGrowthRate(0.05)).toBe('+5.0%');
      expect(formatGrowthRate(0.123)).toBe('+12.3%');
      expect(formatGrowthRate(1.5)).toBe('+150.0%');
    });

    it('should format negative growth rates as percentages', () => {
      expect(formatGrowthRate(-0.05)).toBe('-5.0%');
      expect(formatGrowthRate(-0.123)).toBe('-12.3%');
    });

    it('should format zero growth rate', () => {
      expect(formatGrowthRate(0)).toBe('+0.0%');
    });

    it('should format small rates with appropriate precision', () => {
      expect(formatGrowthRate(0.001)).toBe('+0.1%');
      expect(formatGrowthRate(0.0001)).toBe('+0.0%');
    });

    it('should format large rates correctly', () => {
      expect(formatGrowthRate(10.5)).toBe('+1050.0%');
    });
  });

  describe('getConfidenceLevel', () => {
    it('should return high confidence for 80%+', () => {
      expect(getConfidenceLevel(0.8)).toBe('high');
      expect(getConfidenceLevel(0.95)).toBe('high');
      expect(getConfidenceLevel(1.0)).toBe('high');
    });

    it('should return medium confidence for 50-79%', () => {
      expect(getConfidenceLevel(0.5)).toBe('medium');
      expect(getConfidenceLevel(0.65)).toBe('medium');
      expect(getConfidenceLevel(0.79)).toBe('medium');
    });

    it('should return low confidence for <50%', () => {
      expect(getConfidenceLevel(0.0)).toBe('low');
      expect(getConfidenceLevel(0.25)).toBe('low');
      expect(getConfidenceLevel(0.49)).toBe('low');
    });

    it('should handle edge cases', () => {
      expect(getConfidenceLevel(-0.1)).toBe('low');
      expect(getConfidenceLevel(1.5)).toBe('high');
    });
  });

  describe('getTrendIndicator', () => {
    it('should return correct emoji for each trend', () => {
      expect(getTrendIndicator('accelerating')).toBe('📈⚠️');
      expect(getTrendIndicator('increasing')).toBe('📈');
      expect(getTrendIndicator('stable')).toBe('➡️');
      expect(getTrendIndicator('decreasing')).toBe('📉');
      expect(getTrendIndicator('declining')).toBe('📉✅');
    });
  });

  describe('Real-world scenarios', () => {
    it('should correctly analyze early outbreak phase', () => {
      const metrics: GrowthMetrics = {
        total: 1000,
        new1Day: 200,
        new3Days: 500,
        new7Days: 900,
      };

      const result = analyzeMomentum(metrics);

      expect(result.trend).toBe('accelerating');
      expect(result.worsening).toBe(true);
      expect(result.growthRates.rate1Day).toBeCloseTo(0.2, 2);
    });

    it('should correctly analyze peak plateau phase', () => {
      const metrics: GrowthMetrics = {
        total: 50000,
        new1Day: 500,
        new3Days: 1500,
        new7Days: 3500,
      };

      const result = analyzeMomentum(metrics);

      expect(result.trend).toBe('stable');
      expect(result.improving).toBe(false);
      expect(result.worsening).toBe(false);
    });

    it('should correctly analyze recovery phase', () => {
      const metrics: GrowthMetrics = {
        total: 100000,
        new1Day: 50,
        new3Days: 200,
        new7Days: 600,
      };

      const result = analyzeMomentum(metrics);

      expect(result.trend).toBe('declining');
      expect(result.improving).toBe(true);
    });

    it('should correctly analyze controlled outbreak', () => {
      const metrics: GrowthMetrics = {
        total: 10000,
        new1Day: 30,
        new3Days: 100,
        new7Days: 250,
      };

      const result = analyzeMomentum(metrics);

      expect(result.trend).toBe('decreasing');
      expect(result.improving).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    it('should handle erratic data with low confidence', () => {
      const metrics: GrowthMetrics = {
        total: 10000,
        new1Day: 500,
        new3Days: 200,
        new7Days: 800,
      };

      const result = analyzeMomentum(metrics);

      expect(result.confidence).toBeLessThan(0.7);
    });
  });

  describe('Integration with containment score', () => {
    it('should provide compatible data for containment score calculation', () => {
      const metrics: GrowthMetrics = {
        total: 10000,
        new1Day: 50,
        new3Days: 180,
        new7Days: 500,
      };

      const momentum = analyzeMomentum(metrics);

      // These values should be usable for containment score
      expect(momentum.growthRates.rate1Day).toBeGreaterThanOrEqual(0);
      expect(momentum.growthRates.rate3Day).toBeGreaterThanOrEqual(0);
      expect(momentum.growthRates.rate7Day).toBeGreaterThanOrEqual(0);
    });
  });
});
