/**
 * React Query configuration and client setup
 */

import { QueryClient } from '@tanstack/react-query';
import type { DefaultOptions } from '@tanstack/react-query';
import { ApiError } from './apiClient';

// Default options for all queries
const queryConfig: DefaultOptions = {
  queries: {
    // Stale time: 5 minutes (data considered fresh for 5 minutes)
    staleTime: 5 * 60 * 1000,

    // Cache time: 10 minutes (data kept in cache for 10 minutes after becoming unused)
    gcTime: 10 * 60 * 1000,

    // Retry failed requests 3 times with exponential backoff
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
        return false;
      }
      // Retry up to 3 times for network errors or server errors
      return failureCount < 3;
    },

    // Exponential backoff for retries
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Don't refetch on window focus by default (can be overridden per query)
    refetchOnWindowFocus: false,

    // Don't refetch on mount if data is still fresh
    refetchOnMount: false,

    // Refetch on reconnect
    refetchOnReconnect: true,
  },
  mutations: {
    // Retry mutations once
    retry: 1,
    retryDelay: 1000,
  },
};

// Create the query client
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

// Query keys factory for type-safe query keys
export const queryKeys = {
  // COVID-19 queries
  covid: {
    all: ['covid'] as const,
    global: () => [...queryKeys.covid.all, 'global'] as const,
    countries: () => [...queryKeys.covid.all, 'countries'] as const,
    country: (country: string) => [...queryKeys.covid.countries(), country] as const,
    historical: {
      all: () => [...queryKeys.covid.all, 'historical'] as const,
      global: (days?: number) => [...queryKeys.covid.historical.all(), 'global', days] as const,
      countries: (days?: number) =>
        [...queryKeys.covid.historical.all(), 'countries', days] as const,
      country: (country: string, days?: number) =>
        [...queryKeys.covid.historical.all(), 'country', country, days] as const,
    },
  },

  // Influenza queries
  influenza: {
    all: ['influenza'] as const,
    current: () => [...queryKeys.influenza.all, 'current'] as const,
    historical: (weeks?: number) => [...queryKeys.influenza.all, 'historical', weeks] as const,
  },

  // Mpox queries
  mpox: {
    all: ['mpox'] as const,
    global: () => [...queryKeys.mpox.all, 'global'] as const,
    countries: () => [...queryKeys.mpox.all, 'countries'] as const,
    country: (country: string) => [...queryKeys.mpox.countries(), country] as const,
  },

  // Shared queries
  population: {
    all: ['population'] as const,
    countries: () => [...queryKeys.population.all, 'countries'] as const,
  },
} as const;

// Error handler for React Query
export const onQueryError = (error: Error) => {
  if (error instanceof ApiError) {
    console.error(`[Query Error] ${error.message}`, {
      status: error.status,
      code: error.code,
    });
  } else {
    console.error('[Query Error]', error);
  }
};

// Success handler for development
export const onQuerySuccess = (data: unknown, query: { queryKey: unknown[] }) => {
  if (import.meta.env.DEV) {
    console.log('[Query Success]', query.queryKey, data);
  }
};
