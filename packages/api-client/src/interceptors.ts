let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

export const tokenManager = {
  setToken: (token: string) => { accessToken = token; },
  getToken: () => accessToken,
  clearToken: () => { accessToken = null; },
};

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

export async function requestInterceptor(config: RequestInit): Promise<RequestInit> {
  const token = tokenManager.getToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
}

export async function responseInterceptor(response: Response, originalRequest: () => Promise<Response>): Promise<Response> {
  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        // Assume /api/auth/refresh relies on a secure httpOnly refresh cookie
        const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
        if (!refreshRes.ok) throw new Error('Refresh failed');
        
        const data = await refreshRes.json();
        tokenManager.setToken(data.accessToken);
        isRefreshing = false;
        onRefreshed(data.accessToken);
      } catch (error) {
        isRefreshing = false;
        tokenManager.clearToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return new Promise((resolve) => {
      refreshSubscribers.push(() => {
        resolve(originalRequest());
      });
    });
  }
  
  return response;
}