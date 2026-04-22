const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  token?: string | null;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

function handleLogout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, token } = options;

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  // If body is NOT FormData, default to application/json
  if (!(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const authToken = token || localStorage.getItem('access_token');
  if (authToken) {
    requestHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    if (body instanceof FormData) {
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Handle specific error cases
    if (response.status === 401 && !endpoint.includes('/auth/refresh-token')) {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        handleLogout();
        throw new ApiError(data.message || 'Unauthorized', 401);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        
        // Use a raw fetch to avoid interceptor recursion
        const refreshConfig = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        };

        try {
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, refreshConfig);
          const refreshData = await refreshRes.json();

          if (refreshRes.ok && refreshData.success) {
            const { access_token, refresh_token } = refreshData.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            
            isRefreshing = false;
            onRefreshed(access_token);
          } else {
            isRefreshing = false;
            handleLogout();
            throw new ApiError('Session expired', 401);
          }
        } catch (error) {
          isRefreshing = false;
          handleLogout();
          throw error;
        }
      }

      // Return a promise that waits for the refresh to complete
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          // Retry the original request with the new token
          request<T>(endpoint, { ...options, token: newToken })
            .then(resolve)
            .catch(reject);
        });
      });
    }

    if (response.status === 401 && endpoint.includes('/auth/refresh-token')) {
       handleLogout();
    }

    throw new ApiError(data.message || 'Something went wrong', response.status);
  }

  // Handle generic backend response structure { success: boolean, message: string, data: T }
  return data;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'POST', body }),
  
  put: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'PUT', body }),
  
  patch: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'PATCH', body }),
  
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

