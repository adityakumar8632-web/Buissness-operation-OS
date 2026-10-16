import { requestInterceptor, responseInterceptor } from './interceptors';
import { parseApiError } from './errors';

interface HttpClientConfig extends RequestInit {
  baseURL?: string;
  timeout?: number;
}

export class HttpClient {
  private baseURL: string;
  private timeout: number;

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 10000;
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(id);
    return response;
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Set standard headers
    options.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    // Apply request interceptors
    const interceptedOptions = await requestInterceptor(options);

    const executeRequest = async () => this.fetchWithTimeout(url, interceptedOptions);

    let response = await executeRequest();

    // Apply response interceptors (e.g., token refresh logic)
    response = await responseInterceptor(response, executeRequest);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw parseApiError(response.status, errorData);
    }

    // Handle 204 No Content
    if (response.status === 204) return {} as T;

    return response.json();
  }

  public get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  public put<T>(endpoint: string, body: any, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }

  public delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}