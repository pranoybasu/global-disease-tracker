/**
 * Realistic mock data generator for Mpox (Monkeypox)
 * 
 * Characteristics:
 * - Endemic in Central and West Africa
 * - Recent global spread (2022+) but concentrated cases
 * - Lower case rates overall compared to other diseases
 * - Moderate mortality rate (1-3% in outbreaks, lower with treatment)
 * - High recovery rate (95-98%)
 * - Lower testing rates (targeted testing)
 * - Primarily spread through close contact
 */

import type { CountryData } from '../../../types';
import {
  COUNTRY_METADATA,
  createCountryData,
  randomFloatInRange,
  randomInRange,
  type CountryMetadata,
} from './mockDataUtils';

/**
 * Endemic countries in Central and West Africa
 */
const ENDEMIC_COUNTRIES = new Set([
  'Nigeria',
  'Democratic Republic of the Congo',
  'Cameroon',
  'Central African Republic',
  'Ghana',
  'Ivory Coast',
  'Liberia',
  'Sierra Leone',
  'Gabon',
  'Republic of the Congo',
]);

/**
 * Countries with significant recent outbreaks (2022+)
 */
const OUTBREAK_COUNTRIES = new Set([
  'USA',
  'Spain',
  'France',
  'UK',
  'Germany',
  'Brazil',
  'Netherlands',
  'Portugal',
  'Canada',
  'Mexico',
]);

/**
 * Get geographic risk multiplier for Mpox
 */
const getGeographicMultiplier = (metadata: CountryMetadata): number => {
  // Endemic African countries: highest risk
  if (ENDEMIC_COUNTRIES.has(metadata.country)) {
    return randomFloatInRange(8, 15);
  }
  
  // Recent outbreak countries: moderate-high risk
  if (OUTBREAK_COUNTRIES.has(metadata.country)) {
    return randomFloatInRange(2, 5);
  }
  
  // Other countries: low sporadic cases
  // Africa in general has higher background risk
  if (metadata.continent === 'Africa') {
    return randomFloatInRange(0.5, 1.5);
  }
  
  // Rest of world: very low
  return randomFloatInRange(0.05, 0.3);
};

/**
 * Determine if country has healthcare infrastructure for mpox detection
 */
const hasGoodSurveillance = (metadata: CountryMetadata): boolean => {
  const developedRegions = ['Europe', 'North America'];
  const developedCountries = ['USA', 'UK', 'France', 'Germany', 'Japan', 'Canada', 'Australia'];
  
  return developedRegions.includes(metadata.continent) || 
         developedCountries.includes(metadata.country);
};

/**
 * Generate mpox data for a single country
 */
const generateMpoxCountryData = (metadata: CountryMetadata): CountryData => {
  const geoMultiplier = getGeographicMultiplier(metadata);
  const hasSurveillance = hasGoodSurveillance(metadata);
  
  // Base case rate: 1-20 per 100k (much lower than other diseases)
  // Adjusted heavily by geographic risk
  const baseCaseRate = randomFloatInRange(1, 20) * geoMultiplier;
  
  // Mortality rate: 0.5-3% (lower with modern healthcare)
  // Endemic regions may have higher mortality
  const mortalityRate = ENDEMIC_COUNTRIES.has(metadata.country)
    ? randomFloatInRange(1.5, 3)
    : randomFloatInRange(0.5, 1.5);
  
  // Recovery rate: 95-98.5%
  const recoveryRate = randomFloatInRange(95, 98.5);
  
  // Testing rate: targeted, not mass testing
  // Countries with good surveillance test more
  const testingRate = hasSurveillance
    ? randomFloatInRange(0.5, 2)
    : randomFloatInRange(0.1, 0.5);
  
  // Daily change: 0.3-1.5% (slower spread than respiratory diseases)
  const dailyChangePercent = randomFloatInRange(0.3, 1.5);

  return createCountryData(metadata, {
    baseCaseRate,
    mortalityRate,
    recoveryRate,
    testingRate,
    dailyChangePercent,
  });
};

/**
 * Generate global mpox statistics
 */
export const generateMpoxGlobalData = () => {
  const countries = COUNTRY_METADATA.map(generateMpoxCountryData);
  
  const totals = countries.reduce(
    (acc, country) => ({
      cases: acc.cases + country.cases,
      deaths: acc.deaths + country.deaths,
      recovered: acc.recovered + country.recovered,
      active: acc.active + country.active,
    }),
    { cases: 0, deaths: 0, recovered: 0, active: 0 }
  );

  return {
    global: {
      ...totals,
      updated: Date.now(),
    },
    countries,
  };
};

/**
 * Main export: Get current mpox mock data
 */
export const getMpoxMockData = () => {
  return generateMpoxGlobalData();
};