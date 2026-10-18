import { apiClient } from '@workspace/api-client';

export const webhookActionHandler = {
  type: 'HTTP_WEBHOOK',
  execute: async (config: { url: string, method: string, headers: Record<string, string>, body: any }, context: any) => {
    try {
      // Handler sending outbound HTTP POST requests to third-party endpoints[cite: 3].
      const response = await fetch(config.url, {
        method: config.method || 'POST',
        headers: { 'Content-Type': 'application/json', ...config.headers },
        body: JSON.stringify(config.body ? { ...config.body, _context: context } : context)
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      const data = await response.json().catch(() => ({}));
      return { success: true, output: { statusCode: response.status, response: data } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};