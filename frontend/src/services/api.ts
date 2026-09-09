const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(public status: number, public data: any) {
    super(data?.message || 'API Error');
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const rawToken = localStorage.getItem('token');
  const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken.trim() : null;
  const headers = new Headers(options.headers);

  // If body is raw File, auto-wrap it in FormData
  let bodyPayload = options.body;
  if (bodyPayload instanceof File) {
    const fd = new FormData();
    fd.append('file', bodyPayload); // Change 'file' to 'image' if backend requires it
    bodyPayload = fd;
  }

  const isFormData = bodyPayload instanceof FormData;

  // Only set JSON Content-Type when request is NOT FormData
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Dynamically get the token per-request to prevent stale state
  const currentToken = localStorage.getItem('token');

  // Clean up any invalid Authorization header that might have been passed explicitly
  if (headers.has('Authorization')) {
    const authVal = headers.get('Authorization') || '';
    if (authVal.includes('null') || authVal.includes('undefined') || authVal === 'Bearer' || authVal === 'Bearer ') {
      if (currentToken) {
        headers.set('Authorization', `Bearer ${currentToken}`);
      } else {
        headers.delete('Authorization');
      }
    }
  } else if (currentToken) {
    // Attach JWT token if valid
    headers.set('Authorization', `Bearer ${currentToken}`);
  }

  // Handle Body stringification
  let finalBody: BodyInit | null | undefined;
  if (isFormData || bodyPayload instanceof Blob) {
    finalBody = bodyPayload as BodyInit;
  } else if (bodyPayload && typeof bodyPayload === 'object') {
    finalBody = JSON.stringify(bodyPayload);
  } else {
    finalBody = bodyPayload as BodyInit;
  }

  const config: RequestInit = {
    ...options,
    headers,
    body: finalBody,
    credentials: 'include',
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data;
}

export const api = {
  get: <T>(endpoint: string, options: RequestInit = {}) =>
    request<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, body?: any, options: RequestInit = {}) =>
    request<T>(endpoint, { method: 'POST', body, ...options }),

  put: <T>(endpoint: string, body?: any, options: RequestInit = {}) =>
    request<T>(endpoint, { method: 'PUT', body, ...options }),

  patch: <T>(endpoint: string, body?: any, options: RequestInit = {}) =>
    request<T>(endpoint, { method: 'PATCH', body, ...options }),

  delete: <T>(endpoint: string, options: RequestInit = {}) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};

export { ApiError };