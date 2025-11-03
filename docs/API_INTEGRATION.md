# API Integration Guide

This guide explains how to integrate real disease APIs into the Global Disease Tracker application using the adapter pattern architecture.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Adding a New Real API](#adding-a-new-real-api)
- [Adapter Pattern Implementation](#adapter-pattern-implementation)
- [API Error Handling](#api-error-handling)
- [Testing API Integration](#testing-api-integration)
- [Migration Strategy](#migration-strategy)

## Architecture Overview

The Global Disease Tracker uses an **Adapter Pattern** to abstract data sources, making it easy to:
- Switch between mock and real data
- Add new disease APIs without breaking existing code
- Maintain consistent data structures across different sources
- Test with mock data during development

### Current Data Flow

```
User Interface (App.tsx)
    ↓
TanStack Query Hook (useDiseaseData)
    ↓
Disease API Adapter (diseaseApi.ts)
    ↓
┌─────────────────────────────┐
│  Real API     │  Mock Data  │
│  (COVID-19)   │  (Others)   │
└─────────────────────────────┘
```

## Adding a New Real API

### Step 1: Create API Service File

Create a new file in `src/services/api/` for your disease API:

```typescript
// src/services/api/influenzaApi.ts

import { apiClient } from './apiClient';
import type { CountryStats, GlobalStats } from '@/types';

const INFLUENZA_API_BASE = 'https://api.example.com/influenza';

export async function fetchInfluenzaData(): Promise<{
  global: GlobalStats;
  countries: CountryStats[];
}> {
  try {
    // Fetch global statistics
    const globalResponse = await apiClient.get(`${INFLUENZA_API_BASE}/all`);
    
    // Fetch country-level data
    const countriesResponse = await apiClient.get(`${INFLUENZA_API_BASE}/countries`);

    // Transform API response to match our internal structure
    return {
      global: transformGlobalStats(globalResponse.data),
      countries: transformCountryStats(countriesResponse.data)
    };
  } catch (error) {
    console.error('Error fetching influenza data:', error);
    throw error;
  }
}

// Transform API response to internal format
function transformGlobalStats(apiData: any): GlobalStats {
  return {
    cases: apiData.totalCases || 0,
    deaths: apiData.totalDeaths || 0,
    recovered: apiData.totalRecovered || 0,
    active: apiData.activeCases || 0,
    critical: apiData.criticalCases || 0,
    casesPerMillion: apiData.casesPerOneMillion || 0,
    deathsPerMillion: apiData.deathsPerOneMillion || 0,
    tests: apiData.totalTests || 0,
    testsPerMillion: apiData.testsPerOneMillion || 0,
    population: apiData.population || 0,
    affectedCountries: apiData.affectedCountries || 0,
    todayCases: apiData.todayCases || 0,
    todayDeaths: apiData.todayDeaths || 0,
    updated: apiData.updated || Date.now()
  };
}

function transformCountryStats(apiData: any[]): CountryStats[] {
  return apiData.map(country => ({
    country: country.country || 'Unknown',
    countryInfo: {
      _id: country.countryInfo?.id || 0,
      iso2: country.countryInfo?.iso2 || '',
      iso3: country.countryInfo?.iso3 || '',
      lat: country.countryInfo?.lat || 0,
      long: country.countryInfo?.long || 0,
      flag: country.countryInfo?.flag || ''
    },
    cases: country.cases || 0,
    deaths: country.deaths || 0,
    recovered: country.recovered || 0,
    active: country.active || 0,
    critical: country.critical || 0,
    casesPerMillion: country.casesPerOneMillion || 0,
    deathsPerMillion: country.deathsPerOneMillion || 0,
    tests: country.tests || 0,
    testsPerMillion: country.testsPerOneMillion || 0,
    population: country.population || 0,
    continent: country.continent || '',
    todayCases: country.todayCases || 0,
    todayDeaths: country.todayDeaths || 0,
    updated: country.updated || Date.now()
  }));
}
```

### Step 2: Update the Adapter

Modify `src/services/api/diseaseApi.ts` to include your new API:

```typescript
// src/services/api/diseaseApi.ts

import { useQuery } from '@tanstack/react-query';
import type { Disease } from '@/types';
import { fetchCovidData } from './covidApi';
import { fetchInfluenzaData } from './influenzaApi'; // Add import
import { generateInfluenzaMockData } from '../mockData/influenzaMockData';
import { generateMpoxMockData } from '../mockData/mpoxMockData';
// ... other imports

export function useDiseaseData(disease: Disease) {
  return useQuery({
    queryKey: ['disease', disease],
    queryFn: async () => {
      // Route to appropriate data source based on disease
      switch (disease) {
        case 'covid19':
          return await fetchCovidData(); // Real API
        
        case 'influenza':
          return await fetchInfluenzaData(); // NEW: Real API
        
        case 'mpox':
          return generateMpoxMockData(); // Mock data
        
        case 'malaria':
          return generateMalariaMockData(); // Mock data
        
        case 'dengue':
          return generateDengueMockData(); // Mock data
        
        default:
          throw new Error(`Unknown disease: ${disease}`);
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep in cache for 10 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
}
```

### Step 3: Configure Environment Variables

Add API configuration to `.env`:

```env
# COVID-19 API (disease.sh)
VITE_COVID_API_URL=https://disease.sh/v3/covid-19

# Influenza API
VITE_INFLUENZA_API_URL=https://api.example.com/influenza
VITE_INFLUENZA_API_KEY=your_api_key_here

# General settings
VITE_ENABLE_MOCK_DATA=false
VITE_API_RETRY_ATTEMPTS=3
VITE_API_TIMEOUT=10000
```

Access environment variables in your code:

```typescript
const INFLUENZA_API_BASE = import.meta.env.VITE_INFLUENZA_API_URL;
const INFLUENZA_API_KEY = import.meta.env.VITE_INFLUENZA_API_KEY;
```

### Step 4: Update API Client (if needed)

If your API requires authentication or custom headers, update `apiClient.ts`:

```typescript
// src/services/api/apiClient.ts

import axios from 'axios';

export const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add API key if available
    const apiKey = import.meta.env.VITE_INFLUENZA_API_KEY;
    if (apiKey && config.url?.includes('influenza')) {
      config.headers['X-API-Key'] = apiKey;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      // Rate limit hit - wait and retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

## Adapter Pattern Implementation

### Core Principles

1. **Single Source of Truth**: Each disease has one entry point in the adapter
2. **Consistent Interface**: All data sources return the same structure
3. **Graceful Degradation**: Fallback to mock data if API fails
4. **Type Safety**: TypeScript ensures data consistency

### Example: Hybrid Approach (Real API with Mock Fallback)

```typescript
export function useDiseaseData(disease: Disease) {
  const enableMockData = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

  return useQuery({
    queryKey: ['disease', disease],
    queryFn: async () => {
      // Development mode: use mock data
      if (enableMockData) {
        return generateMockData(disease);
      }

      try {
        // Production mode: use real API
        switch (disease) {
          case 'covid19':
            return await fetchCovidData();
          case 'influenza':
            return await fetchInfluenzaData();
          default:
            // Fallback to mock for unsupported diseases
            return generateMockData(disease);
        }
      } catch (error) {
        console.warn(`API failed for ${disease}, using mock data:`, error);
        // Graceful degradation to mock data
        return generateMockData(disease);
      }
    },
    // ... query options
  });
}
```

## API Error Handling

### Error Boundary Integration

Errors are caught at multiple levels:

1. **API Client Level**: Axios interceptors handle network errors
2. **Service Level**: Try-catch blocks in API functions
3. **React Query Level**: Automatic retry with exponential backoff
4. **Component Level**: Error boundaries display fallback UI

Example error handling:

```typescript
// In your API function
export async function fetchInfluenzaData() {
  try {
    const response = await apiClient.get('/influenza/data');
    return transformData(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Influenza data not found');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    }
    throw new Error('Failed to fetch influenza data');
  }
}
```

### Displaying Errors to Users

Error boundaries in the UI handle failed API calls gracefully:

```typescript
<ErrorBoundary
  fallback={
    <div className="text-center p-8">
      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h3>Data Unavailable</h3>
      <p>Unable to load {disease} data. Please try again later.</p>
    </div>
  }
>
  <DiseaseMap data={data} />
</ErrorBoundary>
```

## Testing API Integration

### 1. Unit Tests for API Functions

```typescript
// src/services/api/__tests__/influenzaApi.test.ts

import { describe, it, expect, vi } from 'vitest';
import { fetchInfluenzaData } from '../influenzaApi';
import { apiClient } from '../apiClient';

vi.mock('../apiClient');

describe('Influenza API', () => {
  it('should fetch and transform data correctly', async () => {
    const mockResponse = {
      data: {
        totalCases: 100000,
        totalDeaths: 5000,
        // ... mock API response
      }
    };

    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const result = await fetchInfluenzaData();

    expect(result.global.cases).toBe(100000);
    expect(result.global.deaths).toBe(5000);
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

    await expect(fetchInfluenzaData()).rejects.toThrow();
  });
});
```

### 2. Integration Testing with Mock API

Use MSW (Mock Service Worker) for integration tests:

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('https://api.example.com/influenza/all', (req, res, ctx) => {
    return res(ctx.json({ totalCases: 100000, totalDeaths: 5000 }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 3. Manual Testing Checklist

- [ ] API returns data in expected format
- [ ] Rate limiting is handled correctly
- [ ] Error states display properly
- [ ] Data refreshes on interval
- [ ] Offline behavior works (shows cached data)
- [ ] Loading states appear during fetch
- [ ] Type errors are caught at compile time

## Migration Strategy

### Gradual Migration from Mock to Real Data

**Phase 1: Development (Mock Data)**
```typescript
const enableMockData = true;
```

**Phase 2: Testing (Real API, Mock Fallback)**
```typescript
try {
  return await fetchRealAPI();
} catch {
  return mockData;
}
```

**Phase 3: Production (Real API Only)**
```typescript
return await fetchRealAPI(); // Throws on error
```

### Feature Flags

Use environment variables for controlled rollout:

```typescript
const USE_REAL_INFLUENZA_API = import.meta.env.VITE_USE_REAL_INFLUENZA_API === 'true';

if (USE_REAL_INFLUENZA_API) {
  return await fetchInfluenzaData();
} else {
  return generateInfluenzaMockData();
}
```

## Best Practices

1. **Always validate API responses** with TypeScript types
2. **Use consistent data transformation functions** across all APIs
3. **Implement retry logic** with exponential backoff
4. **Cache aggressively** to reduce API calls
5. **Monitor API usage** to stay within rate limits
6. **Document API quirks** and edge cases
7. **Test with real API data** before deploying
8. **Keep mock data realistic** for better testing

## Common Issues

### Issue: API Rate Limiting
**Solution**: Implement request queuing and respect rate limit headers

### Issue: Inconsistent Data Formats
**Solution**: Create robust transformation functions with null checks

### Issue: API Downtime
**Solution**: Implement fallback to cached data or mock data

### Issue: CORS Errors
**Solution**: Use a proxy server or CORS-anywhere for development

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [disease.sh API Documentation](https://disease.sh/docs/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

For questions or issues with API integration, please open a GitHub issue with the `api-integration` label.