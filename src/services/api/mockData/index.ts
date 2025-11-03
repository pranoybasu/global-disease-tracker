/**
 * Mock Data Generators - Barrel Export
 * 
 * Centralized export point for all disease mock data generators
 */

export { getInfluenzaMockData } from './influenzaMockData';
export { getMpoxMockData } from './mpoxMockData';
export { getMalariaMockData } from './malariaMockData';
export { getDengueMockData } from './dengueMockData';

// Re-export utilities for potential external use
export type { CountryMetadata } from './mockDataUtils';