import { describe, it, expect } from 'vitest';
import {
  calculateContainmentScore,
  getContainmentScoreDescription,
  getContainmentScoreColor,
  type ContainmentScoreInput,
} from '../containmentScore';

describe('containmentScore', () => {
  describe('calculateContainmentScore', () => {
    it('should return perfect score for zero cases', () => {
      const input: ContainmentScoreInput = {
        currentConfirmed: 0,
        growthLast1Day: 0,
        growthLast3Days: 0,
        growthLast7Days: 0,
      };

      const result = calculateContainmentScore(input);

      expect(result.score).toBe(10);
      expect(result.weightedGrowthRate).toBe(0);
    });

    it('should return score 0 for exponential outbreak (100%+ weighted growth)', () => {
      const input: ContainmentScoreInput = {
        currentConfirmed: 1000,
        growthLast1Day: 500,
        growthLast3Days: 1200,
        growthLast7Days: 2500,
      };

      const result = calculateContainmentScore(input);

      expect(result.score).toBe(0);
      expect(result.weightedGrowthRate).toBeGreaterThanOrEqual(1.0);
    });

    it('should return score 10 for excellent containment (<0.1% weighted growth)', () => {
      const input: ContainmentScoreInput = {
        currentConfirmed: 100000,
        growthLast1Day: 5,
        growthLast3Days: 15,
        growthLast7Days: 35,
      };

      const result = calculateContainmentScore(input);

      expect(result.score).toBe(10);
      expect(result.weightedGrowthRate).toBeLessThan(0.001);
    });

    it('should return score 5 for declining containment (2-5% weighted growth)', () => {
      const input: ContainmentScoreInput = {
        currentConfirmed: 10000,
        growthLast1Day: 50,
        growthLast3Days: 180,
        growthLast7Days: 500,
      };

      const result = calculateContainmentScore(input);

      expect(result.score).toBe(5);
      expect(result.weightedGrowthRate).toBeGreaterThanOrEqual(0.02);
      expect(result.weightedGrowthRate).toBeLessThan(0.05);
    });

    it('should calculate individual growth rates correctly', () => {
      const input: ContainmentScoreInput = {
        currentConfirmed: 1000,
        growthLast1Day: 10, // 1% daily
        growthLast3Days: 30, // 3% over 3 days
        growthLast7Days: 70, // 7% over 7 days
      };

      const result = calculateContainmentScore(input);

      expect(result.breakdown.rate1Day).toBeCloseTo(0.01, 4);
      expect(result.breakdown.rate3Day).toBeCloseTo(0.03, 4);
      expect(result.breakdown.rate7Day).toBeCloseTo(0.07, 4);
    });

    it('should weight 7-day growth most heavily', () => {
      const input1: ContainmentScoreInput = {
        currentConfirmed: 1000,
        growthLast1Day: 100, // High 1-day growth
        growthLast3Days: 50,
        growthLast7Days: 50,
      };

      const input2: ContainmentScoreInput = {
        currentConfirmed: 1000,
        growthLast1Day: 10,
        growthLast3Days: 50,
        growthLast7Days: 200, // High 7-day growth
      };

      const result1 = calculateContainmentScore(input1);
      const result2 = calculateContainmentScore(input2);

      // Despite similar total growth, result2 should have higher weighted rate
      // because 7-day growth has 60% weight vs 10% for 1-day
      expect(result2.weightedGrowthRate).toBeGreaterThan(result1.weightedGrowthRate);
    });

    it('should handle negative growth (recoveries exceeding new cases)', () => {
      const input: ContainmentScoreInput = {
        currentConfirmed: 10000,
        growthLast1Day: -50,
        growthLast3Days: -120,
        growthLast7Days: -300,
      };

      const result = calculateContainmentScore(input);

      expect(result.score).toBe(10); // Negative growth = excellent containment
      expect(result.weightedGrowthRate).toBeLessThan(0);
    });

    it('should match original algorithm thresholds', () => {
      const testCases = [
        { weightedGrowth: 1.5, expectedScore: 0 },
        { weightedGrowth: 0.75, expectedScore: 1 },
        { weightedGrowth: 0.35, expectedScore: 2 },
        { weightedGrowth: 0.15, expectedScore: 3 },
        { weightedGrowth: 0.075, expectedScore: 4 },
        { weightedGrowth: 0.035, expectedScore: 5 },
        { weightedGrowth: 0.015, expectedScore: 6 },
        { weightedGrowth: 0.0075, expectedScore: 7 },
        { weightedGrowth: 0.0035, expectedScore: 8 },
        { weightedGrowth: 0.0015, expectedScore: 9 },
        { weightedGrowth: 0.0005, expectedScore: 10 },
      ];

      testCases.forEach(({ weightedGrowth, expectedScore }) => {
        // Create input that produces the target weighted growth
        // Using primarily 7-day growth since it has 60% weight
        const currentConfirmed = 1000;
        const growthLast7Days = (weightedGrowth * currentConfirmed) / 0.6;

        const input: ContainmentScoreInput = {
          currentConfirmed,
          growthLast1Day: growthLast7Days * 0.1,
          growthLast3Days: growthLast7Days * 0.3,
          growthLast7Days,
        };

        const result = calculateContainmentScore(input);
        expect(result.score).toBe(expectedScore);
      });
    });
  });

  describe('getContainmentScoreDescription', () => {
    it('should return correct descriptions for all scores', () => {
      expect(getContainmentScoreDescription(10)).toBe('Excellent containment');
      expect(getContainmentScoreDescription(9)).toBe('Very good containment');
      expect(getContainmentScoreDescription(8)).toBe('Good containment');
      expect(getContainmentScoreDescription(7)).toBe('Moderate containment');
      expect(getContainmentScoreDescription(6)).toBe('Fair containment');
      expect(getContainmentScoreDescription(5)).toBe('Declining containment');
      expect(getContainmentScoreDescription(4)).toBe('Poor containment');
      expect(getContainmentScoreDescription(3)).toBe('Very poor containment');
      expect(getContainmentScoreDescription(2)).toBe('Critical containment');
      expect(getContainmentScoreDescription(1)).toBe('Severe outbreak');
      expect(getContainmentScoreDescription(0)).toBe('Exponential outbreak');
    });

    it('should return "Unknown" for invalid scores', () => {
      expect(getContainmentScoreDescription(-1)).toBe('Unknown');
      expect(getContainmentScoreDescription(11)).toBe('Unknown');
    });
  });

  describe('getContainmentScoreColor', () => {
    it('should return green for excellent scores (8-10)', () => {
      expect(getContainmentScoreColor(10)).toBe('#22c55e');
      expect(getContainmentScoreColor(9)).toBe('#22c55e');
      expect(getContainmentScoreColor(8)).toBe('#22c55e');
    });

    it('should return lime for good scores (6-7)', () => {
      expect(getContainmentScoreColor(7)).toBe('#84cc16');
      expect(getContainmentScoreColor(6)).toBe('#84cc16');
    });

    it('should return yellow for moderate scores (4-5)', () => {
      expect(getContainmentScoreColor(5)).toBe('#eab308');
      expect(getContainmentScoreColor(4)).toBe('#eab308');
    });

    it('should return orange for poor scores (2-3)', () => {
      expect(getContainmentScoreColor(3)).toBe('#f97316');
      expect(getContainmentScoreColor(2)).toBe('#f97316');
    });

    it('should return red for critical scores (0-1)', () => {
      expect(getContainmentScoreColor(1)).toBe('#ef4444');
      expect(getContainmentScoreColor(0)).toBe('#ef4444');
    });
  });
});
