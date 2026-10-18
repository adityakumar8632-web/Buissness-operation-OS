/**
 * PostMessage-based bridge library providing external plugins a controlled API to communicate with the OS[cite: 3].
 * This script is provided to third-party developers to include in their micro-frontend.
 */
export class BusinessOSPluginSDK {
  private targetOrigin: string;

  constructor(targetOrigin: string = '*') {
    this.targetOrigin = targetOrigin;
  }

  private sendMessage(type: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const messageId = crypto.randomUUID();
      
      const listener = (event: MessageEvent) => {
        if (event.data.messageId === messageId) {
          window.removeEventListener('message', listener);
          if (event.data.error) reject(event.data.error);
          else resolve(event.data.payload);
        }
      };

      window.addEventListener('message', listener);
      window.parent.postMessage({ type, payload, messageId }, this.targetOrigin);
    });
  }

  async getContext(): Promise<{ userId: string, organizationId: string, theme: string }> {
    return this.sendMessage('GET_CONTEXT', {});
  }

  async showToast(message: string, type: 'success' | 'error' = 'success'): Promise<void> {
    return this.sendMessage('SHOW_TOAST', { message, type });
  }
}