import { HttpClient } from './http';
import { tokenManager } from './interceptors';
import { DomainError } from './errors';

// Export a default singleton instance for direct application usage
export const apiClient = new HttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});

// Export underlying tools for custom configurations
export { HttpClient, tokenManager, DomainError };