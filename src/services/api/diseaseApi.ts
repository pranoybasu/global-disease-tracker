/**
 * Unified Disease API Service
 * 
 * Implements the Adapter Pattern to provide a consistent interface for fetching
 * disease data from multiple sources:
 * - Real-time COVID-19 data from disease.sh API
 * - Mock data generators for Influenza, Mpox, Malaria, and Dengue
 * 
 * This allows the application to seamlessly switch between diseases while
 * maintaining a consistent data structure and API interface.
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { Disease, type DiseaseType, type GlobalStats, type CountryData } from '../../types';
import { fetchGlobalStats, fetchCountriesData } from './covidApi';
import { getInfluenzaMockData } from './mockData/influenzaMockData';
import { getMpoxMockData } from './mockData/mpoxMockData';
import { getMalariaMockData } from './mockData/malariaMockData';
import { getDengueMockData } from './mockData/dengueMockData';

/**
 * Combined response structure for global and country-level data
 */
export interface DiseaseDataResponse {
  global: GlobalStats;
  countries: CountryData[];
}

/**
 * Adapter function that routes to the appropriate data source based on disease type
 * 
 * @param disease - The disease type to fetch data for
 * @returns Promise resolving to disease data with global stats and country breakdown
 */
const fetchDiseaseData = async (disease: DiseaseType): Promise<DiseaseDataResponse> => {
  switch (disease) {
    case Disease.COVID19: {
      // Real-time data from disease.sh API
      const [global, countries] = await Promise.all([
        fetchGlobalStats(),
        fetchCountriesData(),
      ]);
      return { global, countries };
    }

    case Disease.INFLUENZA: {
      // Mock data with seasonal flu patterns
      return getInfluenzaMockData();
    }

    case Disease.MPOX: {
      // Mock data with endemic African + outbreak patterns
      return getMpoxMockData();
    }

    case Disease.MALARIA: {
      // Mock data with tropical zone + seasonal patterns
      return getMalariaMockData();
    }

    case Disease.DENGUE: {
      // Mock data with Southeast Asian + Latin American patterns
      return getDengueMockData();
    }

    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = disease;
      throw new Error(`Unknown disease type: ${_exhaustive}`);
    }
  }
};

/**
 * React Query hook for fetching disease data
 * 
 * Features:
 * - Automatic caching and background refetching
 * - Loading and error states
 * - Stale-while-revalidate pattern
 * - Disease-specific cache keys
 * 
 * @param disease - The disease type to fetch data for
 * @returns Query result with data, loading state, and error handling
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useDiseaseData(Disease.COVID19);
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * 
 * return (
 *   <Dashboard 
 *     global={data.global} 
 *     countries={data.countries} 
 *   />
 * );
 * ```
 */
export const useDiseaseData = (disease: DiseaseType): UseQueryResult<DiseaseDataResponse, Error> => {
  return useQuery({
    // Unique cache key per disease
    queryKey: ['diseaseData', disease],
    
    // Fetch function
    queryFn: () => fetchDiseaseData(disease),
    
    // Cache configuration
    staleTime: disease === Disease.COVID19 
      ? 5 * 60 * 1000  // 5 minutes for real-time COVID-19 data
      : 30 * 60 * 1000, // 30 minutes for mock data (doesn't change)
    
    // Refetch configuration
    refetchInterval: disease === Disease.COVID19
      ? 5 * 60 * 1000  // Auto-refetch COVID-19 every 5 minutes
      : false,          // Don't auto-refetch mock data
    
    // Keep previous data while fetching new disease
    placeholderData: (previousData) => previousData,
    
    // Retry configuration
    retry: disease === Disease.COVID19 ? 3 : 1, // More retries for real API
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook for fetching global stats only (lighter weight)
 * 
 * @param disease - The disease type to fetch stats for
 * @returns Query result with global statistics
 */
export const useDiseaseGlobalStats = (disease: DiseaseType): UseQueryResult<GlobalStats, Error> => {
  return useQuery({
    queryKey: ['diseaseGlobalStats', disease],
    
    queryFn: async () => {
      if (disease === Disease.COVID19) {
        return fetchGlobalStats();
      }
      
      // For mock data, extract global stats from full dataset
      const data = await fetchDiseaseData(disease);
      return data.global;
    },
    
    staleTime: disease === Disease.COVID19 ? 5 * 60 * 1000 : 30 * 60 * 1000,
    refetchInterval: disease === Disease.COVID19 ? 5 * 60 * 1000 : false,
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook for fetching country data only
 * 
 * @param disease - The disease type to fetch countries for
 * @returns Query result with country-level data
 */
export const useDiseaseCountries = (disease: DiseaseType): UseQueryResult<CountryData[], Error> => {
  return useQuery({
    queryKey: ['diseaseCountries', disease],
    
    queryFn: async () => {
      if (disease === Disease.COVID19) {
        return fetchCountriesData();
      }
      
      // For mock data, extract countries from full dataset
      const data = await fetchDiseaseData(disease);
      return data.countries;
    },
    
    staleTime: disease === Disease.COVID19 ? 5 * 60 * 1000 : 30 * 60 * 1000,
    refetchInterval: disease === Disease.COVID19 ? 5 * 60 * 1000 : false,
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Prefetch disease data for better UX when switching diseases
 * Useful for preloading data on hover or in anticipation of user action
 * 
 * @param disease - The disease type to prefetch
 * 
 * @example
 * ```tsx
 * <button 
 *   onMouseEnter={() => prefetchDiseaseData(Disease.INFLUENZA)}
 *   onClick={() => setDisease(Disease.INFLUENZA)}
 * >
 *   View Influenza Data
 * </button>
 * ```
 */
export const prefetchDiseaseData = async (disease: DiseaseType): Promise<void> => {
  const queryClient = (await import('./queryClient')).queryClient;
  
  await queryClient.prefetchQuery({
    queryKey: ['diseaseData', disease],
    queryFn: () => fetchDiseaseData(disease),
    staleTime: disease === Disease.COVID19 ? 5 * 60 * 1000 : 30 * 60 * 1000,
  });
};

/**
 * Invalidate disease data cache to force a refetch
 * Useful after configuration changes or when data might be stale
 * 
 * @param disease - Optional disease type to invalidate (invalidates all if not specified)
 */
export const invalidateDiseaseData = async (disease?: DiseaseType): Promise<void> => {
  const queryClient = (await import('./queryClient')).queryClient;
  
  await queryClient.invalidateQueries({
    queryKey: disease ? ['diseaseData', disease] : ['diseaseData'],
  });
};