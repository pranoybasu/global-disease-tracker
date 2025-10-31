/**
 * Base API client configuration with axios and error handling
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class ApiClient {
  private client: AxiosInstance;
  private retries: number;
  private retryDelay: number;

  constructor(config: ApiClientConfig) {
    this.retries = config.retries ?? 3;
    this.retryDelay = config.retryDelay ?? 1000;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log response time in development
        if (import.meta.env.DEV && response.config.metadata) {
          const duration = new Date().getTime() - response.config.metadata.startTime.getTime();
          console.log(
            `[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`
          );
        }
        return response;
      },
      async (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  private async handleError(error: AxiosError): Promise<never> {
    const config = error.config as AxiosRequestConfig & { _retry?: number };

    // Retry logic for network errors or 5xx errors
    if (
      config &&
      (!config._retry || config._retry < this.retries) &&
      (error.code === 'ECONNABORTED' ||
        error.code === 'ERR_NETWORK' ||
        (error.response?.status && error.response.status >= 500))
    ) {
      config._retry = (config._retry || 0) + 1;

      await this.delay(this.retryDelay * config._retry);

      console.log(`[API] Retrying request (${config._retry}/${this.retries}): ${config.url}`);
      return this.client.request(config);
    }

    // Transform error into ApiError
    if (error.response) {
      // Server responded with error status
      throw new ApiError(
        error.response.data?.message || error.message,
        error.response.status,
        error.code,
        error
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new ApiError('No response received from server', undefined, error.code, error);
    } else {
      // Something else happened
      throw new ApiError(error.message, undefined, error.code, error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Create API client instances
export const diseaseShApiClient = new ApiClient({
  baseURL: 'https://disease.sh/v3/covid-19',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
});

export const cdcApiClient = new ApiClient({
  baseURL: 'https://data.cdc.gov/api',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
});

// WHO API client (to be configured when WHO API endpoint is determined)
export const whoApiClient = new ApiClient({
  baseURL: 'https://api.who.int',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
});
